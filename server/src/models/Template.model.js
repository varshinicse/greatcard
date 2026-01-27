const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['UPLOAD', 'AI'],
        default: 'UPLOAD'
    },
    aspectRatio: {
        type: String,
        enum: ['1:1', '16:9', '9:16'],
        default: '16:9'
    },
    filePath: {
        type: String,
        required: true
    },
    previewPath: {
        type: String
    },
    metadata: {
        type: Map,
        of: String
    },
    layout: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Template', TemplateSchema);
