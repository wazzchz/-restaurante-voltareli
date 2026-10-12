import type { MenuResponse } from '../types/menu';
import { CATEGORIES, FALLBACK_MENU, FALLBACK_UPDATED_AT } from '../data/menu';

/**
 * API service layer — the ONLY place that touches the network.
 * Contract: GET /api/v1/menu -> MenuResponse
 * Backend sends `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
 */

const ENDPOINT = '/api/v1/menu';
const TIMEOUT_MS = 4000;

async function fetchWithTimeout(url: string): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' },
    });
  } finally {
    clearTimeout(t);
  }
}

function fallback(reason: string): MenuResponse {
  if (import.meta.env.DEV) console.warn(`[menuApi] fallback: ${reason}`);
  return {
    updatedAt: FALLBACK_UPDATED_AT,
    restaurant: { name: 'Restaurante Voltareli', rating: 4.6, hours: 'Seg–Sáb 11:00–14:00' },
    categories: [
      { id: 'pratos', label: 'Pratos Feitos' },
      { id: 'porcoes', label: 'Porções' },
      { id: 'bebidas', label: 'Bebidas' },
      { id: 'sobremesas', label: 'Sobremesas' },
    ],
    items: FALLBACK_MENU,
  };
}

export async function getMenu(): Promise<MenuResponse> {
  try {
    const res = await fetchWithTimeout(ENDPOINT);
    if (!res.ok) return fallback(`HTTP ${res.status}`);
    const json = (await res.json()) as Partial<MenuResponse>;
    if (!Array.isArray(json.items)) return fallback('malformed payload');
    return {
      updatedAt: typeof json.updatedAt === 'string' ? json.updatedAt : FALLBACK_UPDATED_AT,
      restaurant: {
        name: 'Restaurante Voltareli',
        rating: 4.6,
        hours: 'Seg–Sáb 11:00–14:00',
      },
      categories:
        Array.isArray(json.categories) && json.categories.length > 0
          ? (json.categories as MenuResponse['categories'])
          : CATEGORIES,
      items: json.items as MenuResponse['items'],
    };
  } catch (err) {
    return fallback(err instanceof Error ? err.message : 'network error');
  }
}
