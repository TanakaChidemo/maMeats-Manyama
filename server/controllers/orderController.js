const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allOrders = await features.query;
  res.status(200).json({
    status: "success",
    results: allOrders.length,
    data: {
      allOrders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      newOrder,
    },
  });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body);
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.closeOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body);
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  if (orderStatus === false) {
    return next(new AppError("This order is already closed", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.reopenOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body);
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  if (orderStatus === true) {
    return next(new AppError("This order is already open", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.addProductToOrder = catchAsync(async (req, res, next) => {
  const { orderId, productId, quantity, sharedUsers } = req.body;
  const userId = req.user.id; // Assuming user is authenticated

  if (orderStatus === false) {
    return next(
      new AppError(
        "This order is closed. Please speak to the order admin to reopen it.",
        400
      )
    );
  }
  // Validate input
  if (!orderId || !productId || !quantity) {
    return next(
      new AppError("Please provide orderId, productId, and quantity", 400)
    );
  }

  // Find the order by ID
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Add or update the product in the order
  const existingProductIndex = order.products.findIndex(
    (item) => item.product.toString() === productId
  );

  let sharedUserEntries = [];
  if (sharedUsers && Array.isArray(sharedUsers)) {
    for (const sharedUser of sharedUsers) {
      if (!sharedUser.user || !sharedUser.ratio) {
        return next(
          new AppError(
            "Each shared user entry must have a user ID and a ratio",
            400
          )
        );
      }

      const userExists = await User.findById(sharedUser.user);
      if (!userExists) {
        return next(new AppError("Shared user not found", 404));
      }

      sharedUserEntries.push({
        user: sharedUser.user,
        ratio: sharedUser.ratio,
      });
    }
  }

  if (existingProductIndex >= 0) {
    // If the product already exists in the order, update the user's quantity
    const existingUserIndex = order.products[
      existingProductIndex
    ].userQuantities.findIndex((uq) => uq.user.toString() === userId);

    if (existingUserIndex >= 0) {
      // If the user already has a quantity for this product, update it
      order.products[existingProductIndex].userQuantities[
        existingUserIndex
      ].quantity += quantity;
      order.products[existingProductIndex].userQuantities[
        existingUserIndex
      ].sharedUsers.push(...sharedUserEntries);
    } else {
      // If the user does not have a quantity for this product, add it
      order.products[existingProductIndex].userQuantities.push({
        user: userId,
        quantity,
        sharedUsers: sharedUserEntries,
      });
    }
  } else {
    // If the product does not exist in the order, add it with the user and quantity
    order.products.push({
      product: productId,
      userQuantities: [
        {
          user: userId,
          quantity,
          sharedUsers: sharedUserEntries,
        },
      ],
    });
  }

  // Save the updated order
  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
