// Função para ajustar altura do hero-content baseado na altura do menu
function adjustHeroContentHeight() {
    const heroContent = document.querySelector('.hero-section .hero-content');
    const heroMenu = document.querySelector('.hero-menu');
    
    if (heroContent && heroMenu) {
        // Calcula a altura real do menu
        const menuHeight = heroMenu.offsetHeight;
        
        // Define a variável CSS customizada
        document.documentElement.style.setProperty('--hero-menu-height', `${menuHeight}px`);
        
        // Aplica o cálculo
        heroContent.style.height = `calc(100vh - ${menuHeight}px)`;
    }
}

// Função para inicializar as tabs personalizadas
function initCustomTabs() {
    const tabsContainer = document.querySelector('.block-como-afeta-tabs');
    const blockComoAfeta = document.querySelector('.block-como-afeta');
    if (!tabsContainer || !blockComoAfeta) return;

    const tabItems = tabsContainer.querySelectorAll('.tab-item');
    const tabImages = tabsContainer.querySelectorAll('.tab-image-item');
    
    let currentActiveTab = null;
    let progressInterval = null;
    let progressWidth = 0;
    let isPaused = false;
    let isIntersecting = false; // Controla se o elemento está 50% visível
    const progressDuration = 10000; // 10 segundos para completar
    const progressStep = 100 / (progressDuration / 50); // Atualiza a cada 50ms

    // Configura o Intersection Observer para detectar quando 50% do elemento está visível
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.5) {
                // Elemento está 50% ou mais visível - inicia os tabs
                if (!isIntersecting) {
                    isIntersecting = true;
                    if (currentActiveTab === null && tabItems.length > 0) {
                        // Primeira vez que entra na seção - apenas inicia o progresso
                        // (o primeiro tab já está ativo desde a inicialização)
                        currentActiveTab = 1;
                        startProgressBar();
                    } else if (currentActiveTab !== null) {
                        // Já estava inicializado - apenas retoma o progresso
                        resumeProgress();
                    }
                }
            } else {
                // Elemento está menos de 50% visível - pausa os tabs
                if (isIntersecting) {
                    isIntersecting = false;
                    pauseProgress();
                }
            }
        });
    }, {
        threshold: 0.5 // Dispara quando 50% do elemento está visível
    });

    // Observa o elemento .block-como-afeta
    observer.observe(blockComoAfeta);

    // Função para ativar uma tab
    function activateTab(tabNumber) {
        // Primeiro, mede as alturas naturais de todos os elementos
        const tabHeights = {};
        tabItems.forEach(item => {
            const tabList = item.querySelector('.tab-item-list');
            if (tabList) {
                // Temporariamente define como auto para medir
                const originalHeight = tabList.style.height;
                tabList.style.height = 'auto';
                tabHeights[item.dataset.tab] = tabList.scrollHeight;
                tabList.style.height = originalHeight; // Restaura altura anterior
            }
        });

        // Remove classe is-inactive de todas as tabs
        tabItems.forEach(item => {
            item.classList.remove('is-inactive');
        });

        // Adiciona is-inactive a todas exceto a ativa
        tabItems.forEach(item => {
            if (item.dataset.tab !== tabNumber.toString()) {
                item.classList.add('is-inactive');
            }
        });

        // Lógica para controlar a opacidade das linhas
        // Primeiro, remove o estilo inline de todas as linhas
        tabItems.forEach(item => {
            const tabLine = item.querySelector('.tab-item-line');
            if (tabLine) {
                tabLine.style.opacity = '';
            }
        });

        // Depois, encontra o item ativo e aplica opacity 0 inline à linha do item anterior
        tabItems.forEach((item, index) => {
            // Se este item está ativo (não tem is-inactive) e não é o primeiro
            if (!item.classList.contains('is-inactive') && index > 0) {
                // Pega o item anterior
                const previousItem = tabItems[index - 1];
                const previousLine = previousItem.querySelector('.tab-item-line');
                if (previousLine) {
                    // Aplica opacity 0 inline à linha do item anterior
                    previousLine.style.opacity = '0';
                }
            }
        });

        // Agora aplica as alturas com animação
        requestAnimationFrame(() => {
            tabItems.forEach(item => {
                const tabList = item.querySelector('.tab-item-list');
                if (tabList) {
                    if (item.dataset.tab === tabNumber.toString()) {
                        // Tab que será ativada - anima para altura natural
                        tabList.style.height = tabHeights[item.dataset.tab] + 'px';
                    } else {
                        // Tabs que serão desativadas - anima para altura 0
                        tabList.style.height = '0px';
                    }
                }
            });
        });

        // Mostra/esconde imagens correspondentes
        tabImages.forEach(image => {
            if (image.dataset.tab === tabNumber.toString()) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });

        currentActiveTab = tabNumber;
        startProgressBar();
        
        // Verifica se o mouse já está sobre a tab ativa após a ativação
        setTimeout(() => {
            const activeTab = tabsContainer.querySelector(`.tab-item:not(.is-inactive)`);
            if (activeTab && activeTab.matches(':hover')) {
                pauseProgress();
            }
        }, 10); // Pequeno delay para garantir que o DOM foi atualizado
    }

    // Função para iniciar a progress bar
    function startProgressBar() {
        const activeTab = tabsContainer.querySelector(`.tab-item:not(.is-inactive)`);
        if (!activeTab) return;

        const progressBar = activeTab.querySelector('.progress-bar-item');
        if (!progressBar) return;

        // Reset do progresso
        progressWidth = 0;
        progressBar.style.height = '0%';

        // Clear do interval anterior
        if (progressInterval) {
            clearInterval(progressInterval);
        }

        // Inicia novo interval apenas se o elemento estiver visível
        if (isIntersecting) {
            progressInterval = setInterval(() => {
                if (!isPaused && isIntersecting) {
                    progressWidth += progressStep;
                    progressBar.style.height = `${Math.min(progressWidth, 100)}%`;

                    // Quando completa, vai para próxima tab
                    if (progressWidth >= 100) {
                        clearInterval(progressInterval);
                        goToNextTab();
                    }
                }
            }, 50);
        }
    }

    // Função para ir para próxima tab
    function goToNextTab() {
        // Pega apenas os números dos data-tab que existem
        const availableTabs = Array.from(tabItems).map(item => parseInt(item.dataset.tab)).sort((a, b) => a - b);
        const currentIndex = availableTabs.indexOf(currentActiveTab);
        const nextIndex = (currentIndex + 1) % availableTabs.length; // Usa módulo para fazer loop
        const nextTab = availableTabs[nextIndex];
        

        activateTab(nextTab);
    }

    // Função para pausar/despausar
    function pauseProgress() {
        isPaused = true;
    }

    function resumeProgress() {
        isPaused = false;
        // Se não há interval ativo mas deveria haver (elemento visível e tem tab ativa), reinicia
        if (isIntersecting && currentActiveTab !== null && !progressInterval) {
            startProgressBar();
        }
    }

    // Adiciona event listeners para cliques em todo o item
    tabItems.forEach((item, index) => {
        // Torna apenas tabs inativas clicáveis
        item.addEventListener('click', () => {
            // Só permite clique se a tab estiver inativa
            if (item.classList.contains('is-inactive')) {
                activateTab(parseInt(item.dataset.tab));
            }
        });

        // Adiciona eventos de hover apenas no item ativo
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('is-inactive')) {
                pauseProgress();
            }
        });

        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('is-inactive')) {
                resumeProgress();
            }
        });
    });

    // Função para inicializar alturas dos tab-item-list
    function initTabHeights() {
        // Primeiro, mede a altura natural do primeiro item
        let firstTabHeight = 0;
        const firstTabItem = tabItems[0];
        if (firstTabItem) {
            const firstTabList = firstTabItem.querySelector('.tab-item-list');
            if (firstTabList) {
                // Temporariamente define como auto para medir
                firstTabList.style.height = 'auto';
                firstTabHeight = firstTabList.scrollHeight;
            }
        }

        tabItems.forEach((item, index) => {
            const tabList = item.querySelector('.tab-item-list');
            if (tabList) {
                if (index === 0) {
                    // Primeiro item: define altura natural imediatamente
                    tabList.style.height = firstTabHeight + 'px';
                } else {
                    // Demais itens: define altura inicial como 0
                    tabList.style.height = '0px';
                }
                tabList.style.overflow = 'hidden';
                tabList.style.transition = 'height 0.3s ease';
            }
        });
        
        // Adiciona classe is-inactive a todos os tabs inicialmente, exceto o primeiro
        tabItems.forEach((item, index) => {
            if (index === 0) {
                // Primeiro item fica ativo desde o início
                item.classList.remove('is-inactive');
            } else {
                item.classList.add('is-inactive');
            }
        });

        // Configura as imagens iniciais - mostra apenas a primeira
        tabImages.forEach((image, index) => {
            if (index === 0) {
                image.style.display = 'block';
            } else {
                image.style.display = 'none';
            }
        });
    }

    // Inicializa os estilos imediatamente, mas a ativação é controlada pelo Intersection Observer
    if (tabItems.length > 0) {
        initTabHeights();
    }
}

