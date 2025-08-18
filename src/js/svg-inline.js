/**
 * Script para renderizar SVGs inline
 * Substitui tags <img> com classe "svg-inline" pelo conteúdo SVG
 */

function inlineSVG() {
    const svgImages = document.querySelectorAll('img.svg-inline');
    
    svgImages.forEach(img => {
        const src = img.getAttribute('src');
        
        if (src && src.endsWith('.svg')) {
            fetch(src)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar SVG: ${response.status}`);
                    }
                    return response.text();
                })
                .then(svgContent => {
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                    const svgElement = svgDoc.querySelector('svg');
                    
                    if (svgElement) {
                        const imgClasses = img.getAttribute('class');
                        const imgId = img.getAttribute('id');
                        const imgStyle = img.getAttribute('style');
                        const imgWidth = img.getAttribute('width');
                        const imgHeight = img.getAttribute('height');
                        
                        if (imgClasses) {
                            svgElement.setAttribute('class', imgClasses);
                        }
                        if (imgId) {
                            svgElement.setAttribute('id', imgId);
                        }
                        if (imgStyle) {
                            svgElement.setAttribute('style', imgStyle);
                        }
                        if (imgWidth) {
                            svgElement.setAttribute('width', imgWidth);
                        }
                        if (imgHeight) {
                            svgElement.setAttribute('height', imgHeight);
                        }
                        
                        img.parentNode.replaceChild(svgElement, img);
                    }
                })
                .catch(error => {
                    console.warn('Erro ao carregar SVG inline:', error);
                });
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inlineSVG);
} else {
    inlineSVG();
}

window.inlineSVG = inlineSVG;