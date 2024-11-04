const { validationResult } = require("express-validator");
const User = require("../../models/User");
const Board = require("../../models/Board");
const List = require("../../models/List");
const Card = require("../../models/Card");
const Notification = require("../../models/Notification");

// Thêm một card
const addCard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, listId } = req.body;
    const boardId = req.header("boardId");

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

    res.json({ cardId: card.id, listId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy tất cả các card của một list
const getListCards = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    const cards = await Card.find({ _id: { $in: list.cards } });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy một card theo ID
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Chỉnh sửa tiêu đề, mô tả và nhãn của card
const editCard = async (req, res) => {
  try {
    const { title, description, label } = req.body;
    if (title === "") {
      return res.status(400).json({ msg: "Title is required" });
    }

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    card.title = title || card.title;
    if (description !== undefined) card.description = description;
    if (label !== undefined) card.label = label;
    await card.save();

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Archive hoặc Unarchive một card
const archiveCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ msg: "Card not found" });
    }

    card.archived = req.params.archive === "true";
    await card.save();

    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: card.archived
        ? `${user.name} archived card '${card.title}'`
        : `${user.name} unarchived card '${card.title}'`,
    });
    await board.save();

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Di chuyển một card
const moveCard = async (req, res) => {
  try {
    const { fromId, toId, toIndex } = req.body;
    const boardId = req.header("boardId");

    const cardId = req.params.id;
    const from = await List.findById(fromId);
    let to = await List.findById(toId);
    if (!cardId || !from || !to) {
      return res.status(404).json({ msg: "List/card not found" });
    } else if (fromId === toId) {
      to = from;
    }

    const fromIndex = from.cards.indexOf(cardId);
    if (fromIndex !== -1) {
      from.cards.splice(fromIndex, 1);
      await from.save();
    }

    if (!to.cards.includes(cardId)) {
      if (toIndex === 0 || toIndex) {
        to.cards.splice(toIndex, 0, cardId);
      } else {
        to.cards.push(cardId);
      }
      await to.save();
    }

    if (fromId !== toId) {
      const user = await User.findById(req.user.id);
      const board = await Board.findById(boardId);
      const card = await Card.findById(cardId);
      board.activity.unshift({
        text: `${user.name} moved '${card.title}' from '${from.title}' to '${to.title}'`,
      });
      await board.save();
    }

    res.send({ cardId, from, to });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Thêm hoặc Xóa một thành viên khỏi card
const addOrRemoveMember = async (req, res) => {
  try {
    const { cardId, userId } = req.params;
    const card = await Card.findById(cardId);
    const user = await User.findById(userId);
    if (!card || !user) {
      return res.status(404).json({ msg: "Card/user not found" });
    }

    const add = req.params.add === "true";
    const members = card.members.map((member) => member.user);
    const index = members.indexOf(userId);
    if ((add && members.includes(userId)) || (!add && index === -1)) {
      return res.json(card);
    }

    if (add) {
      card.members.push({ user: user.id, name: user.name });
      const notification = new Notification({
        user: userId,
        message: `Bạn đã được thêm vào card ${card.title}`,
        isRead: false,
      });
      await notification.save();
    } else {
      card.members.splice(index, 1);
    }
    await card.save();

    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: `${user.name} ${add ? "joined" : "left"} '${card.title}'`,
    });
    await board.save();

    res.json(card);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Xóa một card
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    const list = await List.findById(req.params.listId);
    if (!card || !list) {
      return res.status(404).json({ msg: "List/card not found" });
    }

    list.cards.splice(list.cards.indexOf(req.params.id), 1);
    await list.save();
    await card.remove();

    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: `${user.name} deleted '${card.title}' from '${list.title}'`,
    });
    await board.save();

    res.json(req.params.id);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addCard,
  getListCards,
  getCardById,
  editCard,
  archiveCard,
  moveCard,
  addOrRemoveMember,
  deleteCard,
};
