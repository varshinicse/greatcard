const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    logoPath: {
        type: String
    },
    primaryColor: {
        type: String,
        default: '#000000'
    },
    secondaryColor: {
        type: String,
        default: '#ffffff'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Brand', BrandSchema);
