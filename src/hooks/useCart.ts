import { useCallback, useMemo, useState } from 'react';
import type { CartLine, MenuItem } from '../types/menu';

/**
 * Minimal cart state — Map<itemId, CartLine> for O(1) updates.
 * Persisted to localStorage so a refresh doesn't lose the order.
 */

const KEY = 'voltareli-cart-v1';

function restore(): Map<string, CartLine> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as CartLine[];
    return new Map(parsed.map((l) => [l.item.id, l]));
  } catch {
    return new Map();
  }
}

export function useCart() {
  const [lines, setLines] = useState<Map<string, CartLine>>(restore);

  const persist = (next: Map<string, CartLine>) => {
    setLines(new Map(next));
    try {
      localStorage.setItem(KEY, JSON.stringify([...next.values()]));
    } catch {
      /* private mode — ignore */
    }
  };

  const add = useCallback(
    (item: MenuItem) => {
      const next = new Map(lines);
      const cur = next.get(item.id);
      next.set(item.id, { item, qty: (cur?.qty ?? 0) + 1 });
      persist(next);
    },
    [lines],
  );

  const remove = useCallback(
    (id: string) => {
      const next = new Map(lines);
      const cur = next.get(id);
      if (!cur) return;
      if (cur.qty <= 1) next.delete(id);
      else next.set(id, { ...cur, qty: cur.qty - 1 });
      persist(next);
    },
    [lines],
  );

  const clear = useCallback(() => {
    persist(new Map());
  }, []);

  const list = useMemo(() => [...lines.values()], [lines]);
  const count = useMemo(() => list.reduce((s, l) => s + l.qty, 0), [list]);
  const totalCents = useMemo(
    () => list.reduce((s, l) => s + l.item.priceCents * l.qty, 0),
    [list],
  );

  return { list, count, totalCents, add, remove, clear };
}

export type Cart = ReturnType<typeof useCart>;
