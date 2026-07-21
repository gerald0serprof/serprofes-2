const { HttpError } = require("../utils/httpError");
const {
  sanitizeText,
  sanitizeYear,
  sanitizeGenres,
  sanitizeImage,
  sanitizeTemporadas,
} = require("../utils/normalizers");
const { CONTENT_TYPE } = require("../utils/contentConstants");

function validateNumericId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id)) {
    throw new HttpError(400, "El identificador debe ser numérico");
  }
  return id;
}

function validateContentPayload(body, kind, fallbackItem = null) {
  const titulo = sanitizeText(body.titulo ?? fallbackItem?.titulo, { maxLength: 150 });
  const descripcion = sanitizeText(body.descripcion ?? fallbackItem?.descripcion ?? "", {
    maxLength: 2000,
    allowEmpty: true,
  });
  const imagen = sanitizeImage(body.imagen ?? fallbackItem?.imagen ?? "");
  const año = sanitizeYear(body.año ?? fallbackItem?.año);
  const generos = sanitizeGenres(body.generos ?? fallbackItem?.generos ?? []);
  const responsableKey = kind === "movie" ? "director" : "creador";
  const responsable = sanitizeText(body[responsableKey] ?? fallbackItem?.[responsableKey], {
    maxLength: 120,
  });

  if (!titulo) {
    throw new HttpError(400, "El título es obligatorio y debe ser válido");
  }
  if (!responsable) {
    throw new HttpError(400, `El campo ${responsableKey} es obligatorio y debe ser válido`);
  }
  if (imagen === null) {
    throw new HttpError(400, "El campo imagen debe ser una URL http/https válida");
  }
  if (!año) {
    throw new HttpError(400, "El año debe tener formato AAAA y estar en un rango válido");
  }
  if (generos === null) {
    throw new HttpError(400, "El campo generos debe ser un array de textos válidos");
  }

  const payload = {
    titulo,
    imagen,
    descripcion,
    año,
    generos,
    calificacion: 0,
    tipo: CONTENT_TYPE[kind],
    source: "personalizada",
    ...(kind === "movie"
      ? { director: responsable }
      : { creador: responsable, temporadas: sanitizeTemporadas(body.temporadas ?? fallbackItem?.temporadas) }),
  };

  if (kind === "tv" && payload.temporadas === null) {
    throw new HttpError(400, "El campo temporadas debe ser un entero positivo válido");
  }

  return payload;
}

module.exports = {
  validateNumericId,
  validateContentPayload,
};
