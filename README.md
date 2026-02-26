#  Porsche Experience — Landing Page Imersiva

Uma landing page cinematográfica e imersiva inspirada na Porsche, construída com **HTML, CSS e JavaScript puro** — sem frameworks. O projeto utiliza uma sequência de 300 frames PNG controlada por scroll, animações com GSAP ScrollTrigger e tipografia premium com Clash Display.

> 🎯 **Projeto de portfólio** — Foco em performance, animações avançadas e design de alto nível.

---

## ✨ Destaques

- **Hero Cinematográfico** — Sequência de 300 frames PNG renderizada via `<img>` nativo com interpolação suave (lerp + rAF), criando um efeito de "vídeo controlado por scroll"
- **Smooth Scroll** — Lenis para rolagem fluida integrada com GSAP ScrollTrigger
- **Tipografia Premium** — Clash Display (variable font, local) para headings com pesos finos e elegantes
- **Cursor Personalizado** — Dot + follower com efeito de trailing via lerp
- **Grid de Modelos** — Mural responsivo com fotos reais dos modelos icônicos da Porsche
- **Animações por Seção** — Reveal, stagger, parallax e counters animados via GSAP
- **100% Responsivo** — Adaptado para desktop, tablet e mobile

---

## 🛠️ Tech Stack

| Tecnologia | Uso |
|-----------|-----|
| **HTML5** | Estrutura semântica com SEO (meta tags, Open Graph) |
| **CSS3** | Design tokens, CSS Grid, variáveis customizadas, glassmorphism |
| **JavaScript** | Vanilla JS — zero dependências de framework |
| **GSAP 3.12** | ScrollTrigger, timelines, scrub animations |
| **Lenis** | Smooth scroll nativo integrado com ScrollTrigger |
| **Clash Display** | Fonte variable local (200-700) via @font-face |

---

## 📁 Estrutura do Projeto

```
porsche/
├── index.html                    # Página principal
├── style.css                     # Estilos completos (design tokens + responsivo)
├── script.js                     # Lógica (preloader, animações, cursor, carousel)
├── README.md
├── fonts/
│   └── ClashDisplay_Complete/    # Fonte variable local (woff2)
└── assets/
    ├── ezgif-frame-001...300.png # 300 frames da sequência PNG (hero)
    └── ModelosIconicos/          # Fotos dos modelos Porsche
        ├── 911-turbo-s.jpg
        ├── taycan-turbo-gt.jpg
        ├── cayenne-turbo.jpg
        ├── 718-gt4-rs.jpg
        ├── panamera-turbo.jpg
        └── macan-turbo.jpg
```

---

## 🎨 Design

- **Tema:** Dark luxuoso com acentos em vermelho Porsche (`#E31E24`) e dourado (`#c9a96e`)
- **Tipografia:** Clash Display (headings, peso 200-500) + Inter (body) + Roboto Mono (specs)
- **Animações:** Entrada por scroll com stagger, counters animados, hover 3D nos cards
- **Preloader:** Barra de progresso real durante carregamento dos 300 frames

---

## 🚀 Como Rodar

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/porsche-experience.git

# Abrir no navegador (não precisa de servidor)
open index.html

# Ou usar um servidor local para melhor performance
npx serve .
```

> ⚠️ Os 300 frames PNG (~100MB) não estão incluídos no repositório por questão de tamanho. Entre em contato para obter os assets.

---

## 📐 Seções

| Seção | Descrição |
|-------|-----------|
| **Hero** | Sequência PNG cinematográfica com scroll scrub + título animado |
| **Sobre** | História da Porsche com counters animados e cards interativos |
| **Modelos** | Grid responsivo 3×2 com fotos reais e specs técnicas |
| **Tecnologia** | Features de engenharia com reveal animado |
| **Experiência** | Citação de Ferry Porsche + carousel de depoimentos |
| **Footer** | Links, redes sociais e botão de voltar ao topo |

---

## 📱 Responsividade

- **Desktop** (1024px+) — Experiência completa com cursor customizado
- **Tablet** (768-1024px) — Grid adaptado para 2 colunas
- **Mobile** (<768px) — Layout single column, menu hamburger

---

## 🧠 Decisões Técnicas

| Decisão | Motivo |
|---------|--------|
| `<img>` ao invés de `<canvas>` | O browser usa algoritmos de scaling superiores (bicubic/Lanczos) vs canvas drawImage (bilinear) |
| Lerp via `requestAnimationFrame` | Transição suave entre frames ao invés de saltos bruscos no scroll |
| Fonte variable local | Um único arquivo woff2 (~29KB) com range completo 200-700, sem CDN |
| Lenis + GSAP | Scroll suave integrado nativamente com ScrollTrigger |
| Zero frameworks CSS | Controle total sobre o design system e performance |

---

## 📄 Licença

Projeto de portfólio. Imagens e marca Porsche são propriedade de seus respectivos donos.
Fonte Clash Display licenciada sob [Fontshare Free Font License](https://www.fontshare.com/licenses/font).

---

**Desenvolvido por [Enzo Xavier](https://github.com/seu-usuario)** 🇧🇷
