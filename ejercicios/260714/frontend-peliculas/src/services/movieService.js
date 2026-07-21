// ==========================================================
// movieService.js
// API calls para películas
// ==========================================================

const API_URL = "http://localhost:3000/api/peliculas";

// Error personalizado que incluye el statusCode HTTP del backend
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// Helper interno: lanza ApiError si la respuesta no fue OK
async function handleResponse(response) {
  if (!response.ok) {
    let message;
    try {
      const body = await response.json();
      message = body.error || "Error desconocido del servidor";
    } catch {
      message = `Error ${response.status}`;
    }
    throw new ApiError(response.status, message);
  }
  return response.json();
}

// GET /api/peliculas
export async function getMovies() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

// GET /api/peliculasById/:id
export async function getMovieById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("No se pudo obtener la película");
  }
  return await response.json();
}

// POST /api/peliculas
export async function createMovie(movie) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
  return handleResponse(response);
}

// PUT /api/peliculas/:id
export async function updateMovie(id, movie) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
  return handleResponse(response);
}

// DELETE /api/peliculas/:id
export async function deleteMovie(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}