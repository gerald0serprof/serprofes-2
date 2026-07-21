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

const ANO_MIN = 1900;
const ANO_MAX = new Date().getFullYear() + 5;

const GENRES = [
  "Acción","Aventura","Animación","Comedia","Crimen",
  "Documental","Drama","Familia","Fantasía","Histórico",
  "Horror","Música","Misterio","Romance","Ciencia Ficción",
  "Suspenso","Televisión","Thriller","Guerra","Occidental",
];

const LANGUAGES = [
  "Español","Inglés","Francés","Alemán","Italiano","Portugués",
  "Japonés","Coreano","Chino","Árabe","Ruso","Hindi","Otro",
];

function MovieForm({ editingMovie, onSubmit, onCancelEdit, serverError }) {
  const [titulo,   setTitulo]   = useState("");
  const [director, setDirector] = useState("");
  const [imagen,   setImagen]   = useState("");
  const [año,      setAño]      = useState("");
  const [genero,   setGenero]   = useState("");
  const [idioma,   setIdioma]   = useState("");
  const [duracion, setDuracion] = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingMovie) {
      setTitulo(editingMovie.titulo     || "");
      setDirector(editingMovie.director || "");
      setImagen(editingMovie.imagen     || "");
      setAño(editingMovie.año           ? String(editingMovie.año) : "");
      setGenero(editingMovie.genero     || "");
      setIdioma(editingMovie.idioma     || "");
      setDuracion(editingMovie.duracion ? String(editingMovie.duracion) : "");
    } else {
      setTitulo(""); setDirector(""); setImagen("");
      setAño(""); setGenero(""); setIdioma(""); setDuracion("");
    }
    setFieldErrors({});
  }, [editingMovie]);

  const clearFieldError = (field) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: null }));
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
    if (año !== "") {
      const a = parseInt(año);
      if (isNaN(a) || a < ANO_MIN || a > ANO_MAX) {
        errors.año = `El año debe estar entre ${ANO_MIN} y ${ANO_MAX}`;
      }
    }
    if (duracion !== "") {
      const d = parseInt(duracion);
      if (isNaN(d) || d < 1 || d > 999) {
        errors.duracion = "La duración debe ser un número entre 1 y 999 minutos";
      }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateFields();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    const payload = {
      titulo:   titulo.trim(),
      director: director.trim(),
      imagen:   imagen.trim(),
    };
    if (año      !== "") payload.año      = parseInt(año);
    if (genero   !== "") payload.genero   = genero;
    if (idioma   !== "") payload.idioma   = idioma;
    if (duracion !== "") payload.duracion = parseInt(duracion);
    onSubmit(payload);
  };

  const isEditing = editingMovie !== null;

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "✏️ Editar película" : "➕ Agregar película"}
      </h2>

      {serverError && (
        <div className="form-server-error" role="alert">⚠️ {serverError}</div>
      )}

      {/* Título */}
      <div className="form-group">
        <label htmlFor="movie-titulo">Título</label>
        <input id="movie-titulo" type="text" value={titulo}
          onChange={(e) => { setTitulo(e.target.value); clearFieldError("titulo"); }}
          placeholder="Ej: Inception"
          aria-invalid={!!fieldErrors.titulo}
          aria-describedby={fieldErrors.titulo ? "err-movie-titulo" : undefined}
          className={fieldErrors.titulo ? "input-error" : ""}
        />
        {fieldErrors.titulo && <span id="err-movie-titulo" className="field-error">{fieldErrors.titulo}</span>}
      </div>

      {/* Director */}
      <div className="form-group">
        <label htmlFor="movie-director">Director</label>
        <input id="movie-director" type="text" value={director}
          onChange={(e) => { setDirector(e.target.value); clearFieldError("director"); }}
          placeholder="Ej: Christopher Nolan"
          aria-invalid={!!fieldErrors.director}
          aria-describedby={fieldErrors.director ? "err-movie-director" : undefined}
          className={fieldErrors.director ? "input-error" : ""}
        />
        {fieldErrors.director && <span id="err-movie-director" className="field-error">{fieldErrors.director}</span>}
      </div>

      {/* Año — opcional */}
      <div className="form-group">
        <label htmlFor="movie-año">Año <span className="label-optional">(opcional)</span></label>
        <input id="movie-año" type="number" value={año}
          onChange={(e) => { setAño(e.target.value); clearFieldError("año"); }}
          placeholder={`Ej: ${new Date().getFullYear()}`}
          min={ANO_MIN} max={ANO_MAX}
          aria-invalid={!!fieldErrors.año}
          aria-describedby={fieldErrors.año ? "err-movie-año" : undefined}
          className={fieldErrors.año ? "input-error" : ""}
        />
        {fieldErrors.año && <span id="err-movie-año" className="field-error">{fieldErrors.año}</span>}
      </div>

      {/* Género — opcional */}
      <div className="form-group">
        <label htmlFor="movie-genero">Género <span className="label-optional">(opcional)</span></label>
        <select id="movie-genero" value={genero}
          onChange={(e) => setGenero(e.target.value)} className="search-type-select">
          <option value="">Seleccionar género…</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Idioma — opcional */}
      <div className="form-group">
        <label htmlFor="movie-idioma">Idioma original <span className="label-optional">(opcional)</span></label>
        <select id="movie-idioma" value={idioma}
          onChange={(e) => setIdioma(e.target.value)} className="search-type-select">
          <option value="">Seleccionar idioma…</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Duración — opcional */}
      <div className="form-group">
        <label htmlFor="movie-duracion">Duración (min.) <span className="label-optional">(opcional)</span></label>
        <input id="movie-duracion" type="number" value={duracion}
          onChange={(e) => { setDuracion(e.target.value); clearFieldError("duracion"); }}
          placeholder="Ej: 148"
          min="1" max="999"
          aria-invalid={!!fieldErrors.duracion}
          aria-describedby={fieldErrors.duracion ? "err-movie-duracion" : undefined}
          className={fieldErrors.duracion ? "input-error" : ""}
        />
        {fieldErrors.duracion && <span id="err-movie-duracion" className="field-error">{fieldErrors.duracion}</span>}
      </div>

      {/* Imagen — opcional */}
      <div className="form-group">
        <label htmlFor="movie-imagen">Imagen (URL) <span className="label-optional">(opcional)</span></label>
        <input id="movie-imagen" type="url" value={imagen}
          onChange={(e) => { setImagen(e.target.value); clearFieldError("imagen"); }}
          placeholder="https://ejemplo.com/portada.jpg"
          aria-invalid={!!fieldErrors.imagen}
          aria-describedby={fieldErrors.imagen ? "err-movie-imagen" : undefined}
          className={fieldErrors.imagen ? "input-error" : ""}
        />
        {fieldErrors.imagen && <span id="err-movie-imagen" className="field-error">{fieldErrors.imagen}</span>}
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