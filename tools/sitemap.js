#!/usr/bin/env node
/* Gera sitemap.xml incluindo TODAS as imagens dos projetos (image sitemap),
   já que a galeria é aberta por JavaScript. Uso: node tools/sitemap.js */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'site');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(OUT, 'assets/img/manifest.json'), 'utf8'));
const URL = 'https://www.ergoconstrutora.com.br';
const HOJE = new Date().toISOString().slice(0, 10);

const NOMES = {
  'residencia-contemporanea': 'Residência Contemporânea',
  'casa-de-praia': 'Casa de Praia',
  'delicatessen': 'Delicatessen',
  'dolce-by-dulce': 'Dolce by Dulce',
  'escritorio-ergo': 'Escritório Ergo'
};

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const imagensProjetos = Object.entries(MANIFEST).map(([slug, fotos]) =>
  fotos.map((it, i) => {
    const big = Math.max(...it.sizes);
    return `    <image:image>
      <image:loc>${URL}/assets/img/${slug}/${it.base}-${big}.webp</image:loc>
      <image:title>${esc(NOMES[slug])} — imagem ${i + 1} | Ergo Construtora, Maragogi - AL</image:title>
    </image:image>`;
  }).join('\n')
).join('\n');

const paginas = [
  ['/', '1.0', 'weekly'],
  ['/projetos.html', '0.9', 'weekly'],
  ['/servicos.html', '0.9', 'monthly'],
  ['/sobre-nos.html', '0.8', 'monthly'],
  ['/contato.html', '0.8', 'monthly']
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${paginas.map(([loc, pri, freq]) => `  <url>
    <loc>${URL}${loc}</loc>
    <lastmod>${HOJE}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${pri}</priority>${loc === '/projetos.html' ? '\n' + imagensProjetos : ''}
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
const total = Object.values(MANIFEST).reduce((n, a) => n + a.length, 0);
console.log(`sitemap.xml gerado — ${paginas.length} páginas, ${total} imagens`);
