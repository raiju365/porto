document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            const isOpen = item.classList.contains('is-open');

            // Close all others for a cleaner accordion experience
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('is-open');
                if (otherItem.querySelector('.accordion-content')) {
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Open clicked item if it wasn't already open
            if (!isOpen) {
                item.classList.add('is-open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // 3. Sharp Reveal Animation
    const fadeElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    fadeElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});

// =============================================
// CURSOR SPOTLIGHT + MAGNETIC TILT — Feature Items (Awwwards style)
// =============================================
(function initMagneticFeatures() {
    if (typeof gsap === 'undefined') return;

    const items = document.querySelectorAll('.feature-item');

    items.forEach(item => {
        const pseudo = item; // we update CSS custom props on the element

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            // Cursor position as % inside card
            const px = ((e.clientX - rect.left) / rect.width) * 100;
            const py = ((e.clientY - rect.top) / rect.height) * 100;

            // Normalized offset from center (-1 to 1)
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            // Move the radial gradient to follow cursor
            const before = item.style;
            before.setProperty('--gx', `${px}%`);
            before.setProperty('--gy', `${py}%`);

            // 3D magnetic tilt
            gsap.to(item, {
                rotateX: -dy * 6,
                rotateY: dx * 6,
                x: dx * 8,
                y: dy * 4,
                duration: 0.4,
                ease: 'power2.out',
                transformPerspective: 800,
                transformOrigin: 'center center',
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                rotateX: 0,
                rotateY: 0,
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.4)',
            });
        });
    });
})();

// Helper function to open specific service accordion from footer
window.openServiceAccordion = function(index) {
    const targetItem = document.querySelectorAll('.accordion-item')[index];
    if (!targetItem) {
        window.location.href = "index.html#layanan";
        return false;
    }

    // 1. Scroll to the section
    const layananSection = document.getElementById('layanan');
    if (layananSection) {
        const yOffset = -100; 
        const y = layananSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    }

    // 2. Wait briefly for scroll, then open and animate
    setTimeout(() => {
        // Open the accordion if it's not already open
        if (!targetItem.classList.contains('is-open')) {
            const header = targetItem.querySelector('.accordion-header');
            if (header) header.click();
        }

        // Unique Elegant Highlight Animation using GSAP
        if (typeof gsap !== 'undefined') {
            // Elegant nudge from the left with a subtle background shift
            gsap.fromTo(targetItem, 
                { x: -20, backgroundColor: "var(--mercury)" }, 
                { x: 0, backgroundColor: "var(--white)", duration: 1.5, ease: "elastic.out(1, 0.4)", clearProps: "all" }
            );
            
            // Flash the plus icon slightly to draw attention
            const icon = targetItem.querySelector('.accordion-icon');
            if (icon) {
                gsap.fromTo(icon,
                    { rotation: -90, scale: 1.5 },
                    { rotation: 0, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.4)" }
                );
            }
        }
    }, 600);
};

