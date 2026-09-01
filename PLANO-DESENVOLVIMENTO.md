# Plano de Desenvolvimento — Site Ergo Construtora

**Cliente:** Ergo Construtora LTDA (CNPJ 55.209.731/0001-33) — Barra Grande, Maragogi/AL
**Objetivo:** site institucional estático, premium, mobile-first, focado em conversão via WhatsApp e SEO local (Maragogi / Costa dos Corais / litoral norte de Alagoas).
**Stack:** HTML5 semântico + CSS3 (custom properties, grid/flex) + JavaScript vanilla (zero dependências, zero build). Fontes self-hosted, imagens WebP responsivas.

---

## 1. Descobertas da análise de material

### 1.1 Arquivos analisados
| Fonte | Conteúdo aproveitado |
|---|---|
| `ergo_construtora_maragogi.txt` | NAP (nome/endereço/telefone), horários, serviços, avaliações |
| `copy site.txt` (34 KB) | Copy final das 5 páginas, SEO por página, FAQ, diretrizes de design/animação |
| `logo/MANUAL DE MARCA ERGO.pdf` + 48 arquivos de logo | Marca e paleta oficial |
| `FigmaSite/moodboard.png` | Paleta oficial com HEX/RGB/CMYK + referências visuais |
| `FigmaSite/Desenvolvimento-41.png` | Layout de referência já desenhado para a Ergo (8.597 px de altura) |
| `FigmaSite/wiframe-3.png` | Wireframe com cards de vidro sobre foto + estrutura de rodapé |
| `FigmaSite/head.jpg` | Referência externa (imobiliária "Urban") de header/hero/stat cards |
| `projetos/` (110 imagens) | Acervo visual de 5 projetos |
| `equipe/Photos/` (82 fotos, 2,5 GB) | Ensaio de estúdio da equipe — 4 arquivos nomeados pelo cliente (`ceo`, `time`, `como trabalhamos`, `foto para contato`) e 78 retratos individuais dos 5 integrantes |

### 1.2 Paleta oficial extraída (manual de marca + verificação pixel a pixel dos logos)
| Cor | HEX | Uso no site |
|---|---|---|
| Pantone Black 3 C | `#212721` | Fundo escuro principal, header sólido, rodapé |
| Pantone 4224 C | `#3E4938` | Verde secundário, seções alternadas, bordas |
| Pantone 4183 CP | `#B7C0AC` | Sage — textos de apoio sobre escuro, detalhes |
| Pantone 4012 C | `#EA733D` | Acento pontual (selo do hero) — o CTA principal usa o verde escuro |
| Pantone 4283 C | `#A9A2A1` | Cinza neutro — textos secundários |
| Off White | `#EFEFEF` | Fundo claro das seções |
| — | `#F3F3F0` | Cinza claro das seções e cards |

### 1.3 Acervo de imagens (mapeamento pasta → projeto no site)
| Pasta | Nº | Tipo | Nome usado no site |
|---|---|---|---|
| `richard/` | 49 | Foto real — residência 2 pavimentos, piscina, interiores completos | **Residência Contemporânea** |
| `Carlos/` | 33 | Render — casa de praia, arcos, piscina de borda de areia | **Casa de Praia** |
| `Delicatessen/` | 16 | Render — mercado/delicatessen com adega e restaurante | **Delicatessen** |
| `dolcebydulce/` | 6 | Render — loja de moda | **Dolce by Dulce** |
| `escritorio ergo/` | 6 | Foto real — sede da Ergo | **Escritório Ergo** (usado em Sobre Nós) |

> ⚠️ Os nomes acima são descritivos e provisórios. A copy cita *Casa Serena, Chalé, Casa Poente, Casa Villa III, Casa MC*. O material não permite identificar com segurança qual pasta corresponde a qual nome — por isso os nomes ficam centralizados em `assets/js/dados.js` e podem ser trocados em 1 linha cada. Ver seção 7.

---

## 2. Arquitetura de informação

| Página | Arquivo | H1 | Meta title |
|---|---|---|---|
| Home | `index.html` | Construtora em Maragogi que transforma seu terreno em um projeto de alto padrão | Ergo Construtora \| Construção Civil e Reformas em Maragogi - AL |
| Sobre Nós | `sobre-nos.html` | A construtora que projeta ideias e concretiza excelência em Maragogi | Sobre a Ergo Construtora \| Construção Civil em Maragogi - AL |
| Serviços | `servicos.html` | Serviços de construção civil e arquitetura em Maragogi | Serviços de Construção Civil e Reforma em Maragogi \| Ergo Construtora |
| Projetos | `projetos.html` | Projetos e obras da Ergo Construtora em Maragogi | Projetos e Obras da Ergo Construtora em Maragogi - AL |
| Contato | `contato.html` | Fale com a Ergo Construtora em Maragogi | Contato \| Ergo Construtora em Maragogi - AL |
| Erro | `404.html` | — | — |

Navegação: Home · Sobre Nós · Serviços · Projetos · Contato + botão CTA WhatsApp fixo no header.

