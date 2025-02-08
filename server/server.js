const mongoose = require("mongoose");
const dotenv = require("dotenv");
// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION 🧨 Shutting down....");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

dotenv.config({ path: "./../config.env" });
const app = require("./app.js");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("maMeats mongoose connected"))
  .catch((e) => console.log(e));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`maMeats Server started on port ${port}....`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION 🧨 Shutting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION 🧨 Shutting down....x");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
