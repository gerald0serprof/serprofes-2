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
//5. BASES DE DATOS LOCALES (Películas)
//===============================================
let peliculasPersonalizadas = [];
let siguienteIdPelicula = 10000;

//===============================================
//6. BASES DE DATOS LOCALES (Series)
//===============================================
let seriesPersonalizadas = [];
let siguienteIdSerie = 20000;

//================================================
//7. RUTAS DE LA API - PELÍCULAS
//================================================

// GET /api/peliculas → Obtener películas TMDB + personalizadas
app.get("/api/peliculas", async (req, res) => {
  try {
    const responseTMDB = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES",
        page: 1
      }
    });

    const peliculasTMDB = responseTMDB.data.results.slice(0, 15).map(movie => ({
      id: movie.id,
      titulo: movie.title,
      director: "TMDB",
      imagen: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
      año: movie.release_date ? movie.release_date.split("-")[0] : "",
      descripcion: movie.overview,
      tipo: "pelicula",
      source: "tmdb"
    }));

    const todasLasPeliculas = [...peliculasTMDB, ...peliculasPersonalizadas];
    res.json(todasLasPeliculas);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("⚠️ ERROR 401: API Key de TMDB inválida");
    } else {
      console.error("Error al conectar con TMDB:", error.message);
    }
    res.json(peliculasPersonalizadas);
  }
});

// GET /api/peliculas/:id → Detalles de una película
app.get("/api/peliculas/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  
  // Si es personalizada, buscar localmente
  if (id >= 10000) {
    const pelicula = peliculasPersonalizadas.find(p => p.id === id);
    return pelicula 
      ? res.json(pelicula)
      : res.status(404).json({ error: "Película no encontrada" });
  }
  
  // Si es de TMDB, hacer request a TMDB
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES"
      }
    });
    
    res.json({
      id: response.data.id,
      titulo: response.data.title,
      director: "TMDB",
      imagen: response.data.poster_path ? `${IMAGE_BASE_URL}${response.data.poster_path}` : "",
      año: response.data.release_date?.split("-")[0],
      descripcion: response.data.overview,
      tipo: "pelicula",
      generos: response.data.genres.map(g => g.name),
      calificacion: response.data.vote_average,
      source: "tmdb"
    });
  } catch (error) {
    res.status(404).json({ error: "Película no encontrada en TMDB" });
  }
});

// POST /api/peliculas → Crear película personalizada
app.post("/api/peliculas", (req, res) => {
  const { titulo, director, imagen, descripcion, año } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios (título y director)" });
  }

  const nuevaPelicula = {
    id: siguienteIdPelicula,
    titulo,
    director,
    imagen: imagen && imagen.trim() !== "" ? imagen : "",
    descripcion: descripcion || "",
    año: año || new Date().getFullYear(),
    tipo: "pelicula",
    source: "personalizada"
  };

  siguienteIdPelicula++;
  peliculasPersonalizadas.push(nuevaPelicula);
  res.status(201).json(nuevaPelicula);
});

// PUT /api/peliculas/:id → Actualizar película personalizada
app.put("/api/peliculas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, director, imagen, descripcion, año } = req.body;

  if (!titulo || !director) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  if (id < 10000) {
    return res.status(403).json({ error: "No puedes editar películas de TMDB" });
  }

  const pelicula = peliculasPersonalizadas.find(p => p.id === id);
  if (!pelicula) {
    return res.status(404).json({ error: "Película no encontrada" });
  }

  pelicula.titulo = titulo;
  pelicula.director = director;
  pelicula.imagen = imagen && imagen.trim() !== "" ? imagen : "";
  pelicula.descripcion = descripcion || "";
  pelicula.año = año || pelicula.año;

  res.json(pelicula);
});

// DELETE /api/peliculas/:id → Eliminar película personalizada
app.delete("/api/peliculas/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (id < 10000) {
    return res.status(403).json({ error: "No puedes eliminar películas de TMDB" });
  }

  const index = peliculasPersonalizadas.findIndex(p => p.id === id);
  if (index !== -1) {
    peliculasPersonalizadas.splice(index, 1);
    res.json({ mensaje: "Película eliminada" });
  } else {
    res.status(404).json({ error: "Película no encontrada" });
  }
});

//================================================
//8. RUTAS DE LA API - SERIES
//================================================

// GET /api/series → Obtener series TMDB + personalizadas
app.get("/api/series", async (req, res) => {
  try {
    const responseTMDB = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES",
        page: 1
      }
    });

    const seriesTMDB = responseTMDB.data.results.slice(0, 15).map(serie => ({
      id: serie.id,
      titulo: serie.name,
      creador: "TMDB",
      imagen: serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : "",
      año: serie.first_air_date ? serie.first_air_date.split("-")[0] : "",
      descripcion: serie.overview,
      tipo: "serie",
      source: "tmdb"
    }));

    const todasLasSeries = [...seriesTMDB, ...seriesPersonalizadas];
    res.json(todasLasSeries);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("⚠️ ERROR 401: API Key de TMDB inválida");
    } else {
      console.error("Error al conectar con TMDB:", error.message);
    }
    res.json(seriesPersonalizadas);
  }
});

