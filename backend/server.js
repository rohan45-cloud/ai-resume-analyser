const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security
app.use(helmet());

// CORS (IMPORTANT)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('Blocked Origin:', origin);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use('/api/', limiter);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);

// Health
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server running'
    });
});

// 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
            console.log('Frontend URL:', process.env.FRONTEND_URL);
        });
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });