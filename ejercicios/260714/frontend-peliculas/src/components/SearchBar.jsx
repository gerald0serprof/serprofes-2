// ========================================================
// SearchBar.jsx
// Componente para buscar películas y series con filtros
// Incluye: búsqueda de texto, tipo, género, año, director
// ========================================================
import { useState } from "react";

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDirector, setSelectedDirector] = useState("");

  /**
   * Genres disponibles en TMDB
   */
  const genres = [
    "Acción", "Aventura", "Animación", "Comedia", "Crimen",
    "Documental", "Drama", "Familia", "Fantasía", "Histórico",
    "Horror", "Música", "Misterio", "Romance", "Ciencia Ficción",
    "Suspenso", "Televisión", "Thriller", "Guerra", "Occidental"
  ];

  /**
   * Genera lista de años (últimos 50 años)
   */
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 50; i--) {
      years.push(i);
    }
    return years;
  };

  /**
   * Ejecuta la búsqueda con todos los filtros
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim() !== "") {
      const filters = {
        query,
        type: searchType,
        genre: selectedGenre,
        year: selectedYear,
        director: selectedDirector
      };
      onSearch(filters);
    }
  };

  /**
   * Limpia todos los filtros
   */
  const handleClearFilters = () => {
    setQuery("");
    setSearchType("all");
    setSelectedGenre("");
    setSelectedYear("");
    setSelectedDirector("");
    setShowAdvancedFilters(false);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      {/* Búsqueda principal */}
      <div className="search-main">
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="search-query" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            🔍 ¿Qué buscas?
          </label>
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: Inception, The Office, Avatar..."
            className="search-input"
          />
        </div>

        <div className="form-group" style={{ marginLeft: "12px" }}>
          <label htmlFor="search-type" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Tipo
          </label>
          <select
            id="search-type"
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
            className="search-select"
          >
            <option value="all">🎥 Todo</option>
            <option value="movie">🎬 Películas</option>
            <option value="tv">📺 Series</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary search-btn"
          disabled={isLoading}
        >
          {isLoading ? "Buscando..." : "🔍 Buscar"}
        </button>
      </div>

      {/* Toggle para filtros avanzados */}
      <button
        type="button"
        className="btn-advanced-toggle"
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        ⚙️ {showAdvancedFilters ? "Ocultar Filtros" : "Mostrar Filtros Avanzados"}
      </button>

      {/* Filtros avanzados (colapsable) */}
      {showAdvancedFilters && (
        <div className="advanced-filters">
          <div className="filters-row">
            {/* Filtro de Género */}
            <div className="form-group">
              <label htmlFor="genre-select">Género</label>
              <select
                id="genre-select"
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
                className="filter-select"
              >
                <option value="">Todos los géneros</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Año */}
            <div className="form-group">
              <label htmlFor="year-select">Año</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="filter-select"
              >
                <option value="">Todos los años</option>
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Director/Creador */}
            <div className="form-group">
              <label htmlFor="director-input">Director/Creador</label>
              <input
                id="director-input"
                type="text"
                value={selectedDirector}
                onChange={(event) => setSelectedDirector(event.target.value)}
                placeholder="Ej: Christopher Nolan"
                className="filter-input"
              />
            </div>

            {/* Botón de limpiar filtros */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFilters}
              style={{ alignSelf: "flex-end" }}
            >
              🔄 Limpiar Filtros
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default SearchBar;
