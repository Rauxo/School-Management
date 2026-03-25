const mongoose = require('mongoose');

const attendanceSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Batch',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        dateString: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late'],
            required: true,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

attendanceSchema.index({ student: 1, batch: 1, dateString: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
