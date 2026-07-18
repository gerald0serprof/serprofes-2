const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { tmdb, server } = require("./config");

const app = express();
const peliculasPersonalizadas = [];
const seriesPersonalizadas = [];
let siguienteIdPelicula = 10000;
let siguienteIdSerie = 20000;

app.use(cors());
app.use(express.json());

/** Construye una URL de imagen de TMDB o devuelve una cadena vacía si no existe. */
const imageUrl = (path) => (path ? `${tmdb.imageBaseUrl}${path}` : "");

/** Ejecuta llamadas a TMDB con los parámetros comunes de seguridad e idioma. */
const tmdbGet = (path, params = {}) => {
  if (!tmdb.apiKey) throw new Error("TMDB_API_KEY no está configurada");
  return axios.get(`${tmdb.baseUrl}${path}`, { params: { api_key: tmdb.apiKey, language: tmdb.language, ...params } });
};

/** Normaliza un resultado resumido de TMDB para que películas y series tengan la misma interfaz. */
const mapSummary = (item, kind) => ({
  id: item.id, titulo: kind === "movie" ? item.title : item.name,
  titulo_original: kind === "movie" ? item.original_title : item.original_name,
  imagen: imageUrl(item.poster_path), fecha_estreno: kind === "movie" ? item.release_date : item.first_air_date,
  año: (kind === "movie" ? item.release_date : item.first_air_date)?.slice(0, 4) || "",
  descripcion: item.overview || "", calificacion: item.vote_average || 0,
  generos_ids: item.genre_ids || [], tipo: kind === "movie" ? "pelicula" : "serie", source: "tmdb"
});

/** Enriquece el detalle TMDB con equipo, vídeos y reparto principal. */
async function getTmdbDetail(kind, id) {
  const [detailResponse, creditsResponse, videosResponse] = await Promise.all([
    tmdbGet(`/${kind}/${id}`), tmdbGet(`/${kind}/${id}/credits`), tmdbGet(`/${kind}/${id}/videos`)
  ]);
  const detail = detailResponse.data;
  const credits = creditsResponse.data;
  const trailer = videosResponse.data.results.find((video) => video.site === "YouTube" && ["Trailer", "Teaser"].includes(video.type));
  const director = kind === "movie"
    ? credits.crew.find((person) => person.job === "Director")?.name || "No disponible"
    : detail.created_by?.map((person) => person.name).join(", ") || "No disponible";
  return {
    ...mapSummary(detail, kind), director, creador: director,
    idioma_original: detail.original_language?.toUpperCase(), generos: detail.genres?.map((genre) => genre.name) || [],
    duracion: detail.runtime, temporadas: detail.number_of_seasons,
    trailer: trailer?.key || null,
    actores: (credits.cast || []).slice(0, 12).map((actor) => ({ nombre: actor.name, personaje: actor.character, imagen: imageUrl(actor.profile_path) }))
  };
}

/** Devuelve un catálogo popular TMDB más los contenidos creados localmente. */
async function getCatalog(kind, localContent) {
  try {
    const response = await tmdbGet(`/${kind}/popular`, { page: 1 });
    return [...response.data.results.slice(0, 15).map((item) => mapSummary(item, kind)), ...localContent];
  } catch (error) {
    console.error(`No se pudo cargar el catálogo ${kind}:`, error.message);
    return localContent;
  }
}

/** Recupera el detalle de un contenido, local si pertenece al usuario o remoto si procede de TMDB. */
async function getContentDetail(req, res, kind, localContent, localId) {
  const id = Number(req.params.id);
  const local = localContent.find((item) => item.id === id);
  if (id >= localId) return local ? res.json(local) : res.status(404).json({ error: "Contenido no encontrado" });
  try { return res.json(await getTmdbDetail(kind, id)); }
  catch { return res.status(404).json({ error: "Contenido no encontrado en TMDB" }); }
}

