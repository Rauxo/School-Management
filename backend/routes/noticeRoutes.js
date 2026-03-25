const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Notice = require('../models/noticeModel');

// @desc    Get notices based on user role
// @route   GET /api/notices
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'student') {
            query = { targetRoles: 'student' };
        } else if (req.user.role === 'staff') {
            query = { targetRoles: 'staff' };
        }
        // Admin sees all
        const notices = await Notice.find(query).populate('createdBy', 'name').sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
