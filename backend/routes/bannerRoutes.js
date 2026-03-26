const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    addBanner,
    getBanners,
    updateBanner,
    deleteBanner
} = require('../controllers/adminController');

// Public route to get banners
router.get('/', getBanners);

// Admin routes
router.post('/', protect, admin, upload.single('image'), addBanner);
router.put('/:id', protect, admin, upload.single('image'), updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

module.exports = router;
