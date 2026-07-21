function notFoundHandler(_req, res) {
  return res.status(404).json({ error: "Ruta no encontrada" });
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const payload = { error: error.message || "Error interno del servidor" };

  if (error.details) {
    payload.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
