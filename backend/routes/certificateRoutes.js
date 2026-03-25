const express = require('express');
const { getMyCertificates, getAllCertificates, issueCertificate } = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyCertificates);
router.get('/admin', admin, getAllCertificates);
router.post('/', admin, issueCertificate);

module.exports = router;
