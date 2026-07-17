// ==========================================================
// SerieForm.jsx
// Formulario para CREAR/EDITAR series
// Similar a MovieForm pero con campos específicos de series:
// - creador (en lugar de director)
// - temporadas (número de temporadas)
// ==========================================================
import { useState, useEffect } from "react";

function SerieForm({ editingSerie, onSubmit, onCancelEdit }) {
  const [titulo, setTitulo] = useState("");
  const [creador, setCreador] = useState("");
  const [imagen, setImagen] = useState("");
  const [temporadas, setTemporadas] = useState(1);
  const [año, setAño] = useState(new Date().getFullYear());

  useEffect(() => {
    if (editingSerie) {
      setTitulo(editingSerie.titulo);
      setCreador(editingSerie.creador);
      setImagen(editingSerie.imagen || "");
      setTemporadas(editingSerie.temporadas || 1);
      setAño(editingSerie.año || new Date().getFullYear());
    } else {
      setTitulo("");
      setCreador("");
      setImagen("");
      setTemporadas(1);
      setAño(new Date().getFullYear());
    }
  }, [editingSerie]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (titulo.trim() === "" || creador.trim() === "") {
      alert("Por favor, rellena el título y el creador");
      return;
    }

    onSubmit({ titulo, creador, imagen, temporadas: parseInt(temporadas), año });

    setTitulo("");
    setCreador("");
    setImagen("");
    setTemporadas(1);
    setAño(new Date().getFullYear());
  };

  const isEditing = editingSerie !== null;

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {isEditing ? "✏️ Editar serie" : "➕ Agregar serie"}
      </h2>

      <div className="form-group">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          placeholder="Ej: Breaking Bad"
        />
      </div>

      <div className="form-group">
        <label htmlFor="creador">Creador</label>
        <input
          id="creador"
          type="text"
          value={creador}
          onChange={(event) => setCreador(event.target.value)}
          placeholder="Ej: Vince Gilligan"
        />
      </div>

      <div className="form-group">
        <label htmlFor="temporadas">Temporadas</label>
        <input
          id="temporadas"
          type="number"
          value={temporadas}
          onChange={(event) => setTemporadas(event.target.value)}
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="año">Año</label>
        <input
          id="año"
          type="number"
          value={año}
          onChange={(event) => setAño(event.target.value)}
          min="1900"
        />
      </div>

      <div className="form-group">
        <label htmlFor="imagen">Imagen (URL) - Opcional</label>
        <input
          id="imagen"
          type="url"
          value={imagen}
          onChange={(event) => setImagen(event.target.value)}
          placeholder="https://ejemplo.com/portada.jpg (dejar vacío para sin imagen)"
        />
        {imagen && (
          <div style={{
            marginTop: "8px",
            padding: "8px",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#555"
          }}>
            ✓ Se mostrará imagen en la serie
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Actualizar serie" : "Agregar serie"}
        </button>

        {isEditing && (
          <button type="button" className="btn btn-cancel" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default SerieForm;
