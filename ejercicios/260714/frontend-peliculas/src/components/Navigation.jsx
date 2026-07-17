// ==========================================================
// Navigation.jsx
// Componente para navegar entre vistas
// ==========================================================
function Navigation({ currentView, onViewChange }) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      padding: "12px",
      backgroundColor: "#f5f5f5",
      borderRadius: "8px"
    }}>
      <button
        onClick={() => onViewChange("movies")}
        className="btn"
        style={{
          backgroundColor: currentView === "movies" ? "#4CAF50" : "#ddd",
          color: currentView === "movies" ? "white" : "#333",
          border: "none",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: currentView === "movies" ? "bold" : "normal"
        }}
      >
        🎬 Películas
      </button>

      <button
        onClick={() => onViewChange("series")}
        className="btn"
        style={{
          backgroundColor: currentView === "series" ? "#4CAF50" : "#ddd",
          color: currentView === "series" ? "white" : "#333",
          border: "none",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: currentView === "series" ? "bold" : "normal"
        }}
      >
        📺 Series
      </button>

      <button
        onClick={() => onViewChange("search")}
        className="btn"
        style={{
          backgroundColor: currentView === "search" ? "#4CAF50" : "#ddd",
          color: currentView === "search" ? "white" : "#333",
          border: "none",
          cursor: "pointer",
          padding: "10px 20px",
          borderRadius: "4px",
          fontWeight: currentView === "search" ? "bold" : "normal"
        }}
      >
        🔍 Buscar
      </button>
    </div>
  );
}

export default Navigation;
