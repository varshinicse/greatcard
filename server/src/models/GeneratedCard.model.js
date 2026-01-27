const mongoose = require('mongoose');

const GeneratedCardSchema = new mongoose.Schema({
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    },
    outputPath: {
        type: String,
        required: true
    },
    format: {
        type: String,
        enum: ['png', 'jpg', 'pdf'],
        default: 'png'
    },
    recipientData: {
        type: Object // Stores the CSV row data used for this card
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GeneratedCard', GeneratedCardSchema);
