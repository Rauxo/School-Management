const mongoose = require('mongoose');

const examSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Batch',
        },
        examDate: {
            type: Date,
            required: true,
        },
        maxMarks: {
            type: Number,
            required: true,
        },
        passingMarks: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    }
);

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
