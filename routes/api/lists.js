const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const member = require("../../middleware/member");
const { check } = require("express-validator");

const {
    ListController
} = require("../../controller/");

// Thêm một danh sách mới
router.post(
    "/",
    [auth, member, [check("title", "Title is required").not().isEmpty()]],
    ListController.addList
);

// Lấy tất cả các danh sách của một board
router.get("/boardLists/:boardId", auth, ListController.getBoardLists);

// Lấy một danh sách theo ID
router.get("/:id", auth, ListController.getListById);

// Đổi tên danh sách
router.patch(
    "/rename/:id",
    [auth, member, [check("title", "Title is required").not().isEmpty()]],
    ListController.renameList
);

// Lưu trữ hoặc bỏ lưu trữ danh sách
router.patch("/archive/:archive/:id", [auth, member], ListController.archiveList);

// Di chuyển danh sách
router.patch("/move/:id", [auth, member], ListController.moveList);

module.exports = router;
