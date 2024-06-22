const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path");
const AppError = require("./utils/appError");
const helmet = require("helmet");

const app = express();

//Middlewares
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/manyama", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "./../client/public")));

//Test route
app.get("/manyama/hello", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello from the manyama server!!",
  });
});

//Routes
// app.use("/manayama/orders", orderRouter);
// app.use("/manayama/products", productRouter);
// app.use("/manayama/users", userRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server! Hakuna nyama yakadaro!`,
      404
    )
  );
});

module.exports = app;