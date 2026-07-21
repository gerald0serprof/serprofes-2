// ==========================================================
// tmdbService.js  (backend)
// Servicio de integración con la API de TMDB.
//
// ==========================================================

const axios = require("axios");
const { tmdb } = require("../../config");
const { CONTENT_TYPE } = require("../utils/contentConstants");
const { HttpError } = require("../utils/httpError");

const imageUrl = (path) => (path ? `${tmdb.imageBaseUrl}${path}` : "");

// ---------------------------------------------------------------
// Tipos de vídeo soportados por TMDB, en orden de relevancia.
// Se respetan los nombres exactos de la API para que el frontend
// pueda mostrar la etiqueta correcta sin necesidad de traducción.
// ---------------------------------------------------------------
const VIDEO_TYPES = [
  "Trailer",
  "Teaser",
  "Clip",
  "Featurette",
  "Behind the Scenes",
  "Bloopers",
];

async function tmdbGet(path, params = {}) {
  if (!tmdb.apiKey) {
    throw new HttpError(500, "TMDB_API_KEY no está configurada");
  }

  return axios.get(`${tmdb.baseUrl}${path}`, {
    params: { api_key: tmdb.apiKey, language: tmdb.language, ...params },
    timeout: 10000,
  });
}

async function tmdbGet(path, params = {}) {
  if (!tmdb.apiKey) {
    throw new HttpError(500, "TMDB_API_KEY no está configurada");
  }
  return axios.get(`${tmdb.baseUrl}${path}`, {
    params: { api_key: tmdb.apiKey, language: tmdb.language, ...params },
    timeout: 10000,
  });
}

function extractYear(dateString) {
  if (!dateString || typeof dateString !== "string") return "";
  const year = dateString.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : "";
}

function mapSummary(item, kind) {
  const rawDate = kind === "movie" ? item.release_date : item.first_air_date;
  return {
    id: item.id,
    titulo: kind === "movie" ? item.title : item.name,
    titulo_original: kind === "movie" ? item.original_title : item.original_name,
    imagen: imageUrl(item.poster_path),
    fecha_estreno: rawDate || "",
    año: extractYear(rawDate),
    descripcion: item.overview || "",
    calificacion: item.vote_average || 0,
    generos_ids: item.genre_ids || [],
    tipo: CONTENT_TYPE[kind],
    source: "tmdb",
  };
}

// ---------------------------------------------------------------
// Construye el array de vídeos agrupados por tipo TMDB.
// Cada entrada: { tipo, titulo, key }
// - Solo incluye vídeos de YouTube y tipos reconocidos.
// - El orden de VIDEO_TYPES define la prioridad de visualización.
// - trailer_key apunta al primer Trailer o Teaser para
//   retrocompatibilidad con el frontend actual.
// ---------------------------------------------------------------
function mapVideos(rawResults) {
  const youtubeVideos = (rawResults || []).filter((v) => v.site === "YouTube");

  const videos = VIDEO_TYPES.flatMap((tipo) =>
    youtubeVideos
      .filter((v) => v.type === tipo)
      .map((v) => ({ tipo, titulo: v.name || "", key: v.key })),
  );

  const trailerEntry =
    videos.find((v) => v.tipo === "Trailer") ||
    videos.find((v) => v.tipo === "Teaser") ||
    null;

  return {
    videos,
    trailer_key: trailerEntry?.key || null,
  };
}

async function getTmdbDetail(kind, id) {
  const isTV = kind === "tv";

  // Series usan /aggregate_credits para el reparto completo de toda la
  // serie. /credits solo devuelve créditos del episodio piloto.
  const creditsEndpoint = isTV
    ? tmdbGet(`/tv/${id}/aggregate_credits`)
    : tmdbGet(`/movie/${id}/credits`);

  const [detailResponse, creditsResponse, videosResponse] = await Promise.all([
    tmdbGet(`/${kind}/${id}`),
    creditsEndpoint,
    tmdbGet(`/${kind}/${id}/videos`),
  ]);

  const detail = detailResponse.data;
  const credits = creditsResponse.data;
  const { videos, trailer_key } = mapVideos(videosResponse.data.results);

  const director = isTV
    ? detail.created_by?.map((p) => p.name).join(", ") || "No disponible"
    : credits.crew?.find((p) => p.job === "Director")?.name || "No disponible";

  // Aggregate_credits (TV) usa roles[0].character; credits (movie) usa character
  const castRaw = credits.cast || [];
  const actores = castRaw.slice(0, 12).map((actor) => ({
    nombre: actor.name,
    personaje: isTV
      ? (actor.roles?.[0]?.character ?? actor.character ?? "")
      : (actor.character ?? ""),
    imagen: imageUrl(actor.profile_path),
  }));

  return {
    ...mapSummary(detail, kind),
    director,
    creador: director,
    idioma_original: detail.original_language?.toUpperCase() || "",
    generos: detail.genres?.map((g) => g.name) || [],
    duracion: detail.runtime ?? null,
    temporadas: detail.number_of_seasons ?? null,
    trailer_key,
    videos,
    actores,
  };
}

async function getCatalog(kind, localContent) {
  try {
    const response = await tmdbGet(`/${kind}/popular`, { page: 1 });
    return [
      ...response.data.results.slice(0, 15).map((item) => mapSummary(item, kind)),
      ...localContent,
    ];
  } catch (error) {
    console.error(`No se pudo cargar el catálogo ${kind}:`, error.message);
    return localContent;
  }
}

async function searchContent(query) {
  const { q, type = "all", genre = "", year = "", director = "" } = query;
  if (!q?.trim()) {
    throw new HttpError(400, "El parámetro q es obligatorio");
  }

  const kinds = type === "movie" ? ["movie"] : type === "tv" ? ["tv"] : ["movie", "tv"];
  const groups = await Promise.all(
    kinds.map(async (kind) => {
      const response = await tmdbGet(`/search/${kind}`, { query: q, page: 1 });
      return response.data.results.map((item) => mapSummary(item, kind));
    }),
  );

  let results = groups.flat().filter((item) => !year || item.año === year);

  if (genre || director) {
    results = (
      await Promise.all(
        results.slice(0, 20).map(async (item) => {
          const detail = await getTmdbDetail(
            item.tipo === "pelicula" ? "movie" : "tv",
            item.id,
          );
          const matchesGenre =
            !genre ||
            detail.generos.some((name) =>
              name.toLocaleLowerCase("es").includes(String(genre).toLocaleLowerCase("es")),
            );
          const matchesDirector =
            !director ||
            detail.director.toLocaleLowerCase().includes(String(director).toLocaleLowerCase());

          return matchesGenre && matchesDirector
            ? { ...item, generos: detail.generos, director: detail.director, creador: detail.creador }
            : null;
        }),
      )
    ).filter(Boolean);
  }

  return results;
}

async function getUpcoming(query) {
  const { type = "movie", date } = query;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, "date debe tener formato AAAA-MM-DD");
  }

  const kind = type === "tv" ? "tv" : "movie";
  const dateField = kind === "movie" ? "release_date" : "first_air_date";
  const response = await tmdbGet(`/discover/${kind}`, {
    [`primary_${dateField}.gte`]: date,
    [`primary_${dateField}.lte`]: date,
    sort_by: "popularity.desc",
  });

  return response.data.results.map((item) => mapSummary(item, kind));
}

module.exports = {
  getTmdbDetail,
  getCatalog,
  searchContent,
  getUpcoming,
};