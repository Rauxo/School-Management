const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const Fee = require('../models/feeModel');

const getRazorpayInstance = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private/Student
const createOrder = async (req, res) => {
    const razorpay = getRazorpayInstance(); // ✅ yaha init

    const { feeId } = req.body;
    const fee = await Fee.findById(feeId);

    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    const options = {
        amount: fee.amount * 100,
        currency: 'INR',
        receipt: `receipt_${feeId}`,
    };

    try {
        const order = await razorpay.orders.create(options);

        await Payment.create({
            fee: feeId,
            student: fee.student,
            orderId: order.id,
            amount: fee.amount,
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment
// @route   POST /api/payments/verify
// @access  Private/Student
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        payment.paymentId = razorpay_payment_id;
        payment.status = 'captured';
        await payment.save();

        const fee = await Fee.findById(payment.fee);
        fee.status = 'paid';
        fee.paidAt = Date.now();
        await fee.save();

        res.json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};

module.exports = { createOrder, verifyPayment };
