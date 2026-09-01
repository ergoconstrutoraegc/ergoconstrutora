# Site Ergo Construtora — Maragogi/AL

Site institucional estático (HTML + CSS + JavaScript puro), responsivo, otimizado para SEO local e conversão por WhatsApp.

**Estilo visual:** Modern Minimalist / Editorial Real Estate — folha em cinza claro com cards brancos, fotografia de contexto em preto e branco, tipografia contida e paleta monocromática construída sobre o verde escuro da marca (`#212721`) no lugar do preto.

**Tudo o que precisa ir para o ar está na pasta [`site/`](site/).** Não há build, servidor ou banco de dados.

---

## 1. Como publicar

Envie **o conteúdo da pasta `site/`** para a raiz da hospedagem (`public_html`, `www` etc.).

| Hospedagem | Como fazer |
|---|---|
| Hostinger / cPanel | Enviar o conteúdo de `site/` para `public_html` (o `.htaccess` incluído já cuida de HTTPS, cache e URLs amigáveis) |
| Netlify / Vercel | Arrastar a pasta `site/` no painel, ou apontar o repositório com "publish directory" = `site` |
| GitHub Pages | Publicar o conteúdo de `site/` na branch `gh-pages` ou na pasta `/docs` |
| Amazon S3 / Cloudflare Pages | Upload direto do conteúdo de `site/` |

Depois de publicar:
1. Cadastre o site no **Google Search Console** e envie `sitemap.xml`.
2. Adicione o endereço do site no **Google Meu Negócio** e no Instagram.
3. Se o domínio final **não** for `www.ergoconstrutora.com.br`, faça a troca (ver item 3).

### Testar localmente
```bash
cd site
python3 -m http.server 8000
# abra http://localhost:8000
```

---

## 2. Estrutura

```
site/
├── index.html          Home
├── sobre-nos.html      Sobre Nós
├── servicos.html       Serviços (8 serviços + processo + FAQ)
├── projetos.html       Portfólio em faixas horizontais que abrem a galeria
├── contato.html        Canais, horários, formulário e mapa
├── 404.html            Página de erro
├── robots.txt · sitemap.xml · site.webmanifest · .htaccess
└── assets/
    ├── css/style.css       Design system completo (comentado)
    ├── css/fonts.css       Fontes self-hosted
    ├── js/dados.js         ← contatos usados pelo formulário
    ├── js/main.js          Interações (menu, reveal, galeria, formulário…)
    ├── fonts/              Plus Jakarta Sans (WOFF2)
    ├── img/                Imagens WebP responsivas (3 tamanhos por foto)
    │   └── equipe/         Retratos da equipe + fotos oficiais (time, fundador, contato)
    └── favicon/            Favicons, ícones PWA e SVG da marca

tools/                  Gerador do site (opcional — ver item 4)
PLANO-DESENVOLVIMENTO.md Plano, decisões de projeto e pendências
```

---

## 3. Como editar as informações mais comuns

| O que mudar | Onde |
|---|---|
| **Telefone / WhatsApp** | `site/assets/js/dados.js` **e** buscar `5582988839919` nos arquivos `.html` |
| **Endereço** | buscar `R. Dourado` nos `.html` e em `dados.js` |
| **Domínio** | buscar `www.ergoconstrutora.com.br` em todos os `.html`, no `sitemap.xml` e no `robots.txt` |
| **Nome dos projetos** | buscar o nome atual (ex.: `Residência Contemporânea`) em `projetos.html` e `index.html` |
| **Textos das páginas** | direto no HTML correspondente |
| **Cores** | `site/assets/css/style.css`, bloco `:root` no topo |
| **Catálogo de projetos da home** | marcadores `{{SLIDE:...}}` em `tools/paginas/index.html`; categorias no atributo `data-cats` |
| **Capa/texto das faixas de projeto** | marcador `{{STRIP:...}}` em `tools/paginas/projetos.html` (ou direto no HTML gerado) |
| **Fotos em preto e branco** | classe `.bw` / regra `.hero__card > img` em `style.css` — remova o `filter` para voltar à cor |
| **Números (7+, 100+, 98%)** | atributo `data-count` em `index.html` e `sobre-nos.html` |
| **Nomes e cargos da equipe** | objeto `EQUIPE` no topo de `tools/build.js` → rode `node tools/build.js` |
| **Foto do hero** | `site/assets/img/hero/` (origem em `imagens/fotohero.png`) |
| **Hero da home** | `.hero4` em `style.css`; conteúdo em `index.html` |
| **Faixa de briefing** | `.brief` em `style.css`; campos em `index.html` |
| **Escurecimento das fotos dos heros internos** | `.hero3::after` em `style.css` |
| **Enquadramento de foto com pessoas no hero** | `.hero3--pessoas .hero3__bg { object-position }` em `style.css` |
| **Suavidade da junção entre seções** | `.hero3::before` e `.section--dark::before/::after` em `style.css` |
| **Velocidade das animações** | blocos `[data-reveal]` e `[data-stagger]` no fim do `style.css` |

