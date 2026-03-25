const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const StaffAttendance = require('../models/staffAttendanceModel');
const Exam = require('../models/examModel');
const Result = require('../models/resultModel');

// @desc    Mark student attendance
// @route   POST /api/staff/attendance
// @access  Private/Staff
const markStudentAttendance = async (req, res) => {
    const { studentId, batchId, status, date } = req.body;

    const attendance = await Attendance.create({
        student: studentId,
        batch: batchId,
        status,
        date: date || Date.now(),
        markedBy: req.user._id
    });

    res.status(201).json(attendance);
};

// @desc    Get staff's own attendance
// @route   GET /api/staff/my-attendance
// @access  Private/Staff
const getMyAttendance = async (req, res) => {
    const { _id } = await require('../models/staffModel').findOne({ user: req.user._id });
    const attendance = await StaffAttendance.find({ staff: _id });
    res.json(attendance);
};

// @desc    Get students in a batch
// @route   GET /api/staff/students/:batchId
// @access  Private/Staff
const getBatchStudents = async (req, res) => {
    const students = await Student.find({ batch: req.params.batchId }).populate('user', 'name email');
    res.json(students);
};

// @desc    Enter exam marks
// @route   POST /api/staff/results
// @access  Private/Staff
const enterMarks = async (req, res) => {
    const { examId, studentId, marksObtained, remarks } = req.body;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const status = marksObtained >= exam.passingMarks ? 'pass' : 'fail';

    const result = await Result.findOneAndUpdate(
        { exam: examId, student: studentId },
        { marksObtained, remarks, status },
        { upsert: true, new: true }
    );

    res.status(201).json(result);
};

module.exports = { markStudentAttendance, getMyAttendance, getBatchStudents, enterMarks };
