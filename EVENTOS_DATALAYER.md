# Eventos do DataLayer - NMOSD Landing Page

## Visão Geral
Este documento lista todos os eventos personalizados implementados no DataLayer para tracking no Google Tag Manager.

## 📋 Lista de Eventos

### 1. `page_load`
**Descrição:** Disparado quando a página é carregada completamente.

**Parâmetros:**
- `event`: "page_load"
- `page_url`: URL da página atual
- `page_title`: Título da página
- `page_type`: "nmosd_landing_page"
- `timestamp`: Data/hora em formato ISO

---

### 2. `scroll_view`
**Descrição:** Disparado quando o usuário atinge determinadas porcentagens de scroll na página.

**Thresholds:** 20%, 40%, 60%, 80%, 100%

**Parâmetros:**
- `event`: "scroll_view"
- `scroll_percentage`: Porcentagem atingida (20, 40, 60, 80, 100)
- `page_url`: URL da página atual
- `page_title`: Título da página
- `timestamp`: Data/hora em formato ISO

---

### 3. `section_view`
**Descrição:** Disparado quando 50% de uma seção fica visível na tela.

**Seções Rastreadas:**
- O que é NMOSD
- Epidemiologia
- Principais sintomas
- NMOSD x Esclerose Múltipla
- Diagnóstico
- Tratamento
- Fisiopatologia
- Portal Médico
- Conteúdo Exclusivo

**Parâmetros:**
- `event`: "section_view"
- `section_id`: ID da seção (ex: "o-que-e-nmosd")
- `section_name`: Nome amigável da seção (ex: "O que é NMOSD")
- `page_url`: URL da página atual
- `page_title`: Título da página
- `timestamp`: Data/hora em formato ISO

---

### 4. `button_click`
**Descrição:** Disparado quando qualquer botão, link ou elemento clicável é acionado.

**Tipos de Botões Identificados:**
- `video_link`: Links para vídeos (azplay.com.br)
- `external_guide`: Guias externos (azmed.com.br)
- `registration`: Links de cadastro (identity.astrazeneca.com)
- `navigation_menu`: Itens do menu de navegação
- `tab_navigation`: Navegação entre tabs
- `primary_action`: Botões primários (.btn)
- `secondary_action`: Botões secundários (.btn-secondary)
- `generic`: Outros botões não classificados

**Parâmetros:**
- `event`: "button_click"
- `button_text`: Texto do botão (apenas do primeiro span, sem ícones)
- `button_type`: Tipo classificado do botão
- `button_url`: URL de destino (se houver)
- `button_target`: Target do link (_blank, etc.)
- `section_context`: ID da seção onde o botão está localizado
- `element_classes`: Classes CSS do elemento
- `is_external_link`: Boolean indicando se é link externo
- `page_url`: URL da página atual
- `page_title`: Título da página
- `timestamp`: Data/hora em formato ISO

---

### 5. `tab_interaction`
**Descrição:** Disparado especificamente para interações com as tabs dos sintomas da NMOSD.

**Parâmetros:**
- `event`: "tab_interaction"
- `tab_id`: ID da tab clicada (1, 2, 3, 4)
- `section_context`: "sintomas_tabs"
- `interaction_type`: "click"
- `page_url`: URL da página atual
- `page_title`: Título da página
- `timestamp`: Data/hora em formato ISO

## 🔍 Exemplo de Dados no Console

Durante o desenvolvimento, todos os eventos são logados no console do navegador para facilitar o debug:

```javascript
DataLayer Event: {
  event: "section_view",
  section_id: "sintomas-da-nmosd",
  section_name: "Principais sintomas",
  page_url: "https://exemplo.com/nmosd",
  page_title: "NMOSD | AstraZeneca",
  timestamp: "2025-01-27T10:30:45.123Z"
}
```

## 📝 Notas Técnicas

- **Performance:** Scroll tracking usa throttling de 100ms para otimizar performance
- **Precisão:** Section view usa Intersection Observer com threshold de 50%
- **Prevenção de duplicatas:** Cada evento é disparado apenas uma vez por sessão
- **Compatibilidade:** Funciona em todos os navegadores modernos
- **Debug:** Logs automáticos no console durante desenvolvimento
