import { Clock, ExternalLink, MapPin, Navigation, Phone } from 'lucide-react';
import { RESTAURANT } from '../lib/whatsapp';

const MAP_QUERY = encodeURIComponent(
  'Restaurante Voltareli, Rodovia Assis Chateaubriand km 460, Presidente Prudente SP',
);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed&z=15`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;
const WAZE_LINK = `https://waze.com/ul?q=${MAP_QUERY}`;

/**
 * Location & hours — minimalist dark footer with map integration,
 * one-click Google Maps + Waze routing.
 */
export default function LocationFooter() {
  return (
    <footer
      id="localizacao"
      aria-labelledby="loc-title"
      className="scroll-mt-24 bg-canvas-obsidian pb-28 pt-16 text-white sm:pt-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-primary-muted">
          Localização & horário
        </p>
        <h2
          id="loc-title"
          className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-[2.75rem]"
        >
          Na saída para o aeroporto
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* Dark map card */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-canvas-coal shadow-float">
            <div className="relative">
              <iframe
                title="Mapa — Restaurante Voltareli, Rod. Assis Chateaubriand km 460"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="h-72 w-full border-0 opacity-90 grayscale-[35%] contrast-[1.05] sm:h-80"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-none shadow-[inset_0_0_80px_rgba(9,9,11,0.45)]"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <address className="text-sm not-italic leading-relaxed text-white/60">
                <strong className="block text-[15px] text-white">{RESTAURANT.address}</strong>
                Presidente Prudente/SP · CEP 19053-680
              </address>
              <div className="flex gap-2">
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-ink"
                >
                  <Navigation size={15} aria-hidden="true" />
                  Maps
                  <ExternalLink size={12} aria-hidden="true" className="opacity-50" />
                </a>
                <a
                  href={WAZE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:border-primary-muted hover:text-primary-muted"
                >
                  Waze
                  <ExternalLink size={12} aria-hidden="true" className="opacity-50" />
                </a>
              </div>
            </div>
          </div>

          {/* Hours + contact */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Clock size={18} aria-hidden="true" className="text-primary-muted" />
                Horário de funcionamento
              </h3>
              <dl className="mt-4 divide-y divide-white/10 text-[15px]">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="font-medium">Segunda – Sábado</dt>
                  <dd className="rounded-full bg-primary px-3 py-1 font-bold text-white">
                    11:00 – 14:00
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-white/55">Domingo</dt>
                  <dd className="font-semibold text-white/40">Fechado</dd>
                </div>
              </dl>
              <p className="mt-3 text-[13px] text-white/50">
                Almoço no balcão e marmitex para viagem, enquanto durar o estoque.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold">
                <Phone size={18} aria-hidden="true" className="text-primary-muted" />
                Peça direto
              </h3>
              <p className="mt-2 text-[15px] text-white/60">
                Ligue ou chame no WhatsApp para reservar marmitex e porções.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <a
                  href={`https://wa.me/${RESTAURANT.phoneE164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2 rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-bold text-white hover:brightness-95"
                >
                  WhatsApp · {RESTAURANT.phoneDisplay}
                </a>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pressable inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold hover:border-primary-muted hover:text-primary-muted"
                >
                  <MapPin size={15} aria-hidden="true" />
                  Traçar rota
                </a>
              </div>
            </div>

            <p className="px-1 text-[13px] text-white/35">
              © 2026 {RESTAURANT.name} · {RESTAURANT.address} · Prudente/SP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
