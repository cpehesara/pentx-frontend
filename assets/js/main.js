// ==================== Main JavaScript - Optimized ====================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initNetworkCanvas();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initCounters();
    initCardEffects();
    initScrollTopButton();
    initPageTransitions();
    enhanceLazyLoading();
    checkBrowserCompatibility();
});

// ==================== Navbar Scroll Effect ====================
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    if (!navbar) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.scrollY;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', debounce(function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                (current === 'hero' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }, 100));
}

// ==================== Network Canvas Animation ====================
function initNetworkCanvas() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let lastTime = 0;
    const fps = 40;
    const fpsInterval = 1000 / fps;
    let isTabVisible = true;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeCanvas();
            initParticles();
        }, 200);
    });
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.8 + 0.8;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        const particleCount = Math.min(70, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function drawConnections() {
        const maxDistance = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.18 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate(currentTime) {
        if (!isTabVisible) return;
        
        animationId = requestAnimationFrame(animate);
        
        const elapsed = currentTime - lastTime;
        if (elapsed < fpsInterval) return;
        lastTime = currentTime - (elapsed % fpsInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
    }
    
    initParticles();
    animate(0);
    
    document.addEventListener('visibilitychange', function() {
        isTabVisible = !document.hidden;
        if (isTabVisible) {
            animate(0);
        } else {
            if (animationId) cancelAnimationFrame(animationId);
        }
    });
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const elements = document.querySelectorAll(
        '.solution-card, .feature-card, .industry-card, ' +
        '.case-study-card, .project-card, .service-detail-card, ' +
        '.solution-type-card, .expect-card'
    );
    
    elements.forEach(el => observer.observe(el));
}

// ==================== Smooth Scroll ====================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 75;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Mobile Menu ====================
function initMobileMenu() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// ==================== Counter Animation ====================
function initCounters() {
    const counters = document.querySelectorAll('.metric-value, .counter, .stat-number');
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (!isNaN(number) && number > 0) {
                    animateCounter(target, number);
                    observer.unobserve(target);
                }
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const suffix = element.textContent.replace(/[0-9]/g, '');
    const duration = 1800;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// ==================== Card Hover Effects ====================
function initCardEffects() {
    if (window.innerWidth <= 768) return;
    
    const cards = document.querySelectorAll(
        '.solution-card, .project-card, .service-detail-card'
    );
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
    });
}

// ==================== Page Transitions ====================
function initPageTransitions() {
    const TRANSITION_DURATION = 280;
    const NAVIGATION_DELAY = 150;
    
    function createOverlay() {
        if (document.querySelector('.page-transition-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0f1123 0%, #1a1f4e 50%, #2d1b69 100%);
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.28s ease;
        `;
        
        document.body.appendChild(overlay);
        return overlay;
    }
    
    function fadeOut() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) return;
        
        document.body.classList.add('transitioning');
        setTimeout(() => overlay.style.opacity = '1', 10);
    }
    
    function fadeIn() {
        const overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) return;
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            document.body.classList.remove('transitioning');
            document.body.classList.add('page-loaded');
            
            setTimeout(() => overlay.remove(), TRANSITION_DURATION);
        }, 50);
    }
    
    function handleClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('tel:') || 
            href.startsWith('mailto:') ||
            link.getAttribute('target') === '_blank') {
            return;
        }
        
        e.preventDefault();
        fadeOut();
        
        setTimeout(() => {
            window.location.href = href;
        }, TRANSITION_DURATION + NAVIGATION_DELAY);
    }
    
    createOverlay();
    
    if (document.readyState === 'complete') {
        fadeIn();
    } else {
        window.addEventListener('load', fadeIn);
    }
    
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('tel:') && 
            !href.startsWith('mailto:') &&
            !href.startsWith('javascript:') &&
            link.getAttribute('target') !== '_blank') {
            link.addEventListener('click', handleClick);
        }
    });
    
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) fadeIn();
    });
    
    window.PageTransition = {
        navigate: function(url) {
            fadeOut();
            setTimeout(() => window.location.href = url, TRANSITION_DURATION + NAVIGATION_DELAY);
        }
    };
}

// ==================== Scroll to Top Button ====================
function initScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--cyan-accent);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 400) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    }, 100));
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== Lazy Loading Enhancement ====================
function enhanceLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ==================== Browser Compatibility Check ====================
function checkBrowserCompatibility() {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported. Some animations may not work.');
    }
    
    if (!('requestAnimationFrame' in window)) {
        console.warn('requestAnimationFrame not supported. Animations may be choppy.');
    }
}

// ==================== Utility Functions ====================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ==================== Prevent Scroll Restoration ====================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => window.scrollTo(0, 0));