import { motion } from 'framer-motion';
import { Beef, Flame, HandPlatter } from 'lucide-react';

const PILLARS = [
  {
    icon: Flame,
    title: 'Feito na hora',
    text: 'Cozinha ligada às 11h. Arroz soltinho, feijão temperado e grelhados do fogão direto para o prato.',
  },
  {
    icon: HandPlatter,
    title: 'Parada de estrada',
    text: 'No km 460, ao lado do aeroporto: farto, rápido e com preço justo para quem cruza a Chateaubriand.',
  },
  {
    icon: Beef,
    title: 'Tradição repetida',
    text: 'Virado de segunda, feijoada de quarta e sábado. Receitas que voltam porque funcionam.',
  },
];

/** Editorial story band — obsidian in both themes for rhythm. */
export default function About() {
  return (
    <section
      id="sobre"
      aria-labelledby="sobre-title"
      className="scroll-mt-24 bg-canvas-obsidian py-16 text-white sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary-muted">
          Sobre nós
        </p>
        <h2
          id="sobre-title"
          className="mt-2 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-[2.75rem] sm:leading-[1.02]"
        >
          O ponto de parada de quem conhece a estrada.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-white/65">
          Caminhoneiro, família e viajante dividem o mesmo balcão no Voltareli.
          Sem frescura: comida caseira, atendimento rápido e suco feito na hora.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md transition-colors hover:border-primary-bright/40"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary-bright to-primary shadow-pop">
                <p.icon size={22} aria-hidden="true" className="text-white" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/60">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
