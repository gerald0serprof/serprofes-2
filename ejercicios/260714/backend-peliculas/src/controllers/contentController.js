const contentService = require("../services/contentService");
const { validateNumericId, validateContentPayload } = require("../validators/contentValidator");

function createContentController(kind) {
  return {
    list: async (_req, res) => {
      const result = await contentService.listContent(kind);
      return res.json(result);
    },

    getById: async (req, res) => {
      const id = validateNumericId(req.params.id);
      const result = await contentService.getContentById(kind, id);
      return res.json(result);
    },

    create: async (req, res) => {
      const payload = validateContentPayload(req.body, kind);
      const result = contentService.createContent(kind, payload);
      return res.status(201).json(result);
    },

    update: async (req, res) => {
      const id = validateNumericId(req.params.id);
      const currentItem = await contentService.getContentById(kind, id);
      const payload = validateContentPayload(req.body, kind, currentItem);
      const result = contentService.updateContent(kind, id, payload);
      return res.json(result);
    },

    remove: async (req, res) => {
      const id = validateNumericId(req.params.id);
      const result = contentService.deleteContent(kind, id);
      return res.json(result);
    },
  };
}

module.exports = { createContentController };
