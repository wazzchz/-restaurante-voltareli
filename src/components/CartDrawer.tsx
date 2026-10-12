import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Minus, Plus, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import type { Cart } from '../hooks/useCart';
import { brl } from '../lib/format';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface Props {
  cart: Cart;
  open: boolean;
  onClose: () => void;
}

/**
 * Order drawer: itemized review + one-click WhatsApp checkout.
 * Esc closes, body scroll locks, dark-mode aware.
 */
export default function CartDrawer({ cart, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const checkout = () => {
    try {
      window.open(buildWhatsAppUrl(cart.list), '_blank', 'noopener,noreferrer');
    } catch {
      /* button disabled when empty */
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Seu pedido" className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-canvas-porcelain shadow-2xl dark:bg-canvas-coal"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
              <h2 className="font-display text-xl font-extrabold tracking-tight">
                Seu pedido{' '}
                <span className="font-sans text-sm font-medium text-ink-soft dark:text-zinc-400">
                  ({cart.count} {cart.count === 1 ? 'item' : 'itens'})
                </span>
              </h2>
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label="Fechar pedido"
                className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.list.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <p className="font-display text-lg font-bold">Pedido vazio</p>
                  <p className="max-w-60 text-sm text-ink-soft dark:text-zinc-400">
                    Toque em “Adicionar ao Pedido” nos pratos para montar.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="pressable mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-ink"
                  >
                    Ver cardápio
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {cart.list.map(({ item, qty }) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white p-3.5 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">{item.name}</p>
                        <p className="text-[13px] text-ink-soft dark:text-zinc-400">
                          {brl(item.priceCents)} cada
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => cart.remove(item.id)}
                          aria-label={`Remover um ${item.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full bg-black/5 transition-transform active:scale-90 dark:bg-white/10"
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>
                        <span aria-live="polite" className="w-6 text-center text-sm font-bold tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => cart.add(item)}
                          aria-label={`Adicionar mais um ${item.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white transition-transform active:scale-90"
                        >
                          <Plus size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cart.list.length > 0 && (
              <div className="border-t border-black/5 bg-white px-5 py-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft dark:text-zinc-400">Total</span>
                  <strong aria-live="polite" className="font-display text-2xl font-extrabold tabular-nums">
                    {brl(cart.totalCents)}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={checkout}
                  className="pressable mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#16a34a] px-6 py-4 text-[15px] font-bold text-white shadow-lg hover:brightness-95"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Enviar pedido no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={cart.clear}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-medium text-ink-soft transition-colors hover:text-primary-deep dark:text-zinc-400"
                >
                  <Trash2 size={14} aria-hidden="true" />
                  Limpar pedido
                </button>
                <p className="mt-1 text-center text-[12px] text-ink-faint dark:text-zinc-500">
                  Abre o WhatsApp com o pedido formatado — é só enviar.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
