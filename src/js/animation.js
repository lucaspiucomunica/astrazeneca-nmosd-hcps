// Animações do site NMOSD com GSAP e ScrollTrigger
(function () {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detecta se há uma âncora na URL
  function hasAnchor() {
    return window.location.hash && window.location.hash.length > 1;
  }

  // Verifica se um elemento está visível no viewport atual
  function isInViewport(element, threshold = 0.1) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    // Verifica se o elemento está pelo menos parcialmente visível
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return vertInView && horInView;
  }

  // Verifica se um elemento já passou do ponto de trigger
  function hasPassedTriggerPoint(element, startOffset = 'top 80%') {
    if (!element || !window.ScrollTrigger) return false;
    
    // Parse do offset (ex: 'top 80%' -> 0.8)
    const match = startOffset.match(/(\d+)%/);
    const percentage = match ? parseInt(match[1]) / 100 : 0.8;
    
    const rect = element.getBoundingClientRect();
    const triggerPoint = window.innerHeight * percentage;
    
    // Se o topo do elemento está acima do ponto de trigger, já passou
    return rect.top < triggerPoint;
  }

  // Remove spans vazios criados pelo SplitText
  function cleanEmptySpans(splitTextInstance) {
    if (!splitTextInstance || !splitTextInstance.lines) return;
    
    splitTextInstance.lines.forEach(line => {
      const spans = line.querySelectorAll('span');
      spans.forEach(span => {
        if (!span.textContent.trim()) {
          span.remove();
        }
      });
    });
  }

  // Função para animar a seção hero
  function runHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    const heroContentBg = document.querySelector('.hero-content-bg');
    const heroContentText = document.querySelector('.hero-content-text');
    const letteringImg = document.querySelector('.hero-content-text img[alt="NMOSD"]');
    const heroParagraph = document.querySelector('.hero-content-text p');

    if (!heroSection || !heroContent || !heroContentBg || !heroContentText || !letteringImg || !heroParagraph) {
      console.warn('Elementos da hero section não encontrados');
      return;
    }

    // Verifica se GSAP está disponível
    if (typeof window.gsap === 'undefined') {
      console.warn('GSAP não está carregado');
      return;
    }

    // Registra plugins do GSAP se disponíveis
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Se o usuário prefere movimento reduzido, apenas torna os elementos visíveis
    if (prefersReducedMotion) {
      gsap.set([heroContentText, letteringImg, heroParagraph], { opacity: 1, x: 0, scale: 1 });
      gsap.set(heroContentBg, { scale: 1 });
      return;
    }

    // Timeline principal das animações
    const tl = gsap.timeline({ 
      defaults: { ease: 'power3.out' },
      delay: 0.2 // Pequeno delay inicial para suavizar o carregamento
    });

    // Estados iniciais
    gsap.set(heroContentBg, { 
      scale: 1.1, // Começa com zoom in para fazer zoom out
      transformOrigin: '50% 50%'
    });
    gsap.set(heroContentText, { 
      opacity: 0 // Fade-in rápido para mobile
    });
    gsap.set(letteringImg, { 
      opacity: 0, 
      x: 60, 
      scale: 0.9,
      transformOrigin: '0% 50%'
    });
    gsap.set(heroParagraph, { 
      opacity: 0, 
      x: 40
    });

    // Animação 0: Fade-in rápido do hero-content-text (importante para mobile)
    tl.to(heroContentText, {
      opacity: 1,
      duration: 0.4
    }, 0);

    // Animação 1: Zoom out no background usando a div separada
    tl.to(heroContentBg, {
      scale: 1,
      duration: 2,
      ease: 'power2.out'
    }, 0);

    // Animação 2: Scale in left na imagem do lettering
    tl.to(letteringImg, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power2.out'
    }, 0.3);

    // Animação 3: Fade in left no parágrafo
    tl.to(heroParagraph, {
      opacity: 1,
      x: 0,
      duration: 1.8
    }, 0.6);
  }

  function runOQueEAnimations() {
    const section = document.getElementById('o-que-e-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Primeira linha/row da seção - conteúdo principal
    const mainRow = section.querySelector('.flex.lg\\:flex-row.flex-col.items-center');
    if (!mainRow) return;

    const leftCol = mainRow.children && mainRow.children.length > 0 ? mainRow.children[0] : null;
    const rightCol = mainRow.children && mainRow.children.length > 1 ? mainRow.children[1] : null;

    // Elementos da coluna esquerda
    const contentText = leftCol ? leftCol.querySelector('.content-text') : null;
    const title = contentText ? contentText.querySelector('h2') : null;
    const paragraphs = contentText ? contentText.querySelectorAll('p') : [];
    const card = leftCol ? leftCol.querySelector('.card-primary') : null;

    // Elemento da coluna direita
    const imageWrapper = rightCol ? rightCol.querySelector('.content-image') : null;
    const image = imageWrapper ? imageWrapper.querySelector('img') : null;

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      paragraphs.forEach(p => (p.style.opacity = '1'));
      if (card) card.style.opacity = '1';
      if (imageWrapper) imageWrapper.style.opacity = '1';
      if (image) image.style.transform = 'scale(1)';
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (paragraphs && paragraphs.length) gsap.set(paragraphs, { y: 20, opacity: 0 });
    if (card) gsap.set(card, { y: 24, opacity: 0, scale: 0.98, transformOrigin: '50% 50%' });
    if (imageWrapper) gsap.set(imageWrapper, { x: 32, opacity: 0, scale: 0.98, transformOrigin: '50% 50%' });
    if (image) gsap.set(image, { scale: 1.08, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Título com animação simples
    if (title) {
      gsap.set(title, { y: 24, opacity: 0 });
      tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);
    }

    // Parágrafos entram em sequência após o título
    if (paragraphs && paragraphs.length) {
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 }, '>-0.2');
    }

    // Card surge de baixo com leve pop
    if (card) {
      tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, '>-0.1');
    }

    // Imagem surge da direita com zoom-out suave
    if (imageWrapper) tl.to(imageWrapper, { x: 0, opacity: 1, scale: 1, duration: 0.8 }, '>-0.3');
    if (image) tl.to(image, { scale: 1, duration: 1.6, ease: 'power2.out' }, '<');

    if (shouldAnimate) {
      tl.delay(0.4);
    }

    // Anima o bloco guia separadamente
    const blockGuia = section.querySelector('.block-guia');
    if (blockGuia) {
      const shouldAnimateGuia = hasPassedTriggerPoint(blockGuia, 'top 80%');

      if (prefersReducedMotion) {
        gsap.set(blockGuia, { opacity: 1, scale: 1 });
      } else {
        gsap.set(blockGuia, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' });

        if (shouldAnimateGuia) {
          gsap.to(blockGuia, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: 0.6
          });
        } else {
          gsap.to(blockGuia, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: blockGuia,
              start: 'top 80%',
              toggleActions: 'play none play none',
              once: true,
            },
          });
        }
      }
    }
  }

  function runEpidemiologiaAnimations() {
    const section = document.getElementById('epidemiologia-da-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Row principal da seção
    const mainRow = section.querySelector('.flex.ml\\:flex-row.flex-col.items-center');
    if (!mainRow) return;

    const leftCol = mainRow.children && mainRow.children.length > 0 ? mainRow.children[0] : null;
    const rightCol = mainRow.children && mainRow.children.length > 1 ? mainRow.children[1] : null;

    // Elementos da coluna esquerda (textos)
    const contentText = leftCol ? leftCol.querySelector('.content-text') : null;
    const title = contentText ? contentText.querySelector('h2') : null;
    const paragraphs = contentText ? contentText.querySelectorAll('p') : [];

    // Elementos da coluna direita (cards)
    const cardList = rightCol ? rightCol.querySelector('.card-list') : null;
    const cards = cardList ? cardList.querySelectorAll('.card-primary') : [];

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      paragraphs.forEach(p => (p.style.opacity = '1'));
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (title) gsap.set(title, { y: 24, opacity: 0 });
    if (paragraphs && paragraphs.length) gsap.set(paragraphs, { y: 20, opacity: 0 });
    if (cards && cards.length) gsap.set(cards, { y: 32, opacity: 0, scale: 0.95, transformOrigin: '50% 50%' });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Título surge primeiro
    if (title) {
      tl.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);
    }

    // Parágrafos entram em sequência após o título
    if (paragraphs && paragraphs.length) {
      tl.to(paragraphs, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 }, '>-0.2');
    }

    // Cards surgem de baixo para cima com scale e fade
    if (cards && cards.length) {
      tl.to(cards, { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.7, 
        stagger: 0.12,
        ease: 'power2.out'
      }, '>-0.1');
    }

    if (shouldAnimate) {
      tl.delay(0.5);
    }
  }

  function runSintomasAnimations() {
    const section = document.getElementById('sintomas-da-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Título da seção
    const titleRow = section.querySelector('.flex.mb-10');
    const title = titleRow ? titleRow.querySelector('h2') : null;

    // Grid dos cards de sintomas
    const cardsGrid = section.querySelector('.grid.sm\\:grid-cols-5');
    const cards = cardsGrid ? cardsGrid.querySelectorAll('.card-primary') : [];

    // Bloco "Como afeta"
    const blockComoAfeta = section.querySelector('.block-como-afeta');

    // Bloco do vídeo
    const blockVideoSintomas = section.querySelector('.block-video-sintomas-desafios');

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      });
      if (blockComoAfeta) {
        blockComoAfeta.style.opacity = '1';
        blockComoAfeta.style.transform = 'scale(1)';
      }
      if (blockVideoSintomas) {
        blockVideoSintomas.style.opacity = '1';
        blockVideoSintomas.style.transform = 'scale(1)';
      }
      return;
    }

    const shouldAnimateTitle = hasPassedTriggerPoint(titleRow || section, 'top 75%');
    const shouldAnimateCards = hasPassedTriggerPoint(cardsGrid, 'top 80%');
    const shouldAnimateBlock = hasPassedTriggerPoint(blockComoAfeta, 'top 80%');
    const shouldAnimateVideo = hasPassedTriggerPoint(blockVideoSintomas, 'top 80%');

    // Animação do título
    if (title) {
      gsap.set(title, { y: 24, opacity: 0 });

      const tlTitle = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: shouldAnimateTitle ? null : {
          trigger: titleRow || section,
          start: 'top 75%',
          toggleActions: 'play none play none',
          once: true,
        },
      });

      tlTitle.to(title, { y: 0, opacity: 1, duration: 0.6 }, 0);

      if (shouldAnimateTitle) {
        tlTitle.delay(0.3);
      }
    }

    // Animação dos cards
    if (cards && cards.length) {
      gsap.set(cards, { y: 32, opacity: 0, scale: 0.95, transformOrigin: '50% 50%' });

      const tlCards = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: shouldAnimateCards ? null : {
          trigger: cardsGrid,
          start: 'top 80%',
          toggleActions: 'play none play none',
          once: true,
        },
      });

      tlCards.to(cards, { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.7, 
        stagger: 0.12
      }, 0);

      if (shouldAnimateCards) {
        tlCards.delay(0.5);
      }
    }

    // Animação do bloco "Como afeta" (mesma do block-guia)
    if (blockComoAfeta) {
      gsap.set(blockComoAfeta, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' });

      if (shouldAnimateBlock) {
        gsap.to(blockComoAfeta, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.7
        });
      } else {
        gsap.to(blockComoAfeta, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: blockComoAfeta,
            start: 'top 80%',
            toggleActions: 'play none play none',
            once: true,
          },
        });
      }
    }

    // Animação do bloco de vídeo (mesma do block-guia)
    if (blockVideoSintomas) {
      gsap.set(blockVideoSintomas, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' });

      if (shouldAnimateVideo) {
        gsap.to(blockVideoSintomas, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.9
        });
      } else {
        gsap.to(blockVideoSintomas, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: blockVideoSintomas,
            start: 'top 80%',
            toggleActions: 'play none play none',
            once: true,
          },
        });
      }
    }
  }

  function runNmosdEscleroseAnimations() {
    const section = document.getElementById('nmosd-x-esclerose-multipla');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Row principal da seção
    const mainRow = section.querySelector('.flex.lg\\:flex-row.flex-col');
    if (!mainRow) return;

    const leftCol = mainRow.children && mainRow.children.length > 0 ? mainRow.children[0] : null;
    const rightCol = mainRow.children && mainRow.children.length > 1 ? mainRow.children[1] : null;

    // Elementos da coluna esquerda
    const leftContentText = leftCol ? leftCol.querySelector('.content-text') : null;
    const leftTitle = leftContentText ? leftContentText.querySelector('h2') : null;
    const leftParagraphs = leftContentText ? leftContentText.querySelectorAll('p') : [];

    // Elementos da coluna direita
    const rightContentText = rightCol ? rightCol.querySelector('.content-text') : null;
    const rightTitle = rightContentText ? rightContentText.querySelector('h3') : null;
    const tableWrapper = rightCol ? rightCol.querySelector('.table-ui') : null;

    // Bloco decorativo
    const blockDiferencial = section.querySelector('.block-diferencial-em-nmosd');

    if (prefersReducedMotion) {
      if (leftTitle) leftTitle.style.opacity = '1';
      leftParagraphs.forEach(p => (p.style.opacity = '1'));
      if (rightTitle) rightTitle.style.opacity = '1';
      if (tableWrapper) tableWrapper.style.opacity = '1';
      if (blockDiferencial) {
        blockDiferencial.style.opacity = '1';
        blockDiferencial.style.transform = 'scale(1)';
      }
      return;
    }

    const shouldAnimateMain = hasPassedTriggerPoint(section, 'top 75%');
    const shouldAnimateBlock = hasPassedTriggerPoint(blockDiferencial, 'top 80%');

    // Estados iniciais
    if (leftTitle) gsap.set(leftTitle, { y: 24, opacity: 0 });
    if (leftParagraphs && leftParagraphs.length) gsap.set(leftParagraphs, { y: 20, opacity: 0 });
    if (rightTitle) gsap.set(rightTitle, { y: 20, opacity: 0 });
    if (tableWrapper) gsap.set(tableWrapper, { opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimateMain ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Título da esquerda surge primeiro
    if (leftTitle) {
      tl.to(leftTitle, { y: 0, opacity: 1, duration: 0.6 }, 0);
    }

    // Parágrafos da esquerda entram em sequência
    if (leftParagraphs && leftParagraphs.length) {
      tl.to(leftParagraphs, { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 }, '>-0.2');
    }

    // Título da direita
    if (rightTitle) {
      tl.to(rightTitle, { y: 0, opacity: 1, duration: 0.5 }, '>-0.1');
    }

    // Tabela com fade simples
    if (tableWrapper) {
      tl.to(tableWrapper, { opacity: 1, duration: 0.6 }, '>-0.2');
    }

    if (shouldAnimateMain) {
      tl.delay(0.4);
    }

    // Animação do bloco decorativo (mesma dos outros blocos)
    if (blockDiferencial) {
      gsap.set(blockDiferencial, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%' });

      if (shouldAnimateBlock) {
        gsap.to(blockDiferencial, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.6
        });
      } else {
        gsap.to(blockDiferencial, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: blockDiferencial,
            start: 'top 80%',
            toggleActions: 'play none play none',
            once: true,
          },
        });
      }
    }
  }

  function runDiagnosticoNmosdAnimations() {
    const section = document.getElementById('diagnostico-da-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);

    // Coluna esquerda
    const leftCol = section.querySelector('.lg\\:w-4\\/12');
    const title = leftCol ? leftCol.querySelector('h2') : null;
    const paragraph = leftCol ? leftCol.querySelector('p') : null;
    const listItems = leftCol ? leftCol.querySelectorAll('.list-item') : [];

    // Coluna direita - tabs
    const rightCol = section.querySelector('.lg\\:w-8\\/12');
    const tabsNav = rightCol ? rightCol.querySelector('.tabs-diagnostico-nav') : null;
    const tabsContainer = rightCol ? rightCol.querySelector('.tabs-diagnostico-container') : null;

    if (prefersReducedMotion) {
      if (title) title.style.opacity = '1';
      if (paragraph) paragraph.style.opacity = '1';
      listItems.forEach(item => item.style.opacity = '1');
      if (tabsNav) tabsNav.style.opacity = '1';
      if (tabsContainer) tabsContainer.style.opacity = '1';
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais - coluna esquerda
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (paragraph) gsap.set(paragraph, { opacity: 0, y: 18 });
    if (listItems.length) gsap.set(listItems, { opacity: 0, x: -20, y: 8 });

    // Estados iniciais - coluna direita
    if (tabsNav) gsap.set(tabsNav, { opacity: 0, y: 16 });
    if (tabsContainer) gsap.set(tabsContainer, { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Animação da coluna esquerda
    if (title && window.SplitText) {
      gsap.set(title, { opacity: 1 });
      const split = new SplitText(title, { type: 'lines', linesClass: 'split-line' });
      cleanEmptySpans(split);
      gsap.set(split.lines, { yPercent: 120, opacity: 0 });
      tl.to(split.lines, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0);
    } else if (title) {
      tl.to(title, { opacity: 1, y: 0, duration: 0.7 }, 0);
    }

    if (paragraph) tl.to(paragraph, { opacity: 1, y: 0, duration: 0.6 }, '>-0.2');
    
    // Lista com ícones: animação sequencial dos itens
    if (listItems.length) {
      tl.to(listItems, { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        duration: 0.5, 
        stagger: 0.15,
        ease: 'power2.out'
      }, '>-0.1');
    }

    // Animação da coluna direita (simplificada)
    if (tabsNav) tl.to(tabsNav, { opacity: 1, y: 0, duration: 0.6 }, '>-0.3');
    if (tabsContainer) tl.to(tabsContainer, { opacity: 1, y: 0, duration: 0.7 }, '>-0.1');

    if (shouldAnimate) {
      tl.delay(0.4);
    }
  }

  function runTratamentoNmosdAnimations() {
    const section = document.getElementById('tratamento-da-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Título principal da seção
    const title = section.querySelector('h2');
    
    // Duas colunas completas
    const columns = section.querySelectorAll('.sm\\:w-1\\/2');
    const leftColumn = columns[0] || null;
    const rightColumn = columns[1] || null;

    if (prefersReducedMotion) {
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (leftColumn) gsap.set(leftColumn, { opacity: 1, y: 0 });
      if (rightColumn) gsap.set(rightColumn, { opacity: 1, y: 0 });
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (leftColumn) gsap.set(leftColumn, { opacity: 0, y: 32 });
    if (rightColumn) gsap.set(rightColumn, { opacity: 0, y: 32 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Sequência da animação: título -> colunas de baixo para cima
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0);
    
    // Colunas surgem de baixo para cima com stagger
    if (leftColumn && rightColumn) {
      tl.to([leftColumn, rightColumn], { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, '>-0.2');
    } else {
      if (leftColumn) tl.to(leftColumn, { opacity: 1, y: 0, duration: 0.7 }, '>-0.2');
      if (rightColumn) tl.to(rightColumn, { opacity: 1, y: 0, duration: 0.7 }, '>+0.05');
    }

    if (shouldAnimate) {
      tl.delay(0.4);
    }
  }

  function runFisiopatologiaNmosdAnimations() {
    const section = document.getElementById('fisiopatologia-da-nmosd');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Colunas principais
    const leftColumn = section.querySelector('.lg\\:w-1\\/2:first-of-type');
    const rightColumn = section.querySelector('.lg\\:w-1\\/2:last-of-type');
    
    // Elementos da coluna esquerda
    const title = leftColumn ? leftColumn.querySelector('h2') : null;
    const subtitle = leftColumn ? leftColumn.querySelector('h3') : null;
    const paragraphs = leftColumn ? leftColumn.querySelectorAll('p') : [];
    const cardWithChart = leftColumn ? leftColumn.querySelector('.card-primary') : null;
    const button = leftColumn ? leftColumn.querySelector('.btn') : null;

    // Imagem da coluna direita
    const rightImage = rightColumn ? rightColumn.querySelector('.content-image') : null;

    if (prefersReducedMotion) {
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
      paragraphs.forEach(p => gsap.set(p, { opacity: 1, y: 0 }));
      if (cardWithChart) gsap.set(cardWithChart, { opacity: 1, x: 0 });
      if (button) gsap.set(button, { opacity: 1, y: 0 });
      if (rightImage) gsap.set(rightImage, { opacity: 1, y: 0 });
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 16 });
    if (paragraphs.length) gsap.set(paragraphs, { opacity: 0, y: 16 });
    if (cardWithChart) gsap.set(cardWithChart, { opacity: 0, x: 40 }); // fade in right
    if (button) gsap.set(button, { opacity: 0, y: 16 });
    if (rightImage) gsap.set(rightImage, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Sequência da animação
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0);
    if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, '>-0.2');
    if (paragraphs.length) tl.to(paragraphs, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '>-0.1');
    
    // Card com gráfico: fade in da direita
    if (cardWithChart) tl.to(cardWithChart, { opacity: 1, x: 0, duration: 0.7 }, '>-0.1');
    
    if (button) tl.to(button, { opacity: 1, y: 0, duration: 0.5 }, '>-0.4');
    
    // Imagem da direita (após o botão)
    if (rightImage) tl.to(rightImage, { opacity: 1, y: 0, duration: 0.6 }, '>-0.1');

    if (shouldAnimate) {
      tl.delay(0.4);
    }
  }

  function runPortalMedicoAnimations() {
    const section = document.getElementById('portal-medico');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Elementos da coluna esquerda
    const leftColumn = section.querySelector('.max-w-\\[500px\\]');
    const title = leftColumn ? leftColumn.querySelector('h2') : null;
    const button = leftColumn ? leftColumn.querySelector('.btn') : null;
    
    // Imagem da coluna direita
    const rightColumn = section.querySelector('.w-full:last-child');
    const image = rightColumn ? rightColumn.querySelector('.content-img') : null;

    if (prefersReducedMotion) {
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (button) gsap.set(button, { opacity: 1, y: 0 });
      if (image) gsap.set(image, { opacity: 1, y: 0 });
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (button) gsap.set(button, { opacity: 0, y: 16 });
    if (image) gsap.set(image, { opacity: 0, y: 24 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Sequência: título -> botão -> imagem
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0);
    if (button) tl.to(button, { opacity: 1, y: 0, duration: 0.5 }, '>-0.2');
    if (image) tl.to(image, { opacity: 1, y: 0, duration: 0.6 }, '>-0.1');

    if (shouldAnimate) {
      tl.delay(0.4);
    }
  }

  function runConteudoExclusivoAnimations() {
    const section = document.getElementById('conteudo-exclusivo');
    if (!section) return;

    if (typeof window.gsap === 'undefined') return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // Elementos centralizados
    const contentBlock = section.querySelector('.max-w-\\[900px\\]');
    const title = contentBlock ? contentBlock.querySelector('h2') : null;
    const paragraph = contentBlock ? contentBlock.querySelector('p') : null;
    const button = contentBlock ? contentBlock.querySelector('.btn') : null;

    if (prefersReducedMotion) {
      if (title) gsap.set(title, { opacity: 1, y: 0 });
      if (paragraph) gsap.set(paragraph, { opacity: 1, y: 0 });
      if (button) gsap.set(button, { opacity: 1, y: 0 });
      return;
    }

    const shouldAnimate = hasPassedTriggerPoint(section, 'top 75%');

    // Estados iniciais
    if (title) gsap.set(title, { opacity: 0, y: 24 });
    if (paragraph) gsap.set(paragraph, { opacity: 0, y: 16 });
    if (button) gsap.set(button, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: shouldAnimate ? null : {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none play none',
        once: true,
      },
    });

    // Sequência: título -> parágrafo -> botão
    if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.6 }, 0);
    if (paragraph) tl.to(paragraph, { opacity: 1, y: 0, duration: 0.5 }, '>-0.2');
    if (button) tl.to(button, { opacity: 1, y: 0, duration: 0.5 }, '>-0.1');

    if (shouldAnimate) {
      tl.delay(0.4);
    }
  }

  // Função de inicialização
  function initAnimations() {
    // Aguarda o carregamento completo para evitar problemas de layout
    const runAll = () => {
      runHeroAnimations();
      runOQueEAnimations();
      runEpidemiologiaAnimations();
      runDiagnosticoNmosdAnimations();
      runTratamentoNmosdAnimations();
      runFisiopatologiaNmosdAnimations();
      runSintomasAnimations();
      runNmosdEscleroseAnimations();
      runPortalMedicoAnimations();
      runConteudoExclusivoAnimations();
      
      // Refresh do ScrollTrigger após configurar as animações
      if (window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
        ScrollTrigger.refresh();
      }
    };

    // Aguarda carregamento de fontes para evitar problemas de medição
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
      document.fonts.ready.then(runAll).catch(runAll);
    } else {
      runAll();
    }
  }

  // Inicializa quando o documento estiver pronto
  if (document.readyState === 'complete') {
    initAnimations();
  } else {
    window.addEventListener('load', initAnimations);
  }
})();
