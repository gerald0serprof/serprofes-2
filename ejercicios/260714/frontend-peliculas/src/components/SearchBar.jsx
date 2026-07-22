// ========================================================
// SearchBar.jsx
// Componente para buscar películas y series con filtros
// Incluye: búsqueda de texto, tipo, género, año, director
// ========================================================
import { useState } from "react";

const GENRES = [
  "Acción", "Aventura", "Animación", "Comedia", "Crimen",
  "Documental", "Drama", "Familia", "Fantasía", "Histórico",
  "Horror", "Música", "Misterio", "Romance", "Ciencia Ficción",
  "Suspenso", "Televisión", "Thriller", "Guerra", "Occidental",
];

function generateYears() {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current; y >= current - 50; y--) years.push(y);
  return years;
}

function SearchBar({ onSearch, isLoading }) {
  const [query,            setQuery]            = useState("");
  const [searchType,       setSearchType]       = useState("all");
  const [showAdvanced,     setShowAdvanced]     = useState(false);
  const [selectedGenre,    setSelectedGenre]    = useState("");
  const [selectedYear,     setSelectedYear]     = useState("");
  const [selectedDirector, setSelectedDirector] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch({ query, type: searchType, genre: selectedGenre, year: selectedYear, director: selectedDirector });
  };

  const handleClear = () => {
    setQuery(""); setSearchType("all"); setSelectedGenre("");
    setSelectedYear(""); setSelectedDirector(""); setShowAdvanced(false);
  };

  return (
    <div className="search-hero">
      <div className="search-hero-inner">
        <p className="search-eyebrow">
         <svg className="search-eyebrow-icon" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Descubre tu próxima historia
        </p>
        <h2 className="search-heading">¿Qué quieres <span>ver hoy</span>?</h2>

        <form onSubmit={handleSubmit} className="search-form" noValidate>
          {/* Barra principal */}
          <div className="search-row">
            <div className="search-input-wrap">
              <input
                id="search-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Título, director, saga..."
                className="search-input-field"
                autoComplete="off"
              />
            </div>

            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="search-type-select"
              aria-label="Tipo de contenido"
            >
              <option value="all">Todo</option>
              <option value="movie">Películas</option>
              <option value="tv">Series</option>
            </select>

            {/* Botón búsqueda — solo icono lupa, sin texto */}
            <button
              type="submit"
              className="search-submit-btn"
              disabled={isLoading}
              aria-label={isLoading ? "Buscando…" : "Buscar"}
            >
              {isLoading ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className="search-btn-icon spin" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  className="search-btn-icon" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              )}
            </button>
          </div>

          {/* Toggle filtros avanzados */}
          <button
            type="button"
            className="search-filter-toggle"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <svg className="search-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
              strokeWidth="2" aria-hidden="true">
              <path d="M22 3H2l8 9.46V19l4 2v-8.54Z"/>
            </svg>
            {showAdvanced ? "Ocultar filtros" : "Filtros avanzados"}
          </button>

          {/* Filtros avanzados */}
          {showAdvanced && (
            <div className="search-advanced">
              <div className="filters-row">
                <div className="form-group">
                  <label htmlFor="filter-genre">Género</label>
                  <select id="filter-genre" value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)} className="filter-select">
                    <option value="">Todos los géneros</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="filter-year">Año</label>
                  <select id="filter-year" value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)} className="filter-select">
                    <option value="">Todos los años</option>
                    {generateYears().map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="filter-director">Director / Creador</label>
                  <input id="filter-director" type="text" value={selectedDirector}
                    onChange={(e) => setSelectedDirector(e.target.value)}
                    placeholder="Ej: Christopher Nolan" className="filter-input"/>
                </div>
                <button type="button" className="btn btn-cancel"
                  onClick={handleClear} style={{ alignSelf: "center" }}>
                  Limpiar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default SearchBar;