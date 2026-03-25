const Fee = require('../models/feeModel');
const Student = require('../models/studentModel');

// @desc    Create fee for a student or batch
// @route   POST /api/admin/fees
// @access  Private/Admin
const createFee = async (req, res) => {
    const { studentId, batchId, title, amount, dueDate } = req.body;

    if (batchId) {
        const students = await Student.find({ batch: batchId });
        const fees = await Promise.all(students.map(s => Fee.create({
            student: s._id,
            title,
            amount,
            dueDate
        })));
        return res.status(201).json(fees);
    }

    const fee = await Fee.create({
        student: studentId,
        title,
        amount,
        dueDate
    });

    res.status(201).json(fee);
};

// @desc    Get all fees (Admin)
// @route   GET /api/admin/fees
// @access  Private/Admin
const getFees = async (req, res) => {
    const fees = await Fee.find({}).populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
    });
    res.json(fees);
};

// @desc    Get pending dues report
// @route   GET /api/admin/reports/dues
// @access  Private/Admin
const getPendingDues = async (req, res) => {
    const dues = await Fee.find({ status: 'pending' }).populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
    });
    res.json(dues);
};

module.exports = { createFee, getFees, getPendingDues };
