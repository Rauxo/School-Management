const express = require('express');
const { getStudentProfile, getMaterials, getNotices, getStudentAttendance, getStudentFees, getStudentResults, getStudentCertificates } = require('../controllers/studentController');
const { protect, student } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(student);

router.get('/profile', getStudentProfile);
router.get('/materials', getMaterials);
router.get('/notices', getNotices);
router.get('/attendance', getStudentAttendance);
router.get('/fees', getStudentFees);
router.get('/results', getStudentResults);
router.get('/certificates', getStudentCertificates);

module.exports = router;
