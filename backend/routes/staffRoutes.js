const express = require('express');
const {
    getStaffDashboardStats,
    getMyBatches,
    markStudentAttendance,
    getTodayAttendance,
    getMyAttendance,
    getBatchStudents,
    enterMarks,
    getStudentProfile,
    getBatchResults,
    createExam,
    getStaffExams,
    markMyAttendance,
    uploadMaterial,
    getStaffMaterials
} = require('../controllers/staffController');
const { protect, staff } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(staff);

router.get('/dashboard', getStaffDashboardStats);
router.get('/my-batches', getMyBatches);
router.post('/attendance', markStudentAttendance);
router.get('/attendance-today/:batchId', getTodayAttendance);
router.post('/my-attendance', markMyAttendance);
router.get('/my-attendance', getMyAttendance);
router.get('/students/:batchId', getBatchStudents);
router.post('/results', enterMarks);
router.get('/student/:studentId/profile', getStudentProfile);
router.get('/results/:batchId', getBatchResults);

router.route('/exams')
    .post(createExam)
    .get(getStaffExams);

router.route('/materials')
    .post(require('../middleware/uploadMiddleware').single('file'), uploadMaterial)
    .get(getStaffMaterials);

module.exports = router;
