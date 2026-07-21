// ==========================================================
// App.jsx
// Componente principal. Estado global de la aplicación:
// - catálogos de películas y series
// - estado del backend: "checking" | "online" | "offline"
// - navegación entre vistas (view)
// - contenido seleccionado para detalle
// - contenido en edición
// - serverError: mensaje de error del servidor → se pasa al form activo
// ==========================================================

import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SearchBar from "./components/SearchBar.jsx";
import MovieList from "./components/MovieList.jsx";
import SerieList from "./components/SerieList.jsx";
import MovieForm from "./components/MovieForm.jsx";
import SerieForm from "./components/SerieForm.jsx";
import DetailPage from "./components/DetailPage.jsx";
import UpcomingPage from "./components/UpcomingPage.jsx";
import {
  createMovie, deleteMovie, getMovies, updateMovie, ApiError
} from "./services/movieService.js";
import {
  createSerie, deleteSerie, getSeries, updateSerie
} from "./services/serieService.js";
import { searchAll } from "./services/searchService.js";

function App() {
  const [movies, setMovies]               = useState([]);
  const [series, setSeries]               = useState([]);
  const [view, setView]                   = useState("search");
  const [results, setResults]             = useState([]);
  const [isSearching, setIsSearching]     = useState(false);
  const [selected, setSelected]           = useState(null);
  const [editing, setEditing]             = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [serverError, setServerError]     = useState(null);
  const [theme, setTheme]                 = useState(
    () => localStorage.getItem("cinedb-theme") || "dark"
  );

  // ---- Carga inicial de catálogos ----
  const loadCatalogs = async () => {
    try {
      const [movieData, serieData] = await Promise.all([getMovies(), getSeries()]);
      setMovies(movieData);
      setSeries(serieData);
      setBackendStatus("online");
    } catch {
      setBackendStatus("offline");
    }
  };

  useEffect(() => { loadCatalogs(); }, []);

  // ---- Tema: persiste y aplica al <html> ----
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("cinedb-theme", theme);
  }, [theme]);

  // ---- Búsqueda ----
  const handleSearch = async (filters) => {
    setIsSearching(true);
    try {
      setResults(await searchAll(filters));
      setView("search");
      setBackendStatus("online");
    } catch {
      setBackendStatus("offline");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // ---- Detalle ----
  const selectContent = (content, type) =>
    setSelected({ id: content.id, type, summary: content });

  // ---- CREAR o ACTUALIZAR (películas y series) ----
  const saveContent = async (data, type) => {
    setServerError(null);
    try {
      const isMovie = type === "movie";
      if (editing) {
        await (isMovie ? updateMovie : updateSerie)(editing.id, data);
      } else {
        await (isMovie ? createMovie : createSerie)(data);
      }
      setEditing(null);
      await loadCatalogs();
      setView(isMovie ? "movies" : "series");
    } catch (error) {
      if (error instanceof ApiError) {
        // 400 validación, 409 duplicado → se muestra en el formulario, sin alert()
        setServerError(error.message);
        if (!error.statusCode || error.statusCode >= 500) {
          setBackendStatus("offline");
        }
      } else {
        setBackendStatus("offline");
        setServerError("No se pudo conectar con el servidor. Comprueba que el backend esté encendido.");
      }
    }
  };

  // ---- ELIMINAR ----
  const removeContent = async (id, type) => {
    if (!window.confirm("¿Quieres eliminar este contenido personalizado?")) return;
    try {
      await (type === "movie" ? deleteMovie : deleteSerie)(id);
      setSelected(null);
      await loadCatalogs();
      setView(type === "movie" ? "movies" : "series");
    } catch (error) {
      if (error instanceof ApiError) {
        setServerError(error.message);
      } else {
        setBackendStatus("offline");
        setServerError("No se pudo eliminar el contenido. Verifica que el backend esté encendido.");
      }
    }
  };

  // ---- Cambio de vista: limpia errores y edición ----
  const handleViewChange = (next) => {
    setEditing(null);
    setServerError(null);
    setSelected(null);
    setView(next);
  };

  // ---- Render de tarjetas de búsqueda ----
  const renderCards = (items) => (
    <div className="movie-list">
      {items.map((item) => (
        <button
          className="movie-card card-button"
          key={`${item.tipo}-${item.id}`}
          onClick={() => selectContent(item, item.tipo === "pelicula" ? "movie" : "tv")}
        >
          <img
            src={item.imagen || "https://placehold.co/500x750?text=Sin+portada"}
            alt={`Portada de ${item.titulo}`}
          />
          <span className="movie-card-info">
            <strong className="movie-title">{item.titulo}</strong>
            <small>{item.año || "Fecha pendiente"}</small>
            <small>{item.tipo === "pelicula" ? "Película" : "Serie"}</small>
          </span>
        </button>
      ))}
    </div>
  );

  // ---- Vista de detalle ----
  if (selected) {
    return (
      <>
        <Header
          status={backendStatus}
          currentView={view}
          onViewChange={handleViewChange}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <main className="app-container">
          <DetailPage
            contentId={selected.id}
            contentType={selected.type}
            initialContent={selected.summary}
            onBack={() => setSelected(null)}
            onEdit={(item) => {
              setEditing(item);
              setServerError(null);
              setSelected(null);
              setView(selected.type === "movie" ? "add-movie" : "add-series");
            }}
            onDelete={(id) => removeContent(id, selected.type)}
          />
        </main>
        <Footer />
      </>
    );
  }

  // ---- Vista principal ----
  return (
    <>
      <Header
        status={backendStatus}
        currentView={view}
        onViewChange={handleViewChange}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main className="app-container">

        {backendStatus === "offline" && (
          <p className="offline-banner">
            No se ha podido conectar con la API. Inicia el backend y configura su archivo <code>.env</code>.
          </p>
        )}

        {view === "search" && (
          <section>
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            {results.length
              ? renderCards(results)
              : <p className="empty-message">Busca por título y usa los filtros para encontrar tu próxima historia.</p>
            }
          </section>
        )}

        {view === "movies" && (
          <MovieList movies={movies} onSelect={(item) => selectContent(item, "movie")} />
        )}

        {view === "series" && (
          <SerieList series={series} onSelect={(item) => selectContent(item, "tv")} />
        )}

        {view === "add-movie" && (
          <MovieForm
            editingMovie={editing}
            onSubmit={(data) => saveContent(data, "movie")}
            onCancelEdit={() => { setView("movies"); setServerError(null); }}
            serverError={serverError}
          />
        )}

        {view === "add-series" && (
          <SerieForm
            editingSerie={editing}
            onSubmit={(data) => saveContent(data, "tv")}
            onCancelEdit={() => { setView("series"); setServerError(null); }}
            serverError={serverError}
          />
        )}

        {view === "upcoming-movies" && (
          <UpcomingPage
            contentType="movie"
            onSelect={(item) => selectContent(item, "movie")}
          />
        )}

        {view === "upcoming-series" && (
          <UpcomingPage
            contentType="tv"
            onSelect={(item) => selectContent(item, "tv")}
          />
        )}

      </main>
      <Footer />
    </>
  );
}

export default App;