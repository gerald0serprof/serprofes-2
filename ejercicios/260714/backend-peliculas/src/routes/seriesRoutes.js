const { Router } = require("express");
const { createContentController } = require("../controllers/contentController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = Router();
const controller = createContentController("tv");

router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.getById));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.remove));

module.exports = router;
