const collections = {
  movie: {
    items: [],
    nextId: 10000,
  },
  tv: {
    items: [],
    nextId: 20000,
  },
};

function getCollection(kind) {
  const collection = collections[kind];
  if (!collection) {
    throw new Error(`Colección no soportada: ${kind}`);
  }
  return collection;
}

function getItems(kind) {
  return getCollection(kind).items;
}

function getNextId(kind) {
  const collection = getCollection(kind);
  const id = collection.nextId;
  collection.nextId += 1;
  return id;
}

module.exports = {
  getItems,
  getNextId,
};
