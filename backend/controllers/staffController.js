const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const StaffAttendance = require('../models/staffAttendanceModel');
const StaffModel = require('../models/staffModel');
const Exam = require('../models/examModel');
const Result = require('../models/resultModel');

// @desc    Get staff dashboard stats (dynamic)
// @route   GET /api/staff/dashboard
// @access  Private/Staff
const getStaffDashboardStats = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        if (!staffRecord) return res.status(404).json({ message: 'Staff record not found' });

        const assignedBatches = staffRecord.assignedBatches || [];

        // Count total students across all assigned batches
        const totalStudents = await Student.countDocuments({ batch: { $in: assignedBatches } });

        // Count pending evaluations (results not yet entered for assigned batches' exams)
        const examsForBatches = await Exam.find({ batch: { $in: assignedBatches } });
        const examIds = examsForBatches.map(e => e._id);
        const studentsInBatches = await Student.find({ batch: { $in: assignedBatches } }).select('_id');
        const studentIds = studentsInBatches.map(s => s._id);
        const enteredResults = await Result.countDocuments({ exam: { $in: examIds }, student: { $in: studentIds } });
        const totalPossibleResults = examIds.length * studentIds.length;
        const pendingEvaluations = Math.max(0, totalPossibleResults - enteredResults);

        // Today's attendance stats
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const presentToday = await Attendance.countDocuments({
            batch: { $in: assignedBatches },
            date: { $gte: todayStart, $lte: todayEnd },
            status: 'present'
        });

        const totalMarkedToday = await Attendance.countDocuments({
            batch: { $in: assignedBatches },
            date: { $gte: todayStart, $lte: todayEnd }
        });

        const attendanceRate = totalMarkedToday > 0
            ? Math.round((presentToday / totalMarkedToday) * 100)
            : null; // null means not yet marked today

        res.json({
            totalStudents,
            pendingEvaluations,
            assignedBatchCount: assignedBatches.length,
            subjectCount: examsForBatches.length,
            attendanceRate,
            attendanceMarkedToday: totalMarkedToday > 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get batches assigned to the current staff
// @route   GET /api/staff/my-batches
// @access  Private/Staff
const getMyBatches = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id }).populate('assignedBatches', 'name description');
        if (!staffRecord) return res.status(404).json({ message: 'Staff record not found' });
        res.json(staffRecord.assignedBatches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark student attendance (prevents duplicate per student/batch/day)
// @route   POST /api/staff/attendance
// @access  Private/Staff
const markStudentAttendance = async (req, res) => {
    try {
        const { studentId, batchId, status, date } = req.body;

        const attendanceDate = date ? new Date(date) : new Date();
        const dayStart = new Date(attendanceDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(attendanceDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Check if already marked for this student/batch/day
        const existing = await Attendance.findOne({
            student: studentId,
            batch: batchId,
            date: { $gte: dayStart, $lte: dayEnd }
        });

        if (existing) {
            // Update the existing record instead of creating a duplicate
            existing.status = status;
            existing.markedBy = req.user._id;
            const updated = await existing.save();
            return res.json({ ...updated.toObject(), updated: true });
        }

        const attendance = await Attendance.create({
            student: studentId,
            batch: batchId,
            status,
            date: attendanceDate,
            markedBy: req.user._id
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get today's attendance status for a batch (to show already-marked students)
// @route   GET /api/staff/attendance-today/:batchId
// @access  Private/Staff
const getTodayAttendance = async (req, res) => {
    try {
        const dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date();
        dayEnd.setHours(23, 59, 59, 999);

        const records = await Attendance.find({
            batch: req.params.batchId,
            date: { $gte: dayStart, $lte: dayEnd }
        });

        // Return a map of studentId -> status for quick lookup
        const statusMap = {};
        records.forEach(r => { statusMap[r.student.toString()] = r.status; });
        res.json(statusMap);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get staff's own attendance
// @route   GET /api/staff/my-attendance
// @access  Private/Staff
const getMyAttendance = async (req, res) => {
    try {
        const { _id } = await StaffModel.findOne({ user: req.user._id });
        const attendance = await StaffAttendance.find({ staff: _id });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get students in a batch (only if assigned to this staff)
// @route   GET /api/staff/students/:batchId
// @access  Private/Staff
const getBatchStudents = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        if (!staffRecord) return res.status(404).json({ message: 'Staff record not found' });

        // Verify the staff is assigned to this batch
        const isAssigned = staffRecord.assignedBatches.some(
            b => b.toString() === req.params.batchId
        );
        if (!isAssigned) {
            return res.status(403).json({ message: 'You are not assigned to this batch' });
        }

        const students = await Student.find({ batch: req.params.batchId }).populate('user', 'name email');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enter exam marks
// @route   POST /api/staff/results
// @access  Private/Staff
const enterMarks = async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Student Profile
// @route   GET /api/staff/student/:studentId/profile
// @access  Private/Staff
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('user', 'name email').populate('batch', 'name');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const isAssigned = staffRecord.assignedBatches.some(b => b.toString() === student.batch._id.toString());
        if (!isAssigned) return res.status(403).json({ message: 'You are not assigned to this student\'s batch' });

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Batch Results
// @route   GET /api/staff/results/:batchId
// @access  Private/Staff
const getBatchResults = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const isAssigned = staffRecord.assignedBatches.some(b => b.toString() === req.params.batchId);
        if (!isAssigned) return res.status(403).json({ message: 'Not assigned to this batch' });

        const exams = await Exam.find({ batch: req.params.batchId });
        const examIds = exams.map(e => e._id);
        const results = await Result.find({ exam: { $in: examIds } }).populate('exam', 'title maxMarks passingMarks').populate({
            path: 'student',
            populate: { path: 'user', select: 'name' }
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStaffDashboardStats,
    getMyBatches,
    markStudentAttendance,
    getTodayAttendance,
    getMyAttendance,
    getBatchStudents,
    enterMarks,
    getStudentProfile,
    getBatchResults
};
