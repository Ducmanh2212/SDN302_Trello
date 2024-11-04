const { validationResult } = require("express-validator");
const Card = require("../models/Card");

// Thêm một mục vào checklist
const addChecklistItem = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ msg: "Card not found" });
        }

        card.checklist.push({ text: req.body.text, complete: false });
        await card.save();

        res.json(card);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Chỉnh sửa văn bản của một mục trong checklist
const editChecklistItemText = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ msg: "Card not found" });
        }

        const item = card.checklist.find((item) => item.id === req.params.itemId);
        if (item) {
            item.text = req.body.text;
            await card.save();
            res.json(card);
        } else {
            res.status(404).json({ msg: "Checklist item not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Hoàn thành hoặc bỏ hoàn thành một mục trong checklist
const toggleChecklistItemComplete = async (req, res) => {
    try {
        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ msg: "Card not found" });
        }

        const item = card.checklist.find((item) => item.id === req.params.itemId);
        if (item) {
            item.complete = req.params.complete === "true";
            await card.save();
            res.json(card);
        } else {
            res.status(404).json({ msg: "Checklist item not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Xóa một mục trong checklist
const deleteChecklistItem = async (req, res) => {
    try {
        const card = await Card.findById(req.params.cardId);
        if (!card) {
            return res.status(404).json({ msg: "Card not found" });
        }

        const index = card.checklist.findIndex((item) => item.id === req.params.itemId);
        if (index !== -1) {
            card.checklist.splice(index, 1);
            await card.save();
            res.json(card);
        } else {
            res.status(404).json({ msg: "Checklist item not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    addChecklistItem,
    editChecklistItemText,
    toggleChecklistItemComplete,
    deleteChecklistItem,
};
