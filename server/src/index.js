'use strict';

/**
 * Voltareli Menu API — Express, zero-framework extras.
 *
 *   GET /api/v1/menu[?category=&available=&q=]   public, edge-cacheable
 *   GET /api/v1/health                            uptime probe
 *   POST /api/v1/order-link  { lines:[{name,qty,priceCents}] } -> { url }
 *
 * Env:
 *   PORT=3001  FRONTEND_ORIGIN=http://localhost:5173  WHATSAPP_E164=5518...
 */
const express = require('express');
const cors = require('cors');
const securityHeaders = require('./middleware/security');
const { handleGetMenu } = require('./routes/menu');
const { buildWhatsAppUrl } = require('./lib/whatsappBuilder');

const app = express();
const PORT = Number(process.env.PORT || 3001);

// ——— Strict CORS: only the site origin (+ local dev) ———
const allowlist = new Set(
  (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl / health checks
      if (allowlist.has(origin)) return cb(null, true);
      return cb(new Error('CORS: origin not allowed'));
    },
    methods: ['GET', 'POST'],
    maxAge: 86400,
  }),
);
app.use(express.json({ limit: '16kb' })); // small body cap = cheap DoS guard
app.use(securityHeaders);

app.get('/api/v1/health', (_req, res) => res.json({ ok: true, at: new Date().toISOString() }));
app.get('/api/v1/menu', handleGetMenu);

app.post('/api/v1/order-link', (req, res) => {
  try {
    const lines = req.body && req.body.lines;
    const url = buildWhatsAppUrl(lines);
    res.setHeader('Cache-Control', 'no-store');
    res.json({ url });
  } catch (err) {
    res.status(400).json({ error: err.message || 'invalid order' });
  }
});

// 404 + error shape (never leak stacks)
app.use((_req, res) => res.status(404).json({ error: 'not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => res.status(403).json({ error: err.message || 'forbidden' }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`[voltareli-api] :${PORT}  CORS -> ${[...allowlist].join(', ')}`));
}

module.exports = app;
