const { validationResult } = require("express-validator");
const User = require("../../models/User");
const Board = require("../../models/Board");
const List = require("../../models/List");

// Thêm một danh sách mới
const addList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const title = req.body.title;
    const boardId = req.header("boardId");

    // Tạo và lưu danh sách mới
    const newList = new List({ title });
    const list = await newList.save();

    // Gán danh sách vào board
    const board = await Board.findById(boardId);
    board.lists.push(list.id);

    // Ghi lại hoạt động
    const user = await User.findById(req.user.id);
    board.activity.unshift({
      text: `${user.name} added '${title}' to this board`,
    });
    await board.save();

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy tất cả các danh sách của một board
const getBoardLists = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ msg: "Board not found" });
    }

    const lists = [];
    for (const listId of board.lists) {
      lists.push(await List.findById(listId));
    }

    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lấy một danh sách theo ID
const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Đổi tên danh sách
const renameList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    list.title = req.body.title;
    await list.save();

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Lưu trữ hoặc bỏ lưu trữ danh sách
const archiveList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    list.archived = req.params.archive === "true";
    await list.save();

    // Ghi lại hoạt động
    const user = await User.findById(req.user.id);
    const board = await Board.findById(req.header("boardId"));
    board.activity.unshift({
      text: list.archived
        ? `${user.name} archived list '${list.title}'`
        : `${user.name} sent list '${list.title}' to the board`,
    });
    await board.save();

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Di chuyển danh sách
const moveList = async (req, res) => {
  try {
    const toIndex = req.body.toIndex ? req.body.toIndex : 0;
    const boardId = req.header("boardId");
    const board = await Board.findById(boardId);
    const listId = req.params.id;
    if (!listId) {
      return res.status(404).json({ msg: "List not found" });
    }

    board.lists.splice(board.lists.indexOf(listId), 1);
    board.lists.splice(toIndex, 0, listId);
    await board.save();

    res.send(board.lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addList,
  getBoardLists,
  getListById,
  renameList,
  archiveList,
  moveList,
};
