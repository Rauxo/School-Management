const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Batch',
        },
        rollNumber: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        parentName: {
            type: String,
        },
        parentPhone: {
            type: String,
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'graduated'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
