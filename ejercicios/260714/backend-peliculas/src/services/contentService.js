const { getItems, getNextId } = require("../data/inMemoryStore");
const { getCatalog, getTmdbDetail } = require("./tmdbService");
const { HttpError } = require("../utils/httpError");
const { TYPE_LABEL, CONTENT_TYPE, LOCAL_ID_BASE } = require("../utils/contentConstants");
const { normalizeText } = require("../utils/normalizers");

function buildUniquenessKey(item, kind) {
  const responsable = kind === "movie" ? item.director : item.creador;
  return [normalizeText(item.titulo), String(item.año || ""), normalizeText(responsable), CONTENT_TYPE[kind]].join("|");
}

function ensureNoDuplicate(items, candidate, kind, excludedId = null) {
  const candidateKey = buildUniquenessKey(candidate, kind);
  const duplicated = items.some((item) => {
    if (excludedId !== null && item.id === excludedId) return false;
    return buildUniquenessKey(item, kind) === candidateKey;
  });

  if (duplicated) {
    throw new HttpError(409, `Ya existe una ${TYPE_LABEL[kind]} con el mismo título, año y director/a`);
  }
}

async function listContent(kind) {
  const items = getItems(kind);
  return getCatalog(kind, items);
}

async function getContentById(kind, id) {
  const items = getItems(kind);
  const local = items.find((item) => item.id === id);

  if (id >= LOCAL_ID_BASE[kind]) {
    if (!local) {
      throw new HttpError(404, "Contenido no encontrado");
    }
    return local;
  }

  try {
    return await getTmdbDetail(kind, id);
  } catch {
    throw new HttpError(404, "Contenido no encontrado en TMDB");
  }
}

function createContent(kind, payload) {
  const items = getItems(kind);
  ensureNoDuplicate(items, payload, kind);

  const item = { id: getNextId(kind), ...payload };
  items.push(item);
  return item;
}

function updateContent(kind, id, payload) {
  const items = getItems(kind);
  const item = items.find((content) => content.id === id);

  if (!item) {
    throw new HttpError(404, `${TYPE_LABEL[kind]} no encontrada o no editable`);
  }

  ensureNoDuplicate(items, payload, kind, id);
  Object.assign(item, payload, { id: item.id, source: "personalizada", tipo: item.tipo });
  return item;
}

function deleteContent(kind, id) {
  const items = getItems(kind);
  const index = items.findIndex((content) => content.id === id);

  if (index < 0) {
    throw new HttpError(404, `${TYPE_LABEL[kind]} no encontrada o no eliminable`);
  }

  items.splice(index, 1);
  return { mensaje: `${TYPE_LABEL[kind]} eliminada` };
}

module.exports = {
  listContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
};
