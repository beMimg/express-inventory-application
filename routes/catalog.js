const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const car_controller = require("../controllers/carController");

router.get("/", car_controller.countAllDocuments);

// CATEGORY //

router.get("/catalog/categories");

// BRANDS //

// CARS //

module.exports = router;
