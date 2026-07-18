// ==========================================================
// searchService.js
// API calls para búsqueda en TMDB
// ==========================================================

const API_URL = "http://localhost:3000/api/search";

/** Consulta la API de búsqueda con los filtros opcionales seleccionados por el usuario. */
export async function searchContent(filters, type = "all") {
  const normalized = typeof filters === "string" ? { query: filters, type } : filters;
  if (!normalized?.query || normalized.query.trim() === "") {
    return [];
  }
  const params = new URLSearchParams({ q: normalized.query, type: normalized.type || type });
  ["genre", "year", "director"].forEach((key) => { if (normalized[key]) params.set(key, normalized[key]); });
  const response = await fetch(`${API_URL}?${params}`);
  
  if (!response.ok) {
    throw new Error("Error en la búsqueda");
  }
  
  return await response.json();
}

export async function searchMovies(query) {
  return searchContent(query, "movie");
}

export async function searchSeries(query) {
  return searchContent(query, "tv");
}

export async function searchAll(query) {
  return searchContent(query, "all");
}
