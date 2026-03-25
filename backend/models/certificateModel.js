const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam', // Optional: could be a course completion cert
        },
        title: {
            type: String,
            required: true,
        },
        issueDate: {
            type: Date,
            default: Date.now,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
