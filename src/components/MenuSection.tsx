import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SearchX } from 'lucide-react';
import type { Cart } from '../hooks/useCart';
import type { CategoryId, MenuItem } from '../types/menu';
import { useMenu } from '../hooks/useMenu';
import { cn } from '../lib/format';
import MenuCard from './MenuCard';

type Filter = CategoryId | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tudo' },
  { id: 'principais', label: 'Pratos Principais' },
  { id: 'especiais', label: 'Especiais do Dia' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'sobremesas', label: 'Sobremesas' },
];

interface Props {
  cart: Cart;
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Editorial menu: tabbed selector with gliding active pill (layoutId),
 * diacritic-insensitive search, photo grid, aria-live result counts.
 */
export default function MenuSection({ cart }: Props) {
  const { data, isLoading } = useMenu();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const items: MenuItem[] = data?.items ?? [];
  const qtyOf = (id: string) => cart.list.find((l) => l.item.id === id)?.qty ?? 0;

  const visible = useMemo(() => {
    const q = norm(query.trim());
    return items.filter((it) => {
      if (filter !== 'all' && it.category !== filter) return false;
      if (!q) return true;
      return norm(`${it.name} ${it.description} ${it.tags.join(' ')}`).includes(q);
    });
  }, [items, filter, query]);

  if (isLoading && items.length === 0) {
    return (
      <section id="cardapio" aria-label="Cardápio — carregando" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="cardapio" aria-labelledby="cardapio-title" className="scroll-mt-24 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary-deep dark:text-primary-muted">
          Cardápio digital
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="cardapio-title"
            className="max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-[2.75rem] sm:leading-[1.02]"
          >
            O que sai da cozinha hoje
          </h2>
          <p className="text-sm font-medium text-ink-soft dark:text-zinc-400">
            Seg–Sáb · 11:00–14:00 · enquanto durar
          </p>
        </div>

        {/* Tab rail */}
        <div className="sticky top-[4.5rem] z-20 -mx-4 mt-8 bg-canvas-porcelain/85 px-4 py-3 backdrop-blur-xl dark:bg-canvas-obsidian/85 sm:-mx-6 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Categorias do cardápio"
              className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1"
            >
              {FILTERS.map((f) => {
                const selected = filter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'relative shrink-0 rounded-full px-4 py-2.5 text-sm font-bold transition-colors',
                      selected
                        ? 'text-white'
                        : 'text-ink-soft hover:text-ink dark:text-zinc-400 dark:hover:text-white',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="menu-tab-pill"
                        transition={{ type: 'spring', damping: 30, stiffness: 420 }}
                        className="absolute inset-0 rounded-full bg-primary shadow-pop"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{f.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative lg:w-72">
              <Search
                size={17}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
              />
              <label htmlFor="menu-search" className="sr-only">
                Buscar no cardápio
              </label>
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar — ex. feijoada, suco…"
                autoComplete="off"
                className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-primary dark:border-white/15 dark:bg-white/5 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {visible.length} itens encontrados
        </p>

        {visible.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/15 py-14 text-center dark:border-white/15">
            <SearchX size={28} aria-hidden="true" className="text-ink-faint" />
            <p className="font-bold">Nada por aqui com “{query}”.</p>
            <p className="text-sm text-ink-soft dark:text-zinc-400">
              Tente “feijoada”, “suco” ou limpe a busca.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
              className="pressable mt-1 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-ink"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  qty={qtyOf(item.id)}
                  onAdd={cart.add}
                  onRemove={cart.remove}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
