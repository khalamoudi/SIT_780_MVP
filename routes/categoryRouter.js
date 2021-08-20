const express = require("express");
const router = express.Router();

const catController = require("../controllers/category");

router.post("/", catController.createCategory),
router.get("/", catController.getCategory),


module.exports = router;