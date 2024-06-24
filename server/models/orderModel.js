const mongoose = require("mongoose");

const sharedUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  ratio: {
    type: String, // Ratio as a string (e.g., "1/2", "1/3")
    required: [true, "Sharing ratio is required"],
  },
});

const userQuantitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  sharedUsers: [sharedUserSchema], // Users with whom this product is shared and their sharing ratios
});

const productSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
  userQuantities: [userQuantitySchema],
});

const orderSchema = new mongoose.Schema({
  admin: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  deliveryDate: {
    type: Date,
    required: [true, "An order must have an estimated delivery date."],
  },
  closingDate: {
    type: Date,
    required: [true, "An order must have a closing date."],
  },
  closingTime: {
    type: String, // Changed from Time to String
    required: [true, "An order must have a closing time."],
  },
  paymentDeadline: {
    type: Date,
    required: [true, "An order must have a payment deadline."],
  },
  paymentDeadlineTime: {
    type: String, // Changed from Time to String
    required: [true, "An order must have a closing time."],
  },
  paymentDetails1: {
    type: String,
  },
  paymentDetails2: {
    type: String,
  },
  orderStatus: {
    type: Boolean,
    default: true,
  },
  products: [productSchema],
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "admin",
    select: "username",
  });
  next();
});

const Order = new mongoose.model("Order", orderSchema);

module.exports = Order;