// Função para inicializar as tabs de diagnóstico
function initDiagnosticoTabs() {
    const tabsContainer = document.querySelector('.tabs-diagnostico');
    if (!tabsContainer) return;

    const navButtons = tabsContainer.querySelectorAll('.tabs-diagnostico-nav-item button');
    const tabItems = tabsContainer.querySelectorAll('.tabs-diagnostico-item');

    // Adiciona event listeners aos botões de navegação
    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            // Remove classe active de todos os botões
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Remove classe active de todos os itens do container
            tabItems.forEach(item => item.classList.remove('active'));
            
            // Adiciona classe active ao botão clicado
            button.classList.add('active');
            
            // Adiciona classe active ao item correspondente
            if (tabItems[index]) {
                tabItems[index].classList.add('active');
            }
        });
    });
}

// Função para inicializar gráficos radiais
function initRadialCharts() {
    const radialCharts = document.querySelectorAll('.radial-chart');
    
    radialCharts.forEach(chart => {
        const percentage = parseInt(chart.dataset.percentage) || 0;
        const circleProgress = chart.querySelector('.circle-progress');
        const percentageText = chart.querySelector('.percentage');
        
        if (circleProgress && percentageText) {
            // Calcula o stroke-dashoffset baseado na porcentagem
            // Circunferência = 2 * π * r = 2 * π * 36 ≈ 226.2
            const circumference = 226.2;
            const percentageValue = parseFloat(chart.dataset.percentage) || 0;
            const offset = circumference - (percentageValue / 100) * circumference;
            
            // Aplica o valor
            circleProgress.style.strokeDashoffset = offset;
            
            // Separa parte inteira da decimal
            const percentageStr = chart.dataset.percentage;
            const parts = percentageStr.split('.');
            const integerPart = parts[0];
            const decimalPart = parts[1] ? ',' + parts[1] : '';
            
            // Atualiza o texto da porcentagem
            percentageText.querySelector('.percentage-number').textContent = integerPart;
            percentageText.querySelector('.percentage-text').textContent = decimalPart + '%';
        }
    });
}

