const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true },
});

BrandSchema.virtual("url").get(function () {
  return `/catalog/brand/${this._id}`;
});
