/* ==========================================================================
   PORTFÓLIO REBECCA LOBATO - CORE JAVASCRIPT
   Integração: Lenis Smooth Scroll, GSAP ScrollTrigger, Magnetic Physics & UI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Inicializar Lenis Smooth Scroll
    initSmoothScroll();

    // 3. Registrar Animações GSAP ScrollTrigger
    initScrollAnimations();

    // 4. Efeito 3D Tilt / WebGL nas Imagens de Projetos
    initCardTiltEffect();

    // 5. Header Scrolled State & Active Navigation
    initHeaderScroll();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL & GSAP TICKER SYNC
   ========================================================================== */
let lenis;

function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential smooth curve
        touchMultiplier: 1.5,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sincronizar GSAP ScrollTrigger com Lenis
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }
}

/* ==========================================================================
   2. GSAP SCROLLTRIGGER REVEAL ANIMATIONS (Ease power4.out)
   ========================================================================== */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Animação de revelação suave para títulos e textos hero
    gsap.from('.reveal-text', {
        y: 40,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.15
    });

    gsap.from('.reveal-fade', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.2
    });

    // Animação de entrada dos cards de seções (Skills, Projetos, Certificados)
    const revealCards = gsap.utils.toArray('.reveal-card');
    revealCards.forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        });
    });

    // Animação das barras de progresso na Seção de Skills
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card) => {
        const barFill = card.querySelector('.bar-fill');
        if (!barFill) return;

        const targetWidth = barFill.getAttribute('data-width') || '0%';

        ScrollTrigger.create({
            trigger: card,
            start: 'top 85%',
            onEnter: () => {
                barFill.style.width = targetWidth;
            }
        });
    });

    // Atualização de Link Ativo no Menu de Navegação conforme o scroll
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 40%',
            end: 'bottom 40%',
            onToggle: (self) => {
                if (self.isActive) {
                    const id = section.getAttribute('id');
                    document.querySelectorAll('.menu-link').forEach((link) => {
                        link.classList.remove('nav-link-active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav-link-active');
                        }
                    });
                }
            }
        });
    });
}



/* ==========================================================================
   4. WEBGL / 3D CARD TILT INTERACTION
   ========================================================================== */
function initCardTiltEffect() {
    const projectCards = document.querySelectorAll('.projetos-card');

    projectCards.forEach((card) => {
        const img = card.querySelector('.projetos-imagem');
        let ticking = false;

        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) * 5;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

                    if (img) {
                        img.style.transform = `scale(1.05) translate(${rotateY * 0.4}px, ${-rotateX * 0.4}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            if (img) {
                img.style.transform = 'scale(1) translate(0px, 0px)';
            }
        });
    });
}

/* ==========================================================================
   5. HEADER SCROLLED STATE
   ========================================================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ==========================================================================
   6. HAMBURGER MENU MOBILE
   ========================================================================== */
function AbrirMenu() {
    const menu = document.getElementById('menu');
    const hamburguer = document.getElementById('hamburguer');
    if (menu && hamburguer) {
        menu.classList.toggle('ativo');
        hamburguer.classList.toggle('ativo');
    }
}

function FecharMenu() {
    const menu = document.getElementById('menu');
    const hamburguer = document.getElementById('hamburguer');
    if (menu && hamburguer) {
        menu.classList.remove('ativo');
        hamburguer.classList.remove('ativo');
    }
}

/* ==========================================================================
   7. ENVIO DE MENSAGEM VIA WHATSAPP
   ========================================================================== */
function enviarWhats(event) {
    event.preventDefault();

    const nomeInput = document.getElementById('nome');
    const mensagemInput = document.getElementById('mensagem');

    if (!nomeInput || !mensagemInput) return;

    const nome = nomeInput.value.trim();
    const mensagem = mensagemInput.value.trim();
    const telefone = "5511981996311";

    if (!nome || !mensagem) return;

    const texto = `Olá! Me chamo ${nome}. ${mensagem}`;
    const msgFormatada = encodeURIComponent(texto);
    const url = `https://wa.me/${telefone}?text=${msgFormatada}`;

    window.open(url, '_blank');
}