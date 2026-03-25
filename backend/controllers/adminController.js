const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Staff = require('../models/staffModel');
const Batch = require('../models/batchModel');
const Fee = require('../models/feeModel');
const Exam = require('../models/examModel');
const Notice = require('../models/noticeModel');
const Material = require('../models/materialModel');
const StaffAttendance = require('../models/staffAttendanceModel');

// @desc    Add new student
// @route   POST /api/admin/students
// @access  Private/Admin
const addStudent = async (req, res) => {
    const { name, email, password, rollNumber, batchId, phone, address, parentName, parentPhone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'student',
    });

    if (user) {
        const student = await Student.create({
            user: user._id,
            rollNumber,
            batch: batchId,
            phone,
            address,
            parentName,
            parentPhone
        });

        res.status(201).json(student);
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    const students = await Student.find({}).populate('user', 'name email').populate('batch', 'name');
    res.json(students);
};

// @desc    Update student
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.rollNumber = req.body.rollNumber || student.rollNumber;
        student.batch = req.body.batchId || student.batch;
        student.phone = req.body.phone || student.phone;
        student.address = req.body.address || student.address;
        student.parentName = req.body.parentName || student.parentName;
        student.parentPhone = req.body.parentPhone || student.parentPhone;
        student.status = req.body.status || student.status;

        const updatedStudent = await student.save();

        if (req.body.name || req.body.email) {
            const user = await User.findById(student.user);
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            await user.save();
        }

        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

// @desc    Delete student
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        await User.findByIdAndDelete(student.user);
        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

// @desc    Add new staff
// @route   POST /api/admin/staff
// @access  Private/Admin
const addStaff = async (req, res) => {
    const { name, email, password, employeeId, designation, salary, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'staff',
    });

    if (user) {
        const staff = await Staff.create({
            user: user._id,
            employeeId,
            designation,
            salary,
            phone,
            address
        });

        res.status(201).json(staff);
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get all staff
// @route   GET /api/admin/staff
// @access  Private/Admin
const getStaff = async (req, res) => {
    const staff = await Staff.find({}).populate('user', 'name email').populate('assignedBatches', 'name');
    res.json(staff);
};

// @desc    Update staff
// @route   PUT /api/admin/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        staff.employeeId = req.body.employeeId || staff.employeeId;
        staff.designation = req.body.designation || staff.designation;
        staff.salary = req.body.salary || staff.salary;
        staff.phone = req.body.phone || staff.phone;
        staff.address = req.body.address || staff.address;
        staff.status = req.body.status || staff.status;
        // Allow admin to assign/update batches
        if (req.body.assignedBatches !== undefined) {
            staff.assignedBatches = req.body.assignedBatches;
        }

        const updatedStaff = await staff.save();

        if (req.body.name || req.body.email) {
            const user = await User.findById(staff.user);
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            await user.save();
        }

        res.json(updatedStaff);
    } else {
        res.status(404).json({ message: 'Staff not found' });
    }
};

// @desc    Delete staff
// @route   DELETE /api/admin/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (staff) {
        await User.findByIdAndDelete(staff.user);
        await staff.deleteOne(); // Use deleteOne in newer mongoose
        res.json({ message: 'Staff removed' });
    } else {
        res.status(404).json({ message: 'Staff not found' });
    }
};

// @desc    Add new batch
// @route   POST /api/admin/batches
// @access  Private/Admin
const addBatch = async (req, res) => {
    const { name, description, startDate, endDate } = req.body;

    const batch = await Batch.create({
        name,
        description,
        startDate,
        endDate
    });

    res.status(201).json(batch);
};

// @desc    Get all batches
// @route   GET /api/admin/batches
// @access  Private/Admin
const getBatches = async (req, res) => {
    const batches = await Batch.find({});
    res.json(batches);
};

// @desc    Update batch
// @route   PUT /api/admin/batches/:id
// @access  Private/Admin
const updateBatch = async (req, res) => {
    const batch = await Batch.findById(req.params.id);

    if (batch) {
        batch.name = req.body.name || batch.name;
        batch.description = req.body.description || batch.description;
        batch.startDate = req.body.startDate || batch.startDate;
        batch.endDate = req.body.endDate || batch.endDate;
        batch.active = req.body.active !== undefined ? req.body.active : batch.active;

        const updatedBatch = await batch.save();
        res.json(updatedBatch);
    } else {
        res.status(404).json({ message: 'Batch not found' });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    const totalStudents = await Student.countDocuments();
    const totalStaff = await Staff.countDocuments();
    const totalBatches = await Batch.countDocuments();

    // Aggregation for fees
    const feeStats = await Fee.aggregate([
        {
            $group: {
                _id: null,
                totalCollected: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
                pendingDues: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } }
            }
        }
    ]);

    const stats = {
        totalStudents,
        totalStaff,
        totalBatches,
        totalFeesCollected: feeStats.length > 0 ? feeStats[0].totalCollected : 0,
        pendingDues: feeStats.length > 0 ? feeStats[0].pendingDues : 0
    };

    res.json(stats);
};

