/** Agrupa la navegación principal y las subpestañas propias de películas y series. */
function Navigation({ currentView, onViewChange }) {
  const section = currentView.includes("movie") ? "movies" : currentView.includes("series") ? "series" : currentView;
  const mainItems = [["search", "Buscar"], ["movies", "Películas"], ["series", "Series"], ["add-movie", "Añadir película"], ["add-series", "Añadir serie"]];
  return <div className="navbar-content"><nav className="navigation" aria-label="Navegación principal">{mainItems.map(([value, label]) => <button key={value} className={`btn ${currentView === value ? "active" : ""}`} onClick={() => onViewChange(value)}>{label}</button>)}</nav>{(section === "movies" || section === "series") && <nav className="subnavigation" aria-label={`Sección ${section}`}><button className={currentView === section ? "active" : ""} onClick={() => onViewChange(section)}>Catálogo</button><button className={currentView === (section === "movies" ? "upcoming-movies" : "upcoming-series") ? "active" : ""} onClick={() => onViewChange(section === "movies" ? "upcoming-movies" : "upcoming-series")}>Próximamente</button></nav>}</div>;
}
export default Navigation;
