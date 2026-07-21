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
      <button
        className="btn btn-trailer"
        onClick={() => setVisible(!visible)}
      >
        ▶ {visible ? "Ocultar vídeo" : `Ver ${VIDEO_LABEL[videoActual.tipo] ?? videoActual.tipo}`}
      </button>

      {visible && (
        <div className="trailer-container">
          {/* Selector de pestañas solo si hay más de un vídeo */}
          {lista.length > 1 && (
            <div className="video-tabs">
              {lista.map((v, idx) => (
                <button
                  key={v.key}
                  className={`video-tab${idx === activo ? " video-tab--active" : ""}`}
                  onClick={() => setActivo(idx)}
                  title={v.titulo}
                >
                  {VIDEO_LABEL[v.tipo] ?? v.tipo}
                </button>
              ))}
            </div>
          )}

          <div className="trailer-embed">
            <iframe
              key={videoActual.key}
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${videoActual.key}`}
              title={videoActual.titulo || videoActual.tipo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {videoActual.titulo && (
            <p className="video-titulo">{videoActual.titulo}</p>
          )}
        </div>
      )}
    </div>
  );
}

function DetailPage({ contentId, contentType, initialContent, onBack, onEdit, onDelete }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {/* Header */}
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>← Volver</button>
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
        {/* Columna izquierda: Poster */}
        <div className="detail-poster-section">
          {content.imagen?.trim() ? (
            <img src={content.imagen} alt={content.titulo} className="detail-poster" />
          ) : (
            <div className="detail-poster-placeholder">Sin imagen</div>
          )}

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

          {esPersonalizado && (
            <div className="detail-actions">
              <button className="btn btn-edit" onClick={() => onEdit(content)}>✏️ Editar</button>
              <button className="btn btn-delete" onClick={() => onDelete(content.id)}>🗑️ Eliminar</button>
            </div>
          )}
        </div>

        {/* Columna derecha: Información */}
        <div className="detail-info-section">
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
                : <span className="muted">No disponibles</span>}
            </div>
          </div>

          {content.descripcion && (
            <div className="detail-description">
              <h3>Sinopsis</h3>
              <p>{content.descripcion}</p>
            </div>
          )}

          {/* VideoSection reemplaza el bloque anterior de trailer */}
          <VideoSection
            videos={content.videos}
            trailer_key={content.trailer_key}
          />
        </div>
      </div>

      <CastCarousel actors={actores} />
    </div>
  );
}

export default DetailPage;