### Estrutura da Home (ordem das seções)
1. Header sticky claro (como no mockup da Ergo): **logo à esquerda, menu centralizado e um único botão "Entrar em contato"** à direita
2. **Hero no formato do mockup da Ergo** (`FigmaSite/Desenvolvimento-41.png`): título "Projetando ideias, concretizando excelência" à esquerda, frase de apoio à direita, fotografia grande em 21:9 (`imagens/fotohero.png`) e a linha "Sobre nós ··· Saiba mais" fechando o bloco
3. **Faixa de briefing** logo abaixo: abas Construir/Reformar, local, tipo de projeto, etapa, faixa de investimento com slider laranja e envio direto ao WhatsApp
3. Sobre a Ergo — texto à esquerda + grid 2×2 de números à direita
4. Faixa de credenciais (5,0 no Google · projeto + obra na mesma equipe · base em Maragogi · execução própria)
5. Nossos serviços — **grade numerada 3 × 2** (01 a 06) com título em destaque e link para a página de serviços
6. Como trabalhamos — imagem P&B com selo circular "Consultoria gratuita" + 6 etapas com ícones circulares
7. Equipe — carrossel de retratos, com o **CEO em primeiro** (legenda em laranja) seguido dos demais integrantes
8. **Catálogo de projetos** — bloco cinza com número da seção, título, descrição, carrossel de dois projetos e lista lateral de categorias que filtra os slides
9. Avaliação (nota 5,0 + prova social)
10. Por que Maragogi (seção escura + imagem)
11. Bloco de orçamento (3 seletores → WhatsApp com a mensagem montada)
12. FAQ (accordion + schema FAQPage)
13. Footer verde escuro com logomarca ERGO em largura total
14. Botão flutuante de WhatsApp

---

## 3. Design system — Modern Minimalist / Editorial

Direção visual definida com o cliente a partir de duas referências de *real estate* minimalista (a última: "Business Alliance — Commercial Real Estate"). Características aplicadas:

- **Folha em cinza claro** (`#f1f1ef`) com cards brancos — não o inverso
- **Fotografia de contexto em preto e branco** (hero e "como trabalhamos"); cor plena apenas no portfólio e no catálogo, onde a imagem vende
- **Tipografia contida**: títulos em 700 com tamanhos moderados (h1 até 56 px), corpo em 15–16 px — hierarquia por peso e espaço, não por escala
- **Blocos horizontais com muito respiro**: título à esquerda + conteúdo à direita
- Monocromia sobre o **verde escuro da marca no lugar do preto**; laranja apenas como acento pontual

- **Tipografia:** `Plus Jakarta Sans` (400–800) para títulos e corpo — geométrica, moderna, alinhada ao desenho da logomarca. Self-hosted em WOFF2 (27 KB), sem CDN externo.
- **Escala tipográfica fluida** com `clamp()` — sem breakpoints para tamanho de texto.
- **Grid:** folha de 1440 px; conteúdo em 1180 px (texto) e 1340 px (blocos visuais).
- **Raio de borda:** 22 px (blocos grandes), 16 px (cards e mídias), 999 px (pílulas).
- **Glassmorphism com moderação** (conforme briefing): apenas no header (blur ao rolar) e no painel das faixas de projeto — vidro escuro `rgba(24,29,24,.58)` + blur 20 px + borda 1 px, garantindo texto legível sobre qualquer foto.
- **Briefing em faixa horizontal**: em vez de uma busca de imóveis (que não se aplica a construtora), qualifica o lead em 5 campos e monta a mensagem do WhatsApp
- **Heros das páginas internas** em fotografia sangrada de ponta a ponta com overlay escuro
- **Página de Serviços enxuta**: hero + lista única dos 8 serviços com descrição (âncoras preservadas) + processo + CTA
- **Portfólio em cards** (texto + imagem, 2 colunas) que abrem a galeria do projeto
- **Portfólio em faixas horizontais empilhadas** (formato pedido pelo cliente): imagem larga + painel de vidro à esquerda com categoria, nome, descrição e CTA; contador de imagens no canto. Clique abre a **galeria do projeto** em lightbox com miniaturas, teclado e swipe. No celular o painel ancora na base para a foto continuar visível.
- **Layout em largura total** — sem moldura lateral; o conteúdo respira em containers de 1440 px.
- **Junções suaves entre seções:** o hero termina em degradê até o cinza da página e as seções escuras/claras têm degradês nas bordas, eliminando o corte seco na troca de fundo.
- **Animações:** entrada do hero em cascata (título → texto → CTA → card), parallax leve na foto, scroll reveal com deslocamento de 22 px, blocos em cascata (`data-stagger`, 90 ms entre filhos), imagens entrando com zoom-out de 1,08 → 1, contadores e hover de card. Todas respeitam `prefers-reduced-motion`.
- **Não usar:** typewriter, partículas, confete, splash screen, autoplay com som, parallax exagerado.

---

## 4. SEO

