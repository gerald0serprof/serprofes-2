// ==========================================================
// SerieCard.jsx
// Representa UNA serie dentro del catálogo.
// Recibe la serie por props y avisa al padre cuando pulsa
// "Editar" o "Eliminar".
// ==========================================================
function SerieCard({ serie, onEdit, onDelete }) {
  const esPersonalizada = serie.source === "personalizada";
  
  return (
    <div className="movie-card">
      {serie.imagen && serie.imagen.trim() !== "" ? (
        <img
          src={serie.imagen}
          alt={serie.titulo}
          style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "180px",
          backgroundColor: "#e0e0e0",
          borderRadius: "8px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: "14px"
        }}>
          Sin imagen
        </div>
      )}

      <div className="movie-card-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <h3 className="movie-title">{serie.titulo}</h3>
          {!esPersonalizada && (
            <span style={{
              fontSize: "10px",
              backgroundColor: "#ff6b35",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap"
            }}>TMDB</span>
          )}
          <span style={{
            fontSize: "10px",
            backgroundColor: "#6c5ce7",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            marginLeft: "4px"
          }}>📺 Serie</span>
        </div>
        <p className="movie-director">👤 {serie.creador}</p>
        {serie.temporadas && <p style={{ fontSize: "12px", color: "#666" }}>📅 {serie.temporadas} temporada(s)</p>}
      </div>

      <div className="movie-card-actions">
        <button 
          className="btn btn-edit" 
          onClick={() => onEdit(serie)}
          disabled={!esPersonalizada}
          title={!esPersonalizada ? "No puedes editar series de TMDB" : "Editar serie"}
          style={!esPersonalizada ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          Editar
        </button>
        <button 
          className="btn btn-delete" 
          onClick={() => onDelete(serie.id)}
          disabled={!esPersonalizada}
          title={!esPersonalizada ? "No puedes eliminar series de TMDB" : "Eliminar serie"}
          style={!esPersonalizada ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default SerieCard;
