/** Muestra una película como acceso al detalle, sin acciones destructivas en el catálogo. */
function MovieCard({ movie, onSelect }) { return <button className="movie-card card-button" onClick={() => onSelect(movie)}><img src={movie.imagen || "https://placehold.co/500x750?text=Sin+portada"} alt={`Portada de ${movie.titulo}`} /><span className="movie-card-info"><strong className="movie-title">{movie.titulo}</strong><small>{movie.año}</small><small>{movie.director || "Información en detalle"}</small></span></button>; }
export default MovieCard;
