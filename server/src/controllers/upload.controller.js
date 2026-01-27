const fs = require('fs');
const csv = require('csv-parser');
const CSVBatch = require('../models/CSVBatch.model');

// @desc    Upload CSV
// @route   POST /api/upload/csv
// @access  Public
exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
        }

        const results = [];
        const headers = new Set();

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
                Object.keys(data).forEach(k => headers.add(k));
            })
            .on('end', async () => {
                const headerArray = Array.from(headers);

                const batch = await CSVBatch.create({
                    originalFilename: req.file.originalname,
                    filePath: req.file.path, // In real app, might want relative path if serving static
                    rowCount: results.length,
                    columnHeaders: headerArray,
                    status: 'PARSED'
                });

                res.status(200).json({
                    success: true,
                    data: {
                        batchId: batch._id,
                        rowCount: results.length,
                        headers: headerArray,
                        preview: results.slice(0, 5) // Send top 5 rows
                    }
                });
            });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Upload Image Asset
// @route   POST /api/upload/image
// @access  Public
exports.uploadImage = async (req, res) => {
    res.status(200).json({ success: true, message: 'Image Uploaded' });
};
