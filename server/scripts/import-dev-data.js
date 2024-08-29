const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const Product = require("../models/productModel");

dotenv.config({ path: `${__dirname}/../../config.env` });

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE:", process.env.DATABASE);
console.log("DATABASE_PASSWORD:", process.env.DATABASE_PASSWORD);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("manyama DB connection successful!"));

// READ JSON FILE
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/allProducts.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
