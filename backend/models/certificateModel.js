const mongoose = require('mongoose');

const certificateSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
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
        description: {
            type: String,
        },
        issuer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
