/**
 * Shared WhatsApp order builder for serverless functions.
 * Twin of src/lib/whatsapp.ts — keep in sync. ESM (root package.json
 * has "type": "module", which Vercel respects for api/ functions).
 */

const PHONE = process.env.WHATSAPP_E164 || '5518999990000';

export function sanitizePhone(raw) {
  return String(raw || '').replace(/\D/g, '');
}

function sanitizeName(s) {
  return String(s || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/https?:\S+/gi, '[link]')
    .trim()
    .slice(0, 80);
}

function brl(cents) {
  return `R$ ${(Number(cents) / 100).toFixed(2).replace('.', ',')}`;
}

export function buildOrderMessage(lines) {
  const items = lines
    .map((l, i) => `${i + 1}. ${l.qty}x ${sanitizeName(l.name)} — ${brl(l.priceCents * l.qty)}`)
    .join('\n');
  const total = lines.reduce((s, l) => s + l.priceCents * l.qty, 0);
  return [
    'Olá, Restaurante Voltareli! Quero fazer um pedido:',
    '',
    items,
    '',
    `Total: ${brl(total)}`,
    '',
    'Nome: ',
    'Retirada ou entrega? ',
  ].join('\n');
}

export function buildWhatsAppUrl(lines, phone = PHONE) {
  const digits = sanitizePhone(phone);
  if (!/^\d{10,15}$/.test(digits)) throw new Error('Invalid WhatsApp phone');
  if (!Array.isArray(lines) || lines.length === 0) throw new Error('Empty order');
  if (lines.length > 50) throw new Error('Order too large');
  for (const l of lines) {
    if (!l || typeof l.name !== 'string' || !Number.isInteger(l.qty) || !Number.isInteger(l.priceCents)) {
      throw new Error('Invalid line item');
    }
    if (l.qty < 1 || l.qty > 20 || l.priceCents < 0 || l.priceCents > 100000) {
      throw new Error('Line item out of range');
    }
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildOrderMessage(lines))}`;
}
