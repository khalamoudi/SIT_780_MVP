const express = require("express");
const router = express.Router();

const depController = require("../controllers/department");

router.post("/", depController.createDepartment),
router.get("/", depController.getDepartment),

module.exports = router;