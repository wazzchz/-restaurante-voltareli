# Restaurante Voltareli — Landing + Cardápio Digital

Presidente Prudente/SP · Rod. Assis Chateaubriand, km 460 (Aeroporto) · Seg–Sáb 11:00–14:00 · 4.6★ Google

## 1. Brand identity & color system (v2 — amber editorial)

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `primary` / accent | `#C2410C` | CTAs, tab pills ativos, price tags, focus rings — **único acento saturado** | `primary-deep #9A3412` p/ texto no claro **7.5:1 (AAA)** |
| `primary-bright` | `#D97706` | Gradientes (monograma, headlines) | — |
| `primary-soft` | `#FEF3E8` | Tints hover no claro | — |
| `primary-muted` | `#FB923C` | Texto de destaque sobre obsidian | — |
| `canvas-porcelain` | `#FAFAFA` | Base clara | — |
| `canvas-obsidian` | `#09090B` | Dark mode + faixas Sobre/Localização | — |
| `gold` | `#C9A227` | **Somente** estrela 4.6★ | — |

Tipografia: `Plus Jakarta Sans` 700/800 `tracking-tight` nos(headers);
`Inter` `leading-relaxed` no corpo. Dark/light via classe `dark` + `useTheme`
(persistido, sem FOUC). Header: pill flutuante `rounded-full` glass com
pílula ativa deslizante (`layoutId`) + badge Aberto/Fechado (Seg–Sáb 11–14h,
ponto verde pulsante). Hero: avatares animados + foto com zoom-on-hover e
overlay âmbar. Cards de prato com fotografia lazy + placeholder gradiente.

## 2. Stack & estrutura

**React 18 + Vite 5 + Tailwind 3 + Lucide + Framer Motion** (5 deps de runtime —
bundle alvo <100KB gzipped). Sem React Query: `useMenu` faz SWR manual.

```
src/
  App.tsx                      composição + landmarks
  main.tsx / index.css         tokens, focus-visible AAA, reduced-motion
  types/menu.ts                contrato espelho de GET /api/v1/menu
  data/menu.ts                 fallback estático (first paint <500ms, offline)
  services/menuApi.ts          ÚNICO lugar com fetch (timeout 4s + fallback)
  hooks/useMenu.ts             stale-while-revalidate sem dependências
  hooks/useCart.ts             carrinho + persistência localStorage
  hooks/useTheme.ts            dark/light (classe + persistência)
  lib/hours.ts                 status Aberto/Fechado (puro, testável)
  lib/whatsapp.ts              builder wa.me (sanitize + encode) / RESTAURANT
  lib/format.ts                cn(), brl(), clamp()
  components/
    Header.tsx                 pill flutuante glass + pílula ativa + badge + tema
    Hero.tsx                   value prop + avatares 4.6★ + foto zoom/overlay
    MenuSection.tsx            tabs (layoutId) + busca + aria-live
    MenuCard.tsx               foto + price tag + Adicionar ao Pedido
    CartBar.tsx                barra flutuante (soma → drawer → WhatsApp)
    CartDrawer.tsx             dialog, Esc fecha, checkout WhatsApp
    About.tsx                  faixa obsidian editorial
    LocationFooter.tsx         mapa dark + Maps/Waze + horários
server/ (Express, 2 deps: express+cors)
  src/index.js                 CORS estrito, body 16kb, headers, rotas
  src/routes/menu.js           GET /api/v1/menu (?category&available&q)
  src/lib/whatsappBuilder.js   validação + sanitize (twin do frontend)
  src/middleware/security.js   nosniff, DENY, referrer-policy
  src/data/menu.json           fonte de verdade do cardápio
```

## 3. Rodando

```powershell
# frontend (http://localhost:5173)
Set-Location "restaurante-voltareli"; npm install; npm run dev

# API (http://localhost:3001/api/v1/menu) — outro terminal
Set-Location "restaurante-voltareli\server"; npm install; npm start
# ou com origem custom: $env:FRONTEND_ORIGIN="https://seu-dominio.com"; npm start
```

Vite faz proxy de `/api/*` → `:3001` no dev; em produção sirva o `dist/` pelo
mesmo domínio da API (ou defina `FRONTEND_ORIGIN`).

## 4. API

```
GET /api/v1/menu?category=pratos&available=true&q=feijoada
→ { updatedAt, restaurant:{name,rating,hours}, categories[], items[] }
   Cache-Control: public, max-age=60, stale-while-revalidate=300

GET /api/v1/health → { ok:true }

POST /api/v1/order-link  { lines:[{name,qty,priceCents}] } → { url: wa.me… }
```

Teste rápido: `curl "http://localhost:3001/api/v1/menu?available=true"`.

## 6. Deploy na Vercel (frontend + API, zero config)

O frontend chama a API por URL relativa (`/api/v1/menu`), então no mesmo
domínio tudo funciona sem proxy. A pasta `api/` contém Serverless Functions
que a Vercel publica automaticamente (a pasta `server/` Express é só a
alternativa para VPS/Render — a Vercel a ignora):

```
api/v1/menu.js        GET /api/v1/menu (mesmo contrato do Express)
api/v1/health.js      GET /api/v1/health
api/v1/order-link.js  POST /api/v1/order-link
api/_lib, api/_data   helpers/dados (prefixo `_` = sem rota pública)
```

Passo a passo:

1. **Suba o código para o GitHub** (a `dist/` já está no `.gitignore` —
   a Vercel gera ela sozinha, não precisa criar nem enviar):
   ```powershell
   Set-Location "restaurante-voltareli"
   git init; git add -A; git commit -m "feat: Voltareli landing + cardápio + api"
   gh repo create restaurante-voltareli --public --source=. --push
   ```
2. Em **vercel.com → Add New → Project → Import** o repositório. O preset
   **Vite** é detectado sozinho: Build `npm run build`, Output `dist`.
   Não precisa de `vercel.json`.
3. Em **Settings → Environment Variables**, adicione (antes do deploy):
   - `VITE_WHATSAPP_E164=5518XXXXXXXXX` — número real (vai embutido no
     build do frontend; trocar exige redeploy).
   - `WHATSAPP_E164=5518XXXXXXXXX` — mesmo número para `order-link`.
4. **Deploy** e teste: `https://seu-projeto.vercel.app/api/v1/menu` e
   `/api/v1/health` devem retornar JSON.

Sanity check local opcional antes do passo 1: `npm run build` deve gerar
`dist/` sem erros de `tsc`.

## 5. A11y / performance / responsivo

- Landmarks + heading order + skip-link; `aria-pressed` nos filtros,
  `aria-live` nos resultados e no total; `role=dialog aria-modal` no carrinho.
- `:focus-visible` sempre em `primary-accent`; `prefers-reduced-motion` desliga animação.
- Mobile-first 360px → 4K (`max-w-6xl`, grid 1→3 col); skeleton sem CLS;
  `loading=lazy` no Maps; imagens de prato são opcionais/progressivas.
