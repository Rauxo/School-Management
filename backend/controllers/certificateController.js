const Certificate = require('../models/certificateModel');
const Student = require('../models/studentModel');

// @desc    Get all certificates for a student
// @route   GET /api/certificates
// @access  Private/Student
const getMyCertificates = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const certificates = await Certificate.find({ student: student._id }).populate('issuedBy', 'name');
    res.json(certificates);
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates/admin
// @access  Private/Admin
const getAllCertificates = async (req, res) => {
    const certificates = await Certificate.find({}).populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
    }).populate('issuedBy', 'name');
    res.json(certificates);
};

// @desc    Issue certificate
// @route   POST /api/certificates
// @access  Private/Admin
const issueCertificate = async (req, res) => {
    const { studentId, title, fileUrl, examId } = req.body;
    const certificate = await Certificate.create({
        student: studentId,
        title,
        fileUrl,
        exam: examId || null,
        issuedBy: req.user._id
    });
    res.status(201).json(certificate);
};

module.exports = { getMyCertificates, getAllCertificates, issueCertificate };
