const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Notification = require('../../models/Notification');


// Lấy danh sách thông báo của người dùng đã đăng nhập
router.get('/', auth, async (req, res) => {
    try {
        console.log("User ID:", req.user.id); // Kiểm tra ID người dùng
        const notifications = await Notification.find({ user: req.user.id, isRead: false });
        console.log("Notifications:", notifications); // Kiểm tra dữ liệu trả về
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
});


// Đánh dấu thông báo đã đọc
router.put('/:id', auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ msg: 'Không tìm thấy thông báo' });

        notification.isRead = true;
        await notification.save();
        
        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi máy chủ');
    }
});


module.exports = router;
