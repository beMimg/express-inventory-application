const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: false },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
});

CarSchema.virtual("url").get(function () {
  return `/catalog/car/${this._id}`;
});

module.exports = mongoose.model("Car", CarSchema);
