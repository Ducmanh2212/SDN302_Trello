const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Board = require("../../models/Board");
const List = require("../../models/List");
const Card = require("../../models/Card");

// Helper function for error handling
const handleError = (res, error, defaultMessage = "Server Error") => {
  console.error(error.message);
  return res.status(500).json({ message: defaultMessage });
};

// Add a card
const createCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, listId } = req.body;
  const boardId = req.header("boardId");

  try {
    const newCard = new Card({ title });
    const card = await newCard.save();

    const list = await List.findById(listId);
    list.cards.push(card.id);
    await list.save();

    const user = await User.findById(req.user.id);
    const board = await Board.findById(boardId);
    board.activity.unshift({
      text: `${user.name} added '${title}' to '${list.title}'`,
    });
    await board.save();

    res.status(201).json({ cardId: card.id, listId });
  } catch (error) {
    handleError(res, error, "Failed to create card");
  }
};

// Get all of a list's cards
const getAllCardsByListId = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const cards = await Card.find({ _id: { $in: list.cards } });
    res.status(200).json(cards);
  } catch (error) {
    handleError(res, error, "Failed to retrieve cards");
  }
};

// Get a card by id
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    handleError(res, error, "Failed to retrieve card");
  }
};

// Edit a card's title, description, and/or label
const editCard = async (req, res) => {
  const { title, description, label } = req.body;

  if (title === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.title = title || card.title;
    card.description =
      description !== undefined ? description : card.description;
    card.label = label !== undefined ? label : card.label;

    await card.save();
    res.status(200).json(card);
  } catch (error) {
    handleError(res, error, "Failed to edit card");
  }
};

// Archive/Unarchive a card
const archiveCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.archived = req.params.archive === "true";
    await card.save();

    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: card.archived
        ? `${user.name} archived card '${card.title}'`
        : `${user.name} sent card '${card.title}' to the board`,
    });
    await board.save();

    res.status(200).json(card);
  } catch (error) {
    handleError(res, error, "Failed to archive card");
  }
};

// Move a card
const moveCard = async (req, res) => {
  const { fromId, toId, toIndex } = req.body;
  const cardId = req.params.id;

  try {
    const fromList = await List.findById(fromId);
    const toList = await List.findById(toId);
    if (!fromList || !toList) {
      return res.status(404).json({ message: "List/card not found" });
    }

    const fromIndex = fromList.cards.indexOf(cardId);
    if (fromIndex !== -1) {
      fromList.cards.splice(fromIndex, 1);
      await fromList.save();
    }

    if (!toList.cards.includes(cardId)) {
      if (toIndex >= 0) {
        toList.cards.splice(toIndex, 0, cardId);
      } else {
        toList.cards.push(cardId);
      }
      await toList.save();
    }

    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    const card = await Card.findById(cardId);
    board.activity.unshift({
      text: `${user.name} moved '${card.title}' from '${fromList.title}' to '${toList.title}'`,
    });
    await board.save();

    res.status(200).json({ cardId, from: fromList, to: toList });
  } catch (error) {
    handleError(res, error, "Failed to move card");
  }
};

// Add/Remove a member
const addRemoveMember = async (req, res) => {
  const { cardId, userId } = req.params;
  const add = req.params.add === "true";

  try {
    const card = await Card.findById(cardId);
    const user = await User.findById(userId);
    if (!card || !user) {
      return res.status(404).json({ message: "Card/user not found" });
    }

    const members = card.members.map((member) => member.user);
    if (
      (add && members.includes(userId)) ||
      (!add && !members.includes(userId))
    ) {
      return res.status(400).json(card);
    }

    if (add) {
      card.members.push({ user: user.id, name: user.name });
      // Assuming Notification model exists
      const notification = new Notification({
        user: userId,
        message: `You have been added to card ${card.title}`,
        isRead: false,
      });
      await notification.save();
    } else {
      const index = members.indexOf(userId);
      card.members.splice(index, 1);
    }
    await card.save();

    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: `${user.name} ${add ? "joined" : "left"} '${card.title}'`,
    });
    await board.save();

    res.status(200).json(card);
  } catch (error) {
    handleError(res, error, "Failed to modify member");
  }
};

// Delete a card
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    const list = await List.findById(req.params.listId);
    if (!card || !list) {
      return res.status(404).json({ message: "List/card not found" });
    }

    list.cards.splice(list.cards.indexOf(card.id), 1);
    await list.save();
    await card.remove();

    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: `${user.name} deleted '${card.title}' from '${list.title}'`,
    });
    await board.save();

    res.status(200).json({ message: "Card deleted", cardId: card.id });
  } catch (error) {
    handleError(res, error, "Failed to delete card");
  }
};

module.exports = {
  createCard,
  getAllCardsByListId,
  getCardById,
  editCard,
  archiveCard,
  moveCard,
  addRemoveMember,
  deleteCard,
};
