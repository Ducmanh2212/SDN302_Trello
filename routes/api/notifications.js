const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const {
    NotificationController
} = require("../../controller/");

// Lấy danh sách thông báo của người dùng đã đăng nhập
router.get("/", auth, NotificationController.getUserNotifications);

// Đánh dấu thông báo đã đọc
router.put("/:id", auth, NotificationController.markNotificationAsRead);

module.exports = router;
