// ==========================================================
// SearchBar.jsx
// Componente para buscar películas y series
// ==========================================================
import { useState } from "react";

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim() !== "") {
      onSearch(query, searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1, minWidth: "200px", margin: 0 }}>
          <label htmlFor="search-query" style={{ display: "block", marginBottom: "8px" }}>
            ¿Qué buscas?
          </label>
          <input
            id="search-query"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej: Inception, The Office, etc."
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          />
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor="search-type" style={{ display: "block", marginBottom: "8px" }}>
            Tipo
          </label>
          <select
            id="search-type"
            value={searchType}
            onChange={(event) => setSearchType(event.target.value)}
            style={{
              padding: "12px",
              border: "2px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px"
            }}
          >
            <option value="all">🎥 Todo</option>
            <option value="movie">🎬 Películas</option>
            <option value="tv">📺 Series</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
          style={{
            padding: "12px 30px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? "Buscando..." : "🔍 Buscar"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
