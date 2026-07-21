// ========================================================
// Navigation.jsx
// Navegación principal + subpestañas condicionales.
// BUG FIX: las subpestañas "Catálogo" y "Próximamente"
// solo se muestran cuando la sección activa es movies o series.
// Se ocultan en search, add-movie, add-series, upcoming-*.
// ========================================================
function Navigation({ currentView, onViewChange }) {
  // La sección raíz activa: solo "movies" o "series" activan subpestañas
  const activeSection =
    currentView === "movies" || currentView === "upcoming-movies"
      ? "movies"
      : currentView === "series" || currentView === "upcoming-series"
      ? "series"
      : null;

  const mainItems = [
    ["search",     "Buscar"],
    ["movies",     "Películas"],
    ["series",     "Series"],
    ["add-movie",  "Añadir película"],
    ["add-series", "Añadir serie"],
  ];

  return (
    <div className="navbar-content">
      <nav className="navigation" aria-label="Navegación principal">
        {mainItems.map(([value, label]) => (
          <button
            key={value}
            className={`btn ${currentView === value ? "active" : ""}`}
            onClick={() => onViewChange(value)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Subpestañas: SOLO visibles cuando la sección es movies o series */}
      {activeSection && (
        <nav className="subnavigation" aria-label={`Sección ${activeSection}`}>
          <button
            className={
              currentView === activeSection ? "active" : ""
            }
            onClick={() => onViewChange(activeSection)}
          >
            Catálogo
          </button>
          <button
            className={
              currentView ===
              (activeSection === "movies" ? "upcoming-movies" : "upcoming-series")
                ? "active"
                : ""
            }
            onClick={() =>
              onViewChange(
                activeSection === "movies" ? "upcoming-movies" : "upcoming-series"
              )
            }
          >
            Próximamente
          </button>
        </nav>
      )}
    </div>
  );
}

export default Navigation;