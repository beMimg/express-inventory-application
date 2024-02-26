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
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);

// BRANDS //

router.get("/brands", brand_controller.brand_list);
router.get("/brand/create", brand_controller.brand_create_get);
router.post("/brand/create", brand_controller.brand_create_post);
router.get("/brand/:id", brand_controller.brand_detail);
router.get("/brand/:id/delete", brand_controller.brand_delete_get);
router.post("/brand/:id/delete", brand_controller.brand_delete_post);
// CARS //

router.get("/cars", car_controller.car_list);
router.get("/car/create", car_controller.car_create_get);
router.post("/car/create", car_controller.car_create_post);
router.get("/car/:id", car_controller.car_detail);
router.get("/car/:id/delete", car_controller.car_delete_get);
router.post("/car/:id/delete", car_controller.car_delete_post);

module.exports = router;
