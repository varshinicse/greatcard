const mongoose = require('mongoose');

const CSVBatchSchema = new mongoose.Schema({
    originalFilename: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    rowCount: {
        type: Number,
        default: 0
    },
    columnHeaders: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['UPLOADED', 'PARSED', 'PROCESSED'],
        default: 'UPLOADED'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CSVBatch', CSVBatchSchema);
