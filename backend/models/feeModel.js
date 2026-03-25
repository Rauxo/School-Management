const mongoose = require('mongoose');

const feeSchema = mongoose.Schema(
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
        amount: {
            type: Number,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['paid', 'pending', 'overdue'],
            default: 'pending',
        },
        paidAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
