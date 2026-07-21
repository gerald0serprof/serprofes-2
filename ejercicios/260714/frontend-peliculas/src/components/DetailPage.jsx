// ========================================================
// DetailPage.jsx
// Página completa para mostrar detalles de película/serie
// Se muestra al seleccionar un contenido
// Incluye: portada, detalles, vídeos TMDB, actores
//
//  - content.trailer  → content.trailer_key (retrocompatibilidad)
//  - Nuevo selector de vídeos con content.videos[]
//    Muestra el tipo real de TMDB: Trailer, Teaser, Clip, etc.
// ========================================================

import { useState, useEffect } from "react";
import { getMovieById } from "../services/movieService.js";
import { getSerieById } from "../services/serieService.js";
import CastCarousel from "./CastCarousel.jsx";

// Etiquetas en español para cada tipo de vídeo TMDB
const VIDEO_LABEL = {
  "Trailer":           "🎬 Tráiler",
  "Teaser":            "📽️ Teaser",
  "Clip":              "🎞️ Clip",
  "Featurette":        "🎥 Featurette",
  "Behind the Scenes": "🎭 Detrás de cámaras",
  "Bloopers":          "😂 Bloopers",
};

function VideoSection({ videos = [], trailer_key }) {
  // Determinar lista de vídeos disponibles; fallback a trailer_key legacy
  const lista = videos.length > 0
    ? videos
    : trailer_key
      ? [{ tipo: "Trailer", titulo: "Tráiler oficial", key: trailer_key }]
      : [];

  const [activo, setActivo] = useState(0);
  const [visible, setVisible] = useState(false);

  if (lista.length === 0) {
    return <p className="muted">No hay vídeos disponibles para este contenido.</p>;
  }

  const videoActual = lista[activo];

  return (
    <div className="detail-trailer">
      <button className="btn btn-trailer" onClick={() => setVisible(!visible)}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"
          style={{ marginRight: "6px", verticalAlign: "middle" }}>
          <path d="M8 5v14l11-7z"/>
        </svg>
        {visible
          ? "Ocultar vídeo"
          : `Ver ${VIDEO_LABEL[videoActual.tipo] ?? videoActual.tipo}`}
      </button>

      {visible && (
        <div className="trailer-container">
          {lista.length > 1 && (
            <div className="video-tabs">
              {lista.map((v, idx) => (
                <button key={v.key}
                  className={`video-tab${idx === activo ? " video-tab--active" : ""}`}
                  onClick={() => setActivo(idx)} title={v.titulo}>
                  {VIDEO_LABEL[v.tipo] ?? v.tipo}
                </button>
              ))}
            </div>
          )}
          <div className="trailer-embed">
            <iframe key={videoActual.key} width="100%" height="400"
              src={`https://www.youtube.com/embed/${videoActual.key}`}
              title={videoActual.titulo || videoActual.tipo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          {videoActual.titulo && <p className="video-titulo">{videoActual.titulo}</p>}
        </div>
      )}
    </div>
  );
}

/** Muestra valoración numérica + estrellas.
 *  Si no hay calificación → 5 estrellas vacías + "Pendiente de valoración". */
function RatingBlock({ calificacion }) {
  const hasRating = calificacion != null && calificacion > 0;
  const stars = hasRating ? Math.round(calificacion / 2) : 0;

  return (
    <div className="rating-container">
      {hasRating ? (
        <div className="rating-circle">
          <span className="rating-value">{calificacion.toFixed(1)}</span>
          <span className="rating-label">/10</span>
        </div>
      ) : (
        <p className="rating-pending">Pendiente de valoración</p>
      )}
      <div className="rating-stars" aria-label={hasRating ? `${stars} de 5 estrellas` : "Sin valoración"}>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < stars ? "star-full" : "star-empty"}>★</span>
        ))}
      </div>
    </div>
  );
}

