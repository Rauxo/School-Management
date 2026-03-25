const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        targetRoles: [
            {
                type: String,
                enum: ['admin', 'staff', 'student'],
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