/** Registra las rutas CRUD para contenido añadido manualmente. */
function registerCrud(path, kind, localContent, getNextId) {
  const label = kind === "movie" ? "película" : "serie";
  app.get(path, async (_req, res) => res.json(await getCatalog(kind, localContent)));
  app.get(`${path}/:id`, (req, res) => getContentDetail(req, res, kind, localContent, kind === "movie" ? 10000 : 20000));
  app.post(path, (req, res) => {
    const { titulo, imagen = "", descripcion = "", año, generos = [] } = req.body;
    const responsable = kind === "movie" ? req.body.director : req.body.creador;
    if (!titulo || !responsable) return res.status(400).json({ error: "Título y responsable son obligatorios" });
    const item = { id: getNextId(), titulo, imagen, descripcion, año: año || String(new Date().getFullYear()), generos, calificacion: 0, tipo: kind === "movie" ? "pelicula" : "serie", source: "personalizada", ...(kind === "movie" ? { director: responsable } : { creador: responsable, temporadas: req.body.temporadas || 1 }) };
    localContent.push(item); return res.status(201).json(item);
  });
  app.put(`${path}/:id`, (req, res) => {
    const item = localContent.find((content) => content.id === Number(req.params.id));
    if (!item) return res.status(404).json({ error: `${label} no encontrada o no editable` });
    Object.assign(item, req.body, { id: item.id, source: "personalizada", tipo: item.tipo }); return res.json(item);
  });
  app.delete(`${path}/:id`, (req, res) => {
    const index = localContent.findIndex((content) => content.id === Number(req.params.id));
    if (index < 0) return res.status(404).json({ error: `${label} no encontrada o no eliminable` });
    localContent.splice(index, 1); return res.json({ mensaje: `${label} eliminada` });
  });
}

registerCrud("/api/peliculas", "movie", peliculasPersonalizadas, () => siguienteIdPelicula++);
registerCrud("/api/series", "tv", seriesPersonalizadas, () => siguienteIdSerie++);

/** Busca por texto en TMDB y aplica filtros de tipo, género y año; director se comprueba desde el detalle. */
app.get("/api/search", async (req, res) => {
  const { q, type = "all", genre = "", year = "", director = "" } = req.query;
  if (!q?.trim()) return res.status(400).json({ error: "El parámetro q es obligatorio" });
  try {
    const kinds = type === "movie" ? ["movie"] : type === "tv" ? ["tv"] : ["movie", "tv"];
    const groups = await Promise.all(kinds.map(async (kind) => (await tmdbGet(`/search/${kind}`, { query: q, page: 1 })).data.results.map((item) => mapSummary(item, kind))));
    let results = groups.flat().filter((item) => !year || item.año === year);
    if (genre || director) {
      results = (await Promise.all(results.slice(0, 20).map(async (item) => {
        const detail = await getTmdbDetail(item.tipo === "pelicula" ? "movie" : "tv", item.id);
        const matchesGenre = !genre || detail.generos.some((name) => name.toLocaleLowerCase("es").includes(genre.toLocaleLowerCase("es")));
        const matchesDirector = !director || detail.director.toLocaleLowerCase().includes(director.toLocaleLowerCase());
        return matchesGenre && matchesDirector ? { ...item, generos: detail.generos, director: detail.director, creador: detail.creador } : null;
      }))).filter(Boolean);
    }
    res.json(results);
  } catch (error) { res.status(500).json({ error: "No se pudo completar la búsqueda" }); }
});

/** Obtiene próximos estrenos reales de TMDB para una fecha seleccionada y tipo de contenido. */
app.get("/api/upcoming", async (req, res) => {
  const { type = "movie", date } = req.query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: "date debe tener formato AAAA-MM-DD" });
  const kind = type === "tv" ? "tv" : "movie";
  const dateField = kind === "movie" ? "release_date" : "first_air_date";
  try {
    const response = await tmdbGet(`/discover/${kind}`, { [`primary_${dateField}.gte`]: date, [`primary_${dateField}.lte`]: date, sort_by: "popularity.desc" });
    res.json(response.data.results.map((item) => mapSummary(item, kind)));
  } catch { res.status(500).json({ error: "No se pudieron obtener los próximos estrenos" }); }
});

app.listen(server.port, () => console.log(`API de CineDB disponible en http://localhost:${server.port}`));
