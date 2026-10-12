/**
 * POST /api/v1/order-link  { lines: [{ name, qty, priceCents }] } → { url }
 * Validates + sanitizes the cart server-side, returns a wa.me deep link.
 * Same-origin on Vercel; never cached.
 */
import { buildWhatsAppUrl } from '../_lib/whatsapp.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const url = buildWhatsAppUrl(body && body.lines);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(400).json({ error: err instanceof Error ? err.message : 'invalid order' });
  }
}
