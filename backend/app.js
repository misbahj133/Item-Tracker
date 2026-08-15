const express = require('express');
const cors = require('cors');

// ---------------------------------------------------------------------------
// In-memory "database" - reset per process. Good enough for a demo app.
// ---------------------------------------------------------------------------
const MOCK_USER = { username: 'admin', password: 'password123' };

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Fresh state per app instance so tests don't leak data into each other.
  let items = [];
  let nextId = 1;
  const validTokens = new Set();

  function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token || !validTokens.has(token)) {
      return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
    }
    next();
  }

  // -------------------------------------------------------------------------
  // Auth
  // -------------------------------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' });
    }

    if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = `mock-token-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    validTokens.add(token);

    return res.status(200).json({ token, user: { username } });
  });

  // -------------------------------------------------------------------------
  // Items
  // -------------------------------------------------------------------------
  app.get('/api/items', authenticate, (req, res) => {
    return res.status(200).json({ items });
  });

  app.post('/api/items', authenticate, (req, res) => {
    const { name } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    const item = { id: nextId++, name: name.trim(), createdAt: new Date().toISOString() };
    items.push(item);

    return res.status(201).json({ item });
  });

  app.delete('/api/items/:id', authenticate, (req, res) => {
    const id = Number(req.params.id);
    const before = items.length;
    items = items.filter((i) => i.id !== id);

    if (items.length === before) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json({ success: true });
  });

  // Health check - handy for the e2e test's webServer readiness probe.
  app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

  return app;
}

module.exports = { createApp, MOCK_USER };
