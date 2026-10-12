/**
 * GET /api/v1/menu[?category=&available=&q=]
 * Vercel Serverless Function — same contract as server/src/routes/menu.js.
 * Public catalog: open CORS, edge-cacheable.
 */
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MENU = require('../_data/menu.json');

const VALID = new Set(['principais', 'especiais', 'bebidas', 'sobremesas']);

const norm = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'method not allowed' });

  const q = req.query || {};
  let items = MENU.items;

  if (typeof q.category === 'string' && VALID.has(q.category)) {
    items = items.filter((i) => i.category === q.category);
  }
  if (q.available === 'true') items = items.filter((i) => i.available === true);
  if (q.available === 'false') items = items.filter((i) => i.available === false);
  if (typeof q.q === 'string' && q.q.trim()) {
    const needle = norm(q.q.trim().slice(0, 60));
    items = items.filter((i) =>
      norm(`${i.name} ${i.description} ${(i.tags || []).join(' ')}`).includes(needle),
    );
  }

  res.setHeader(
    'Cache-Control',
    'public, max-age=60, s-maxage=60, stale-while-revalidate=300',
  );
  return res.status(200).json({
    updatedAt: MENU.updatedAt,
    restaurant: MENU.restaurant,
    categories: MENU.categories,
    items,
  });
}
