const { 
    addStudent, getStudents, updateStudent, deleteStudent,
    addStaff, getStaff, updateStaff, deleteStaff,
    addBatch, getBatches, updateBatch, deleteBatch,
    getDashboardStats,
    addNotice, getAdminNotices, uploadMaterial, getAdminMaterials, getIncomeReport,
    getExams, createExam
} = require('../controllers/adminController');
const { createFee, getFees, getPendingDues } = require('../controllers/feeController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const express = require("express")

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);

router.route('/students')
    .post(addStudent)
    .get(getStudents);
router.route('/students/:id')
    .put(updateStudent)
    .delete(deleteStudent);

router.route('/staff')
    .post(addStaff)
    .get(getStaff);
router.route('/staff/:id')
    .put(updateStaff)
    .delete(deleteStaff);

router.route('/batches')
    .post(addBatch)
    .get(getBatches);
router.route('/batches/:id')
    .put(updateBatch);

router.route('/fees')
    .post(createFee)
    .get(getFees);
router.get('/reports/dues', getPendingDues);
router.get('/reports/income', getIncomeReport);

router.route('/notices')
    .post(addNotice)
    .get(getAdminNotices);

router.route('/exams')
    .post(createExam)
    .get(getExams);

router.route('/materials')
    .post(upload.single('file'), uploadMaterial)
    .get(getAdminMaterials);

module.exports = router;
