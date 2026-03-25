const mongoose = require('mongoose');

const resultSchema = mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Exam',
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        marksObtained: {
            type: Number,
            required: true,
        },
        remarks: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pass', 'fail'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
