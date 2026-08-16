document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // 1. PRELOADER & INITIALIZATION
    // --------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Remove loading class if present
    document.body.classList.remove('loading');

    initAnimations();

    // --------------------------------------------------------
    // 2. LENIS SMOOTH SCROLL
    // --------------------------------------------------------
    let lenis;
    function initLenis() {
        lenis = new Lenis({
            duration: 2.2, // Increased for longer, smoother inertia
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 0.75, // Decreased to make each scroll wheel tick move less distance
            smoothTouch: false,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Sync ScrollTrigger with Lenis
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
    }
    initLenis();

    // --------------------------------------------------------
    // 3. (Custom Cursor Removed)
    // --------------------------------------------------------

    // --------------------------------------------------------
    // 3.5 PILL NAVBAR TOGGLE
    // --------------------------------------------------------
    const pillNavbar = document.getElementById('pill-navbar');
    const pillToggleBtn = document.getElementById('pill-toggle-btn');

    if (pillNavbar && pillToggleBtn) {
        pillToggleBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if it acts like a link
            pillNavbar.classList.toggle('is-expanded');

            // Toggle icon text
            if (pillNavbar.classList.contains('is-expanded')) {
                pillToggleBtn.innerHTML = '&times;'; // Cross icon
                pillToggleBtn.style.fontSize = '1.6rem'; // Slightly larger for the X
            } else {
                pillToggleBtn.textContent = '...';
                pillToggleBtn.style.fontSize = '1.2rem';
            }
        });

        // Close navbar when clicking outside
        document.addEventListener('click', (e) => {
            if (pillNavbar.classList.contains('is-expanded') && !pillNavbar.contains(e.target)) {
                pillNavbar.classList.remove('is-expanded');
                pillToggleBtn.textContent = '...';
                pillToggleBtn.style.fontSize = '1.2rem';
            }
        });

        // Detect when mouse is over navbar to fix cursor blend mode
        pillNavbar.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-on-navbar');
        });
        pillNavbar.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-on-navbar');
        });
    }

    // Scramble Text Effect
    const interactiveElements = document.querySelectorAll('a, button, .accordion-header, .feature-item');
    const chars = '!<>-_\\\\/[]{}—=+*^?#________';

    // --------------------------------------------------------
    // 4. ANIMATIONS & SCROLL EFFECT
    // --------------------------------------------------------

    function initAnimations() {
        // Flawless 3D Flip Setup
        const lineContainers = document.querySelectorAll('.hero-line-container');
        gsap.set(lineContainers, { perspective: 1000, transformStyle: "preserve-3d" });
        gsap.set('.hero-text.blue-text', { backfaceVisibility: "hidden", rotationX: 0, opacity: 1, filter: "none", y: "0%" });
        gsap.set('.hero-text.yellow-text', { backfaceVisibility: "hidden", rotationX: 180, opacity: 1, filter: "none", y: "0%" });

        // Premium Awwwards Intro Animation
        const revealInners = document.querySelectorAll('.hero-text.blue-text .reveal-inner');
        if (revealInners.length > 0) {
            gsap.from(revealInners, {
                y: "120%",
                rotationZ: 3, // Subtle tilt
                skewY: 6, // Premium skew effect
                opacity: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: "power4.out", // Very dynamic easing
                delay: 0.2
            });
        }

        // Hero Text Transition (CUCIAN MENUMPUK? -> BIAR KAMI YANG URUS!)
        const heroSection = document.querySelector('.minimal-hero');

        if (heroSection) {
            const heroTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: "top top",
                    end: "+=150%", // Shorter pin for better performance
                    pin: true,
                    scrub: 1.5
                }
            });

            const yellowLines = document.querySelectorAll('.hero-text.yellow-text');
            const blueLines = document.querySelectorAll('.hero-text.blue-text');

            if (blueLines.length === 2 && yellowLines.length === 2 && lineContainers.length === 2) {
                // Flawless 3D Flip Board (Literally impossible to see the switch)
                // The entire container flips. At exactly 90 degrees (invisible edge), the text swaps perfectly.

                // Flip Line 1
                heroTl.to(lineContainers[0], { rotationX: 180, duration: 1.5, ease: "power2.inOut" }, 0);

                // Flip Line 2 (Staggered slightly for premium feel)
                heroTl.to(lineContainers[1], { rotationX: 180, duration: 1.5, ease: "power2.inOut" }, 0.2);
            }

            // Hold the fully visible state for a moment before unpinning
            heroTl.to({}, { duration: 0.3 });
        }

        // 0. Pre-Footer Zoom Transition
        const footer = document.getElementById('footer');



        const preFooterOverlay = document.getElementById('pre-footer-transition');
        const transitionLogo = preFooterOverlay ? preFooterOverlay.querySelector('.transition-logo') : null;

        if (footer && preFooterOverlay && transitionLogo) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    start: "top top",
                    end: "+=300%", // Increased distance so user needs to scroll more
                    pin: true,
                    scrub: 1.5, // Smoother and longer scrub feeling
                }
            });

            // Phase 1: Zoom and spin the logo
            tl.to(transitionLogo, {
                scale: 40, // 40x is plenty to swallow the screen without excessive GPU strain
                rotation: 90, // Elegant 90deg turn instead of dizzying 360deg spin
                opacity: 0,
                ease: "power2.in", // Smoother acceleration
                duration: 1
            }, 0)

                // Phase 2: Fade out the overlay to reveal the footer
                .to(preFooterOverlay, {
                    opacity: 0,
                    duration: 0.5
                }, 0.3)

                // Phase 3: Complex Footer Elements Reveal
                // Draw grid lines downwards
                .fromTo(footer.querySelectorAll('.grid-line'), {
                    scaleY: 0,
                    transformOrigin: "top"
                }, {
                    scaleY: 1,
                    stagger: 0.1,
                    ease: "power3.inOut",
                    duration: 0.5
                }, 0.5)

                // Huge text rises up and scales up
                .fromTo(footer.querySelector('.footer-huge-text'), {
                    y: 100,
                    scale: 0.9,
                    opacity: 0,
                    filter: "blur(10px)"
                }, {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    ease: "power3.out",
                    duration: 0.8
                }, 0.7)

                // Footer columns slide up sequentially
                .fromTo(footer.querySelectorAll('.footer-col-content'), {
                    y: 50,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    stagger: 0.05,
                    ease: "power2.out",
                    duration: 0.5
                }, 0.8);
        }

        // 1. Scroll Progress Bar
        gsap.to('.scroll-progress', {
            scrollTrigger: {
                start: 0,
                end: "max",
                scrub: 0.3
            },
            width: "100%",
            ease: "none"
        });

        // 2. SplitType Implementation
        const splitTexts = document.querySelectorAll('.split-text');
        splitTexts.forEach(text => {
            const split = new SplitType(text, { types: 'lines, words, chars' });

            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: text,
                    start: "top 90%",
                },
                y: 100,
                opacity: 0,
                stagger: 0.02,
                duration: 1,
                ease: "power4.out"
            });
        });

        // 3. Kinetic Typography & Parallax (data-speed)
        const kineticElements = document.querySelectorAll('.kinetic-text, [data-speed]');
        kineticElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 1;
            const yOffset = (1 - speed) * 100;

            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: yOffset,
                fontStretch: el.classList.contains('kinetic-text') ? "150%" : "100%",
                ease: "none"
            });
        });

        // 4. Reveal Animations
        const reveals = document.querySelectorAll('.reveal-fade, .reveal-slide');
        reveals.forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                y: el.classList.contains('reveal-slide') ? 50 : 0,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        });

        // 5. Navbar Scroll Effect
        const navbar = document.querySelector('.bento-navbar');
        if (navbar) {
            ScrollTrigger.create({
                start: "top -100",
                onUpdate: (self) => {
                    if (self.direction === 1) {
                        navbar.classList.add('scrolled');
                    } else if (self.progress === 0) {
                        navbar.classList.remove('scrolled');
                    }
                }
            });
        }


    }

    // --------------------------------------------------------
    // 5. ACCORDION & MODALS
    // --------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isOpen = item.classList.contains('is-open');

            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('is-open');
                if (otherItem.querySelector('.accordion-content')) {
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            if (!isOpen) {
                item.classList.add('is-open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    window.openServiceAccordion = function (index) {
        const targetItem = document.querySelectorAll('.accordion-item')[index];
        if (!targetItem) return;

        const layananSection = document.getElementById('layanan');
        if (layananSection) {
            lenis.scrollTo(layananSection, { offset: -100, duration: 1.5 });
        }

        setTimeout(() => {
            if (!targetItem.classList.contains('is-open')) {
                const header = targetItem.querySelector('.accordion-header');
                if (header) header.click();
            }
            gsap.fromTo(targetItem,
                { backgroundColor: "rgba(255,255,255,0.05)" },
                { backgroundColor: "transparent", duration: 1.5, ease: "power2.out" }
            );
        }, 1500);
    };

    window.openModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            lenis.stop(); // Stop scroll when modal open
        }
    }

    window.closeModal = function (id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            lenis.start(); // Resume scroll
        }
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.classList.remove('active');
            lenis.start();
        }
    });

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // --------------------------------------------------------
    // 6. SEARCH FILTER
    // --------------------------------------------------------
    const searchInput = document.getElementById('item-search');
    if (searchInput) {
        // Removed JS-based focus/blur styling to allow CSS :focus-within to handle it cleanly
        // Comprehensive synonym and typo dictionary
        const synonyms = {
            "jas": ["blazer", "suit", "tuxedo", "formal", "almamater", "almet", "safari", "beskap"],
            "sepatu": ["sneakers", "kets", "boots", "pantofel", "sniker", "snikers", "alas kaki", "shoes", "slip on", "wedges", "heels", "sapatu", "spatu"],
            "sandal": ["sendal", "selop", "slippers"],
            "karpet": ["ambal", "permadani", "rug", "tikar", "carpet", "karpit", "matras", "karpet bulu"],
            "boneka": ["doll", "teddy", "bear", "bonek", "bnka", "plushie", "action figure", "barbie"],
            "bed cover": ["bedcover", "selimut tebal", "bed caver", "sprei tebal", "bedkover", "quilt", "duvet", "selimut"],
            "bantal": ["pillow", "guling", "bolster", "bantl", "cushion", "sarung bantal"],
            "celana": ["bawahan", "jeans", "levis", "jins", "clana", "clna", "chinos", "celan", "pants", "short", "kulot", "jogger", "cargo", "cargos", "legging", "leging", "training", "trening", "rok"],
            "baju": ["atasan", "kaos", "tshirt", "kemeja", "pakaian", "t-shirt", "bju", "shirt", "blus", "blouse", "tunik", "poloshirt", "polo", "tanktop", "singlet", "baju tidur", "piyama"],
            "tas": ["bag", "ransel", "backpack", "koper", "suitcase", "carrier", "ts", "totebag", "selempang", "slingbag", "pouch", "waistbag", "gymbag", "koper besar"],
            "gorden": ["korden", "tirai", "hordeng", "gordyn", "blind", "vitrase", "kelambu"],
            "handuk": ["anduk", "towel", "hnduk", "keset", "lap", "kimono mandi", "bathrobe"],
            "gaun": ["dress", "gown", "dres", "kebaya", "gamis", "abaya", "longdress", "baju pesta", "kaftan"],
            "jaket": ["jacket", "jket", "jkt", "sweater", "switer", "suwiter", "hoodie", "hudi", "cardigan", "kardigan", "bomber", "parka", "mantel", "coat", "jas hujan", "wearpack", "rompi", "vest"],
            "mukena": ["telekung", "rukuh", "mukenah", "alat sholat", "sajadah", "sarung", "peci", "sorban"],
            "topi": ["hat", "cap", "kupluk", "beanie", "tpi", "dasi", "aksesoris"]
        };

        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const categories = document.querySelectorAll('#item-grid .item-category');

            categories.forEach(category => {
                const items = category.querySelectorAll('.item-list li');
                let hasVisibleItem = false;

                items.forEach(item => {
                    let text = item.textContent.toLowerCase();
                    let expandedText = text + " ";

                    // Expand search space with synonyms
                    for (const [base, words] of Object.entries(synonyms)) {
                        // If item name contains a synonym root, or one of its words
                        if (text.includes(base) || words.some(w => text.includes(w))) {
                            expandedText += base + " " + words.join(" ") + " ";
                        }
                    }

                    // Allow simple matching (including typos covered in dictionary)
                    if (searchTerm === '' || expandedText.includes(searchTerm)) {
                        item.style.display = '';
                        hasVisibleItem = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Hide category if no items match
                if (hasVisibleItem) {
                    category.style.display = '';
                    const content = category.querySelector('.accordion-content');
                    if (searchTerm !== '' && content) {
                        category.classList.add('is-open');
                        content.style.maxHeight = content.scrollHeight + "px";
                    } else if (searchTerm === '' && content) {
                        category.classList.remove('is-open');
                        content.style.maxHeight = null;
                    }
                } else {
                    category.style.display = 'none';
                }
            });

            // Re-trigger scrolltrigger refresh if needed since heights changed
            setTimeout(() => { ScrollTrigger.refresh(); }, 500);
        });
    }
});

