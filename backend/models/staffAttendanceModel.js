const mongoose = require('mongoose');

const staffAttendanceSchema = mongoose.Schema(
    {
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Staff',
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
            enum: ['present', 'absent', 'leave'],
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

staffAttendanceSchema.index({ staff: 1, dateString: 1 }, { unique: true });

const StaffAttendance = mongoose.model('StaffAttendance', staffAttendanceSchema);

module.exports = StaffAttendance;
