import { useRef } from "react";

/** Muestra el reparto principal en una tira horizontal desplazable de mini-fichas. */
function CastCarousel({ actors = [] }) {
  const trackRef = useRef(null);
  /** Desplaza el carrusel una anchura de tarjeta en la dirección indicada. */
  const scrollCast = (direction) => trackRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  if (!actors.length) return null;
  return <section className="detail-cast-section" aria-label="Reparto principal"><div className="cast-title-row"><div><p className="eyebrow">Reparto</p><h2>Actores principales</h2></div><div className="cast-controls"><button onClick={() => scrollCast(-1)} aria-label="Ver actores anteriores">←</button><button onClick={() => scrollCast(1)} aria-label="Ver más actores">→</button></div></div><div className="cast-track" ref={trackRef}>{actors.map((actor, index) => <article className="cast-card" key={`${actor.nombre}-${index}`}><img src={actor.imagen || "https://placehold.co/160x210/293241/ffffff?text=Sin+foto"} alt={`Foto de ${actor.nombre}`} onError={(event) => { event.currentTarget.src = "https://placehold.co/160x210/293241/ffffff?text=Sin+foto"; }} /><h3>{actor.nombre || "Intérprete sin identificar"}</h3>{actor.personaje && <p>{actor.personaje}</p>}</article>)}</div></section>;
}
export default CastCarousel;
