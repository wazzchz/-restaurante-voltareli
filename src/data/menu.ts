import type { Category, MenuItem } from '../types/menu';

/**
 * Static fallback menu — bundled for instant first paint (<500ms TTFB
 * even on low-3G) and offline resilience. The live API overwrites it
 * via stale-while-revalidate in `useMenu`.
 *
 * Taxonomy (editorial): Pratos Principais · Especiais do Dia · Bebidas · Sobremesas.
 * Photography: Unsplash CDN, w=800 lazy-loaded; cards render a warm
 * gradient placeholder underneath so layout never breaks offline.
 */
export const FALLBACK_UPDATED_AT = '2026-10-12T11:00:00-03:00';

export const CATEGORIES: Category[] = [
  { id: 'principais', label: 'Pratos Principais' },
  { id: 'especiais', label: 'Especiais do Dia' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'sobremesas', label: 'Sobremesas' },
];

const U = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;

export const FALLBACK_MENU: MenuItem[] = [
  // ——— Pratos Principais ———
  {
    id: 'pf-frango',
    name: 'Frango Grelhado da Casa',
    description: 'Arroz branco soltinho, feijão carioca, frango grelhado, farofa, vinagrete e salada fresca.',
    priceCents: 2490,
    category: 'principais',
    tags: ['mais pedido'],
    available: true,
    serves: 'Serve 1 pessoa',
    image: U('photo-1598103442097-8b74394b95c6'),
  },
  {
    id: 'pf-bife',
    name: 'Bife Acebolado com Fritas',
    description: 'Arroz, feijão, bife macio acebolado, batata frita crocante e salada do dia.',
    priceCents: 2890,
    category: 'principais',
    tags: ['clássico'],
    available: true,
    serves: 'Serve 1 pessoa',
    image: U('photo-1600891964092-4316c288032e'),
  },
  {
    id: 'pf-marmitex',
    name: 'Marmitex Executiva',
    description: 'A mesma comida do balcão, para viagem. Proteína do dia + 4 acompanhamentos caprichados.',
    priceCents: 2290,
    category: 'principais',
    tags: ['viagem'],
    available: true,
    serves: 'Serve 1 pessoa',
    image: U('photo-1546069901-ba9599a7e63c'),
  },
  {
    id: 'por-frango',
    name: 'Frango a Passarinho',
    description: 'Temperado da casa, alho frito e limão. Crocante por fora, suculento por dentro.',
    priceCents: 3990,
    category: 'principais',
    tags: ['porção', 'dividir'],
    available: true,
    serves: 'Serve 2–3 pessoas',
    image: U('photo-1569058242253-92a9c755a0ec'),
  },
  {
    id: 'por-fritas',
    name: 'Fritas com Cheddar e Bacon',
    description: 'Batata crocante, cheddar cremoso, bacon crocante e cebolinha. Para a mesa dividir.',
    priceCents: 3490,
    category: 'principais',
    tags: ['porção'],
    available: true,
    serves: 'Serve 2–3 pessoas',
    image: U('photo-1573080496219-bb080dd4f877'),
  },
  // ——— Especiais do Dia ———
  {
    id: 'esp-virado',
    name: 'Virado à Paulista · Segunda',
    description: 'Virado de feijão, bisteca suína, couve, ovo frito, banana-da-terra e torresmo.',
    priceCents: 2990,
    category: 'especiais',
    tags: ['seg', 'tradição'],
    available: true,
    weekdaySpecial: [1],
    serves: 'Serve 1 pessoa',
    image: U('photo-1504674900247-0877df9cc836'),
  },
  {
    id: 'esp-feijoada',
    name: 'Feijoada Completa · Qua & Sáb',
    description: 'Feijoada encorpada, couve fatiada, torresmo, laranja, arroz e farofa de mandioca.',
    priceCents: 3290,
    category: 'especiais',
    tags: ['qua', 'sáb'],
    available: true,
    weekdaySpecial: [3, 6],
    serves: 'Serve 1–2 pessoas',
    image: U('photo-1547592180-85f173990554'),
  },
  {
    id: 'esp-tilapia',
    name: 'Tilápia Frita com Mandioca',
    description: 'Filé empanado dourado, mandioca frita, vinagrete e molho tártaro da casa.',
    priceCents: 5490,
    category: 'especiais',
    tags: ['peixe'],
    available: false,
    serves: 'Serve 2–3 pessoas',
    image: U('photo-1580476262798-bddd9f4b7369'),
  },
  // ——— Bebidas ———
  {
    id: 'beb-suco',
    name: 'Suco Natural · 500 ml',
    description: 'Laranja, maracujá, limonada ou abacaxi com hortelã. Espremido na hora.',
    priceCents: 900,
    category: 'bebidas',
    tags: ['natural'],
    available: true,
    image: U('photo-1600271886742-f049cd451bba'),
  },
  {
    id: 'beb-refri',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná Antarctica ou Sprite. Sempre geladíssimo.',
    priceCents: 650,
    category: 'bebidas',
    tags: ['gelado'],
    available: true,
    image: U('photo-1581636625402-29b2a704ef13'),
  },
  {
    id: 'beb-cerveja',
    name: 'Cerveja Long Neck',
    description: 'Heineken, Stella ou Corona. Consulte a disponibilidade do dia.',
    priceCents: 1200,
    category: 'bebidas',
    tags: ['gelada'],
    available: true,
    image: U('photo-1608270586620-248524c67de9'),
  },
  {
    id: 'beb-agua',
    name: 'Água Mineral · 500 ml',
    description: 'Com ou sem gás.',
    priceCents: 400,
    category: 'bebidas',
    tags: [],
    available: true,
  },
  // ——— Sobremesas ———
  {
    id: 'sob-pudim',
    name: 'Pudim de Leite Condensado',
    description: 'Receita da casa com calda de caramelo. Fatia generosa, textura lisa.',
    priceCents: 1200,
    category: 'sobremesas',
    tags: ['receita da casa'],
    available: true,
    image: U('photo-1488477181946-6428a0292767'),
  },
  {
    id: 'sob-mousse',
    name: 'Mousse de Maracujá',
    description: 'Cremosa e aerada, com calda de maracujá natural por cima.',
    priceCents: 1000,
    category: 'sobremesas',
    tags: [],
    available: true,
    image: U('photo-1551024506-0bccd828d307'),
  },
  {
    id: 'sob-cocada',
    name: 'Cocada Cremosa de Colher',
    description: 'Feita diariamente. Doce na medida, coco fresco ralado.',
    priceCents: 900,
    category: 'sobremesas',
    tags: [],
    available: false,
    image: U('photo-1587314168485-3236d6710814'),
  },
];
