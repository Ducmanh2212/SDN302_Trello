const express = require("express");
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const member = require("../../middleware/member");
const { BoardController } = require("../../controller");

const router = express.Router();

// Route để thêm board mới
router.post(
    "/",
    [auth, [check("title", "Title is required").not().isEmpty()]],
    BoardController.addBoard
);

// Route để lấy danh sách board của người dùng
router.get("/", auth, BoardController.getUserBoards);

// Route để lấy thông tin board theo ID
router.get("/:id", auth, BoardController.getBoardById);

// Route để lấy hoạt động của board
router.get("/activity/:boardId", auth, BoardController.getBoardActivity);

// Route để đổi tên board
router.patch(
    "/rename/:id",
    [auth, member, [check("title", "Title is required").not().isEmpty()]],
    BoardController.renameBoard
);

// Route để thêm thành viên vào board
router.put("/addMember/:userId", [auth, member], BoardController.addBoardMember);

module.exports = router;
