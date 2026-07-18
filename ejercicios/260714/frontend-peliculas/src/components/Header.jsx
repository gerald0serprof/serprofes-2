import Navigation from "./Navigation.jsx";

/** Presenta la marca, navegación global, estado de API y control de tema. */
function Header({ status = "checking", currentView, onViewChange, theme, onToggleTheme }) {
  const label = status === "online" ? "API conectada" : status === "offline" ? "API sin conexión" : "Conectando…";
  return <header className="app-header"><div className="header-container"><div className="header-top"><div className="header-logo"><h1>CineDB</h1><p className="tagline">Descubre, organiza y consulta películas y series</p></div><div className="header-actions"><span className={`status status-${status}`}>{label}</span><button className="theme-toggle" onClick={onToggleTheme} aria-label="Cambiar tema">{theme === "dark" ? "☀ Tema claro" : "◐ Tema noche"}</button></div></div>{onViewChange && <Navigation currentView={currentView} onViewChange={onViewChange} />}</div></header>;
}
export default Header;
