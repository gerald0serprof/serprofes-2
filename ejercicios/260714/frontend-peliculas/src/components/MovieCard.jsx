// ==========================================================
// MovieCard.jsx
// Representa UNA película dentro del catálogo.
// Recibe la película por props y avisa al padre (App.jsx)
// cuando el usuario pulsa "Editar" o "Eliminar".
// ==========================================================
function MovieCard({ movie, onEdit, onDelete }) {
  const esPersonalizada = movie.source === "personalizada";
  
  return (
    <div className="movie-card">
      {movie.imagen && movie.imagen.trim() !== "" ? (
        <img
          src={movie.imagen}
          alt={movie.titulo}
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
          <h3 className="movie-title">{movie.titulo}</h3>
          {!esPersonalizada && (
            <span style={{
              fontSize: "10px",
              backgroundColor: "#007bff",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap"
            }}>TMDB</span>
          )}
        </div>
        <p className="movie-director">🎬 {movie.director}</p>
      </div>

      <div className="movie-card-actions">
        <button 
          className="btn btn-edit" 
          onClick={() => onEdit(movie)}
          disabled={!esPersonalizada}
          title={!esPersonalizada ? "No puedes editar películas de TMDB" : "Editar película"}
          style={!esPersonalizada ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          Editar
        </button>
        <button 
          className="btn btn-delete" 
          onClick={() => onDelete(movie.id)}
          disabled={!esPersonalizada}
          title={!esPersonalizada ? "No puedes eliminar películas de TMDB" : "Eliminar película"}
          style={!esPersonalizada ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default MovieCard;