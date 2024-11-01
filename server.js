const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

// Connect database
(async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
})();

// Init middleware
app.use(express.json({ extended: false }));

// Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/boards", require("./routes/api/boards"));
app.use("/api/lists", require("./routes/api/lists"));
app.use("/api/cards", require("./routes/api/cards"));
app.use("/api/checklists", require("./routes/api/checklists"));
app.use("/api/notifications", require("./routes/api/notifications"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT_NUMBER || 5000;
const hostname = process.env.HOST_NAME;

// Start the server and connect to the database
app.listen(port, hostname, () => {
  console.log(`Server running at: http://${hostname}:${port}`);
  Db.connectDB();
});
