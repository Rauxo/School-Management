const express = require('express');
const { markStudentAttendance, getMyAttendance, getBatchStudents, enterMarks } = require('../controllers/staffController');
const { protect, staff } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(staff);

router.post('/attendance', markStudentAttendance);
router.get('/my-attendance', getMyAttendance);
router.get('/students/:batchId', getBatchStudents);
router.post('/results', enterMarks);

module.exports = router;
