const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const Template = require('../models/Template.model');
const CSVBatch = require('../models/CSVBatch.model');
const GeneratedCard = require('../models/GeneratedCard.model');
const mongoose = require('mongoose');

// @desc    Bulk Generate Cards
// @route   POST /api/generate/bulk
// @access  Public
exports.generateBulk = async (req, res) => {
    try {
        console.log("Generate Bulk Request Body:", JSON.stringify(req.body, null, 2));

        // Allow recipientData directly for manual/single entry
        const { templateId, batchId, layerConfig, recipientData } = req.body;

        if (!templateId) {
            return res.status(400).json({ success: false, message: 'Template ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(templateId)) {
            return res.status(400).json({ success: false, message: 'Invalid Template ID format' });
        }

        const template = await Template.findById(templateId);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });

        let rows = [];

        if (batchId && !batchId.startsWith('manual-')) {
            if (!mongoose.Types.ObjectId.isValid(batchId)) {
                return res.status(400).json({ success: false, message: 'Invalid Batch ID format' });
            }

            const batch = await CSVBatch.findById(batchId);
            if (!batch) return res.status(404).json({ success: false, message: 'CSV Batch not found' });

            // Read CSV
            await new Promise((resolve, reject) => {
                if (!fs.existsSync(batch.filePath)) {
                    reject(new Error(`CSV file not found at ${batch.filePath}`));
                    return;
                }
                fs.createReadStream(batch.filePath)
                    .pipe(csv())
                    .on('data', (data) => rows.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else if (recipientData && Array.isArray(recipientData)) {
            rows = recipientData;
        } else {
            console.log("Missing Batch ID or Recipient Data");
            return res.status(400).json({ success: false, message: 'Either valid Batch ID or Recipient Data is required' });
        }

        console.log(`Processing ${rows.length} rows for generation.`);

        const generatedCards = [];
        // Process each row (limit to 10 for demo)
        const processCount = Math.min(rows.length, 10);

        for (let i = 0; i < processCount; i++) {
            const row = rows[i];

            // Prepare overlays
            const overlays = layerConfig.map(layer => {
                let content = layer.content || "";
                // Placeholder replacement
                Object.keys(row).forEach(key => {
                    content = content.replace(new RegExp(`{${key}}`, 'gi'), row[key] || "");
                });

                return {
                    type: layer.type,
                    content: content,
                    x: layer.x,
                    y: layer.y,
                    style: layer.style
                };
            });

            // Call Python AI Engine
            try {
                // Using URLSearchParams for axios to mimic form-data/x-www-form-urlencoded
                const params = new URLSearchParams();
                params.append('template_path', template.filePath);
                params.append('overlays', JSON.stringify(overlays));

                console.log(`Calling AI Engine for row ${i}...`);
                const aiResponse = await axios.post('http://localhost:8000/compose-card', params);
                console.log(`AI Engine Response:`, aiResponse.data);

                if (aiResponse.data.status === 'success') {
                    const newCard = await GeneratedCard.create({
                        templateId: template._id,
                        outputPath: `/storage/generated/${aiResponse.data.filename}`,
                        recipientData: row,
                        status: 'COMPLETED'
                    });
                    generatedCards.push(newCard);
                } else {
                    console.error(`AI Engine returned error: ${aiResponse.data.message}`);
                }
            } catch (err) {
                console.error("AI Generation Error for row " + i, err.message);
                if (err.response) {
                    console.error("AI Engine Error Data:", err.response.data);
                }
                // Continue to next row even if one fails
            }
        }

        res.status(200).json({
            success: true,
            message: `Generated ${generatedCards.length} cards`,
            data: generatedCards
        });

    } catch (error) {
        console.error("generateBulk Controller Error:", error);
        res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};