- Meta title/description por página (limites 60/155) conforme a copy
- 1 `<h1>` por página com a palavra-chave principal
- Open Graph + Twitter Card + imagem OG 1200×630 gerada a partir do acervo
- `<link rel="canonical">` em todas as páginas
- **JSON-LD:** `GeneralContractor` com geo, horários, telefone, avaliação e catálogo de serviços · `WebSite` · `BreadcrumbList` · `FAQPage` (Home e Serviços) · `CollectionPage` + `ItemList` (Projetos)
- **Image sitemap** com as 110 fotos dos projetos — como a galeria abre por JavaScript, é o sitemap que garante a indexação das imagens
- `sitemap.xml` + `robots.txt`
- URLs amigáveis, `alt` descritivo com palavra-chave local em 100 % das imagens
- Semântica: `header/nav/main/section/article/footer`, `aria-label`, `aria-expanded`, skip link
- Performance: WebP + `srcset/sizes`, `loading="lazy"`, `width/height` (evita CLS), preload do hero, CSS crítico inline mínimo, JS `defer`
- Palavras-chave trabalhadas: construtora em Maragogi, construtora Barra Grande, construção civil Alagoas, Costa dos Corais, reforma em Maragogi, projeto arquitetônico Maragogi AL, casa de praia em Alagoas, pavimentação Maragogi

---

## 5. Conversão

- Botão flutuante de WhatsApp em todas as páginas
- Barra de orçamento no hero da Home: 3 seletores que montam a mensagem e abrem o WhatsApp
- CTA de WhatsApp no header (fixo) e ao menos 2 blocos de CTA por página
- **Formulário sem backend:** valida no cliente e abre o WhatsApp comercial com a mensagem já formatada (nome, telefone, tipo de projeto, cidade, mensagem). Alternativa por e-mail no mesmo bloco.
- Links diretos: WhatsApp comercial, WhatsApp arquitetura, Instagram, Google Maps, telefone

---

## 6. Pipeline de assets

| Item | Processo |
|---|---|
| 110 imagens PNG (395 MB) | → WebP q78 em 3 larguras (1600/1000/600) com `srcset` |
| Logos | → PNG otimizado + WebP (versões branco/verde) |
| Símbolo da marca | → favicon 32/48/180/192/512 + `favicon.ico` + ícone maskable |
| OG image | → 1200×630 composta (foto + overlay + logo) |
| Fotos da equipe (4480×6720) | → recorte 3:4 no busto + WebP em 3 larguras (646 KB no total para 8 imagens) |
| Fontes | → Plus Jakarta Sans em WOFF2 self-hosted (latin + latin-ext, 27 KB) |

---

## 7. Informações pendentes de confirmação do cliente

1. **Telefones divergentes** — arquivo de negócio: (82) 98883-9919 e (82) 8878-1496; mockups do Figma: 81 98212-4657 e 81 98877-9939. *Assumido: os números do arquivo de negócio (verificados no Google Maps).*
2. **Endereço divergente** — arquivo de negócio: R. Dourado, Barra Grande, Maragogi/AL, 57955-000; wireframe: Av. Hélio Holanda Costa, nº 158, Maragogi/AL. *Assumido: o do arquivo de negócio.*
3. **Nome real de cada projeto** (mapeamento das 5 pastas para Casa Serena / Chalé / Casa Poente / Casa Villa III / Casa MC).
4. **E-mail oficial** — o wireframe traz `ergoconstrutora.egc@gmail.com`; confirmar se é o e-mail de contato público.
5. **Domínio final** (para canonical, sitemap e OG). *Assumido: `https://www.ergoconstrutora.com.br`.*
6. **Métricas da seção de números** (7+ projetos ativos, 100+ executados, 98 % de satisfação, 2+ anos) — vieram do mockup do Figma; confirmar antes de publicar.
7. **História da empresa e sócios** — a copy deixou espaço reservado.
7-b. **Nomes e cargos da equipe** — as fotos estão no site, mas os nomes não constavam em nenhum material. Os cards usam a função como título; preencha `EQUIPE` em `tools/build.js` (campo `nome`) e o nome passa a ser o título, com a função como linha de apoio. A ordem hoje é: CEO, Coordenação de obras, Administrativo e financeiro, Arquitetura e interiores — confirmar se as funções batem (foram inferidas do que cada pessoa segura nas fotos: trena e prancha, amostras de cor e livro de decoração, notebook).
8. **Missão, visão e valores** — redigidos pela copy com base no posicionamento; precisam de validação.
9. **Fotos dos projetos citados na copy sem imagem** (Chalé, Casa Poente, Casa MC).
10. **Facebook/LinkedIn** e ID do Google Business Profile (para o mapa e reviews).

---

## 8. Entrega

```
site/
├── index.html · sobre-nos.html · servicos.html · projetos.html · contato.html · 404.html
├── robots.txt · sitemap.xml · site.webmanifest
└── assets/
    ├── css/style.css
    ├── js/dados.js · main.js
    ├── fonts/  (Sora, Inter — WOFF2)
    ├── img/    (WebP responsivo por projeto + logos + OG)
    └── favicon/
```

Publicação: qualquer hospedagem estática (Hostinger, Netlify, Vercel, GitHub Pages, S3). Sem build, sem servidor, sem banco.
