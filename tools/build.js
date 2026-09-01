#!/usr/bin/env node
/* =========================================================
   ERGO CONSTRUTORA — Gerador do site estático
   Substitui os marcadores {{...}} das páginas-fonte (tools/paginas)
   por HTML final e grava em /site.

   Uso:  node tools/build.js
   ========================================================= */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'tools', 'paginas');
const OUT = path.join(ROOT, 'site');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(OUT, 'assets/img/manifest.json'), 'utf8'));

const SITE_URL = 'https://www.ergoconstrutora.com.br';
const WA_COM = '5582988839919';
const WA_ARQ = '558288781496';
const INSTAGRAM = 'https://www.instagram.com/ergoconstrutora/';
const MAPS = 'https://www.google.com/maps/place/Ergo+Construtora/@-8.9846244,-35.1926247,17z';

const PROJETOS = {
  'residencia-contemporanea': { nome: 'Residência Contemporânea', cat: 'residencial', catLabel: 'Residencial · Obra entregue' },
  'casa-de-praia': { nome: 'Casa de Praia', cat: 'residencial', catLabel: 'Residencial · Projeto' },
  'delicatessen': { nome: 'Delicatessen', cat: 'comercial', catLabel: 'Comercial · Projeto' },
  'dolce-by-dulce': { nome: 'Dolce by Dulce', cat: 'comercial', catLabel: 'Comercial · Interiores' },
  'escritorio-ergo': { nome: 'Escritório Ergo', cat: 'comercial', catLabel: 'Sede da Ergo · Interiores' }
};

/* ---------------- imagem responsiva ---------------- */
function findImg(slug, id) {
  const list = MANIFEST[slug];
  if (!list) throw new Error('projeto inexistente: ' + slug);
  const item = list.find(i => i.id === id);
  if (!item) throw new Error('imagem inexistente: ' + slug + '/' + id);
  return item;
}

function img(ref, sizes, alt, opts = {}) {
  const [slug, id] = ref.split('/');
  const it = findImg(slug, id);
  const dir = `assets/img/${slug}`;
  const srcset = it.sizes
    .map(w => `${dir}/${it.base}-${w}.webp ${Math.min(w, it.w)}w`)
    .join(', ');
  const largest = Math.max(...it.sizes);
  const realW = Math.min(largest, it.w);
  const realH = Math.round(realW / it.ratio);
  const attrs = [
    `src="${dir}/${it.base}-${largest}.webp"`,
    `srcset="${srcset}"`,
    `sizes="${sizes}"`,
    `width="${realW}" height="${realH}"`,
    `alt="${alt}"`,
    opts.eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"',
    opts.class ? `class="${opts.class}"` : ''
  ].filter(Boolean);
  return `<img ${attrs.join(' ')}>`;
}

/* ---------------- faixa de projeto (abre a galeria) ---------------- */
function strip(slug, capa, texto, opts = {}) {
  const p = PROJETOS[slug];
  const total = MANIFEST[slug].length;
  const id = capa.includes('/') ? capa.split('/')[1] : capa;
  const it = findImg(slug, id);
  const dir = `assets/img/${slug}`;
  const srcset = it.sizes.map(w => `${dir}/${it.base}-${w}.webp ${Math.min(w, it.w)}w`).join(', ');
  const big = Math.max(...it.sizes);
  const realW = Math.min(big, it.w);
  const tag = opts.href ? 'a' : 'button';
  const attrs = opts.href
    ? `href="${opts.href}"`
    : `type="button" data-galeria="${slug}"`;
  return `<${tag} class="strip" ${attrs} aria-label="${opts.href ? 'Ver' : 'Abrir galeria de'} ${p.nome} — ${total} imagens">
            <img src="${dir}/${it.base}-${big}.webp" srcset="${srcset}" sizes="(min-width: 90rem) 1340px, 100vw" width="${realW}" height="${Math.round(realW / it.ratio)}" alt="${opts.alt || (p.nome + ' — projeto da Ergo Construtora em Maragogi, Alagoas')}" loading="lazy" decoding="async">
            <span class="strip__panel">
              <span class="strip__cat">${p.catLabel}</span>
              <h3>${p.nome}</h3>
              <p>${texto}</p>
              <span class="strip__cta">${opts.href ? 'Ver projeto' : 'Ver galeria'} <svg aria-hidden="true"><use href="#i-arrow-up"></use></svg></span>
            </span>
            <span class="strip__count">${total} imagens</span>
          </${tag}>`;
}



