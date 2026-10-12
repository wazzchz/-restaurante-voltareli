import type { CartLine } from '../types/menu';
import { brl } from './format';

/**
 * Serializes cart lines into a clean, URL-encoded WhatsApp order string.
 * Mirrors server/src/lib/whatsappBuilder.js — keep both in sync.
 *
 * Output: https://wa.me/<digits>?text=<encodeURIComponent(message)>
 */

/**
 * WhatsApp number resolution: `VITE_WHATSAPP_E164` (Vercel env, embedded at
 * build time) wins; falls back to the placeholder. Invalid values fall back
 * safely instead of generating a broken wa.me link.
 */
function resolvePhone(): string {
  const fromEnv = ((import.meta.env.VITE_WHATSAPP_E164 as string | undefined) ?? '').replace(
    /\D/g,
    '',
  );
  return /^\d{10,15}$/.test(fromEnv) ? fromEnv : '5518999990000';
}

const PHONE = resolvePhone();

export const RESTAURANT = {
  name: 'Restaurante Voltareli',
  /** Public WhatsApp — set VITE_WHATSAPP_E164 or replace before launch. */
  phoneDisplay: '+55 (18) 99999-0000',
  phoneE164: PHONE,
  address: 'Rod. Assis Chateaubriand, km 460 — Aeroporto, Presidente Prudente/SP',
  hours: 'Seg–Sáb · 11:00–14:00',
};

/** Strip everything but digits (wa.me requires plain international digits). */
export function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function buildOrderMessage(lines: CartLine[]): string {
  const items = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.qty}x ${l.item.name} — ${brl(l.item.priceCents * l.qty)}`,
    )
    .join('\n');
  const totalCents = lines.reduce((s, l) => s + l.item.priceCents * l.qty, 0);
  return [
    `Olá, ${RESTAURANT.name}! Quero fazer um pedido:`,
    ``,
    items,
    ``,
    `Total: ${brl(totalCents)}`,
    ``,
    `Nome: `,
    `Retirada ou entrega? `,
  ].join('\n');
}

export function buildWhatsAppUrl(lines: CartLine[], phone = RESTAURANT.phoneE164): string {
  const digits = sanitizePhone(phone);
  if (!/^\d{10,15}$/.test(digits)) throw new Error('Invalid WhatsApp phone');
  if (lines.length === 0) throw new Error('Empty order');
  return `https://wa.me/${digits}?text=${encodeURIComponent(buildOrderMessage(lines))}`;
}
