const cron = require('node-cron');
const Notification = require('../models/Notification');
const Card = require('../models/Card');
const List = require('../models/List');
const Board = require('../models/Board');  // Đừng quên import Board

// Chạy mỗi giờ kiểm tra deadline
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();
        const upcomingDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 giờ tới

        // Kiểm tra deadline của Card
        const cards = await Card.find({ deadline: { $lte: upcomingDeadline, $gte: now } });
        cards.forEach(async (card) => {
            const members = card.members.map(member => member.user);
            members.forEach(async (memberId) => {
                const notification = new Notification({
                    user: memberId,
                    message: `Nhắc nhở: Card '${card.title}' sắp đến hạn!`,
                });
                await notification.save();
            });
        });

        // Kiểm tra deadline của List
        const lists = await List.find({ deadline: { $lte: upcomingDeadline, $gte: now } });
        lists.forEach(async (list) => {
            const board = await Board.findOne({ lists: list._id });
            board.members.forEach(async (member) => {
                const notification = new Notification({
                    user: member.user,
                    message: `Nhắc nhở: List '${list.title}' sắp đến hạn!`,
                });
                await notification.save();
            });
        });

        console.log('Đã gửi thông báo cho các deadline sắp tới.');
    } catch (err) {
        console.error('Lỗi khi kiểm tra deadline:', err.message);
    }
});
