// ========================================================
// DetailPage.jsx
// Página completa para mostrar detalles de película/serie
// Se muestra al seleccionar un contenido
// Incluye: portada, detalles, trailer, actores
// ========================================================

import { useState, useEffect } from "react";
import { getMovieById } from "../services/movieService.js";
import { getSerieById } from "../services/serieService.js";
import CastCarousel from "./CastCarousel.jsx";

function DetailPage({ contentId, contentType, initialContent, onBack, onEdit, onDelete }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    /**
     * Carga los detalles del contenido (película o serie)
     * dependiendo del tipo
     */
    const cargarDetalles = async () => {
      try {
        setLoading(true);
        let data;
        
        if (contentType === "movie") {
          data = await getMovieById(contentId);
        } else {
          data = await getSerieById(contentId);
        }
        
        setContent(data);
        setError(null);
      } catch (err) {
        // Conserva la ficha resumida para que la navegación al detalle siga funcionando sin TMDB.
        if (initialContent) { setContent(initialContent); setError(null); }
        else { setError("No se pudo cargar el detalle del contenido"); }
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      cargarDetalles();
    }
  }, [contentId, contentType, initialContent]);

  if (loading) {
    return (
      <div className="detail-page-loading">
        <p>Cargando detalles...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="detail-page-error">
        <p>❌ {error || "Contenido no encontrado"}</p>
        <button className="btn btn-primary" onClick={onBack}>
          ← Volver atrás
        </button>
      </div>
    );
  }

  const esPersonalizado = content.source === "personalizada";
  const actores = content.actores || [];

  return (
    <div className="detail-page">
      {/* Header del detail */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>
          ← Volver
        </button>
        <h1>{content.titulo}</h1>
        <div className="detail-badges">
          {!esPersonalizado && <span className="badge badge-tmdb">🎬 TMDB</span>}
          {esPersonalizado && <span className="badge badge-personal">📝 Personalizada</span>}
          <span className="badge badge-type">
            {content.tipo === "pelicula" ? "🎬 Película" : "📺 Serie"}
          </span>
        </div>
      </div>

      <div className="detail-content">
        {/* Columna Izquierda: Poster */}
        <div className="detail-poster-section">
          {content.imagen && content.imagen.trim() !== "" ? (
            <img
              src={content.imagen}
              alt={content.titulo}
              className="detail-poster"
            />
          ) : (
            <div className="detail-poster-placeholder">Sin imagen</div>
          )}

          {/* Calificación creativa */}
          {content.calificacion && (
            <div className="rating-container">
              <div className="rating-circle">
                <span className="rating-value">{content.calificacion.toFixed(1)}</span>
                <span className="rating-label">/10</span>
              </div>
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(content.calificacion / 2) ? "star-full" : "star-empty"}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción (solo si es personalizado) */}
          {esPersonalizado && (
            <div className="detail-actions">
              <button className="btn btn-edit" onClick={() => onEdit(content)}>
                ✏️ Editar
              </button>
              <button className="btn btn-delete" onClick={() => onDelete(content.id)}>
                🗑️ Eliminar
              </button>
            </div>
          )}
        </div>

        {/* Columna Derecha: Información */}
        <div className="detail-info-section">
          {/* Información Básica */}
          <div className="detail-info-group">
            <h3>Información</h3>
            <p><strong>Título original:</strong> {content.titulo_original || content.titulo || "No disponible"}</p>
            {content.año && <p><strong>Año:</strong> {content.año}</p>}
            <p><strong>Idioma original:</strong> {content.idioma_original || "No disponible"}</p>
            {content.tipo === "pelicula" && content.duracion && (
              <p><strong>Duración:</strong> {content.duracion} minutos</p>
            )}
            {content.tipo === "serie" && content.temporadas && (
              <p><strong>Temporadas:</strong> {content.temporadas}</p>
            )}
            <p><strong>{content.tipo === "pelicula" ? "Director(es)" : "Creador(es)"}:</strong> {content.director || content.creador || "No disponible"}</p>
          </div>

          {/* Géneros como etiquetas */}
          <div className="detail-genres"><h3>Géneros</h3><div className="genres-list">{content.generos?.length ? content.generos.map((genero, idx) => <span key={idx} className="genre-tag">{genero}</span>) : <span className="muted">No disponibles</span>}</div></div>

          {/* Descripción */}
          {content.descripcion && (
            <div className="detail-description">
              <h3>Sinopsis</h3>
              <p>{content.descripcion}</p>
            </div>
          )}

          {/* Botón de Trailer */}
          <div className="detail-trailer">
            {content.trailer ? (<>
              <button
                className="btn btn-trailer"
                onClick={() => setShowTrailer(!showTrailer)}
              >
                ▶ {showTrailer ? "Ocultar tráiler" : "Ver tráiler"}
              </button>
              {showTrailer && (
                <div className="trailer-embed">
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${content.trailer}`}
                    title="Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}</>) : <p className="muted">No hay tráiler disponible para este contenido.</p>}
            </div>
        </div>
      </div>

      <CastCarousel actors={actores} />
    </div>
  );
}

export default DetailPage;