// GET /api/series/:id → Detalles de una serie
app.get("/api/series/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  
  if (id >= 20000) {
    const serie = seriesPersonalizadas.find(s => s.id === id);
    return serie 
      ? res.json(serie)
      : res.status(404).json({ error: "Serie no encontrada" });
  }
  
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "es-ES"
      }
    });
    
    res.json({
      id: response.data.id,
      titulo: response.data.name,
      creador: "TMDB",
      imagen: response.data.poster_path ? `${IMAGE_BASE_URL}${response.data.poster_path}` : "",
      año: response.data.first_air_date?.split("-")[0],
      descripcion: response.data.overview,
      temporadas: response.data.number_of_seasons,
      tipo: "serie",
      generos: response.data.genres.map(g => g.name),
      calificacion: response.data.vote_average,
      source: "tmdb"
    });
  } catch (error) {
    res.status(404).json({ error: "Serie no encontrada en TMDB" });
  }
});

// POST /api/series → Crear serie personalizada
app.post("/api/series", (req, res) => {
  const { titulo, creador, imagen, descripcion, año, temporadas } = req.body;

  if (!titulo || !creador) {
    return res.status(400).json({ error: "Faltan datos obligatorios (título y creador)" });
  }

  const nuevaSerie = {
    id: siguienteIdSerie,
    titulo,
    creador,
    imagen: imagen && imagen.trim() !== "" ? imagen : "",
    descripcion: descripcion || "",
    año: año || new Date().getFullYear(),
    temporadas: temporadas || 1,
    tipo: "serie",
    source: "personalizada"
  };

  siguienteIdSerie++;
  seriesPersonalizadas.push(nuevaSerie);
  res.status(201).json(nuevaSerie);
});

// PUT /api/series/:id → Actualizar serie personalizada
app.put("/api/series/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, creador, imagen, descripcion, año, temporadas } = req.body;

  if (!titulo || !creador) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  if (id < 20000) {
    return res.status(403).json({ error: "No puedes editar series de TMDB" });
  }

  const serie = seriesPersonalizadas.find(s => s.id === id);
  if (!serie) {
    return res.status(404).json({ error: "Serie no encontrada" });
  }

  serie.titulo = titulo;
  serie.creador = creador;
  serie.imagen = imagen && imagen.trim() !== "" ? imagen : "";
  serie.descripcion = descripcion || "";
  serie.año = año || serie.año;
  serie.temporadas = temporadas || serie.temporadas;

  res.json(serie);
});

// DELETE /api/series/:id → Eliminar serie personalizada
app.delete("/api/series/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (id < 20000) {
    return res.status(403).json({ error: "No puedes eliminar series de TMDB" });
  }

  const index = seriesPersonalizadas.findIndex(s => s.id === id);
  if (index !== -1) {
    seriesPersonalizadas.splice(index, 1);
    res.json({ mensaje: "Serie eliminada" });
  } else {
    res.status(404).json({ error: "Serie no encontrada" });
  }
});

//================================================
//9. RUTAS DE LA API - BÚSQUEDA
//================================================

// GET /api/search?q=...&type=movie|tv|all → Búsqueda en TMDB
app.get("/api/search", async (req, res) => {
  const { q, type = "all" } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ error: "Parámetro 'q' requerido" });
  }

  try {
    let resultados = [];

    if (type === "movie" || type === "all") {
      const movieResponse = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "es-ES",
          query: q,
          page: 1
        }
      });

      const películas = movieResponse.data.results.slice(0, 10).map(movie => ({
        id: movie.id,
        titulo: movie.title,
        director: "TMDB",
        imagen: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "",
        año: movie.release_date ? movie.release_date.split("-")[0] : "",
        descripcion: movie.overview,
        tipo: "pelicula",
        source: "tmdb"
      }));

      resultados.push(...películas);
    }

    if (type === "tv" || type === "all") {
      const tvResponse = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "es-ES",
          query: q,
          page: 1
        }
      });

      const series = tvResponse.data.results.slice(0, 10).map(serie => ({
        id: serie.id,
        titulo: serie.name,
        creador: "TMDB",
        imagen: serie.poster_path ? `${IMAGE_BASE_URL}${serie.poster_path}` : "",
        año: serie.first_air_date ? serie.first_air_date.split("-")[0] : "",
        descripcion: serie.overview,
        tipo: "serie",
        source: "tmdb"
      }));

      resultados.push(...series);
    }

    res.json(resultados);
  } catch (error) {
    console.error("Error en búsqueda:", error.message);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

//==========================================
//10. ENCENDIDO DEL SERVIDOR
//==========================================
app.listen(3000, () => {
  console.log("🎬 Servidor de películas y series listo en puerto 3000");
  console.log("📽️  Películas TMDB: IDs < 10000");
  console.log("📝 Películas Personalizadas: IDs 10000-19999");
  console.log("📺 Series TMDB: IDs < 20000");
  console.log("📝 Series Personalizadas: IDs >= 20000");
  console.log("🔍 Búsqueda disponible en /api/search");
});