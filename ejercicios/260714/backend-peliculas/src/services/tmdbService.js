const axios = require("axios");
const { tmdb } = require("../../config");
const { CONTENT_TYPE } = require("../utils/contentConstants");
const { HttpError } = require("../utils/httpError");

const imageUrl = (path) => (path ? `${tmdb.imageBaseUrl}${path}` : "");

async function tmdbGet(path, params = {}) {
  if (!tmdb.apiKey) {
    throw new HttpError(500, "TMDB_API_KEY no está configurada");
  }

  return axios.get(`${tmdb.baseUrl}${path}`, {
    params: { api_key: tmdb.apiKey, language: tmdb.language, ...params },
    timeout: 10000,
  });
}

function mapSummary(item, kind) {
  return {
    id: item.id,
    titulo: kind === "movie" ? item.title : item.name,
    titulo_original: kind === "movie" ? item.original_title : item.original_name,
    imagen: imageUrl(item.poster_path),
    fecha_estreno: kind === "movie" ? item.release_date : item.first_air_date,
    año: (kind === "movie" ? item.release_date : item.first_air_date)?.slice(0, 4) || "",
    descripcion: item.overview || "",
    calificacion: item.vote_average || 0,
    generos_ids: item.genre_ids || [],
    tipo: CONTENT_TYPE[kind],
    source: "tmdb",
  };
}

async function getTmdbDetail(kind, id) {
  const [detailResponse, creditsResponse, videosResponse] = await Promise.all([
    tmdbGet(`/${kind}/${id}`),
    tmdbGet(`/${kind}/${id}/credits`),
    tmdbGet(`/${kind}/${id}/videos`),
  ]);

  const detail = detailResponse.data;
  const credits = creditsResponse.data;
  const trailer = (videosResponse.data.results || []).find(
    (video) => video.site === "YouTube" && ["Trailer", "Teaser"].includes(video.type),
  );

  const director =
    kind === "movie"
      ? credits.crew?.find((person) => person.job === "Director")?.name || "No disponible"
      : detail.created_by?.map((person) => person.name).join(", ") || "No disponible";

  return {
    ...mapSummary(detail, kind),
    director,
    creador: director,
    idioma_original: detail.original_language?.toUpperCase(),
    generos: detail.genres?.map((genre) => genre.name) || [],
    duracion: detail.runtime,
    temporadas: detail.number_of_seasons,
    trailer: trailer?.key || null,
    actores: (credits.cast || []).slice(0, 12).map((actor) => ({
      nombre: actor.name,
      personaje: actor.character,
      imagen: imageUrl(actor.profile_path),
    })),
  };
}

async function getCatalog(kind, localContent) {
  try {
    const response = await tmdbGet(`/${kind}/popular`, { page: 1 });
    return [...response.data.results.slice(0, 15).map((item) => mapSummary(item, kind)), ...localContent];
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
          const detail = await getTmdbDetail(item.tipo === "pelicula" ? "movie" : "tv", item.id);
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
