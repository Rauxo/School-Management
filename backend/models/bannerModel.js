const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
