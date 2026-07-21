// ==========================================================
// serieService.js
// API calls para series
// ==========================================================

import { ApiError } from "./movieService.js";

const API_URL = "http://localhost:3000/api/series";

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

export async function getSeries() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function getSerieById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
}

export async function createSerie(serie) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serie),
  });
  return handleResponse(response);
}

export async function updateSerie(id, serie) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serie),
  });
  return handleResponse(response);
}

export async function deleteSerie(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}