// Função para inicializar gráficos de pizza
function initPieCharts() {
    const pieCharts = document.querySelectorAll('.pie-chart');
    
    pieCharts.forEach(chart => {
        const percentage = parseFloat(chart.dataset.percentage) || 0;
        const pieSlice = chart.querySelector('.pie-slice');
        
        if (pieSlice) {
            // Calcula o ângulo em radianos
            const angle = (percentage / 100) * 2 * Math.PI;
            
            // Centro do círculo
            const centerX = 40;
            const centerY = 40;
            const radius = 40;
            
            // Ponto inicial (topo do círculo)
            const startX = centerX;
            const startY = centerY - radius;
            
            // Ponto final baseado na porcentagem
            const endX = centerX + radius * Math.sin(angle);
            const endY = centerY - radius * Math.cos(angle);
            
            // Flag para arcos maiores que 180°
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            // Cria o path do SVG
            let pathData;
            if (percentage === 100) {
                // Círculo completo
                pathData = `M ${centerX} ${centerY} m -${radius} 0 a ${radius} ${radius} 0 1 1 ${radius * 2} 0 a ${radius} ${radius} 0 1 1 -${radius * 2} 0`;
            } else if (percentage === 0) {
                // Sem fatia
                pathData = '';
            } else {
                // Fatia normal
                pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
            }
            
            pieSlice.setAttribute('d', pathData);
        }
    });
}

