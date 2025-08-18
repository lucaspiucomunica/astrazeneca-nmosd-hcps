# Manual de Implementação - Google Tag Manager
## NMOSD Landing Page - AstraZeneca

## 🚀 Configuração Inicial

### 1. Instalação do GTM
Adicione o código do Google Tag Manager no `<head>` do `index.html`:

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

E no `<body>`:
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

## 📊 Configuração de Variáveis

### Variáveis do DataLayer
Crie as seguintes variáveis no GTM (Tipo: **Variável do Data Layer**):

| Nome da Variável | Nome do Data Layer |
|------------------|-------------------|
| DL - Event | event |
| DL - Scroll Percentage | scroll_percentage |
| DL - Section ID | section_id |
| DL - Section Name | section_name |
| DL - Button Text | button_text |
| DL - Button Type | button_type |
| DL - Button URL | button_url |
| DL - Section Context | section_context |
| DL - Is External Link | is_external_link |
| DL - Page URL | page_url |
| DL - Page Title | page_title |
| DL - Tab ID | tab_id |

### Variáveis Integradas Úteis
- **Page URL** (integrada)
- **Page Title** (integrada)
- **Click URL** (integrada)
- **Click Text** (integrada)

## 🎯 Configuração de Acionadores (Triggers)

### 1. Scroll Tracking
**Nome:** `Scroll - 20% 40% 60% 80% 100%`
- **Tipo:** Evento personalizado
- **Nome do evento:** `scroll_view`
- **Condições:** Este acionador é disparado em: Alguns eventos personalizados
- **Condição:** `{{DL - Scroll Percentage}}` corresponde à expressão regular `^(20|40|60|80|100)$`

### 2. Section Views
**Nome:** `Section View - Todas as Seções`
- **Tipo:** Evento personalizado
- **Nome do evento:** `section_view`

### 3. Button Clicks - Geral
**Nome:** `Button Click - Todos os Botões`
- **Tipo:** Evento personalizado
- **Nome do evento:** `button_click`

### 4. Button Clicks - Específicos

#### Videos
**Nome:** `Button Click - Videos`
- **Tipo:** Evento personalizado
- **Nome do evento:** `button_click`
- **Condições:** `{{DL - Button Type}}` é igual a `video_link`

#### Cadastro
**Nome:** `Button Click - Cadastro`
- **Tipo:** Evento personalizado
- **Nome do evento:** `button_click`
- **Condições:** `{{DL - Button Type}}` é igual a `registration`

#### Guias Externos
**Nome:** `Button Click - Guias`
- **Tipo:** Evento personalizado
- **Nome do evento:** `button_click`
- **Condições:** `{{DL - Button Type}}` é igual a `external_guide`

#### Menu de Navegação
**Nome:** `Button Click - Menu Navegação`
- **Tipo:** Evento personalizado
- **Nome do evento:** `button_click`
- **Condições:** `{{DL - Button Type}}` é igual a `navigation_menu`

### 5. Tab Interactions
**Nome:** `Tab Interaction - Sintomas`
- **Tipo:** Evento personalizado
- **Nome do evento:** `tab_interaction`

## 📈 Configuração de Tags

### Google Analytics 4

#### 1. Tag de Configuração GA4
**Nome:** `GA4 - Configuração`
- **Tipo:** Configuração do Google Analytics: GA4
- **ID de medição:** `G-XXXXXXXXXX`
- **Acionador:** All Pages

#### 2. Event Tags

##### Scroll Tracking
**Nome:** `GA4 - Scroll Progress`
- **Tipo:** Evento do Google Analytics: GA4
- **Tag de configuração:** `{{GA4 - Configuração}}`
- **Nome do evento:** `scroll_progress`
- **Parâmetros:**
  - `scroll_percentage`: `{{DL - Scroll Percentage}}`
  - `page_location`: `{{DL - Page URL}}`
- **Acionador:** `Scroll - 20% 40% 60% 80% 100%`

##### Section Views
**Nome:** `GA4 - Section View`
- **Tipo:** Evento do Google Analytics: GA4
- **Tag de configuração:** `{{GA4 - Configuração}}`
- **Nome do evento:** `section_view`
- **Parâmetros:**
  - `section_id`: `{{DL - Section ID}}`
  - `section_name`: `{{DL - Section Name}}`
  - `page_location`: `{{DL - Page URL}}`
