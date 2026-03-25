const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const StaffAttendance = require('../models/staffAttendanceModel');
const StaffModel = require('../models/staffModel');
const Exam = require('../models/examModel');
const Result = require('../models/resultModel');
const Material = require('../models/materialModel');

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
            return res.status(400).json({ message: 'Attendance already marked for today and cannot be changed.' });
        }

        const attendance = await Attendance.create({
            student: studentId,
            batch: batchId,
            status,
            date: attendanceDate,
            dateString: attendanceDate.toISOString().split('T')[0],
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
        const attendance = await StaffAttendance.find({ staff: _id }).sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark staff's own attendance
// @route   POST /api/staff/my-attendance
// @access  Private/Staff
const markMyAttendance = async (req, res) => {
    try {
        const { status } = req.body;
        const staff = await StaffModel.findOne({ user: req.user._id });
        if (!staff) return res.status(404).json({ message: 'Staff profile not found' });

        const d = new Date();
        d.setHours(0, 0, 0, 0);

        const existing = await StaffAttendance.findOne({
            staff: staff._id,
            date: { $gte: d, $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000) }
        });

        if (existing) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        const attendance = await StaffAttendance.create({
            staff: staff._id,
            date: new Date(),
            dateString: new Date().toISOString().split('T')[0],
            status
        });

        res.status(201).json(attendance);
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

// @desc    Create new exam
// @route   POST /api/staff/exams
// @access  Private/Staff
const createExam = async (req, res) => {
    try {
        const { title, description, date, maxMarks, passingMarks, batchId } = req.body;
        
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const isAssigned = staffRecord.assignedBatches.some(b => b.toString() === batchId);
        if (!isAssigned) return res.status(403).json({ message: 'Not assigned to this batch' });

        const exam = await Exam.create({
            title,
            description,
            examDate: date,
            maxMarks,
            passingMarks,
            batch: batchId
        });
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get exams for assigned batches
// @route   GET /api/staff/exams
// @access  Private/Staff
const getStaffExams = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const exams = await Exam.find({ batch: { $in: staffRecord.assignedBatches } }).populate('batch', 'name');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload Material
// @route   POST /api/staff/materials
// @access  Private/Staff
const uploadMaterial = async (req, res) => {
    try {
        const { title, description, type, batchId } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!fileUrl) return res.status(400).json({ message: 'File is required' });

        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const isAssigned = staffRecord.assignedBatches.some(b => b.toString() === batchId);
        if (batchId && !isAssigned) return res.status(403).json({ message: 'Not assigned to this batch' });

        const material = await Material.create({
            title,
            description,
            fileUrl,
            type,
            batch: batchId || null,
            uploadedBy: req.user._id
        });

        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get materials for staff (all + their uploads)
// @route   GET /api/staff/materials
// @access  Private/Staff
const getStaffMaterials = async (req, res) => {
    try {
        const staffRecord = await StaffModel.findOne({ user: req.user._id });
        const materials = await Material.find({
            $or: [
                { batch: { $in: staffRecord.assignedBatches } },
                { batch: null },
                { uploadedBy: req.user._id }
            ]
        }).populate('uploadedBy', 'name').populate('batch', 'name');
        res.json(materials);
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
    getBatchResults,
    createExam,
    getStaffExams,
    markMyAttendance,
    uploadMaterial,
    getStaffMaterials
};
