//==================================
//1. IMPORTACIONES
//==================================
const express = require("express");
const cors = require("cors");
const axios = require("axios");

//=============================================
//2. INICIALIZACIÓN
//=============================================
const app = express();

//=============================================
//3. MIDDLEWARES (CONFIGURACIÓN GLOBAL y TMDB)
//=============================================
const TMDB_API_KEY = "bb54f6044f7e7fbb03c4a72ec6da570f"; // API Key de TMDB (The Movie Database)
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

//=============================================
//4. MIDDLEWARES
//=============================================
app.use(cors());
app.use(express.json());

//===============================================
//5. BASES DE DATOS LOCALES
//===============================================
// Películas personalizadas guardadas localmente
let peliculasPersonalizadas = [];
// Contador para IDs de películas personalizadas (>= 10000 para evitar conflictos con TMDB)
let siguienteIdPersonalizado = 10000;

//================================================
//6. RUTAS DE LA API (CRUD)
//================================================

// GET /api/peliculas → Obtener películas de TMDB + películas personalizadas
app.get("/api/peliculas", async (req, res) => {
  try {
    // Obtener películas de TMDB
    const responseTMDB = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES",
        page: 1
      }
    });

    // Mapear películas de TMDB
    const peliculasTMDB = responseTMDB.data.results.slice(0, 15).map(movie => ({
      id: movie.id,
      titulo: movie.title,
      director: "TMDB",
      imagen: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
      source: "tmdb"
    }));

    // Combinar películas de TMDB + películas personalizadas
    const todasLasPeliculas = [...peliculasTMDB, ...peliculasPersonalizadas];

    res.json(todasLasPeliculas);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("⚠️  ERROR 401: API Key de TMDB inválida o no autorizada");
      console.error("📌 Verifica tu API Key en https://www.themoviedb.org/settings/api");
    } else {
      console.error("Error al conectar con TMDB:", error.message);
    }
    // Si TMDB falla, devolver al menos las películas personalizadas
    res.json(peliculasPersonalizadas);
  }
});

// POST /api/peliculas → Crear una película personalizada
app.post("/api/peliculas", (req, res) => {
  const { titulo, director, imagen } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios (título y director)" });
  }

  const nuevaPelicula = {
    id: siguienteIdPersonalizado,
    titulo: titulo,
    director: director,
    imagen: imagen && imagen.trim() !== "" ? imagen : "", // Solo guardar si no está vacía
    source: "personalizada"
  };

  siguienteIdPersonalizado++;
  peliculasPersonalizadas.push(nuevaPelicula);
  
  res.status(201).json(nuevaPelicula);
});

// PUT /api/peliculas/:id → Actualizar una película personalizada
app.put("/api/peliculas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, director, imagen } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  // Solo se pueden editar películas personalizadas (id >= 10000)
  if (id < 10000) {
    return res.status(403).json({ error: "No puedes editar películas de TMDB" });
  }

  const pelicula = peliculasPersonalizadas.find(p => p.id === id);

  if (!pelicula) {
    return res.status(404).json({ error: "Película no encontrada" });
  }

  pelicula.titulo = titulo;
  pelicula.director = director;
  pelicula.imagen = imagen && imagen.trim() !== "" ? imagen : ""; // Solo guardar si no está vacía

  res.json(pelicula);
});

// DELETE /api/peliculas/:id → Eliminar una película personalizada
app.delete("/api/peliculas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Solo se pueden eliminar películas personalizadas (id >= 10000)
  if (id < 10000) {
    return res.status(403).json({ error: "No puedes eliminar películas de TMDB" });
  }

  const index = peliculasPersonalizadas.findIndex(p => p.id === id);

  if (index !== -1) {
    peliculasPersonalizadas.splice(index, 1);
    res.json({ mensaje: "Película personalizada eliminada" });
  } else {
    res.status(404).json({ error: "Película no encontrada" });
  }
});

//==========================================
//7. ENCENDIDO DEL SERVIDOR
//==========================================
app.listen(3000, () => {
  console.log("🎬 Servidor de películas listo en el puerto 3000 (TMDB + Personalizadas)");
  console.log("🎬 Películas TMDB: IDs < 10000");
  console.log("🎬 Películas Personalizadas: IDs >= 10000");
});