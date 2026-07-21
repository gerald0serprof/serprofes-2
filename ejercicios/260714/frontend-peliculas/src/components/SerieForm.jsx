// ==========================================================
// SerieForm.jsx
// Formulario para CREAR/EDITAR series
// Similar a MovieForm pero con campos específicos de series:
// - creador (en lugar de director)
// - temporadas (número de temporadas)
// ==========================================================

import { useState, useEffect } from "react";

const AÑO_MIN = 1900;
const AÑO_MAX = new Date().getFullYear() + 5;

function SerieForm({ editingSerie, onSubmit, onCancelEdit, serverError }) {
  const [titulo,    setTitulo]    = useState("");
  const [creador,   setCreador]   = useState("");
  const [imagen,    setImagen]    = useState("");
  const [temporadas, setTemporadas] = useState(1);
  const [año,       setAño]       = useState(new Date().getFullYear());

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingSerie) {
      setTitulo(editingSerie.titulo || "");
      setCreador(editingSerie.creador || "");
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
    setFieldErrors({});
  }, [editingSerie]);

  const clearFieldError = (field) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  function validateFields() {
    const errors = {};

    if (!titulo.trim()) {
      errors.titulo = "El título es obligatorio";
    } else if (titulo.trim().length > 150) {
      errors.titulo = "El título no puede superar 150 caracteres";
    }

    if (!creador.trim()) {
      errors.creador = "El creador es obligatorio";
    } else if (creador.trim().length > 120) {
      errors.creador = "El creador no puede superar 120 caracteres";
    }

    const t = parseInt(temporadas);
    if (isNaN(t) || t < 1 || t > 100) {
      errors.temporadas = "Las temporadas deben ser un número entre 1 y 100";
    }

    const a = parseInt(año);
    if (isNaN(a) || a < AÑO_MIN || a > AÑO_MAX) {
      errors.año = `El año debe estar entre ${AÑO_MIN} y ${AÑO_MAX}`;
    }

    if (imagen.trim()) {
      try {
        const url = new URL(imagen.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.imagen = "La URL debe comenzar por http:// o https://";
        }
      } catch {
        errors.imagen = "Introduce una URL válida (ej: https://ejemplo.com/portada.jpg)";
      }
    }

    return errors;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    onSubmit({
      titulo: titulo.trim(),
      creador: creador.trim(),
      imagen: imagen.trim(),
      temporadas: parseInt(temporadas),
      año: parseInt(año),
    });
  };

  const isEditing = editingSerie !== null;

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "✏️ Editar serie" : "➕ Agregar serie"}
      </h2>

      {/* Banner de error del backend (409 duplicado, 400 validación...) */}
      {serverError && (
        <div className="form-server-error" role="alert">
          ⚠️ {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="serie-titulo">Título</label>
        <input
          id="serie-titulo"
          type="text"
          value={titulo}
          onChange={(e) => { setTitulo(e.target.value); clearFieldError("titulo"); }}
          placeholder="Ej: Breaking Bad"
          aria-invalid={!!fieldErrors.titulo}
          aria-describedby={fieldErrors.titulo ? "error-serie-titulo" : undefined}
          className={fieldErrors.titulo ? "input-error" : ""}
        />
        {fieldErrors.titulo && (
          <span id="error-serie-titulo" className="field-error">{fieldErrors.titulo}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="serie-creador">Creador</label>
        <input
          id="serie-creador"
          type="text"
          value={creador}
          onChange={(e) => { setCreador(e.target.value); clearFieldError("creador"); }}
          placeholder="Ej: Vince Gilligan"
          aria-invalid={!!fieldErrors.creador}
          aria-describedby={fieldErrors.creador ? "error-serie-creador" : undefined}
          className={fieldErrors.creador ? "input-error" : ""}
        />
        {fieldErrors.creador && (
          <span id="error-serie-creador" className="field-error">{fieldErrors.creador}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="serie-temporadas">Temporadas</label>
        <input
          id="serie-temporadas"
          type="number"
          value={temporadas}
          onChange={(e) => { setTemporadas(e.target.value); clearFieldError("temporadas"); }}
          min="1"
          max="100"
          aria-invalid={!!fieldErrors.temporadas}
          aria-describedby={fieldErrors.temporadas ? "error-serie-temporadas" : undefined}
          className={fieldErrors.temporadas ? "input-error" : ""}
        />
        {fieldErrors.temporadas && (
          <span id="error-serie-temporadas" className="field-error">{fieldErrors.temporadas}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="serie-año">Año</label>
        <input
          id="serie-año"
          type="number"
          value={año}
          onChange={(e) => { setAño(e.target.value); clearFieldError("año"); }}
          min={AÑO_MIN}
          max={AÑO_MAX}
          aria-invalid={!!fieldErrors.año}
          aria-describedby={fieldErrors.año ? "error-serie-año" : undefined}
          className={fieldErrors.año ? "input-error" : ""}
        />
        {fieldErrors.año && (
          <span id="error-serie-año" className="field-error">{fieldErrors.año}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="serie-imagen">Imagen (URL) — Opcional</label>
        <input
          id="serie-imagen"
          type="url"
          value={imagen}
          onChange={(e) => { setImagen(e.target.value); clearFieldError("imagen"); }}
          placeholder="https://ejemplo.com/portada.jpg"
          aria-invalid={!!fieldErrors.imagen}
          aria-describedby={fieldErrors.imagen ? "error-serie-imagen" : undefined}
          className={fieldErrors.imagen ? "input-error" : ""}
        />
        {fieldErrors.imagen && (
          <span id="error-serie-imagen" className="field-error">{fieldErrors.imagen}</span>
        )}
        {imagen && !fieldErrors.imagen && (
          <div className="imagen-preview-hint">✓ Se mostrará imagen en la serie</div>
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