// ========================================================
// Footer.jsx
// Componente footer profesional con información legal
// y links de utilidad
// ========================================================

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Sobre CineDB</h4>
          <p>Tu aplicación web para gestionar películas y series personalizadas, integrada con TMDB.</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a></li>
            <li><a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">Documentación TMDB</a></li>
            <li><a href="mailto:soporte@cinedb.local">Soporte</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Tecnologías</h4>
          <ul>
            <li>React + Vite</li>
            <li>Express.js</li>
            <li>TMDB API</li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} CineDB. Todos los derechos reservados.</p>
          <p className="disclaimer">
            Los datos de películas y series provienen de <strong>TMDB</strong>. 
            Utilizamos información de acceso público para propósitos educativos.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
