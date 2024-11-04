const express = require("express");
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const member = require("../../middleware/member");
const { CardController } = require("../../controller/");

const router = express.Router();

// Endpoint để thêm card mới
router.post(
  "/",
  [auth, member, [check("title", "Title is required").not().isEmpty()]],
  CardController.addCard
);

// Endpoint để lấy danh sách các card của list
router.get("/listCards/:listId", auth, CardController.getListCards);

// Endpoint để lấy thông tin card theo ID
router.get("/:id", auth, CardController.getCardById);

// Endpoint để chỉnh sửa card
router.patch("/edit/:id", [auth, member], CardController.editCard);

// Endpoint để archive/unarchive một card
router.patch(
  "/archive/:archive/:id",
  [auth, member],
  CardController.archiveCard
);

// Endpoint để di chuyển một card
router.patch("/move/:id", [auth, member], CardController.moveCard);

// Endpoint để thêm/xóa thành viên của card
router.put(
  "/addMember/:add/:cardId/:userId",
  [auth, member],
  CardController.addOrRemoveMember
);

// Endpoint để xóa một card
router.delete("/:listId/:id", [auth, member], CardController.deleteCard);

module.exports = router;