// Função para implementar menu fixo e navegação ativa
function initStickyMenuAndActiveNavigation() {
    const heroMenu = document.querySelector('.hero-menu');
    const heroSection = document.querySelector('.hero-section');
    const menuLinks = document.querySelectorAll('.hero-content-menu-list a');
    
    if (!heroMenu || !heroSection || !menuLinks.length) return;

    let isMenuFixed = false;
    let menuOriginalTop = 0;
    let spacerElement = null;

    // Função para criar elemento espaçador
    function createSpacer() {
        if (!spacerElement) {
            spacerElement = document.createElement('div');
            spacerElement.className = 'menu-spacer';
            spacerElement.style.height = heroMenu.offsetHeight + 'px';
            spacerElement.style.display = 'none';
            heroMenu.parentNode.insertBefore(spacerElement, heroMenu.nextSibling);
        }
    }

    // Função para tornar o menu fixo
    function makeMenuFixed() {
        if (!isMenuFixed) {
            isMenuFixed = true;
            heroMenu.style.position = 'fixed';
            heroMenu.style.top = '0';
            heroMenu.style.left = '0';
            heroMenu.style.right = '0';
            heroMenu.style.zIndex = '1000';
            heroMenu.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            
            // Mostra o espaçador para evitar gap
            if (spacerElement) {
                spacerElement.style.display = 'block';
            }
        }
    }

    // Função para tornar o menu normal
    function makeMenuNormal() {
        if (isMenuFixed) {
            isMenuFixed = false;
            heroMenu.style.position = '';
            heroMenu.style.top = '';
            heroMenu.style.left = '';
            heroMenu.style.right = '';
            heroMenu.style.zIndex = '';
            heroMenu.style.boxShadow = '';
            
            // Esconde o espaçador
            if (spacerElement) {
                spacerElement.style.display = 'none';
            }
        }
    }

    // Função para obter todas as seções com IDs
    function getSections() {
        const sections = [];
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                const section = document.getElementById(sectionId);
                if (section) {
                    sections.push({
                        id: sectionId,
                        element: section,
                        link: link
                    });
                }
            }
        });
        return sections;
    }

    // Função para atualizar item ativo do menu
    function updateActiveMenuItem() {
        const sections = getSections();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Sempre considera a altura do menu para determinar qual seção está ativa
        const menuHeight = heroMenu.offsetHeight;
        const adjustedScrollTop = scrollTop + menuHeight;
        
        let activeSection = null;

        // Encontra a seção que está mais próxima do topo da tela (considerando a altura do menu)
        sections.forEach(section => {
            const sectionTop = section.element.offsetTop;
            
            // Se o topo da seção está na área visível considerando o menu
            if (sectionTop <= adjustedScrollTop + 10) { // 10px de tolerância
                activeSection = section;
            }
        });

        // Remove classe active de todos os links
        menuLinks.forEach(link => link.classList.remove('active'));

        // Adiciona classe active ao link da seção atual
        if (activeSection) {
            activeSection.link.classList.add('active');
        }
    }

    // Função para scroll suave
    function smoothScrollTo(target) {
        const targetElement = document.getElementById(target);
        if (!targetElement) return;

        // Sempre considera a altura do menu, pois ele ficará fixo após o scroll
        const menuHeight = heroMenu.offsetHeight;
        const targetPosition = targetElement.offsetTop - menuHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Event listener para scroll
    function handleScroll() {
        const heroMenuRect = heroMenu.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calcula a posição original do menu em relação ao documento
        if (menuOriginalTop === 0) {
            // Primeira vez - calcula a posição original do menu
            const heroContentHeight = document.querySelector('.hero-content').offsetHeight;
            menuOriginalTop = heroContentHeight;
        }
        
        // Se o scroll passou da posição original do menu, fixa o menu
        if (scrollTop >= menuOriginalTop) {
            makeMenuFixed();
        } else {
            makeMenuNormal();
        }

        // Atualiza item ativo
        updateActiveMenuItem();
    }

    // Adiciona event listeners aos links do menu
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                smoothScrollTo(targetId);
            }
        });
    });

    // Inicialização
    createSpacer();
    
    // Calcula a posição inicial do menu
    const heroContentHeight = document.querySelector('.hero-content').offsetHeight;
    menuOriginalTop = heroContentHeight;
    
    // Event listener para scroll com throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });

    // Chama uma vez para definir estado inicial
    handleScroll();

    // Event listener para redimensionamento
    window.addEventListener('resize', () => {
        if (spacerElement) {
            spacerElement.style.height = heroMenu.offsetHeight + 'px';
        }
        // Recalcula a posição original do menu
        const heroContentHeight = document.querySelector('.hero-content').offsetHeight;
        menuOriginalTop = heroContentHeight;
        handleScroll();
    });
}

