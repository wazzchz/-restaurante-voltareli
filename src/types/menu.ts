/** Shared domain types — mirrors GET /api/v1/menu response. */

export type CategoryId = 'principais' | 'especiais' | 'bebidas' | 'sobremesas';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in BRL cents to avoid float errors (e.g. 2490 = R$ 24,90). */
  priceCents: number;
  category: CategoryId;
  tags: string[];
  available: boolean;
  /** Set for "Especial do Dia" items. 0=Sun … 6=Sat */
  weekdaySpecial?: number[];
  /** Optimised food photography URL (lazy-loaded, decorative supplement). */
  image?: string;
  serves?: string;
}

export interface MenuResponse {
  updatedAt: string;
  restaurant: { name: string; rating: number; hours: string };
  categories: Category[];
  items: MenuItem[];
}

export interface CartLine {
  item: MenuItem;
  qty: number;
}
