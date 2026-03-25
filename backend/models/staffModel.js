const mongoose = require('mongoose');

const staffSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        employeeId: {
            type: String,
            required: true,
            unique: true,
        },
        designation: {
            type: String,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
            default: 0,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
