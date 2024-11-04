const User = require("../models/User");
const Board = require("../models/Board");
const Notification = require("../models/Notification");
const { validationResult } = require("express-validator");

// Add a new board
const addBoard = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, backgroundURL } = req.body;

        // Create and save the board
        const newBoard = new Board({ title, backgroundURL });
        const board = await newBoard.save();

        // Add board to user's boards
        const user = await User.findById(req.user.id);
        user.boards.unshift(board.id);
        await user.save();

        // Add user to board's members as admin
        board.members.push({ user: user.id, name: user.name });

        // Log activity
        board.activity.unshift({
            text: `${user.name} created this board`,
        });
        await board.save();

        res.json(board);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get all boards of the user
const getUserBoards = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const boards = [];
        for (const boardId of user.boards) {
            boards.push(await Board.findById(boardId));
        }

        res.json(boards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get a specific board by ID
const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ msg: "Board not found" });
        }

        res.json(board);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get board activity
const getBoardActivity = async (req, res) => {
    try {
        const board = await Board.findById(req.params.boardId);
        if (!board) {
            return res.status(404).json({ msg: "Board not found" });
        }

        res.json(board.activity);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Rename board
const renameBoard = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ msg: "Board not found" });
        }

        // Log activity
        if (req.body.title !== board.title) {
            const user = await User.findById(req.user.id);
            board.activity.unshift({
                text: `${user.name} renamed this board (from '${board.title}')`,
            });
        }

        board.title = req.body.title;
        await board.save();

        res.json(board);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Add a member to a board
const addBoardMember = async (req, res) => {
    try {
        const board = await Board.findById(req.header("boardId"));
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if already a member
        if (board.members.map((member) => member.user).includes(req.params.userId)) {
            return res.status(400).json({ msg: "Already member of board" });
        }

        // Add board to user's boards
        user.boards.unshift(board.id);
        await user.save();

        // Add user to board's members with 'normal' role
        board.members.push({ user: user.id, name: user.name, role: "normal" });

        // Log activity
        board.activity.unshift({
            text: `${user.name} joined this board`,
        });
        await board.save();

        // Send notification
        const notification = new Notification({
            user: user.id,
            message: `Bạn đã được thêm vào board ${board.title}`,
            isRead: false,
        });
        await notification.save();

        res.json(board.members);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    addBoard,
    getUserBoards,
    getBoardById,
    getBoardActivity,
    renameBoard,
    addBoardMember,
};
