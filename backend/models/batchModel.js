const mongoose = require('mongoose');

const batchSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        active: {
            type: Boolean,
            default: true,
        },
        schedule: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
