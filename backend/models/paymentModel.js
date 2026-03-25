const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
    {
        fee: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Fee',
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        },
        orderId: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['created', 'captured', 'failed'],
            default: 'created',
        },
        method: {
            type: String,
        },
        receiptUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
