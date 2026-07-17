// ==========================================================
// serieService.js
// API calls para series
// ==========================================================

const API_URL = "http://localhost:3000/api/series";

export async function getSeries() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("No se pudo obtener el listado de series");
  }
  return await response.json();
}

export async function getSerieById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("No se pudo obtener la serie");
  }
  return await response.json();
}

export async function createSerie(serie) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serie),
  });
  if (!response.ok) {
    throw new Error("No se pudo crear la serie");
  }
  return await response.json();
}

export async function updateSerie(id, serie) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serie),
  });
  if (!response.ok) {
    throw new Error("No se pudo actualizar la serie");
  }
  return await response.json();
}

export async function deleteSerie(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("No se pudo eliminar la serie");
  }
  return await response.json();
}
