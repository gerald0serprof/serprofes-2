// ==========================================================
// SerieForm.jsx
// Formulario para CREAR/EDITAR series
// Similar a MovieForm pero con campos específicos de series:
// - creador (en lugar de director)
// - temporadas (número de temporadas)
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

function SerieForm({ editingSerie, onSubmit, onCancelEdit, serverError }) {
  const [titulo,     setTitulo]     = useState("");
  const [creador,    setCreador]    = useState("");
  const [imagen,     setImagen]     = useState("");
  const [temporadas, setTemporadas] = useState("");
  const [año,        setAño]        = useState("");
  const [genero,     setGenero]     = useState("");
  const [idioma,     setIdioma]     = useState("");

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (editingSerie) {
      setTitulo(editingSerie.titulo       || "");
      setCreador(editingSerie.creador     || "");
      setImagen(editingSerie.imagen       || "");
      setTemporadas(editingSerie.temporadas ? String(editingSerie.temporadas) : "");
      setAño(editingSerie.año             ? String(editingSerie.año) : "");
      setGenero(editingSerie.genero       || "");
      setIdioma(editingSerie.idioma       || "");
    } else {
      setTitulo(""); setCreador(""); setImagen("");
      setTemporadas(""); setAño(""); setGenero(""); setIdioma("");
    }
    setFieldErrors({});
  }, [editingSerie]);

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
    if (!creador.trim()) {
      errors.creador = "El creador es obligatorio";
    } else if (creador.trim().length > 120) {
      errors.creador = "El creador no puede superar 120 caracteres";
    }
    if (temporadas !== "") {
      const t = parseInt(temporadas);
      if (isNaN(t) || t < 1 || t > 100) {
        errors.temporadas = "Las temporadas deben ser un número entre 1 y 100";
      }
    }
    if (año !== "") {
      const a = parseInt(año);
      if (isNaN(a) || a < ANO_MIN || a > ANO_MAX) {
        errors.año = `El año debe estar entre ${ANO_MIN} y ${ANO_MAX}`;
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
      titulo:  titulo.trim(),
      creador: creador.trim(),
      imagen:  imagen.trim(),
    };
    if (temporadas !== "") payload.temporadas = parseInt(temporadas);
    if (año        !== "") payload.año        = parseInt(año);
    if (genero     !== "") payload.genero     = genero;
    if (idioma     !== "") payload.idioma     = idioma;
    onSubmit(payload);
  };

  const isEditing = editingSerie !== null;

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">
        {isEditing ? "✏️ Editar serie" : "➕ Agregar serie"}
      </h2>

      {serverError && (
        <div className="form-server-error" role="alert">⚠️ {serverError}</div>
      )}

      {/* Título */}
      <div className="form-group">
        <label htmlFor="serie-titulo">Título</label>
        <input id="serie-titulo" type="text" value={titulo}
          onChange={(e) => { setTitulo(e.target.value); clearFieldError("titulo"); }}
          placeholder="Ej: Breaking Bad"
          aria-invalid={!!fieldErrors.titulo}
          aria-describedby={fieldErrors.titulo ? "err-serie-titulo" : undefined}
          className={fieldErrors.titulo ? "input-error" : ""}
        />
        {fieldErrors.titulo && <span id="err-serie-titulo" className="field-error">{fieldErrors.titulo}</span>}
      </div>

      {/* Creador */}
      <div className="form-group">
        <label htmlFor="serie-creador">Creador</label>
        <input id="serie-creador" type="text" value={creador}
          onChange={(e) => { setCreador(e.target.value); clearFieldError("creador"); }}
          placeholder="Ej: Vince Gilligan"
          aria-invalid={!!fieldErrors.creador}
          aria-describedby={fieldErrors.creador ? "err-serie-creador" : undefined}
          className={fieldErrors.creador ? "input-error" : ""}
        />
        {fieldErrors.creador && <span id="err-serie-creador" className="field-error">{fieldErrors.creador}</span>}
      </div>

      {/* Temporadas — opcional */}
      <div className="form-group">
        <label htmlFor="serie-temporadas">Temporadas <span className="label-optional">(opcional)</span></label>
        <input id="serie-temporadas" type="number" value={temporadas}
          onChange={(e) => { setTemporadas(e.target.value); clearFieldError("temporadas"); }}
          placeholder="Ej: 5" min="1" max="100"
          aria-invalid={!!fieldErrors.temporadas}
          aria-describedby={fieldErrors.temporadas ? "err-serie-temporadas" : undefined}
          className={fieldErrors.temporadas ? "input-error" : ""}
        />
        {fieldErrors.temporadas && <span id="err-serie-temporadas" className="field-error">{fieldErrors.temporadas}</span>}
      </div>

      {/* Año — opcional */}
      <div className="form-group">
        <label htmlFor="serie-año">Año <span className="label-optional">(opcional)</span></label>
        <input id="serie-año" type="number" value={año}
          onChange={(e) => { setAño(e.target.value); clearFieldError("año"); }}
          placeholder={`Ej: ${new Date().getFullYear()}`}
          min={ANO_MIN} max={ANO_MAX}
          aria-invalid={!!fieldErrors.año}
          aria-describedby={fieldErrors.año ? "err-serie-año" : undefined}
          className={fieldErrors.año ? "input-error" : ""}
        />
        {fieldErrors.año && <span id="err-serie-año" className="field-error">{fieldErrors.año}</span>}
      </div>

      {/* Género — opcional */}
      <div className="form-group">
        <label htmlFor="serie-genero">Género <span className="label-optional">(opcional)</span></label>
        <select id="serie-genero" value={genero}
          onChange={(e) => setGenero(e.target.value)} className="search-type-select">
          <option value="">Seleccionar género…</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Idioma — opcional */}
      <div className="form-group">
        <label htmlFor="serie-idioma">Idioma original <span className="label-optional">(opcional)</span></label>
        <select id="serie-idioma" value={idioma}
          onChange={(e) => setIdioma(e.target.value)} className="search-type-select">
          <option value="">Seleccionar idioma…</option>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Imagen — opcional */}
      <div className="form-group">
        <label htmlFor="serie-imagen">Imagen (URL) <span className="label-optional">(opcional)</span></label>
        <input id="serie-imagen" type="url" value={imagen}
          onChange={(e) => { setImagen(e.target.value); clearFieldError("imagen"); }}
          placeholder="https://ejemplo.com/portada.jpg"
          aria-invalid={!!fieldErrors.imagen}
          aria-describedby={fieldErrors.imagen ? "err-serie-imagen" : undefined}
          className={fieldErrors.imagen ? "input-error" : ""}
        />
        {fieldErrors.imagen && <span id="err-serie-imagen" className="field-error">{fieldErrors.imagen}</span>}
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