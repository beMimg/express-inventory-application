const mongoose = require("mongoose");
const Brand = require("../models/brand");
const Car = require("../models/car");
const { body, validationResult } = require("express-validator");

exports.brand_list = async (req, res, next) => {
  try {
    const brand_list = await Brand.find().sort({ name: 1 }).exec();

    res.render("brand-list", {
      title: "Brand List",
      brand_list: brand_list,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.brand_detail = async (req, res, next) => {
  try {
    const [brandDetail, carsInBrand] = await Promise.all([
      await Brand.findById(req.params.id).exec(),
      await Car.find({ brand: req.params.id }, "name").exec(),
    ]);

    res.render("brand-detail", {
      title: "Brand Detail",
      brand_detail: brandDetail,
      cars_in_brand: carsInBrand,
    });
  } catch (err) {
    const error = new Error("Couldn't find this brand");
    error.status = 404;
    return next(error);
  }
};

exports.brand_create_get = (req, res, next) => {
  res.render("brand-form", {
    title: "Create a brand",
  });
};

exports.brand_create_post = [
  body("brand_name").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const brand = new Brand({ name: req.body.brand_name });

      if (!errors.isEmpty()) {
        res.render("brand-form", {
          title: "Create a brand",
          brand: brand,
        });
        return;
      }

      const existsBrand = await Brand.findOne({ name: req.body.brand_name });

      if (existsBrand) {
        res.redirect(existsBrand.url);
        return;
      } else {
        await brand.save();
        res.redirect(brand.url);
      }
    } catch (err) {
      const error = new Error("Couldn't create the brand");
      error.status = 500;
      return next(error);
    }
  },
];

exports.brand_delete_get = async (req, res, next) => {
  try {
    const [brand, carsInBrand] = await Promise.all([
      await Brand.findById(req.params.id).exec(),
      await Car.find({ brand: req.params.id }, "name").exec(),
    ]);

    res.render("brand-delete", {
      title: "Delete Brand",
      brand: brand,
      cars_in_brand: carsInBrand,
    });
  } catch (err) {
    return next(err);
  }
};

exports.brand_delete_post = async (req, res, next) => {
  try {
    if (req.body.admin_password === process.env.ADMIN_PW) {
      await Brand.findByIdAndDelete(req.body.brand_id);
      res.redirect("/catalog/brands");
      return;
    } else {
      res.send("Admin password incorrect");
    }
  } catch (err) {
    return next(err);
  }
};

exports.brand_update_get = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    res.render("brand-form", {
      title: "Update Brand",
      brand: brand,
    });
  } catch (err) {
    return next(err);
  }
};

exports.brand_update_post = [
  body("brand_name").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const brand = new Brand({
        name: req.body.brand_name,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.render("brand-form", {
          title: "Update Form",
          brand: brand,
          errors: errors.array(),
        });
        return;
      }

      const existsBrand = await Brand.findOne({
        name: req.body.brand_name,
      }).exec();

      if (existsBrand) {
        res.redirect(existsBrand.url);
        return;
      } else {
        await Brand.findByIdAndUpdate(req.params.id, brand, {});
        res.redirect(brand.url);
      }
    } catch (err) {
      return next(err);
    }
  },
];
