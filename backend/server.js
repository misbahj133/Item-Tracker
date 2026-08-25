const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION (With strict error handling)
const mongoURI = process.env.MONGODB_URI;

if (mongoURI && mongoURI !== "undefined") {
    mongoose.connect(mongoURI)
      .then(() => console.log('MongoDB Connected Successfully'))
      .catch(err => console.error('Database connection error:', err));
} else {
    console.error("CRITICAL ERROR: MONGODB_URI is missing in Vercel Environment Variables!");
}

// 2. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 3. WEB DASHBOARD (The Frontend)
app.get('/', (req, res) => {
    res.send(\`
        <html>
            <head><title>TaskFlow Pro Live</title></head>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h1 style="color: #6200EE;">TaskFlow Pro - Backend is LIVE</h1>
                <p>Status: \${mongoose.connection.readyState === 1 ? "Connected to Database ✅" : "Connecting... ⏳"}</p>
                <p>Your API is ready to receive requests.</p>
            </body>
        </html>
    \`);
});

// 4. EXPORT FOR VERCEL
module.exports = app;

// 5. LOCAL TESTING ONLY
if (process.env.NODE_ENV !== 'production') {
    app.listen(5001, '0.0.0.0', () => console.log('Local server running on port 5001'));
}
