import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, ShoppingBag, Sun } from 'lucide-react';
import { cn } from '../lib/format';
import { brl } from '../lib/format';
import { getOpenStatus } from '../lib/hours';
import type { Theme } from '../hooks/useTheme';

const LINKS = [
  { id: 'cardapio', label: 'Cardápio', href: '#cardapio' },
  { id: 'sobre', label: 'Sobre Nós', href: '#sobre' },
  { id: 'localizacao', label: 'Localização', href: '#localizacao' },
] as const;

interface Props {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

/**
 * Floating glassmorphic pill header.
 * - Active-section pill glides via Framer Motion `layoutId`.
 * - Open/closed badge with pulsating dot, re-evaluated every minute.
 */
export default function Header({ cartCount, cartTotal, onOpenCart, theme, onToggleTheme }: Props) {
  const [active, setActive] = useState<string>('topo');
  const [status, setStatus] = useState(() => getOpenStatus());

  useEffect(() => {
    const t = setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const sections = ['topo', 'cardapio', 'sobre', 'localizacao']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-6">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Pular para o conteúdo
      </a>
      <nav
        aria-label="Navegação principal"
        className="glass-pill mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 rounded-full border border-black/5 py-1.5 pl-2 pr-1.5 shadow-float dark:border-white/10"
      >
        {/* Brand */}
        <a
          href="#topo"
          aria-label="Restaurante Voltareli — início"
          className="pressable group flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2"
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary-bright to-primary font-display text-lg font-extrabold text-white shadow-pop transition-transform group-hover:scale-105"
          >
            V
          </span>
          <span className="hidden leading-tight min-[420px]:block">
            <span className="block font-display text-[15px] font-bold tracking-tight">
              Voltareli
            </span>
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium"
              role="status"
              aria-label={status.label}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                {status.open && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-open opacity-60" />
                )}
                <span
                  className={cn(
                    'relative inline-flex h-2 w-2 rounded-full',
                    status.open ? 'bg-open' : 'bg-zinc-400',
                  )}
                />
              </span>
              <span className={cn(status.open ? 'text-open' : 'text-ink-faint dark:text-zinc-400')}>
                {status.open ? 'Aberto agora' : 'Fechado'}
              </span>
            </span>
          </span>
        </a>

        {/* Links with gliding active pill */}
        <ul className="hidden items-center gap-0.5 rounded-full p-0.5 md:flex">
          {LINKS.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id} className="relative">
                <a
                  href={l.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative z-10 block rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-ink-soft hover:text-ink dark:text-zinc-400 dark:hover:text-white',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                      className="absolute inset-0 -z-10 rounded-full bg-ink dark:bg-white"
                      aria-hidden="true"
                    />
                  )}
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            aria-pressed={theme === 'dark'}
            className="pressable grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            {theme === 'dark' ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={
              cartCount > 0
                ? `Abrir pedido, ${cartCount} itens, total ${brl(cartTotal)}`
                : 'Abrir pedido, nenhum item'
            }
            className="pressable relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-pop hover:bg-primary-deep sm:px-5"
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Pedir</span>
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-canvas-porcelain bg-ink px-1 text-[11px] font-bold text-white dark:border-canvas-obsidian"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
