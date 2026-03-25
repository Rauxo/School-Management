const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Result = require('../models/resultModel');
const Material = require('../models/materialModel');
const Notice = require('../models/noticeModel');

// @desc    Get student profile & dashboard data
// @route   GET /api/student/profile
// @access  Private/Student
const getStudentProfile = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id }).populate('batch', 'name');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const attendance = await Attendance.find({ student: student._id });
    const results = await Result.find({ student: student._id }).populate('exam', 'title maxMarks passingMarks');
    
    // Calculate attendance percentage
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.json({
        student,
        attendancePercentage,
        attendance,
        results
    });
};

// @desc    Get materials for student's batch
// @route   GET /api/student/materials
// @access  Private/Student
const getMaterials = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    const materials = await Material.find({
        $or: [
            { batch: student.batch },
            { batch: null }
        ]
    });
    res.json(materials);
};

// @desc    Get notices for student
// @route   GET /api/student/notices
// @access  Private/Student
const getNotices = async (req, res) => {
    const notices = await Notice.find({
        targetRoles: 'student'
    }).sort({ createdAt: -1 });
    res.json(notices);
};

// @desc    Get student attendance
// @route   GET /api/student/attendance
// @access  Private/Student
const getStudentAttendance = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendance = await Attendance.find({ student: student._id }).sort({ date: -1 });
    res.json(attendance);
};

// @desc    Get student fees
// @route   GET /api/student/fees
// @access  Private/Student
const getStudentFees = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const Fee = require('../models/feeModel');
    const fees = await Fee.find({ student: student._id }).sort({ dueDate: -1 });
    res.json(fees);
};

// @desc    Get student results
// @route   GET /api/student/results
// @access  Private/Student
const getStudentResults = async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const results = await Result.find({ student: student._id }).populate('exam', 'title maxMarks passingMarks');
    res.json(results);
};

module.exports = { getStudentProfile, getMaterials, getNotices, getStudentAttendance, getStudentFees, getStudentResults };