// Função para implementar scroll horizontal do menu
function initHorizontalMenuScroll() {
    const menuContainer = document.querySelector('.hero-menu .container');
    const menuList = document.querySelector('.hero-content-menu-list');
    
    if (!menuContainer || !menuList) return;
    
    let leftGradient = null;
    let rightGradient = null;
    
    // Função para criar indicadores de gradiente
    function createGradientIndicators() {
        // Gradiente esquerdo
        leftGradient = document.createElement('div');
        leftGradient.className = 'menu-gradient menu-gradient--left';
        
        // Gradiente direito
        rightGradient = document.createElement('div');
        rightGradient.className = 'menu-gradient menu-gradient--right';
        
        // Adiciona os gradientes ao container do menu
        const heroContentMenu = document.querySelector('.hero-content-menu');
        if (heroContentMenu) {
            heroContentMenu.appendChild(leftGradient);
            heroContentMenu.appendChild(rightGradient);
        }
    }
    
    // Função para verificar se o menu precisa de scroll baseado na largura da tela
    function checkMenuScroll() {
        const screenWidth = window.innerWidth;
        const needsScroll = screenWidth <= 1260;
        
        if (needsScroll) {
            // Adiciona classe para ativar scroll horizontal
            menuList.classList.add('menu-scrollable');
            updateGradientVisibility();
        } else {
            // Remove classe de scroll
            menuList.classList.remove('menu-scrollable');
            hideGradients();
        }
        
        return needsScroll;
    }
    
    // Função para atualizar visibilidade dos gradientes
    function updateGradientVisibility() {
        if (!leftGradient || !rightGradient) return;
        
        const scrollLeft = menuList.scrollLeft;
        const maxScrollLeft = menuList.scrollWidth - menuList.clientWidth;
        
        // Gradiente esquerdo - visível quando há scroll para a esquerda
        if (scrollLeft > 10) {
            leftGradient.classList.add('visible');
        } else {
            leftGradient.classList.remove('visible');
        }
        
        // Gradiente direito - visível quando há scroll para a direita
        if (scrollLeft < maxScrollLeft - 10) {
            rightGradient.classList.add('visible');
        } else {
            rightGradient.classList.remove('visible');
        }
    }
    
    // Função para esconder todos os gradientes
    function hideGradients() {
        if (leftGradient) leftGradient.classList.remove('visible');
        if (rightGradient) rightGradient.classList.remove('visible');
    }
    
    // Função para centralizar o item ativo
    function centerActiveMenuItem() {
        const activeLink = menuList.querySelector('a.active');
        const screenWidth = window.innerWidth;
        if (!activeLink || screenWidth > 1260) return;
        
        const linkRect = activeLink.getBoundingClientRect();
        const menuRect = menuList.getBoundingClientRect();
        const linkCenter = linkRect.left + linkRect.width / 2;
        const menuCenter = menuRect.left + menuRect.width / 2;
        const offset = linkCenter - menuCenter;
        
        // Calcula a nova posição de scroll
        const currentScrollLeft = menuList.scrollLeft;
        const newScrollLeft = currentScrollLeft + offset;
        
        // Anima o scroll para centralizar o item
        menuList.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    }
    

    
    // Event listeners
    function setupEventListeners() {
        // Listener para scroll do menu
        menuList.addEventListener('scroll', updateGradientVisibility);
        
        // Listener para redimensionamento da janela
        window.addEventListener('resize', () => {
            checkMenuScroll();
            // Pequeno delay para garantir que o layout foi atualizado
            setTimeout(centerActiveMenuItem, 100);
        });
    }
    
    // Observer para detectar mudanças no item ativo
    function observeActiveChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('active')) {
                        // Pequeno delay para garantir que o scroll foi processado
                        setTimeout(centerActiveMenuItem, 100);
                    }
                }
            });
        });
        
        // Observa mudanças nas classes dos links do menu
        const menuLinks = menuList.querySelectorAll('a');
        menuLinks.forEach(link => {
            observer.observe(link, { attributes: true, attributeFilter: ['class'] });
        });
    }
    
    // Inicialização
    createGradientIndicators();
    setupEventListeners();
    observeActiveChanges();
    
    // Verifica inicialmente
    setTimeout(() => {
        checkMenuScroll();
        centerActiveMenuItem();
    }, 100);
}

// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    adjustHeroContentHeight();
    initCustomTabs();
    initDiagnosticoTabs();
    initRadialCharts();
    initPieCharts();
    initStickyMenuAndActiveNavigation();
    initHorizontalMenuScroll();
});

// Recalcula quando a janela é redimensionada (caso o menu mude de altura)
window.addEventListener('resize', adjustHeroContentHeight);
