import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import type { MenuItem } from '../types/menu';
import { brl, clamp, cn } from '../lib/format';

interface Props {
  item: MenuItem;
  qty: number;
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}

/**
 * Dish card: photography top (zoom-on-hover), price tag bold,
 * "Adicionar ao Pedido" with haptic press. Sold-out = disabled.
 */
export default function MenuCard({ item, qty, onAdd, onRemove }: Props) {
  const soldOut = !item.available;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-labelledby={`item-${item.id}`}
      aria-disabled={soldOut}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-shadow duration-300 hover:shadow-card dark:border-white/10 dark:bg-canvas-coal',
        soldOut && 'opacity-70',
      )}
    >
      {/* Photo */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-soft via-canvas-sand to-canvas-sand dark:from-white/10 dark:via-white/5 dark:to-transparent">
        {item.image && !soldOut ? (
          <img
            src={item.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {item.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/30 bg-black/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-md"
            >
              {t}
            </span>
          ))}
          {soldOut && (
            <span className="rounded-full bg-canvas-obsidian px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Esgotado
            </span>
          )}
        </div>
        <span
          aria-label={`Preço: ${brl(item.priceCents)}`}
          className="absolute bottom-3 right-3 rounded-full bg-primary px-3.5 py-1.5 font-display text-sm font-extrabold text-white shadow-pop"
        >
          {brl(item.priceCents)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          id={`item-${item.id}`}
          className="font-display text-[17px] font-bold leading-snug tracking-tight"
        >
          {item.name}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft dark:text-zinc-400">
          {clamp(item.description)}
        </p>
        {item.serves && (
          <p className="mt-2 text-[12px] font-medium uppercase tracking-wide text-ink-faint dark:text-zinc-500">
            {item.serves}
          </p>
        )}

        <div className="mt-4">
          {qty === 0 ? (
            <button
              type="button"
              disabled={soldOut}
              onClick={() => onAdd(item)}
              aria-label={soldOut ? `${item.name} esgotado` : `Adicionar ${item.name} ao pedido`}
              className="pressable inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-bold text-white hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-ink dark:hover:bg-primary dark:hover:text-white"
            >
              <Plus size={16} aria-hidden="true" />
              {soldOut ? 'Esgotado hoje' : 'Adicionar ao Pedido'}
            </button>
          ) : (
            <div
              role="group"
              aria-label={`Quantidade de ${item.name}: ${qty}`}
              className="flex items-center justify-between rounded-full bg-ink px-1.5 py-1.5 text-white dark:bg-white dark:text-ink"
            >
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={`Remover um ${item.name}`}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15 dark:hover:bg-black/10"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span aria-hidden="true" className="text-sm font-bold tabular-nums">
                {qty} no pedido
              </span>
              <button
                type="button"
                onClick={() => onAdd(item)}
                aria-label={`Adicionar mais um ${item.name}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white transition-transform hover:bg-primary-deep active:scale-90"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
