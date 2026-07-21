// ==========================================================
// MovieForm.jsx
// Formulario único que sirve tanto para CREAR como para
// EDITAR una película.
//
// - Si "editingMovie" es null -> modo CREAR (formulario vacío)
// - Si "editingMovie" tiene datos -> modo EDITAR (rellenado)
//
// El componente NO hace fetch: solo recoge los datos y se los
// pasa a App.jsx mediante la función onSubmit.
// ==========================================================

import { useState, useEffect } from "react";

function MovieForm({ editingMovie, onSubmit, onCancelEdit, serverError }) {
  const [titulo, setTitulo]   = useState("");
  const [director, setDirector] = useState("");
  const [imagen, setImagen]   = useState("");

  // Errores de validación cliente, por campo
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingMovie) {
      setTitulo(editingMovie.titulo || "");
      setDirector(editingMovie.director || "");
      setImagen(editingMovie.imagen || "");
    } else {
      setTitulo("");
      setDirector("");
      setImagen("");
    }
    setFieldErrors({});
  }, [editingMovie]);

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

    if (!director.trim()) {
      errors.director = "El director es obligatorio";
    } else if (director.trim().length > 120) {
      errors.director = "El director no puede superar 120 caracteres";
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
    onSubmit({ titulo: titulo.trim(), director: director.trim(), imagen: imagen.trim() });
  };

  const isEditing = editingMovie !== null;

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "✏️ Editar película" : "➕ Agregar película"}
      </h2>

      {/* Banner de error del backend (409 duplicado, 400 validación...) */}
      {serverError && (
        <div className="form-server-error" role="alert">
          ⚠️ {serverError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="titulo">Título</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => { setTitulo(e.target.value); clearFieldError("titulo"); }}
          placeholder="Ej: Matrix"
          aria-invalid={!!fieldErrors.titulo}
          aria-describedby={fieldErrors.titulo ? "error-titulo" : undefined}
          className={fieldErrors.titulo ? "input-error" : ""}
        />
        {fieldErrors.titulo && (
          <span id="error-titulo" className="field-error">{fieldErrors.titulo}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="director">Director</label>
        <input
          id="director"
          type="text"
          value={director}
          onChange={(e) => { setDirector(e.target.value); clearFieldError("director"); }}
          placeholder="Ej: Lana Wachowski"
          aria-invalid={!!fieldErrors.director}
          aria-describedby={fieldErrors.director ? "error-director" : undefined}
          className={fieldErrors.director ? "input-error" : ""}
        />
        {fieldErrors.director && (
          <span id="error-director" className="field-error">{fieldErrors.director}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="imagen">Imagen (URL) — Opcional</label>
        <input
          id="imagen"
          type="url"
          value={imagen}
          onChange={(e) => { setImagen(e.target.value); clearFieldError("imagen"); }}
          placeholder="https://ejemplo.com/portada.jpg"
          aria-invalid={!!fieldErrors.imagen}
          aria-describedby={fieldErrors.imagen ? "error-imagen" : undefined}
          className={fieldErrors.imagen ? "input-error" : ""}
        />
        {fieldErrors.imagen && (
          <span id="error-imagen" className="field-error">{fieldErrors.imagen}</span>
        )}
        {imagen && !fieldErrors.imagen && (
          <div className="imagen-preview-hint">✓ Se mostrará imagen en la película</div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Actualizar película" : "Agregar película"}
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

export default MovieForm;