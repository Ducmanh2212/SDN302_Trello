const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const member = require("../../middleware/member");
const { check } = require("express-validator");

const {
    ChecklistController
} = require("../../controller");

// Thêm một mục vào checklist
router.post(
    "/:cardId",
    [auth, member, [check("text", "Text is required").not().isEmpty()]],
    ChecklistController.addChecklistItem
);

// Chỉnh sửa văn bản của một mục trong checklist
router.patch(
    "/:cardId/:itemId",
    [auth, member, [check("text", "Text is required").not().isEmpty()]],
    ChecklistController.editChecklistItemText
);

// Hoàn thành hoặc bỏ hoàn thành một mục trong checklist
router.patch("/:cardId/:complete/:itemId", [auth, member], ChecklistController.toggleChecklistItemComplete);

// Xóa một mục trong checklist
router.delete("/:cardId/:itemId", [auth, member], ChecklistController.deleteChecklistItem);

module.exports = router;
