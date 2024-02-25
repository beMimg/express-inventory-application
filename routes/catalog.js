const express = require("express");
const router = express.Router();
const Brand = require("../models/brand");
const Car = require("../models/car");
const Category = require("../models/category");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  try {
    const [allBrands, allCars, allCategories] = await Promise.all([
      Brand.countDocuments().exec(),
      Car.countDocuments().exec(),
      Category.countDocuments().exec(),
    ]);

    res.render("catalog-homepage", {
      title: "Welcome to the cars catalog page",
      all_brands: allBrands,
      all_cars: allCars,
      all_categories: allCategories,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