// @desc    Add Notice
// @route   POST /api/admin/notices
// @access  Private/Admin
const addNotice = async (req, res) => {
    const { title, content, targetRoles } = req.body;
    const notice = await Notice.create({
        title,
        content,
        targetRoles,
        createdBy: req.user._id
    });
    res.status(201).json(notice);
};

// @desc    Get all Notices
// @route   GET /api/admin/notices
// @access  Private/Admin
const getAdminNotices = async (req, res) => {
    const notices = await Notice.find({}).populate('createdBy', 'name');
    res.json(notices);
};

// @desc    Upload Material
// @route   POST /api/admin/materials
// @access  Private/Admin
const uploadMaterial = async (req, res) => {
    const { title, description, type, batchId } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!fileUrl) return res.status(400).json({ message: 'File is required' });

    const material = await Material.create({
        title,
        description,
        fileUrl,
        type,
        batch: batchId || null,
        uploadedBy: req.user._id
    });

    res.status(201).json(material);
};

// @desc    Get all materials (Admin)
// @route   GET /api/admin/materials
// @access  Private/Admin
const getAdminMaterials = async (req, res) => {
    const materials = await Material.find({}).populate('uploadedBy', 'name').populate('batch', 'name');
    res.json(materials);
};
// @desc    Delete batch
// @route   DELETE /api/admin/batches/:id
// @access  Private/Admin
const deleteBatch = async (req, res) => {
    const batch = await Batch.findById(req.params.id);

    if (batch) {
        await batch.deleteOne(); // modern mongoose
        res.json({ message: 'Batch removed' });
    } else {
        res.status(404).json({ message: 'Batch not found' });
    }
};
// @desc    Get Income Report
// @route   GET /api/admin/reports/income
// @access  Private/Admin
const getIncomeReport = async (req, res) => {
    const incomeData = await Fee.aggregate([
        { $match: { status: 'paid' } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$updatedAt" } },
                amount: { $sum: "$amount" }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    res.json(incomeData);
};

// @desc    Get all exams
// @route   GET /api/admin/exams
// @access  Private/Admin
const getExams = async (req, res) => {
    const exams = await Exam.find({});
    res.json(exams);
};

// @desc    Create new exam
// @route   POST /api/admin/exams
// @access  Private/Admin
const createExam = async (req, res) => {
    const { title, description, date, maxMarks, passingMarks, batchId } = req.body;
    const exam = await Exam.create({
        title,
        description,
        examDate: date,
        maxMarks,
        passingMarks,
        batch: batchId || null
    });
    res.status(201).json(exam);
};

// @desc    Get all staff attendance
// @route   GET /api/admin/staff-attendance
// @access  Private/Admin
const getStaffAttendanceAdmin = async (req, res) => {
    const attendance = await StaffAttendance.find({}).populate({
        path: 'staff',
        populate: { path: 'user', select: 'name email' }
    });
    res.json(attendance);
};

// @desc    Approve Online Payment
// @route   PUT /api/admin/fees/:id/approve
// @access  Private/Admin
const approvePayment = async (req, res) => {
    const fee = await Fee.findById(req.params.id);
    if (fee) {
        fee.status = 'paid';
        fee.paidAt = new Date();
        const updatedFee = await fee.save();
        res.json(updatedFee);
    } else {
        res.status(404).json({ message: 'Fee record not found' });
    }
};

// @desc    Download Income Report CSV
// @route   GET /api/admin/reports/income/download
// @access  Private/Admin
const downloadIncomeReport = async (req, res) => {
    const fees = await Fee.find({ status: 'paid' }).populate({
        path: 'student',
        populate: { path: 'user', select: 'name' }
    });

    let csv = 'Receipt No,Student Name,Amount,Title,Paid At\n';
    fees.forEach(fee => {
        const studentName = fee.student && fee.student.user ? fee.student.user.name : 'Unknown';
        const paidAt = fee.paidAt ? new Date(fee.paidAt).toISOString().split('T')[0] : (fee.updatedAt ? new Date(fee.updatedAt).toISOString().split('T')[0] : '');
        csv += `${fee._id},"${studentName}",${fee.amount},"${fee.title}",${paidAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=income_report.csv');
    res.status(200).send(csv);
};

module.exports = { 
    addStudent, getStudents, updateStudent, deleteStudent,
    addStaff, getStaff, updateStaff, deleteStaff,
    addBatch, getBatches, updateBatch, deleteBatch,
    getDashboardStats,
    addNotice,    getAdminNotices,
    uploadMaterial,
    getAdminMaterials,
    getIncomeReport,
    getExams, createExam,
    getStaffAttendanceAdmin, approvePayment, downloadIncomeReport
};
