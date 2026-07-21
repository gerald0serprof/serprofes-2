const { Router } = require("express");
const discoveryController = require("../controllers/discoveryController");
const { asyncHandler } = require("../utils/asyncHandler");

const router = Router();

router.get("/search", asyncHandler(discoveryController.search));
router.get("/upcoming", asyncHandler(discoveryController.upcoming));

module.exports = router;