> Dica: para trocar um telefone em todos os arquivos de uma vez, no macOS/Linux:
> `cd site && grep -rl "5582988839919" . | xargs sed -i '' 's/5582988839919/NOVONUMERO/g'`

### Paleta oficial usada (Manual de Marca Ergo)
| Cor | HEX |
|---|---|
| Verde escuro (Pantone Black 3 C) | `#212721` |
| Verde secundário (Pantone 4224 C) | `#3E4938` |
| Sage (Pantone 4183 CP) | `#B7C0AC` |
| Laranja de destaque (Pantone 4012 C) | `#EA733D` |
| Cinza (Pantone 4283 C) | `#A9A2A1` |
| Off White | `#EFEFEF` |

No estilo minimalista o laranja aparece só como acento pontual (o ponto do selo no hero). Toda a hierarquia é construída com o verde escuro `#212721`, branco e o cinza claro `#f3f3f0`. O token `--muted: #686d67` foi calibrado para 4,76:1 sobre o cinza claro (WCAG AA).

**Tipografia:** Plus Jakarta Sans (400–800), self-hosted em WOFF2 — 27 KB no total.

---

## 4. Regerar o site (opcional)

As páginas em `site/` são HTML final e podem ser editadas diretamente. Elas também podem ser **regeradas** a partir das páginas-fonte em `tools/paginas/`, que usam marcadores (`{{HEADER}}`, `{{IMG:...}}`, `{{STRIP:...}}`) para evitar repetição:

```bash
node tools/build.js     # gera as páginas HTML
node tools/sitemap.js   # regenera o sitemap com as 110 imagens
```

⚠️ O comando **sobrescreve** os arquivos `.html` de `site/`. Se você editar diretamente em `site/`, edite também em `tools/paginas/` (ou pare de usar o gerador).

---

## 5. O que já está pronto em SEO

- Meta title/description exclusivos por página, com as palavras-chave locais
- Open Graph + Twitter Card com imagem 1200×630
- Canonical em todas as páginas
- Dados estruturados JSON-LD: `GeneralContractor` (com geo, horário, avaliação e catálogo de serviços), `WebSite`, `FAQPage`, `BreadcrumbList`, `CollectionPage`, `ItemList`
- `robots.txt`
- Todas as imagens com `alt` descritivo e palavra-chave local
- `sitemap.xml` com **image sitemap das 110 fotos** dos projetos (elas abrem na galeria por JavaScript, então o sitemap garante a indexação)
- WebP responsivo com `srcset`, `loading="lazy"` e `width`/`height` (evita layout shift)
- Fontes self-hosted com `preload` — sem dependência de CDN externo
- Home carrega ~270 KB no celular; a página de projetos, ~32 KB (lazy loading)

**Depois de publicar, o que mais move o ponteiro no Google local:** manter o Google Meu Negócio ativo com posts semanais, responder às avaliações e publicar fotos novas das obras.

---

## 6. Formulário de orçamento

O formulário de `contato.html` **não precisa de servidor**: ele valida os campos e abre o WhatsApp comercial com a mensagem já formatada (nome, telefone, e-mail, tipo de projeto, cidade e mensagem).

Para trocar o número que recebe os envios, edite `whatsappComercial` em `site/assets/js/dados.js`.

Se um dia quiser receber por e-mail também, dá para plugar um serviço como Formspree ou Web3Forms trocando o `submit` em `assets/js/main.js`.
