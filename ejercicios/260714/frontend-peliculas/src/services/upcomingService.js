const API_URL = "http://localhost:3000/api/upcoming";

/** Recupera los estrenos de TMDB para un tipo y una fecha ISO concretos. */
export async function getUpcoming(type, date) {
  const response = await fetch(`${API_URL}?${new URLSearchParams({ type, date })}`);
  if (!response.ok) throw new Error("No se pudieron obtener los estrenos");
  return response.json();
}
