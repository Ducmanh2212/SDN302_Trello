const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cardRouter = express.Router();

cardRouter.use(bodyParser.json());

const readData = () => {
  const dataPath = path.join(__dirname, "..", "trello_db.json");
  try {
    const rawData = fs.readFileSync(dataPath, "utf8");
    if (rawData.trim() === "") {
      return { Cards: [] }; // Return an empty array if the file is empty
    }
    const data = JSON.parse(rawData);
    return { Cards: Array.isArray(data.Cards) ? data.Cards : [] };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // JSON syntax error
      return { Cards: [] };
    }
    throw error;
  }
};

//get all card
cardRouter.get("/list", (req, res, next) => {
  try {
    const data = readData();
    console.log(data);
    if (!Array.isArray(data.Cards)) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (data.Cards.length === 0) {
      return res.status(200).json({ message: "No cards exist" });
    }
    const formatCards = data.Cards.map((card) => ({ ...card }));
    res.status(200).json(formatCards);
  } catch (error) {
    next(error);
  }
});

// Get card by id
cardRouter.get("/detail/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Id is not a number" });
    }

    const data = readData();
    const card = data.find((s) => s.id === id.toString());

    if (!card) {
      return res
        .status(404)
        .json({ error: `Card with id = ${id} does not exist` });
    }

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
});

// Add new card
cardRouter.post("/create", (req, res, next) => {
  try {
    const data = readData();
    const newCard = {
      id: (data.length + 1).toString(),
      ...req.body,
    };
    data.Cards.push(newCard);
    writeData(data);
    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
});

module.exports = cardRouter;
