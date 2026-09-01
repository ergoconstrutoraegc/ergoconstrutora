/* =========================================================
   ERGO CONSTRUTORA — Interações do site
   JavaScript puro, sem dependências.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. Header: estado ao rolar ---------- */
  var header = $('.header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 2. Menu mobile ---------- */
  var burger = $('.burger');
  var mobileMenu = $('.mobile-menu');
  if (burger && mobileMenu) {
    var toggleMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    };
    burger.addEventListener('click', function () {
      toggleMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', mobileMenu).forEach(function (a) {
      a.addEventListener('click', function () { toggleMenu(false); });
    });
    var btnFechar = $('.mobile-menu__close', mobileMenu);
    if (btnFechar) btnFechar.addEventListener('click', function () { toggleMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) toggleMenu(false);
    });
  }

  /* ---------- 3. Scroll reveal ---------- */
  // numera os filhos dos blocos em cascata
  $$('[data-stagger]').forEach(function (bloco) {
    Array.prototype.forEach.call(bloco.children, function (filho, i) {
      filho.style.setProperty('--i', i);
    });
  });

  var revealables = $$('[data-reveal], [data-stagger]');
  if (revealables.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var pendentes = revealables.slice();
      var mostrar = function (el) {
        el.classList.add('is-in');
        var i = pendentes.indexOf(el);
        if (i > -1) pendentes.splice(i, 1);
      };
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { mostrar(entry.target); io.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
      revealables.forEach(function (el) { io.observe(el); });

      // Rede de segurança: rolagem muito rápida (teclado, trackpad, âncora)
      // pode fazer o observer perder elementos. Aqui garantimos que nada
      // fique invisível depois de já ter passado pela tela.
      var varrendo = false;
      var varrer = function () {
        varrendo = false;
        for (var i = pendentes.length - 1; i >= 0; i--) {
          var el = pendentes[i];
          if (el.getBoundingClientRect().top < window.innerHeight * 0.96) {
            io.unobserve(el);
            mostrar(el);
          }
        }
        if (!pendentes.length) window.removeEventListener('scroll', agendarVarredura);
      };
      var agendarVarredura = function () {
        if (!varrendo) { varrendo = true; requestAnimationFrame(varrer); }
      };
      window.addEventListener('scroll', agendarVarredura, { passive: true });
      window.addEventListener('load', agendarVarredura);
    }
  }

  /* ---------- 4. Contadores animados ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCounter = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
      if (reduceMotion) {
        el.textContent = target.toFixed(decimals).replace('.', ',') + suffix;
        return;
      }
      var dur = 1400, start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals).replace('.', ',') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var ioC = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); ioC.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { ioC.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- 5. Parallax discreto do hero ---------- */
  var heroBg = $('.hero3__bg');
  if (heroBg && !reduceMotion) {
    var tick = false;
    var mover = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.3) heroBg.style.transform = 'translate3d(0,' + (y * 0.14).toFixed(1) + 'px,0) scale(1.06)';
      tick = false;
    };
    heroBg.style.transform = 'scale(1.06)';
    window.addEventListener('scroll', function () {
      if (!tick) { requestAnimationFrame(mover); tick = true; }
    }, { passive: true });
  }

  var heroMedia = $('.hero__media img');
  if (heroMedia && !reduceMotion && window.matchMedia('(min-width: 48rem)').matches) {
    var ticking = false;
    var parallax = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroMedia.style.transform = 'translate3d(0,' + (y * 0.09).toFixed(1) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ---------- 6. FAQ (accordion acessível) ---------- */
  $$('.faq__q').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      // fecha os demais do mesmo grupo
      var group = btn.closest('.faq');
      if (group && !open) {
        $$('.faq__q[aria-expanded="true"]', group).forEach(function (other) {
          other.setAttribute('aria-expanded', 'false');
          var p = document.getElementById(other.getAttribute('aria-controls'));
          if (p) p.style.height = '0px';
        });
      }
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* ---------- 7. Filtros de projetos ---------- */
  var filterBar = $('[data-filters]');
  if (filterBar) {
    var itens = $$('[data-cat]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var val = btn.getAttribute('data-filter');
      $$('button', filterBar).forEach(function (b) {
        var ativo = b === btn;
        b.setAttribute('aria-pressed', String(ativo));
        b.classList.toggle('btn--dark', ativo);
        b.classList.toggle('btn--outline', !ativo);
      });
      itens.forEach(function (item) {
        item.hidden = !(val === 'todos' || item.getAttribute('data-cat') === val);
      });
    });
  }

  /* ---------- 8. Galeria do projeto (lightbox) ---------- */
  var lightbox = $('.lightbox');
  var dadosEl = document.getElementById('dados-galerias');
  if (lightbox && dadosEl) {
    var GAL = {};
    try { GAL = JSON.parse(dadosEl.textContent); } catch (e) { GAL = {}; }

    var lbImg = $('.lightbox__stage img', lightbox);
    var lbTitle = $('.lightbox__title', lightbox);
    var lbCount = $('.lightbox__count', lightbox);
    var lbThumbs = $('.lightbox__thumbs', lightbox);
    var fotos = [], indice = 0, projeto = null, focoAnterior = null;

    var pintarThumbs = function () {
      lbThumbs.innerHTML = fotos.map(function (f, i) {
        return '<button type="button" data-i="' + i + '" aria-current="' + (i === indice) + '" aria-label="Ir para a imagem ' + (i + 1) + '">' +
               '<img src="' + f.t + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('');
    };
    var atualizarThumbAtiva = function () {
      $$('button', lbThumbs).forEach(function (b, i) {
        b.setAttribute('aria-current', String(i === indice));
        if (i === indice) b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      });
    };
    var render = function () {
      var f = fotos[indice];
      if (!f) return;
      lbImg.src = f.f;
      lbImg.alt = f.a;
      lbCount.textContent = (indice + 1) + ' de ' + fotos.length + (projeto.cat ? ' · ' + projeto.cat : '');
      atualizarThumbAtiva();
    };
    var abrir = function (slug, i) {
      projeto = GAL[slug];
      if (!projeto) return;
      fotos = projeto.fotos;
      indice = i || 0;
      lbTitle.textContent = projeto.nome;
      pintarThumbs();
      render();
      lightbox.classList.add('is-open');
      document.body.classList.add('is-locked');
      $('.lightbox__close', lightbox).focus();
      // pré-carrega a imagem seguinte
      if (fotos[indice + 1]) new Image().src = fotos[indice + 1].f;
    };
    var fechar = function () {
      lightbox.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      if (focoAnterior) focoAnterior.focus();
    };
    var mover = function (d) {
      indice = (indice + d + fotos.length) % fotos.length;
      render();
      if (fotos[indice + d]) new Image().src = fotos[indice + d].f;
    };

    document.addEventListener('click', function (e) {
      var gatilho = e.target.closest('[data-galeria]');
      if (gatilho) {
        e.preventDefault();
        focoAnterior = gatilho;
        abrir(gatilho.getAttribute('data-galeria'), 0);
        return;
      }
      var thumb = e.target.closest('.lightbox__thumbs button');
      if (thumb) { indice = parseInt(thumb.getAttribute('data-i'), 10); render(); }
    });
    $('.lightbox__close', lightbox).addEventListener('click', fechar);
    $('.lightbox__nav--prev', lightbox).addEventListener('click', function () { mover(-1); });
    $('.lightbox__nav--next', lightbox).addEventListener('click', function () { mover(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) fechar();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowLeft') mover(-1);
      if (e.key === 'ArrowRight') mover(1);
    });
    var xIni = null;
    lightbox.addEventListener('touchstart', function (e) { xIni = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (xIni === null) return;
      var dx = e.changedTouches[0].clientX - xIni;
      if (Math.abs(dx) > 45) mover(dx < 0 ? 1 : -1);
      xIni = null;
    }, { passive: true });

    // abre a galeria direto pelo endereço (#residencia-contemporanea)
    var hash = window.location.hash.replace('#', '');
    if (hash && GAL[hash]) {
      var alvo = document.getElementById(hash);
      if (alvo) alvo.scrollIntoView();
    }
  }

  /* ---------- 9. Formulário → WhatsApp ---------- */
  var form = $('#form-orcamento');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (field) {
        var input = $('input, select, textarea', field);
        if (!input || !input.required) return;
        var valid = input.value.trim() !== '';
        if (input.type === 'email' && valid) valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);
        if (input.name === 'telefone' && valid) valid = input.value.replace(/\D/g, '').length >= 10;
        field.classList.toggle('is-invalid', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      var d = new FormData(form);
      var linhas = [
        '*Novo contato pelo site — Ergo Construtora*',
        '',
        '*Nome:* ' + (d.get('nome') || ''),
        '*Telefone:* ' + (d.get('telefone') || ''),
        '*E-mail:* ' + (d.get('email') || '—'),
        '*Tipo de projeto:* ' + (d.get('tipo') || '—'),
        '*Cidade do terreno/imóvel:* ' + (d.get('cidade') || '—'),
        '',
        (d.get('mensagem') || '').trim()
      ];
      var numero = (window.ERGO && window.ERGO.whatsappComercial) || '5582988839919';
      var url = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(linhas.join('\n'));

      var okBox = $('.form__ok', form);
      if (okBox) okBox.classList.add('is-visible');
      window.open(url, '_blank', 'noopener');
      form.reset();
    });

    // máscara simples de telefone
    var tel = $('input[name="telefone"]', form);
    if (tel) {
      tel.addEventListener('input', function () {
        var v = tel.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        else if (v.length > 6) v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        else if (v.length) v = v.replace(/(\d{0,2})/, '($1');
        tel.value = v;
      });
    }
  }

  /* ---------- 9b. Barra de orçamento do hero ---------- */
  var barra = $('#orcamento-rapido');
  if (barra) {
    barra.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(barra);
      var texto = [
        'Olá! Vim pelo site da Ergo Construtora.',
        '',
        '*O que preciso:* ' + d.get('tipo'),
        '*Onde fica o imóvel:* ' + d.get('cidade'),
        '*Etapa atual:* ' + d.get('etapa'),
        '',
        'Podem me passar um orçamento?'
      ].join('\n');
      var numero = (window.ERGO && window.ERGO.whatsappComercial) || '5582988839919';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  /* ---------- 9c. Carrossel do catálogo de serviços ---------- */
  $$('[data-carousel]').forEach(function (track) {
    var bloco = track.closest('div').parentElement;
    var prev = $('[data-carousel-prev]', bloco);
    var next = $('[data-carousel-next]', bloco);
    if (!prev || !next) return;
    var passo = function () {
      var item = track.firstElementChild;
      if (!item) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || '16');
      return item.getBoundingClientRect().width + gap;
    };
    var estado = function () {
      var max = track.scrollWidth - track.clientWidth - 2;
      var temRolagem = max > 2;
      // sem conteúdo para rolar, as setas saem de cena
      var nav = prev.parentElement;
      if (nav) nav.style.display = temRolagem ? '' : 'none';
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    prev.addEventListener('click', function () { track.scrollBy({ left: -passo(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: passo(), behavior: 'smooth' }); });
    track.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);
    estado();
  });

  /* ---------- 9d. Hero: miniaturas, abas, faixa e briefing ---------- */
  var heroFoto = $('.hero2__media img');
  var thumbs = $$('.hero2__thumbs button');
  if (heroFoto && thumbs.length) {
    thumbs.forEach(function (b) {
      // pré-carrega a versão grande ao passar o mouse
      b.addEventListener('mouseenter', function () {
        var url = b.getAttribute('data-hero-src');
        if (url) new Image().src = url;
      });
      b.addEventListener('click', function () {
        var url = b.getAttribute('data-hero-src');
        if (!url) return;
        thumbs.forEach(function (o) { o.setAttribute('aria-current', String(o === b)); });
        heroFoto.style.opacity = '0';
        var nova = new Image();
        nova.onload = function () {
          heroFoto.removeAttribute('srcset');
          heroFoto.src = url;
          heroFoto.alt = b.getAttribute('data-hero-alt') || heroFoto.alt;
          heroFoto.style.opacity = '1';
        };
        nova.src = url;
      });
    });
  }

  var briefing = $('#briefing');
  if (briefing) {
    // abas Construir / Reformar
    var aba = 'Construir';
    $$('[data-tab]', briefing).forEach(function (b) {
      b.addEventListener('click', function () {
        aba = b.getAttribute('data-tab');
        $$('[data-tab]', briefing).forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
      });
    });

    // faixa de investimento
    var faixa = $('#b-valor', briefing);
    var rotulo = $('#b-valor-label', briefing);
    var textoFaixa = function (v) {
      v = parseInt(v, 10);
      if (v >= 3000) return 'acima de R$ 3 mi';
      if (v >= 1000) return 'até R$ ' + (v / 1000).toFixed(1).replace('.0', '').replace('.', ',') + ' mi';
      return 'até R$ ' + v + ' mil';
    };
    var pintaFaixa = function () {
      var pct = ((faixa.value - faixa.min) / (faixa.max - faixa.min)) * 100;
      faixa.style.setProperty('--pct', pct.toFixed(1) + '%');
      rotulo.textContent = textoFaixa(faixa.value);
    };
    faixa.addEventListener('input', pintaFaixa);
    pintaFaixa();

    briefing.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(briefing);
      var linhas = [
        'Olá! Vim pelo site da Ergo Construtora.',
        '',
        '*Quero:* ' + aba,
        '*Local:* ' + ((d.get('local') || '').trim() || 'a definir'),
        '*Tipo de projeto:* ' + (d.get('tipo') || 'a definir'),
        '*Etapa atual:* ' + (d.get('etapa') || 'a definir'),
        '*Investimento previsto:* ' + textoFaixa(faixa.value),
        '',
        'Podem me enviar um orçamento?'
      ];
      var numero = (window.ERGO && window.ERGO.whatsappComercial) || '5582988839919';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  /* ---------- 9e. Newsletter do rodapé ---------- */
  var news = $('#newsletter');
  if (news) {
    news.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('input[name="email"]', news);
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value)) {
        if (email) email.focus();
        return;
      }
      var numero = (window.ERGO && window.ERGO.whatsappComercial) || '5582988839919';
      var texto = 'Olá! Quero receber as novidades das obras da Ergo. Meu e-mail: ' + email.value;
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      news.classList.add('is-ok');
      email.value = '';
    });
  }

  /* ---------- 9f. Catálogo de projetos da home ---------- */
  var trilho = $('[data-catalog-track]');
  if (trilho) {
    var bloco = trilho.closest('.catalog');
    var anterior = $('[data-catalog-prev]', bloco);
    var proximo = $('[data-catalog-next]', bloco);
    var slides = $$('.catalog__slide', trilho);

    var passo = function () {
      var visivel = slides.filter(function (s) { return !s.hidden; })[0];
      if (!visivel) return trilho.clientWidth;
      var gap = parseFloat(getComputedStyle(trilho).columnGap || '14');
      return visivel.getBoundingClientRect().width + gap;
    };
    var estado = function () {
      var max = trilho.scrollWidth - trilho.clientWidth - 2;
      var rolavel = max > 2;
      var nav = anterior.parentElement;
      if (nav) nav.style.visibility = rolavel ? '' : 'hidden';
      anterior.disabled = trilho.scrollLeft <= 2;
      proximo.disabled = trilho.scrollLeft >= max;
    };
    anterior.addEventListener('click', function () { trilho.scrollBy({ left: -passo(), behavior: 'smooth' }); });
    proximo.addEventListener('click', function () { trilho.scrollBy({ left: passo(), behavior: 'smooth' }); });
    trilho.addEventListener('scroll', estado, { passive: true });
    window.addEventListener('resize', estado);

    $$('.catalog__cats button', bloco).forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-cat');
        $$('.catalog__cats button', bloco).forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
        slides.forEach(function (s) {
          var cats = (s.getAttribute('data-cats') || '').split(',');
          s.hidden = !(cat === 'todos' || cats.indexOf(cat) > -1);
        });
        trilho.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(estado, 320);
      });
    });
    estado();
  }

  /* ---------- 10. Utilitários ---------- */
  var ano = $('#ano-atual');
  if (ano) ano.textContent = new Date().getFullYear();

  // destaca o horário de hoje
  var hoje = new Date().getDay();
  var linhaHoje = $('.hours li[data-dia="' + hoje + '"]');
  if (linhaHoje) linhaHoje.classList.add('is-today');
})();
