/** GET /api/v1/health — uptime probe for the Vercel deployment. */
export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ ok: true, target: 'vercel', at: new Date().toISOString() });
}
