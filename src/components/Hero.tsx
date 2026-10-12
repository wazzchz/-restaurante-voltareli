import { motion, type Variants } from 'framer-motion';
import { ArrowDown, MapPin, Star } from 'lucide-react';
import { getOpenStatus } from '../lib/hours';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.09 * i, duration: 0.6, ease: 'easeOut' },
  }),
};

/** Staggered avatar initials — CSS-only social proof, zero image weight. */
const AVATARS = [
  { initials: 'MC', bg: 'bg-amber-600' },
  { initials: 'JR', bg: 'bg-emerald-700' },
  { initials: 'AS', bg: 'bg-sky-700' },
  { initials: 'LP', bg: 'bg-rose-700' },
];

const HERO_IMG =
  'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop';

/**
 * Editorial hero: value prop left, high-impact image right with
 * zoom-on-hover + warm amber ambient overlay. 4.6★ badge with avatars.
 */
export default function Hero() {
  const status = getOpenStatus();

  return (
    <section
      id="topo"
      aria-labelledby="hero-title"
      className="amber-glow relative overflow-hidden pt-28 sm:pt-32"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:pb-20">
        <div>
          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-black/5 bg-white/80 py-2 pl-2 pr-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex -space-x-2" aria-hidden="true">
              {AVATARS.map((a, i) => (
                <motion.span
                  key={a.initials}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring', damping: 14 }}
                  className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white dark:border-canvas-obsidian ${a.bg}`}
                >
                  {a.initials}
                </motion.span>
              ))}
            </div>
            <p className="text-[13px] font-medium text-ink-soft dark:text-zinc-300">
              <strong className="inline-flex items-center gap-1 font-bold text-ink dark:text-white">
                <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
                4.6
              </strong>{' '}
              <span role="img" aria-label="4.6 de 5 no Google">
                no Google
              </span>{' '}
              · quem passa, volta
            </p>
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="display-clamp mt-6 font-display font-extrabold tracking-tight"
          >
            Tradição, sabor e agilidade{' '}
            <span className="bg-gradient-to-r from-primary-bright to-primary bg-clip-text text-transparent">
              em Presidente Prudente.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft dark:text-zinc-400"
          >
            Comida caseira na Rod. Assis Chateaubriand, km 460 — pratos feitos,
            feijoada de quarta e sábado, suco na hora. {status.label}.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#cardapio"
              className="pressable inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-[15px] font-bold text-white shadow-pop hover:bg-primary-deep"
            >
              Ver Cardápio do Dia
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <a
              href="#localizacao"
              className="pressable inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-7 py-4 text-[15px] font-bold backdrop-blur-md hover:border-primary hover:text-primary-deep dark:border-white/15 dark:bg-white/5 dark:hover:text-primary-muted"
            >
              <MapPin size={17} aria-hidden="true" />
              Como chegar
            </a>
          </motion.div>
        </div>

        {/* Hero image with zoom-on-hover + amber overlay */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="group relative"
          aria-label="Feijoada completa da casa"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-bright/25 via-transparent to-primary/20 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] shadow-float">
            <img
              src={HERO_IMG}
              alt="Feijoada completa servida no Restaurante Voltareli"
              loading="eager"
              className="aspect-[4/3.4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#09090B]/55 via-transparent to-primary-bright/10"
            />
            <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/20 bg-black/35 px-5 py-3.5 text-white backdrop-blur-md">
              <span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Especial · qua & sáb
                </span>
                <span className="block font-display text-lg font-bold">
                  Feijoada completa
                </span>
              </span>
              <span className="rounded-full bg-primary px-3.5 py-1.5 text-sm font-extrabold shadow-pop">
                R$ 32,90
              </span>
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
