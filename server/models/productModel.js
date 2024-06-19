const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Beef", "Poultry", "Pork", "Fish", "Vegetables"],
    required: [true, "A product must have a category."],
  },
  name: {
    type: String,
    required: [true, "A product must have a name."],
  },
  brandName: {
    type: String,
    required: [true, "A product must have a brand name."],
  },
  countryOfOrigin: {
    type: String,
  },
  unit: {
    type: String,
    enum: ["kg", "grams"],
    required: [true, "A product must have a unit."],
  },
  unitPrice: {
    type: Number,
    required: [true, "A product must have a price."],
  },
  standardPackaging: {
    type: String,
    required: [true, "A product must have a standard package quantity."],
  },
});
const Product = new mongoose.model("Product", productSchema);

module.exports = Product;
