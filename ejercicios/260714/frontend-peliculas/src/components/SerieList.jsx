// ==========================================================
// SerieList.jsx
// Recibe el array completo de series y pinta una
// SerieCard por cada una. No sabe nada de fetch ni de la API,
// solo se encarga de mostrar datos (componente "tonto").
// ==========================================================
import SerieCard from "./SerieCard.jsx";

function SerieList({ series, onSelect }) {
  if (series.length === 0) {
    return <p className="empty-message">No hay series en el catálogo todavía.</p>;
  }

  return (
    <div className="movie-list">
      {series.map((serie) => (
        <SerieCard
          key={serie.id}
          serie={serie}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default SerieList;
