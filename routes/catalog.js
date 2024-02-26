const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const car_controller = require("../controllers/carController");
const category_controller = require("../controllers/categoryController");
const brand_controller = require("../controllers/brandController");

router.get("/", car_controller.countAllDocuments);

// CATEGORY //

router.get("/categories", category_controller.category_list);
router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id", category_controller.category_detail);

// BRANDS //

router.get("/brands", brand_controller.brand_list);
router.get("/brand/:id", brand_controller.brand_detail);

// CARS //

router.get("/cars", car_controller.car_list);
router.get("/car/:id", car_controller.car_detail);

module.exports = router;
