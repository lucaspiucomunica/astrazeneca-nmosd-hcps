/**
 * DataLayer de Eventos Personalizados para Google Tag Manager
 * Implementa tracking de scroll, visualização de seções e cliques em botões
 */

// Inicializa o dataLayer se não existir
window.dataLayer = window.dataLayer || [];

// Função para enviar eventos para o dataLayer
function pushToDataLayer(eventData) {
    console.log('DataLayer Event:', eventData); // Para debug
    window.dataLayer.push(eventData);
}

/**
 * 1. SCROLL VIEW - Tracking de porcentagem de scroll
 */
function initScrollTracking() {
    let scrollThresholds = [20, 40, 60, 80, 100];
    let triggeredThresholds = new Set();
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = Math.round((scrollTop / documentHeight) * 100);
        
        // Verifica se algum threshold foi atingido
        scrollThresholds.forEach(threshold => {
            if (scrollPercentage >= threshold && !triggeredThresholds.has(threshold)) {
                triggeredThresholds.add(threshold);
                
                pushToDataLayer({
                    event: 'scroll_view',
                    scroll_percentage: threshold,
                    page_url: window.location.href,
                    page_title: document.title,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }
    
    // Throttle para otimizar performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 100);
    });
}

/**
 * 2. SECTION VIEW - Tracking de visualização de seções
 */
function initSectionViewTracking() {
    const sections = [
        { id: 'o-que-e-nmosd', name: 'O que é NMOSD' },
        { id: 'epidemiologia-da-nmosd', name: 'Epidemiologia' },
        { id: 'sintomas-da-nmosd', name: 'Principais sintomas' },
        { id: 'nmosd-x-esclerose-multipla', name: 'NMOSD x Esclerose Múltipla' },
        { id: 'diagnostico-da-nmosd', name: 'Diagnóstico' },
        { id: 'tratamento-da-nmosd', name: 'Tratamento' },
        { id: 'fisiopatologia-da-nmosd', name: 'Fisiopatologia' },
        { id: 'portal-medico', name: 'Portal Médico' },
        { id: 'conteudo-exclusivo', name: 'Conteúdo Exclusivo' }
    ];
    
    const viewedSections = new Set();
    
    // Configura Intersection Observer para cada seção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const sectionId = entry.target.id;
                
                if (!viewedSections.has(sectionId)) {
                    viewedSections.add(sectionId);
                    
                    const sectionData = sections.find(s => s.id === sectionId);
                    
                    pushToDataLayer({
                        event: 'section_view',
                        section_id: sectionId,
                        section_name: sectionData ? sectionData.name : sectionId,
                        page_url: window.location.href,
                        page_title: document.title,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    }, {
        threshold: 0.5 // Dispara quando 50% da seção está visível
    });
    
    // Observa todas as seções
    sections.forEach(sectionData => {
        const sectionElement = document.getElementById(sectionData.id);
        if (sectionElement) {
            observer.observe(sectionElement);
        }
    });
}

/**
 * 3. BUTTON CLICK - Tracking de cliques em botões
 */
function initButtonClickTracking() {
    
    // Função para extrair informações do botão
    function getButtonInfo(element) {
        // Extrai apenas o texto do primeiro span (ignora ícones)
        const firstSpan = element.querySelector('span');
        const buttonText = firstSpan ? firstSpan.textContent?.trim() : element.textContent?.trim() || '';
        const href = element.href || element.getAttribute('href') || '';
        const target = element.target || '';
        
        // Identifica o tipo de botão baseado no contexto
        let buttonType = 'generic';
        let sectionContext = '';
        
        // Encontra a seção pai
        const parentSection = element.closest('section');
        if (parentSection) {
            sectionContext = parentSection.id || '';
            
            // Classifica o tipo de botão baseado no contexto
            if (href.includes('azplay.com.br')) {
                buttonType = 'video_link';
            } else if (href.includes('azmed.com.br')) {
                buttonType = 'external_guide';
            } else if (href.includes('identity.astrazeneca.com')) {
                buttonType = 'registration';
            } else if (element.classList.contains('btn-secondary')) {
                buttonType = 'secondary_action';
            } else if (element.classList.contains('btn')) {
                buttonType = 'primary_action';
            }
        }
        
        // Identifica se é um botão de navegação do menu
        if (element.closest('.hero-content-menu-list')) {
            buttonType = 'navigation_menu';
            sectionContext = 'hero_menu';
        }
        
        // Identifica se é um botão de tab
        if (element.closest('.tabs-diagnostico-nav')) {
            buttonType = 'tab_navigation';
            sectionContext = 'diagnostico_tabs';
        }
        
        return {
            button_text: buttonText,
            button_type: buttonType,
            button_url: href,
            button_target: target,
            section_context: sectionContext,
            element_classes: element.className || '',
            is_external_link: href.startsWith('http') && !href.includes(window.location.hostname)
        };
    }
    
    // Event listener para todos os cliques
    document.addEventListener('click', (event) => {
        const element = event.target;
        
        // Verifica se é um botão, link ou elemento clicável
        if (element.tagName === 'A' || 
            element.tagName === 'BUTTON' || 
            element.classList.contains('btn') ||
            element.closest('a') ||
            element.closest('button') ||
            element.closest('.btn')) {
            
            // Pega o elemento clicável mais próximo
            const clickableElement = element.closest('a, button, .btn') || element;
            const buttonInfo = getButtonInfo(clickableElement);
            
            pushToDataLayer({
                event: 'button_click',
                ...buttonInfo,
                page_url: window.location.href,
                page_title: document.title,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // Event listener específico para tabs interativas
    document.addEventListener('click', (event) => {
        const tabItem = event.target.closest('.tab-item');
        if (tabItem && tabItem.dataset.tab) {
            pushToDataLayer({
                event: 'tab_interaction',
                tab_id: tabItem.dataset.tab,
                section_context: 'sintomas_tabs',
                interaction_type: 'click',
                page_url: window.location.href,
                page_title: document.title,
                timestamp: new Date().toISOString()
            });
        }
    });
}

/**
 * INICIALIZAÇÃO
 */
function initDataLayer() {
    // Envia evento de page load
    pushToDataLayer({
        event: 'page_load',
        page_url: window.location.href,
        page_title: document.title,
        page_type: 'nmosd_landing_page',
        timestamp: new Date().toISOString()
    });
    
    // Inicializa todos os trackings
    initScrollTracking();
    initSectionViewTracking();
    initButtonClickTracking();
    
    console.log('DataLayer inicializado com sucesso!');
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataLayer);
} else {
    initDataLayer();
}
