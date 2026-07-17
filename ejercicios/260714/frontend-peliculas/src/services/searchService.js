// ==========================================================
// searchService.js
// API calls para búsqueda en TMDB
// ==========================================================

const API_URL = "http://localhost:3000/api/search";

export async function searchContent(query, type = "all") {
  if (!query || query.trim() === "") {
    return [];
  }

  const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&type=${type}`);
  
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
