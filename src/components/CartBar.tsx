import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { brl } from '../lib/format';

/**
 * Floating cart bar: appears when items exist, sums the order,
 * opens the drawer for review → WhatsApp checkout.
 * Bottom-centered pill, safe-area aware, hidden while drawer open.
 */
export default function CartBar({
  count,
  totalCents,
  hidden,
  onOpen,
}: {
  count: number;
  totalCents: number;
  hidden: boolean;
  onOpen: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && !hidden && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Ver pedido: ${count} itens, total ${brl(totalCents)}`}
            className="pressable flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-white/10 bg-ink py-2 pl-5 pr-2 text-white shadow-float dark:bg-white dark:text-ink"
          >
            <span className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white">
                <ShoppingBag size={17} aria-hidden="true" />
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[13px] font-medium opacity-70">
                  {count} {count === 1 ? 'item' : 'itens'}
                </span>
                <span className="block font-display text-lg font-extrabold tabular-nums">
                  {brl(totalCents)}
                </span>
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
              Ver pedido
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