/* ---------------- slide do catálogo da home ---------------- */
function slide(slug, capa, cats) {
  const p = PROJETOS[slug];
  const total = MANIFEST[slug].length;
  const id = capa.includes('/') ? capa.split('/')[1] : capa;
  const it = findImg(slug, id);
  const dir = `assets/img/${slug}`;
  const srcset = it.sizes.map(w => `${dir}/${it.base}-${w}.webp ${Math.min(w, it.w)}w`).join(', ');
  const realW = Math.min(Math.max(...it.sizes), it.w);
  return `<a class="catalog__slide" href="projetos.html#${slug}" data-cats="${cats}" aria-label="Ver ${p.nome} — ${total} imagens">
              <img src="${dir}/${it.base}-1000.webp" srcset="${srcset}" sizes="(min-width: 64rem) 28vw, (min-width: 44rem) 44vw, 84vw" width="${realW}" height="${Math.round(realW / it.ratio)}" alt="${p.nome} — projeto da Ergo Construtora em Maragogi, Alagoas" loading="lazy" decoding="async">
              <span class="catalog__cap"><b>${p.nome}</b><span>${p.catLabel} · ${total} fotos</span></span>
            </a>`;
}

/* ---------------- card de projeto (abre a galeria) ---------------- */
const ICONES_PROJETO = {
  'residencia-contemporanea': 'i-obra',
  'casa-de-praia': 'i-arq',
  'delicatessen': 'i-interior',
  'dolce-by-dulce': 'i-interior',
  'escritorio-ergo': 'i-tools'
};

function pcard(slug, capa, texto) {
  const p = PROJETOS[slug];
  const total = MANIFEST[slug].length;
  const id = capa.includes('/') ? capa.split('/')[1] : capa;
  const it = findImg(slug, id);
  const dir = `assets/img/${slug}`;
  const srcset = it.sizes.map(w => `${dir}/${it.base}-${w}.webp ${Math.min(w, it.w)}w`).join(', ');
  const big = Math.max(...it.sizes);
  const realW = Math.min(big, it.w);
  return `<button class="pcard" type="button" data-galeria="${slug}" aria-label="Abrir galeria de ${p.nome} — ${total} imagens">
            <span class="pcard__body">
              <span class="pcard__ic"><svg aria-hidden="true"><use href="#${ICONES_PROJETO[slug] || 'i-obra'}"></use></svg></span>
              <span class="pcard__cat">${p.catLabel}</span>
              <h3>${p.nome}</h3>
              <p>${texto}</p>
              <span class="pcard__link"><span>Ver galeria · ${total} fotos</span> <svg aria-hidden="true"><use href="#i-arrow-up"></use></svg></span>
            </span>
            <span class="pcard__media">
              <img src="${dir}/${it.base}-1000.webp" srcset="${srcset}" sizes="(min-width: 60rem) 22vw, 40vw" width="${realW}" height="${Math.round(realW / it.ratio)}" alt="${p.nome} — projeto da Ergo Construtora em Maragogi, Alagoas" loading="lazy" decoding="async">
            </span>
          </button>`;
}

