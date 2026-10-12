'use strict';

const fs = require('fs');
const path = require('path');
const MENU = require('../data/menu.json');

const VALID_CATEGORIES = new Set(['principais', 'especiais', 'bebidas', 'sobremesas']);

/**
 * GET /api/v1/menu
 * Query: ?category=pratos&available=true&q=feijoada
 * - All query params are allow-listed + length-capped (input sanitization).
 * - Edge-friendly: `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
 */
function sanitizeQuery(q) {
  const out = {};
  if (typeof q.category === 'string' && VALID_CATEGORIES.has(q.category)) out.category = q.category;
  if (q.available === 'true') out.available = true;
  if (q.available === 'false') out.available = false;
  if (typeof q.q === 'string' && q.q.trim()) {
    out.q = q.q.trim().slice(0, 60).toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return out;
}

function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function handleGetMenu(req, res) {
  const f = sanitizeQuery(req.query);
  let items = MENU.items;
  if (f.category) items = items.filter((i) => i.category === f.category);
  if (typeof f.available === 'boolean') items = items.filter((i) => i.available === f.available);
  if (f.q) items = items.filter((i) => norm(`${i.name} ${i.description} ${(i.tags || []).join(' ')}`).includes(f.q));

  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json({
    updatedAt: MENU.updatedAt,
    restaurant: MENU.restaurant,
    categories: MENU.categories,
    items,
  });
}

module.exports = { handleGetMenu };