// --------------------------------------------------------
// 9. LOCAL TIME CLOCK
// --------------------------------------------------------
function initClock() {
    const timeEl = document.getElementById('local-time');
    if (timeEl) {
        setInterval(() => {
            const now = new Date();
            timeEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        }, 1000);
    }
}
initClock();


// --------------------------------------------------------
// 10. PREMIUM CUSTOM CURSOR (ANIMATED WATER DROP)
// --------------------------------------------------------
function initPremiumCursor() {
    // Only disable custom cursor on touch devices, not just small screens
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let cursorWrapper = document.querySelector('.cursor-wrapper');
    if (!cursorWrapper) {
        cursorWrapper = document.createElement('div');
        cursorWrapper.classList.add('cursor-wrapper');
        const cursorWater = document.createElement('div');
        cursorWater.classList.add('cursor-water');
        cursorWrapper.appendChild(cursorWater);
        document.body.appendChild(cursorWrapper);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let blobX = mouseX;
    let blobY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const target = e.target;
        
        if (target.closest('a, button, input, .interactive, .magnetic, .nav-logo-box, .accordion-header, .term-item, .pill-toggle-btn, .services-note')) {
            cursorWrapper.classList.add('hover');
        } else {
            cursorWrapper.classList.remove('hover');
        }

        if (target.closest('footer, .bg-darkblue, .dark-bg, .nav-logo-box, .pill-toggle-btn')) {
            cursorWrapper.classList.remove('is-blue');
            cursorWrapper.classList.add('is-yellow');
        } else if (target.closest('.yellow-bg, .btn-primary, .term-item h2, .feature-item')) {
            cursorWrapper.classList.remove('is-yellow');
            cursorWrapper.classList.add('is-blue');
        } else {
            cursorWrapper.classList.remove('is-yellow');
            cursorWrapper.classList.add('is-blue');
        }
    });

    gsap.ticker.add(() => {
        blobX += (mouseX - blobX) * 0.2;
        blobY += (mouseY - blobY) * 0.2;
        gsap.set(cursorWrapper, { x: blobX, y: blobY });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumCursor);
} else {
    initPremiumCursor();
}

// --------------------------------------------------------
// 11. INTERACTIVE SERVICES NOTE
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const servicesNote = document.querySelector('.services-note');
    if (servicesNote) {
        let themeIndex = 0;
        const themes = ['', 'theme-yellow', 'theme-darkblue'];
        
        servicesNote.addEventListener('click', () => {
            if (themes[themeIndex]) {
                servicesNote.classList.remove(themes[themeIndex]);
            }
            themeIndex = (themeIndex + 1) % themes.length;
            if (themes[themeIndex]) {
                servicesNote.classList.add(themes[themeIndex]);
            }
        });
    }
});