/* ---------------- dados das galerias (consumidos pelo lightbox) ---------------- */
function galeriasJSON(slugs) {
  const dados = {};
  slugs.forEach(slug => {
    const p = PROJETOS[slug];
    dados[slug] = {
      nome: p.nome,
      cat: p.catLabel,
      fotos: MANIFEST[slug].map((it, i) => {
        const dir = `assets/img/${slug}`;
        const big = Math.max(...it.sizes);
        return {
          f: `${dir}/${it.base}-${big}.webp`,
          t: `${dir}/${it.base}-600.webp`,
          a: `${p.nome} — imagem ${i + 1} de obra da Ergo Construtora em Maragogi, Alagoas`
        };
      })
    };
  });
  return `<script type="application/json" id="dados-galerias">${JSON.stringify(dados)}</script>`;
}


/* ---------------- EQUIPE ----------------
   Preencha "nome" quando o cliente confirmar os nomes: se o nome existir,
   ele vira o título do card e a função passa para a linha de apoio.
   ---------------------------------------- */
const EQUIPE = {
  // Preencha "nome" quando o cliente confirmar: com nome, ele vira o título
  // do card e a função passa para a linha de apoio.
  membros: [
    { img: 'ceo',       nome: '', funcao: 'CEO',                        apoio: 'Ergo Construtora', destaque: true },
    { img: 'membro-01', nome: '', funcao: 'Coordenação de obras',       apoio: 'Equipe Ergo' },
    { img: 'membro-03', nome: '', funcao: 'Administrativo e financeiro', apoio: 'Equipe Ergo' },
    { img: 'membro-04', nome: '', funcao: 'Arquitetura e interiores',   apoio: 'Equipe Ergo' }
  ]
};

function cardEquipe(m) {
  const titulo = m.nome || m.funcao;
  const sub = m.nome ? m.funcao : m.apoio;
  const foto = img('equipe/' + m.img, '(min-width: 64rem) 24vw, (min-width: 48rem) 45vw, 74vw',
    `${titulo} — ${m.funcao} da Ergo Construtora em Maragogi, Alagoas`);
  return `<article class="team-card${m.destaque ? ' team-card--ceo' : ''}">
            ${foto}
            <div class="team-card__body">
              <h3>${titulo}</h3>
              <p>${sub}</p>
            </div>
          </article>`;
}

function equipe() {
  return EQUIPE.membros.map(cardEquipe).join('\n          ');
}

/* ---------------- ícones (sprite SVG) ---------------- */
const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true" focusable="false">
  <symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.02a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 0 1-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.41-4.4 9.81-9.8 9.81M20.52 3.45A11.68 11.68 0 0 0 12.05 0C5.55 0 .27 5.28.26 11.77c0 2.07.54 4.1 1.57 5.88L.16 24l6.5-1.7a11.74 11.74 0 0 0 5.39 1.37h.01c6.5 0 11.78-5.28 11.79-11.77 0-3.15-1.22-6.1-3.44-8.33"/></symbol>
  <symbol id="i-ig" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38a5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32m0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
  <symbol id="i-fone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.3-6.16 3.7 1.64-7L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.48 4.76 1.64 7z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></symbol>
  <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-7 7 7-7 7"/></symbol>
  <symbol id="i-arrow-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m6-7-7 7 7 7"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-7 7 7-7 7"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></symbol>
  <symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-obra" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/></symbol>
  <symbol id="i-reforma" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1 5.3 5.3l-8.4 8.4-4-4Z"/><path d="m3 21 3-1-2-2Z"/><path d="m15 9 1.5 1.5"/></symbol>
  <symbol id="i-arq" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18M6 20V9l6-5 6 5v11"/><path d="M10 20v-5h4v5M9 12h6"/></symbol>
  <symbol id="i-interior" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M2 18h20M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M6 18v2M18 18v2"/></symbol>
  <symbol id="i-estrutura" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V6l8-3 8 3v15"/><path d="M4 11h16M4 16h16M12 3v18"/></symbol>
  <symbol id="i-agua" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7s6 6.3 6 10.3a6 6 0 0 1-12 0c0-4 6-10.3 6-10.3Z"/></symbol>
  <symbol id="i-pav" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h18M3 16h18M3 4v16M21 4v16M9 8v8M15 8v8"/></symbol>
  <symbol id="i-maq" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="18" r="2.5"/><circle cx="17" cy="18" r="2.5"/><path d="M4 15V9h6l3 6M10 9l4-5 4 3-3 4"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  <symbol id="i-award" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="m8.2 14.3-1.4 7 5.2-2.6 5.2 2.6-1.4-7"/></symbol>
  <symbol id="i-pin-solid" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
  <symbol id="i-sliders" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></symbol>
  <symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></symbol>
  <symbol id="i-key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8 3 3-2 2-2-2-4 4"/></symbol>
  <symbol id="i-tools" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 0 5 5L21 9l-2-6-3 3Z"/><path d="m13 10-8 8a2 2 0 1 0 3 3l8-8"/></symbol>
