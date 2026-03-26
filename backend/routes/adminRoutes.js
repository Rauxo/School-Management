const { 
    addStudent, getStudents, updateStudent, deleteStudent,
    addStaff, getStaff, updateStaff, deleteStaff,
    addBatch, getBatches, updateBatch, deleteBatch,
    getDashboardStats,
    addNotice, getAdminNotices, uploadMaterial, getAdminMaterials, getIncomeReport,
    getExams, createExam,
    getStaffAttendanceAdmin, approvePayment, downloadIncomeReport ,getAllResults,
    issueCertificate, getAdminCertificates, getPublicBatches
} = require('../controllers/adminController');
const { createFee, getFees, getPendingDues } = require('../controllers/feeController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const express = require("express")

const router = express.Router();

router.get('/batches/public', getPublicBatches);

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
    .post(upload.single('image'), addStaff)
    .get(getStaff);
router.route('/staff/:id')
    .put(upload.single('image'), updateStaff)
    .delete(deleteStaff);

router.route('/batches')
    .post(addBatch)
    .get(getBatches);
router.route('/batches/:id')
    .put(updateBatch);

router.route('/fees')
    .post(createFee)
    .get(getFees);
router.put('/fees/:id/approve', approvePayment);
router.get('/reports/dues', getPendingDues);
router.get('/reports/income', getIncomeReport);
router.get('/reports/income/download', downloadIncomeReport);
router.get('/staff-attendance', getStaffAttendanceAdmin);

router.route('/notices')
    .post(addNotice)
    .get(getAdminNotices);

router.route('/exams')
    .post(createExam)
    .get(getExams);

router.route('/results').get(getAllResults);

router.route('/materials')
    .post(upload.single('file'), uploadMaterial)
    .get(getAdminMaterials);

router.route('/certificates')
    .post(upload.single('file'), issueCertificate)
    .get(getAdminCertificates);

module.exports = router;