function DetailPage({ contentId, contentType, initialContent, onBack, onEdit, onDelete }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const cargarDetalles = async () => {
      try {
        setLoading(true);
        const data = contentType === "movie"
          ? await getMovieById(contentId)
          : await getSerieById(contentId);
        setContent(data);
        setError(null);
      } catch {
        if (initialContent) { setContent(initialContent); setError(null); }
        else { setError("No se pudo cargar el detalle del contenido"); }
      } finally {
        setLoading(false);
      }
    };
    if (contentId) cargarDetalles();
  }, [contentId, contentType, initialContent]);

  if (loading) {
    return <div className="detail-page-loading"><p>Cargando detalles...</p></div>;
  }

  if (error || !content) {
    return (
      <div className="detail-page-error">
        <p>❌ {error || "Contenido no encontrado"}</p>
        <button className="btn-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            width="16" height="16" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Volver
        </button>
      </div>
    );
  }

  const esPersonalizado = content.source === "personalizada";
  const actores = content.actores || [];

  return (
    <div className="detail-page">
      {/* Header */}
      <div className="detail-header">
        {/* Botón Volver profesional */}
        <button className="btn-back" onClick={onBack} aria-label="Volver al listado">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            width="16" height="16" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Volver
        </button>

        <h1>{content.titulo}</h1>

        <div className="detail-badges">
          {!esPersonalizado && <span className="badge badge-tmdb">TMDB</span>}
          {esPersonalizado  && <span className="badge badge-personal">Personal</span>}
          <span className="badge badge-type">
            {content.tipo === "pelicula" ? "Película" : "Serie"}
          </span>
        </div>
      </div>

      <div className="detail-content">
        {/* Columna izquierda: Poster + rating */}
        <div className="detail-poster-section">
          {content.imagen?.trim() ? (
            <img src={content.imagen} alt={`Portada de ${content.titulo}`}
              className="detail-poster" />
          ) : (
            <div className="detail-poster-placeholder">Sin imagen</div>
          )}

          {/* Siempre se renderiza el bloque de rating */}
          <RatingBlock calificacion={content.calificacion} />

          {esPersonalizado && (
            <div className="detail-actions">
              <button className="btn btn-edit"   onClick={() => onEdit(content)}>✏️ Editar</button>
              <button className="btn btn-delete" onClick={() => onDelete(content.id)}>🗑️ Eliminar</button>
            </div>
          )}
        </div>

        {/* Columna derecha: Información */}
        <div className="detail-info-section">
          <div className="detail-info-group">
            <h3>Información</h3>
            <p><strong>Título original:</strong> {content.titulo_original || content.titulo || "No disponible"}</p>
            {content.año      && <p><strong>Año:</strong> {content.año}</p>}
            {content.idioma_original && <p><strong>Idioma original:</strong> {content.idioma_original}</p>}
            {content.idioma   && <p><strong>Idioma:</strong> {content.idioma}</p>}
            {content.tipo === "pelicula" && content.duracion && (
              <p><strong>Duración:</strong> {content.duracion} minutos</p>
            )}
            {content.tipo === "serie" && content.temporadas && (
              <p><strong>Temporadas:</strong> {content.temporadas}</p>
            )}
            <p>
              <strong>{content.tipo === "pelicula" ? "Director(es)" : "Creador(es)"}:</strong>{" "}
              {content.director || content.creador || "No disponible"}
            </p>
          </div>

          <div className="detail-genres">
            <h3>Géneros</h3>
            <div className="genres-list">
              {content.generos?.length
                ? content.generos.map((g, idx) => <span key={idx} className="genre-tag">{g}</span>)
                : content.genero
                ? <span className="genre-tag">{content.genero}</span>
                : <span className="muted">No disponibles</span>}
            </div>
          </div>

          {content.descripcion && (
            <div className="detail-description">
              <h3>Sinopsis</h3>
              <p>{content.descripcion}</p>
            </div>
          )}

          <VideoSection videos={content.videos} trailer_key={content.trailer_key} />
        </div>
      </div>

      <CastCarousel actors={actores} />
    </div>
  );
}

export default DetailPage;