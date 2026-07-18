/** Muestra una serie como acceso al detalle, sin acciones destructivas en el catálogo. */
function SerieCard({ serie, onSelect }) { return <button className="movie-card card-button" onClick={() => onSelect(serie)}><img src={serie.imagen || "https://placehold.co/500x750?text=Sin+portada"} alt={`Portada de ${serie.titulo}`} /><span className="movie-card-info"><strong className="movie-title">{serie.titulo}</strong><small>{serie.año}</small><small>{serie.creador || "Información en detalle"}</small></span></button>; }
export default SerieCard;
