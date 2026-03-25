const mongoose = require('mongoose');

const materialSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Notes', 'Assignment' , 'syllabus' , 'Other'],
            default: 'Notes',
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Batch', // If null, accessible to all
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
