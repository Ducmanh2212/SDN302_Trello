const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
});

const Label = mongoose.model("Label", labelSchema);
