const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const car_controller = require("../controllers/carController");
const category_controller = require("../controllers/categoryController");

router.get("/", car_controller.countAllDocuments);

// CATEGORY //

router.get("/categories", category_controller.category_list);
router.get("/category/:id", category_controller.category_detail);

// BRANDS //

// CARS //

module.exports = router;
