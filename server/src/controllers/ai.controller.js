const axios = require('axios');

// @desc    Generate Image via Python AI Engine
// @route   POST /api/ai/generate-image
// @access  Public
exports.generateAIImage = async (req, res) => {
    try {
        const { prompt, width, height } = req.body;

        // Call Python Service (Stub)
        // In real dev, localhost:8000
        const pythonResponse = await axios.post('http://localhost:8000/generate-image', {
            prompt, width, height
        }, { headers: { 'Content-Type': 'multipart/form-data' } }); // Note: axios might need form-data handling differently for Form() params in FastAPI

        res.status(200).json({ success: true, data: pythonResponse.data });
    } catch (error) {
        // Fallback or Error
        console.error("AI Service Error:", error.message);
        res.status(503).json({
            success: false,
            message: 'AI Service unavailable (Simulated response)',
            data: { image_path: 'simulation/generated_stub.png' }
        });
    }
};