// 4. Modal Logic
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside the box
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// 5. GSAP Hero Title — Golden Sweep Reveal + Warm Glow Field
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;

    const heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) return;

    const chars = heroTitle.querySelectorAll('.char');
    const subtitle = document.querySelector('.hero-subtitle');
    if (!chars.length) return;

    // --- ENTRANCE: Golden Sweep from center outward ---
    gsap.set(chars, {
        opacity: 0,
        y: 50,
        scale: 0.85,
    });

    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 25 });

    const tl = gsap.timeline({ delay: 0.3 });

    // Stagger from center outward
    tl.to(chars, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: {
            each: 0.03,
            from: 'center',
        },
        onStart: function() {
            // Golden pulse on each char as it enters
            chars.forEach((c, i) => {
                const delay = i * 0.03 + 0.1;
                gsap.fromTo(c,
                    { textShadow: '0 0 0px rgba(244,194,21,0)' },
                    {
                        textShadow: '0 0 25px rgba(244,194,21,0.6), 0 0 50px rgba(244,194,21,0.2)',
                        duration: 0.3,
                        delay: delay,
                        ease: 'power1.in',
                        onComplete: () => {
                            gsap.to(c, {
                                textShadow: '0 0 0px rgba(244,194,21,0)',
                                duration: 0.8,
                                ease: 'power2.out'
                            });
                        }
                    }
                );
            });
        }
    });

    // Subtitle enters
    if (subtitle) {
        tl.to(subtitle, {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: 'power2.out',
        }, '-=0.4');
    }

    tl.call(() => {
        startBreathingGlow();
        activateGlowField();
    });

    // --- IDLE: Slow breathing glow ---
    let breathTime = 0;
    let breathRaf = null;

    function startBreathingGlow() {
        function breathLoop() {
            breathRaf = requestAnimationFrame(breathLoop);
            breathTime += 0.006; // very slow

            chars.forEach((c, i) => {
                if (c._hoverActive) return; // hover takes priority
                // Each char has a staggered phase for a wave-like ripple
                const phase = i * 0.35;
                const wave = (Math.sin(breathTime * 2 + phase) + 1) / 2; // 0 to 1
                const glow = wave * 0.3; // very subtle max
                const glowSize = glow * 18;

                gsap.set(c, {
                    textShadow: `0 0 ${glowSize}px rgba(244,194,21,${glow * 0.6}), 0 0 ${glowSize * 2.5}px rgba(244,194,21,${glow * 0.15})`,
                });
            });
        }
        breathLoop();
    }

    // --- HOVER: Warm Glow Field ---
    function activateGlowField() {
        const radius = 200;
        const maxRise = 18;
        let rafId = null;
        let mouseX = 0, mouseY = 0;
        let isHovering = false;

        // Per-character smooth state
        const charState = [];
        chars.forEach(() => charState.push({ currentY: 0, currentGlow: 0 }));

        function onMove(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }

        function update() {
            rafId = requestAnimationFrame(update);

            chars.forEach((c, i) => {
                const state = charState[i];
                let targetY = 0;
                let targetGlow = 0;

                if (isHovering) {
                    const r = c.getBoundingClientRect();
                    const cx = r.left + r.width / 2;
                    const cy = r.top + r.height / 2;
                    const dx = cx - mouseX;
                    const dy = cy - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    c._hoverActive = dist < radius;

                    if (dist < radius) {
                        const intensity = 1 - dist / radius;
                        // Smooth curve — ease the intensity for natural falloff
                        const smooth = intensity * intensity * (3 - 2 * intensity); // smoothstep
                        targetY = -smooth * maxRise;
                        targetGlow = smooth;
                    }
                }

                // Lerp toward target
                state.currentY += (targetY - state.currentY) * 0.1;
                state.currentGlow += (targetGlow - state.currentGlow) * 0.1;

                // Skip tiny updates
                if (Math.abs(state.currentY) < 0.05 && Math.abs(state.currentGlow) < 0.005) {
                    state.currentY = 0;
                    state.currentGlow = 0;
                    c._hoverActive = false;
                }

                const g = state.currentGlow;
                const glowSize = g * 30;
                const glowSize2 = g * 60;

                gsap.set(c, {
                    y: state.currentY,
                    scale: 1 + state.currentGlow * 0.06,
                    textShadow: g > 0.01
                        ? `0 0 ${glowSize}px rgba(244,194,21,${g * 0.7}), 0 0 ${glowSize2}px rgba(244,194,21,${g * 0.25}), 0 ${-state.currentY * 0.5}px ${glowSize}px rgba(0,0,0,0.15)`
                        : 'none',
                });
            });

            // Stop loop when all settled and not hovering
            if (!isHovering) {
                const allSettled = charState.every(s => s.currentY === 0 && s.currentGlow === 0);
                if (allSettled) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        }

        function onEnter() {
            isHovering = true;
            heroTitle.addEventListener('mousemove', onMove);
            if (!rafId) rafId = requestAnimationFrame(update);
        }

        function onLeave() {
            isHovering = false;
            heroTitle.removeEventListener('mousemove', onMove);
            // Chars will animate back to rest, then breathing takes over
        }

        heroTitle.addEventListener('mouseenter', onEnter);
        heroTitle.addEventListener('mouseleave', onLeave);
    }
});


