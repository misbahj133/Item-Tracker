const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes'); 
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskflow';

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Atlas Error:', err));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// --- POLISHED WEB DASHBOARD (5 VIEWS) ---
app.get('/', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TaskFlow Pro Dashboard</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background: #f4f7f6; font-family: sans-serif; }
                .navbar { background: #6200EE !important; }
                .view { display: none; padding: 20px 0; }
                .view.active { display: block; }
                .card { border: none; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            </style>
        </head>
        <body>
            <nav class="navbar navbar-expand navbar-dark shadow-sm mb-4">
                <div class="container">
                    <a class="navbar-brand fw-bold" href="#" onclick="showView('home')">TaskFlow Pro Admin</a>
                    <div class="navbar-nav ms-auto">
                        <a class="nav-link" href="#" onclick="showView('home')">Home</a>
                        <a class="nav-link" href="#" onclick="showView('team')">Team</a>
                        <a class="nav-link" href="#" onclick="showView('about')">About</a>
                    </div>
                </div>
            </nav>

            <div class="container">
                <!-- VIEW 1: HOME -->
                <div id="home" class="view active text-center">
                    <div class="card p-5">
                        <h1 style="color: #6200EE;">System Status: ${isConnected ? "Connected ✅" : "Offline ❌"}</h1>
                        <p class="lead">The Full-Stack Task Management system is live on the cloud.</p>
                        <hr>
                        <div id="project-list" class="row text-start mt-4">Loading team data...</div>
                    </div>
                </div>

                <!-- VIEW 2: TEAM -->
                <div id="team" class="view">
                    <div class="card p-4">
                        <h2>Team Roles & RBAC</h2>
                        <table class="table mt-3">
                            <thead><tr><th>Role</th><th>Permission</th></tr></thead>
                            <tbody>
                                <tr><td><span class="badge bg-danger">Admin</span></td><td>Full Project Control</td></tr>
                                <tr><td><span class="badge bg-primary">Member</span></td><td>Task Updates</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- VIEW 3: ABOUT -->
                <div id="about" class="view">
                    <div class="card p-4">
                        <h2>Project Overview</h2>
                        <p>TaskFlow Pro is a multi-platform application designed for professional teams.</p>
                        <ul>
                            <li>Backend: Node.js/Express</li>
                            <li>Database: Cloud MongoDB Atlas</li>
                            <li>Mobile: Native Java Android</li>
                        </ul>
                    </div>
                </div>
            </div>

            <script>
                function showView(id) {
                    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                    document.getElementById(id).classList.add('active');
                }

                function fetchProjects() {
                    fetch('/api/projects').then(r => r.json()).then(data => {
                        const list = document.getElementById('project-list');
                        list.innerHTML = data.map(p => \`
                            <div class="col-md-6 mb-3">
                                <div class="card p-3 border">
                                    <h5>\${p.title}</h5>
                                    <p class="small text-muted">\${p.description}</p>
                                </div>
                            </div>
                        \`).join('') || '<p>No projects found yet.</p>';
                    });
                }
                fetchProjects();
            </script>
        </body>
        </html>
    `);
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(5001, '0.0.0.0', () => console.log('Started on 5001'));
}
