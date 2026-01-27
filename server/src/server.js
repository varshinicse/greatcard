const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded/generated files
app.use('/storage', express.static(path.join(__dirname, '../../storage')));

// Routes (to be mounted)
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
});

app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/generate', require('./routes/generate.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