</svg>`;

/* ---------------- header ---------------- */
const NAV = [
  ['index.html', 'Home'],
  ['sobre-nos.html', 'Sobre Nós'],
  ['servicos.html', 'Serviços'],
  ['projetos.html', 'Projetos'],
  ['contato.html', 'Contato']
];

function header(atual) {
  const links = NAV.map(([href, label]) =>
    `<li><a href="${href}"${href === atual ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n          ');
  return `<header class="header">
    <div class="wrap-wide header__inner">
      <a class="header__logo" href="index.html" aria-label="Ergo Construtora — página inicial">
        <img class="logo-dark" src="assets/img/logo-ergo-verde.webp" alt="Ergo Construtora" width="800" height="86">
        <img class="logo-light" src="assets/img/logo-ergo-branco.webp" alt="" aria-hidden="true" width="800" height="86">
      </a>
      <nav class="nav" aria-label="Navegação principal">
        <ul style="display:contents">
          ${links}
        </ul>
      </nav>
      <div class="header__actions">
        <a class="btn btn--light btn--sm" href="https://wa.me/${WA_COM}?text=${encodeURIComponent('Olá! Vim pelo site da Ergo Construtora e quero falar sobre um projeto.')}" target="_blank" rel="noopener">Entrar em contato</a>
        <button class="burger" type="button" aria-expanded="false" aria-controls="menu-mobile" aria-label="Abrir menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" id="menu-mobile">
    <button class="mobile-menu__close" type="button" aria-label="Fechar menu"><svg aria-hidden="true"><use href="#i-close"></use></svg></button>
    <nav aria-label="Navegação mobile">
      <ul>
        ${NAV.map(([href, label]) => `<li><a href="${href}"${href === atual ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n        ')}
        <li><a class="btn btn--light" href="https://wa.me/${WA_COM}" target="_blank" rel="noopener"><svg aria-hidden="true"><use href="#i-wa"></use></svg> Falar no WhatsApp</a></li>
      </ul>
    </nav>
    <div class="mobile-menu__meta">
      <a href="tel:+5582988839919">(82) 98883-9919</a>
      <span>R. Dourado, Barra Grande — Maragogi/AL</span>
      <span>Seg. a sex., 08h às 17h</span>
    </div>
  </div>`;
}

/* ---------------- footer ---------------- */
const FOOTER = `<footer class="footer">
    <div class="footer__top">
      <div class="wrap-wide">
        <div class="footer__bar">
          <a class="footer__logo" href="index.html" aria-label="Ergo Construtora — página inicial">
            <img src="assets/img/logo-ergo-branco.webp" alt="Ergo Construtora" width="800" height="86" loading="lazy">
          </a>
          <div class="footer__social">
            <a href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram da Ergo Construtora"><svg aria-hidden="true"><use href="#i-ig"></use></svg></a>
            <a href="https://wa.me/${WA_COM}" target="_blank" rel="noopener" aria-label="WhatsApp da Ergo Construtora"><svg aria-hidden="true"><use href="#i-wa"></use></svg></a>
            <a href="${MAPS}" target="_blank" rel="noopener" aria-label="Ergo Construtora no Google Maps"><svg aria-hidden="true"><use href="#i-pin"></use></svg></a>
          </div>
        </div>

        <div class="footer__grid">
          <div>
            <h4>Navegar</h4>
            <ul>
              ${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('\n              ')}
            </ul>
          </div>
          <div>
            <h4>Serviços</h4>
            <ul>
              <li><a href="servicos.html#construcao-civil">Construção civil</a></li>
              <li><a href="servicos.html#reforma">Reformas</a></li>
              <li><a href="servicos.html#projeto-arquitetura">Projeto de arquitetura</a></li>
              <li><a href="servicos.html#projeto-interiores">Projeto de interiores</a></li>
              <li><a href="servicos.html#projeto-estrutural">Projeto estrutural</a></li>
              <li><a href="servicos.html#pavimentacao">Pavimentação</a></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>
              <li><a href="https://wa.me/${WA_COM}" target="_blank" rel="noopener">Comercial · (82) 98883-9919</a></li>
              <li><a href="https://wa.me/${WA_ARQ}" target="_blank" rel="noopener">Arquitetura · (82) 8878-1496</a></li>
              <li><a href="${INSTAGRAM}" target="_blank" rel="noopener">@ergoconstrutora</a></li>
              <li><a href="${MAPS}" target="_blank" rel="noopener">R. Dourado, Barra Grande<br>Maragogi — AL, 57955-000</a></li>
              <li>Seg. a sex., das 08h às 17h</li>
            </ul>
          </div>

          <div class="footer__news">
            <h4>Receba nossas obras</h4>
            <p>Novidades das obras e projetos entregues em Alagoas e na Mata Sul pernambucana. Sem spam.</p>
            <form class="news" id="newsletter">
              <label class="sr-only" for="news-email">Seu e-mail</label>
              <input type="email" id="news-email" name="email" placeholder="Digite seu e-mail" required>
              <button class="btn btn--sm" type="submit">Quero receber</button>
            </form>
            <span class="footer__badge"><svg aria-hidden="true"><use href="#i-pin"></use></svg> Atendemos o litoral norte de AL e a Mata Sul de PE</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="wrap-wide footer__bottom-inner">
        <span>© <span id="ano-atual">2026</span> Ergo Construtora LTDA</span>
        <span class="footer__dot">·</span>
        <span>CNPJ 55.209.731/0001-33</span>
        <span class="footer__dot">·</span>
        <span>Projetando ideias, concretizando excelência.</span>
      </div>
    </div>
  </footer>`;

/* ---------------- botão flutuante + lightbox ---------------- */
const WA_FLOAT = `<a class="wa" href="https://wa.me/${WA_COM}?text=${encodeURIComponent('Olá! Vim pelo site da Ergo Construtora e quero um orçamento.')}" target="_blank" rel="noopener" aria-label="Falar com a Ergo Construtora no WhatsApp">
    <span>Fale com a Ergo</span>
    <svg aria-hidden="true"><use href="#i-wa"></use></svg>
  </a>`;

const LIGHTBOX = `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Galeria do projeto">
    <div class="lightbox__bar">
      <div>
        <p class="lightbox__title"></p>
        <p class="lightbox__count"></p>
      </div>
      <button class="lightbox__close" type="button" aria-label="Fechar galeria"><svg aria-hidden="true"><use href="#i-close"></use></svg></button>
    </div>
    <div class="lightbox__stage">
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Imagem anterior"><svg aria-hidden="true"><use href="#i-left"></use></svg></button>
      <img src="" alt="">
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Próxima imagem"><svg aria-hidden="true"><use href="#i-right"></use></svg></button>
    </div>
    <div class="lightbox__foot">
      <div class="wrap-wide">
        <div class="lightbox__thumbs"></div>
      </div>
    </div>
  </div>`;

/* ---------------- head comum ---------------- */
const HEAD_COMMON = `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#212721">
  <meta name="author" content="Ergo Construtora LTDA">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="icon" href="assets/favicon/favicon.ico" sizes="any">
  <link rel="icon" href="assets/favicon/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="assets/favicon/icon-180.png">
  <link rel="manifest" href="site.webmanifest">
  <link rel="preload" href="assets/fonts/jakarta-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="assets/css/style.css">`;

const SCRIPTS = `<script src="assets/js/dados.js"></script>
  <script src="assets/js/main.js" defer></script>`;

/* ---------------- processamento ---------------- */
function build() {
  const arquivos = fs.readdirSync(SRC).filter(f => f.endsWith('.html'));
  arquivos.forEach(file => {
    let html = fs.readFileSync(path.join(SRC, file), 'utf8');

    html = html
      .replace(/\{\{HEAD_COMMON\}\}/g, HEAD_COMMON)
      .replace(/\{\{SPRITE\}\}/g, SPRITE)
      .replace(/\{\{HEADER\}\}/g, () => header(file))
      .replace(/\{\{FOOTER\}\}/g, FOOTER)
      .replace(/\{\{WA_FLOAT\}\}/g, WA_FLOAT)
      .replace(/\{\{LIGHTBOX\}\}/g, LIGHTBOX)
      .replace(/\{\{SCRIPTS\}\}/g, SCRIPTS)
      .replace(/\{\{SITE_URL\}\}/g, SITE_URL)
      .replace(/\{\{WA_COM\}\}/g, WA_COM)
      .replace(/\{\{WA_ARQ\}\}/g, WA_ARQ)
      .replace(/\{\{INSTAGRAM\}\}/g, INSTAGRAM)
      .replace(/\{\{MAPS\}\}/g, MAPS);

    // {{IMG:slug/id|sizes|alt|flags}}
    html = html.replace(/\{\{IMG:([^|}]+)\|([^|}]*)\|([^|}]*)\|?([^}]*)\}\}/g, (_, ref, sizes, alt, flags) => {
      const f = (flags || '').trim();
      return img(ref.trim(), sizes.trim(), alt.trim(), {
        eager: f.includes('eager'),
        class: (f.match(/class=([^\s]+)/) || [])[1]
      });
    });

    html = html.replace(/\{\{EQUIPE\}\}/g, () => equipe());

    // {{SLIDE:slug|capa|categorias}}
    html = html.replace(/\{\{SLIDE:([^|}]+)\|([^|}]+)\|([^}]*)\}\}/g, (_, slug, capa, cats) =>
      slide(slug.trim(), capa.trim(), cats.trim()));

    // {{PCARD:slug|imagem-de-capa|texto}}
    html = html.replace(/\{\{PCARD:([^|}]+)\|([^|}]+)\|([^}]*)\}\}/g, (_, slug, capa, texto) =>
      pcard(slug.trim(), capa.trim(), texto.trim()));

    // {{STRIP:slug|imagem-de-capa|texto|href opcional}}
    html = html.replace(/\{\{STRIP:([^|}]+)\|([^|}]+)\|([^|}]*)\|?([^}]*)\}\}/g, (_, slug, capa, texto, href) =>
      strip(slug.trim(), capa.trim(), texto.trim(), href.trim() ? { href: href.trim() } : {}));

    // {{GALERIAS_JSON:slug,slug,...}}
    html = html.replace(/\{\{GALERIAS_JSON:([^}]+)\}\}/g, (_, lista) =>
      galeriasJSON(lista.split(',').map(x => x.trim())));

    fs.writeFileSync(path.join(OUT, file), html);
    console.log('✓', file, (html.length / 1024).toFixed(1) + ' KB');
  });
}

build();
