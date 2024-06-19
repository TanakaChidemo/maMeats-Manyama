orderModel;
const mongoose = require("mongoose");
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
    type: Time,
    required: [true, "An order must have a closing time."],
  },
  paymentDeadline: {
    type: Date,
    required: [true, "An order must have a payment deadline."],
  },
  paymentDeadlineTime: {
    type: Time,
    required: [true, "An order must have a closing time."],
  },
  paymentDetails1: {
    type: String,
  },
  paymentDetails2: {
    type: String,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "admin",
    select: "username",
  });
  next();
});
