// ==========================================================
// App.jsx
// Componente principal con soporte para películas, series
// y búsqueda en TMDB
// ==========================================================
import { useState, useEffect } from "react";
import MovieList from "./components/MovieList.jsx";
import MovieForm from "./components/MovieForm.jsx";
import SerieList from "./components/SerieList.jsx";
import SerieForm from "./components/SerieForm.jsx";
import Navigation from "./components/Navigation.jsx";
import SearchBar from "./components/SearchBar.jsx";
import { getMovies, createMovie, updateMovie, deleteMovie } from "./services/movieService.js";
import { getSeries, createSerie, updateSerie, deleteSerie } from "./services/serieService.js";
import { searchAll } from "./services/searchService.js";

function App() {
  // ========== ESTADO DE PELÍCULAS ==========
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);

  // ========== ESTADO DE SERIES ==========
  const [series, setSeries] = useState([]);
  const [editingSerie, setEditingSerie] = useState(null);

  // ========== ESTADO DE BÚSQUEDA ==========
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // ========== ESTADO GENERAL ==========
  const [backendStatus, setBackendStatus] = useState("checking");
  const [currentView, setCurrentView] = useState("movies"); // "movies" | "series" | "search"

  // Al montar, cargamos películas y series
  useEffect(() => {
    cargarPeliculas();
    cargarSeries();
  }, []);

  // ========== PELÍCULAS ==========
  const cargarPeliculas = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
      setBackendStatus("online");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const handleFormSubmitMovie = async (movieData) => {
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, movieData);
        setEditingMovie(null);
      } else {
        await createMovie(movieData);
      }
      await cargarPeliculas();
    } catch (error) {
      setBackendStatus("offline");
      alert("No se pudo guardar la película. Verifica que el backend esté encendido.");
    }
  };

  const handleEditClickMovie = (movie) => {
    if (movie.source === "tmdb") {
      alert("No puedes editar películas de TMDB. Solo puedes editar películas personalizadas.");
      return;
    }
    setEditingMovie(movie);
  };

  const handleCancelEditMovie = () => {
    setEditingMovie(null);
  };

  const handleDeleteClickMovie = async (id) => {
    const confirmado = confirm("¿Seguro que quieres eliminar esta película?");
    if (!confirmado) return;

    try {
      await deleteMovie(id);
      await cargarPeliculas();
    } catch (error) {
      setBackendStatus("offline");
      alert(error.message || "No se pudo eliminar la película.");
    }
  };

  // ========== SERIES ==========
  const cargarSeries = async () => {
    try {
      const data = await getSeries();
      setSeries(data);
      setBackendStatus("online");
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  const handleFormSubmitSerie = async (serieData) => {
    try {
      if (editingSerie) {
        await updateSerie(editingSerie.id, serieData);
        setEditingSerie(null);
      } else {
        await createSerie(serieData);
      }
      await cargarSeries();
    } catch (error) {
      setBackendStatus("offline");
      alert("No se pudo guardar la serie. Verifica que el backend esté encendido.");
    }
  };

  const handleEditClickSerie = (serie) => {
    if (serie.source === "tmdb") {
      alert("No puedes editar series de TMDB. Solo puedes editar series personalizadas.");
      return;
    }
    setEditingSerie(serie);
  };

  const handleCancelEditSerie = () => {
    setEditingSerie(null);
  };

  const handleDeleteClickSerie = async (id) => {
    const confirmado = confirm("¿Seguro que quieres eliminar esta serie?");
    if (!confirmado) return;

    try {
      await deleteSerie(id);
      await cargarSeries();
    } catch (error) {
      setBackendStatus("offline");
      alert(error.message || "No se pudo eliminar la serie.");
    }
  };

  // ========== BÚSQUEDA ==========
  const handleSearch = async (query, type) => {
    setIsSearching(true);
    try {
      const results = await searchAll(query);
      setSearchResults(results);
      setCurrentView("search");
      setBackendStatus("online");
    } catch (error) {
      setBackendStatus("offline");
      alert("Error al buscar. Verifica que el backend esté encendido.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 Catálogo de Películas y Series</h1>

        {backendStatus === "online" && (
          <span className="status status-online">🟢 Backend conectado</span>
        )}
        {backendStatus === "offline" && (
          <span className="status status-offline">🔴 Backend desconectado</span>
        )}
        {backendStatus === "checking" && (
          <span className="status status-checking">🟡 Comprobando conexión...</span>
        )}
      </header>

      {backendStatus === "offline" && (
        <div className="offline-banner">
          No se puede conectar con <strong>http://localhost:3000</strong>.
          <br />
          Comprueba que tu servidor Express esté encendido (<code>node server.js</code>).
        </div>
      )}

      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      {/* ========== VISTA DE PELÍCULAS ========== */}
      {currentView === "movies" && (
        <>
          <MovieForm
            editingMovie={editingMovie}
            onSubmit={handleFormSubmitMovie}
            onCancelEdit={handleCancelEditMovie}
          />
          <MovieList
            movies={movies}
            onEdit={handleEditClickMovie}
            onDelete={handleDeleteClickMovie}
          />
        </>
      )}

      {/* ========== VISTA DE SERIES ========== */}
      {currentView === "series" && (
        <>
          <SerieForm
            editingSerie={editingSerie}
            onSubmit={handleFormSubmitSerie}
            onCancelEdit={handleCancelEditSerie}
          />
          <SerieList
            series={series}
            onEdit={handleEditClickSerie}
            onDelete={handleDeleteClickSerie}
          />
        </>
      )}

      {/* ========== VISTA DE BÚSQUEDA ========== */}
      {currentView === "search" && (
        <>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          {searchResults.length > 0 && (
            <div>
              <h3>📊 Resultados de búsqueda ({searchResults.length})</h3>
              <div className="movie-list">
                {searchResults.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="movie-card">
                    {item.imagen && item.imagen.trim() !== "" ? (
                      <img
                        src={item.imagen}
                        alt={item.titulo}
                        style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "180px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: "14px"
                      }}>
                        Sin imagen
                      </div>
                    )}
                    <div className="movie-card-info">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <h3 className="movie-title">{item.titulo}</h3>
                        <span style={{
                          fontSize: "10px",
                          backgroundColor: "#ff6b35",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          whiteSpace: "nowrap"
                        }}>TMDB</span>
                        <span style={{
                          fontSize: "10px",
                          backgroundColor: item.tipo === "pelicula" ? "#0066cc" : "#6c5ce7",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          marginLeft: "4px",
                          whiteSpace: "nowrap"
                        }}>
                          {item.tipo === "pelicula" ? "🎬 Película" : "📺 Serie"}
                        </span>
                      </div>
                      <p className="movie-director">👤 {item.tipo === "pelicula" ? item.director : item.creador}</p>
                      {item.año && <p style={{ fontSize: "12px", color: "#666" }}>📅 {item.año}</p>}
                      {item.calificacion && <p style={{ fontSize: "12px", color: "#666" }}>⭐ {item.calificacion}/10</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {searchResults.length === 0 && (
            <p className="empty-message">Usa la barra de búsqueda para encontrar películas o series.</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;