- **Acionador:** `Section View - Todas as Seções`

##### Button Clicks
**Nome:** `GA4 - Button Click`
- **Tipo:** Evento do Google Analytics: GA4
- **Tag de configuração:** `{{GA4 - Configuração}}`
- **Nome do evento:** `button_click`
- **Parâmetros:**
  - `button_text`: `{{DL - Button Text}}`
  - `button_type`: `{{DL - Button Type}}`
  - `button_url`: `{{DL - Button URL}}`
  - `section_context`: `{{DL - Section Context}}`
  - `is_external_link`: `{{DL - Is External Link}}`
  - `page_location`: `{{DL - Page URL}}`
- **Acionador:** `Button Click - Todos os Botões`

##### Video Clicks (Específico)
**Nome:** `GA4 - Video Click`
- **Tipo:** Evento do Google Analytics: GA4
- **Tag de configuração:** `{{GA4 - Configuração}}`
- **Nome do evento:** `video_click`
- **Parâmetros:**
  - `video_title`: `{{DL - Button Text}}`
  - `video_url`: `{{DL - Button URL}}`
  - `section_context`: `{{DL - Section Context}}`
  - `page_location`: `{{DL - Page URL}}`
- **Acionador:** `Button Click - Videos`

##### Registration Clicks
**Nome:** `GA4 - Registration Click`
- **Tipo:** Evento do Google Analytics: GA4
- **Tag de configuração:** `{{GA4 - Configuração}}`
- **Nome do evento:** `registration_click`
- **Parâmetros:**
  - `button_text`: `{{DL - Button Text}}`
  - `section_context`: `{{DL - Section Context}}`
  - `page_location`: `{{DL - Page URL}}`
- **Acionador:** `Button Click - Cadastro`

## 🔧 Eventos de Conversão Recomendados

### Para Google Ads
- **registration_click** → Conversão de cadastro
- **video_click** → Engajamento com conteúdo
- **scroll_view** (100%) → Página completamente visualizada

### Para Analytics
- **section_view** → Engajamento com conteúdo específico
- **scroll_progress** → Profundidade de scroll
- **button_click** → Interações gerais

## 📊 Relatórios Sugeridos no GA4

### 1. Funil de Engajamento
1. Page Load
2. Section Views (primeiras seções)
3. Scroll 60%+
4. Button Clicks
5. Registration/Video Clicks

### 2. Heatmap de Seções
- Relatório personalizado com `section_name` como dimensão
- Métrica: Contagem de eventos `section_view`

### 3. Performance de CTAs
- Dimensão: `button_type` + `button_text`
- Métrica: Contagem de eventos `button_click`
- Segmentação por `section_context`

## 🎯 Metas e Conversões

### Google Analytics 4
1. **Cadastro Completado**
   - Evento: `registration_click`
   - Valor: 1 (conversão)

2. **Engajamento Alto**
   - Evento: `scroll_view`
   - Condição: `scroll_percentage` = 100

3. **Visualização de Vídeo**
   - Evento: `video_click`
   - Valor: 0.5 (micro-conversão)

### Google Ads
- **Conversão Principal:** `registration_click`
- **Conversão Secundária:** `video_click`
- **Otimização:** `scroll_view` (100%)

## 🔍 Debug e Teste

### Modo Preview do GTM
1. Ative o modo Preview no GTM
2. Navegue pela página
3. Verifique se os eventos aparecem na timeline
4. Confirme se as variáveis estão sendo populadas corretamente

### Console do Navegador
Os eventos são logados automaticamente no console:
```javascript
DataLayer Event: {event: "section_view", section_id: "sintomas-da-nmosd", ...}
```

### Ferramenta dataLayer do Chrome
Use a extensão "dataLayer Checker" para monitorar eventos em tempo real.

## ⚠️ Considerações Importantes

1. **Performance:** Os eventos são otimizados com throttling
2. **Duplicatas:** Cada evento é disparado apenas uma vez por sessão
3. **Compatibilidade:** Testado em navegadores modernos
4. **LGPD:** Considere implementar consent management antes de ativar tracking
5. **Teste:** Sempre teste em ambiente de desenvolvimento antes de publicar

## 📞 Suporte

Para dúvidas sobre implementação:
- Consulte a documentação oficial do GTM
- Verifique logs no console do navegador
- Use o modo Preview do GTM para debug
