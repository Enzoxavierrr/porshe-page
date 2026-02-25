/* ============================================ */
/* PORSCHE EXPERIENCE — Main Script            */
/* GSAP + ScrollTrigger + PNG Sequence          */
/* ============================================ */

// Wait for DOM + GSAP to be ready
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // LENIS SMOOTH SCROLL
    // ============================================
    const lenis = new Lenis({
        duration: 1.2,           // scroll duration — higher = smoother
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential ease
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.8,    // slower wheel = more elegant
        touchMultiplier: 1.5,
        infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Force ScrollTrigger to recalculate positions after Lenis is ready
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    // Only init cursor on non-touch devices
    if (cursor && cursorFollower && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Cursor render loop with lerp for smooth following
        function animateCursor() {
            // Inner dot follows faster
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            // Outer ring follows slower — creates the trailing effect
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .model-card, .about-card, .tech-feature, .dot, .cta-button, .nav-toggle, .social-icons a, .back-to-top'
        );

        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hover');
                cursorFollower.classList.add('is-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hover');
                cursorFollower.classList.remove('is-hover');
            });
        });

        // Click feedback
        document.addEventListener('mousedown', () => {
            cursor.classList.add('is-click');
            cursorFollower.classList.add('is-click');
        });
        document.addEventListener('mouseup', () => {
            cursor.classList.remove('is-click');
            cursorFollower.classList.remove('is-click');
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    }

    // ============================================
    // CONFIG
    // ============================================
    const FRAME_COUNT = 300;
    const FRAME_PATH = './assets/Frames/ezgif-frame-';
    const FRAME_EXT = '.png';

    // ============================================
    // PRELOADER + IMAGE PRELOADING
    // ============================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderPercent = document.getElementById('preloaderPercent');
    const heroFrame = document.getElementById('heroFrame');

    // Store all frame images (preloaded in memory)
    const frames = [];
    let loadedCount = 0;

    // Target frame from GSAP (scroll position)
    let targetFrame = { value: 0 };
    // Displayed frame (lerp-smoothed)
    let displayedFrame = 0;
    // Last shown frame index (avoid redundant swaps)
    let lastShownFrame = -1;

    // Show a frame — simply swap the img src (browser handles scaling natively)
    function showFrame(index) {
        if (index === lastShownFrame) return;
        const img = frames[index];
        if (!img || !img.complete) return;

        // Swap src — since image is pre-loaded, this is instant (no network request)
        heroFrame.src = img.src;
        lastShownFrame = index;
    }

    // Lerp (linear interpolation) for buttery smooth transitions
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // rAF render loop — interpolates between current and target frame
    function renderLoop() {
        // Lerp factor: 0.08 = very smooth, 0.15 = responsive, 0.05 = cinematic
        displayedFrame = lerp(displayedFrame, targetFrame.value, 0.1);

        // Clamp
        const frameIndex = Math.min(
            Math.max(Math.round(displayedFrame), 0),
            FRAME_COUNT - 1
        );

        showFrame(frameIndex);
        requestAnimationFrame(renderLoop);
    }

    // Preload all frames into memory
    function preloadFrames() {
        return new Promise((resolve) => {
            for (let i = 1; i <= FRAME_COUNT; i++) {
                const img = new Image();
                const frameNum = i.toString().padStart(3, '0');
                img.src = `${FRAME_PATH}${frameNum}${FRAME_EXT}`;

                img.onload = () => {
                    loadedCount++;
                    // Scale progress to 0-80% during actual loading
                    const progress = Math.round((loadedCount / FRAME_COUNT) * LOAD_PHASE_MAX);
                    preloaderBar.style.width = progress + '%';
                    preloaderPercent.textContent = progress + '%';

                    if (loadedCount === FRAME_COUNT) {
                        resolve();
                    }
                };

                img.onerror = () => {
                    loadedCount++;
                    const progress = Math.round((loadedCount / FRAME_COUNT) * LOAD_PHASE_MAX);
                    preloaderBar.style.width = progress + '%';
                    preloaderPercent.textContent = progress + '%';

                    if (loadedCount === FRAME_COUNT) {
                        resolve();
                    }
                };

                frames[i - 1] = img;
            }
        });
    }

    // Start preloading with minimum display time for cinematic feel
    const MIN_PRELOADER_TIME = 3500; // 3.5 seconds minimum
    const preloaderStartTime = Date.now();

    // During image loading, the bar only fills to 80%
    // The real progress is scaled to 0-80%
    const LOAD_PHASE_MAX = 80;

    // Override progress updates to cap at 80%
    const originalOnload = null;

    preloadFrames().then(() => {
        // Show first frame
        showFrame(0);

        // Start the smooth render loop
        renderLoop();

        const elapsed = Date.now() - preloaderStartTime;
        const remaining = Math.max(0, MIN_PRELOADER_TIME - elapsed);

        // Animate progress from 80% to 100% over the remaining time
        let fakeProgress = LOAD_PHASE_MAX;
        const targetProgress = 100;
        const steps = 60; // 60 animation frames
        const stepTime = remaining / steps;
        let currentStep = 0;

        function animateRemainingProgress() {
            currentStep++;
            // Ease-out curve for smooth deceleration
            const t = currentStep / steps;
            const easedT = 1 - Math.pow(1 - t, 3); // cubic ease-out
            fakeProgress = LOAD_PHASE_MAX + (targetProgress - LOAD_PHASE_MAX) * easedT;

            preloaderBar.style.width = Math.round(fakeProgress) + '%';
            preloaderPercent.textContent = Math.round(fakeProgress) + '%';

            if (currentStep < steps) {
                setTimeout(animateRemainingProgress, stepTime);
            } else {
                // Ensure we hit 100%
                preloaderBar.style.width = '100%';
                preloaderPercent.textContent = '100%';

                // Small pause at 100% before hiding
                setTimeout(() => {
                    preloader.classList.add('loaded');
                    // Init all animations after preloader hides
                    setTimeout(() => {
                        initAnimations();
                    }, 400);
                }, 600);
            }
        }

        if (remaining > 100) {
            animateRemainingProgress();
        } else {
            // If min time already passed, quickly finish
            preloaderBar.style.width = '100%';
            preloaderPercent.textContent = '100%';
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    initAnimations();
                }, 400);
            }, 600);
        }
    });

    // ============================================
    // GSAP ANIMATIONS
    // ============================================
    function initAnimations() {
        // --- HERO: PNG Sequence Scroll Scrub ---
        // GSAP drives targetFrame.value, the rAF loop lerps to it smoothly
        gsap.to(targetFrame, {
            value: FRAME_COUNT - 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            }
        });

        // --- HERO: Content entrance ---
        const heroTl = gsap.timeline({ delay: 0.2 });

        heroTl
            .to('.title-line', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out'
            })
            .to('.hero-subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .to('.hero-cta', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.5')
            .to('.scroll-indicator', {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.3');

        // --- HERO: Fade out content on scroll ---
        gsap.to('.hero-content', {
            opacity: 0,
            y: -60,
            scrollTrigger: {
                trigger: '.hero-section',
                start: '10% top',
                end: '30% top',
                scrub: true
            }
        });

        gsap.to('.scroll-indicator', {
            opacity: 0,
            scrollTrigger: {
                trigger: '.hero-section',
                start: '5% top',
                end: '15% top',
                scrub: true
            }
        });

        // --- HERO: Unfix canvas and overlay when hero ends ---
        ScrollTrigger.create({
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            onLeave: () => {
                heroFrame.style.position = 'absolute';
                heroFrame.style.top = 'auto';
                heroFrame.style.bottom = '0';
                document.querySelector('.hero-overlay').style.position = 'absolute';
                document.querySelector('.hero-overlay').style.top = 'auto';
                document.querySelector('.hero-overlay').style.bottom = '0';
                document.querySelector('.hero-content').style.position = 'absolute';
                document.querySelector('.hero-content').style.visibility = 'hidden';
            },
            onEnterBack: () => {
                heroFrame.style.position = 'fixed';
                heroFrame.style.top = '0';
                heroFrame.style.bottom = 'auto';
                document.querySelector('.hero-overlay').style.position = 'fixed';
                document.querySelector('.hero-overlay').style.top = '0';
                document.querySelector('.hero-overlay').style.bottom = 'auto';
                document.querySelector('.hero-content').style.position = 'fixed';
                document.querySelector('.hero-content').style.visibility = 'visible';
            }
        });

        // --- ABOUT: Section reveal ---
        gsap.from('.about-header', {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-header',
                start: 'top 85%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- ABOUT: Stats Counter ---
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            gsap.to(stat, {
                textContent: target,
                duration: 2,
                ease: 'power2.out',
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: function () {
                    stat.textContent = formatNumber(Math.round(parseFloat(stat.textContent)));
                }
            });
        });

        // --- ABOUT: Cards stagger ---
        gsap.from('.about-card', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.about-cards',
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- MODELS: Cards entrance stagger ---
        gsap.from('.model-card', {
            opacity: 0,
            y: 60,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.models-header',
                start: 'top 85%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- TECHNOLOGY: Features stagger reveal ---
        gsap.from('.tech-feature', {
            opacity: 0,
            x: -40,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.tech-grid',
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- EXPERIENCE: Quote ---
        gsap.from('.experience-quote', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.experience-quote',
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- EXPERIENCE: CTA ---
        gsap.from('.experience-cta', {
            opacity: 0,
            y: 60,
            scale: 0.96,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.experience-cta',
                start: 'top 90%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });

        // --- FOOTER: Reveal ---
        gsap.from('.footer-top', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 95%',
                toggleActions: 'play none none none',
                invalidateOnRefresh: true
            }
        });
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');

    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            if (self.scroll() > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentTestimonial = 0;
    let autoRotateInterval;

    function showTestimonial(index) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    // Click dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showTestimonial(index);
            resetAutoRotate();
        });
    });

    // Auto-rotate
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            const next = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(next);
        }, 5000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    startAutoRotate();

    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', () => {
        // Use Lenis for smooth scroll to top if available
        if (typeof lenis !== 'undefined') {
            lenis.scrollTo(0, { duration: 2 });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function formatNumber(num) {
        if (num >= 10000) {
            return num.toLocaleString('en-US');
        }
        return num.toString();
    }
});
