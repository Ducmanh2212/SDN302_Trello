// server/index.js

const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cardRouter = require("./routes/card.routes");

const app = express();
const hostname = "localhost";
const port = 5000;

const dbName = "trello_db";

mongoose.connect("mongodb://localhost:27017/" + dbName, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", async (req, res, next) => {
  res.status(200).send("Welcome to Express web server");
});

app.use("/card", cardRouter);

app.use((req, res, next) => {
  next(httpErrors.BadRequest()); // Thay thế bằng lỗi 404
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ message: { status: err.status, message: err.message } });
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(port, () => {
  console.log(`Server is running on port http://${hostname}:${port}`);
});
