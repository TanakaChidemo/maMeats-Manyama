const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, orderController.getAllOrders)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.createOrder
  );

router
  .route("/:id")
  .get(authController.protect, orderController.getOrderById)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.updateOrder
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.closeOrder
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.reopenOrder
  )
  .patch(authController.protect, orderController.addProductToOrder)
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    orderController.deleteOrder
  );

module.exports = router;
