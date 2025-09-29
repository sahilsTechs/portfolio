// Replace no-js class
document.documentElement.classList.remove('no-js');

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.getElementById('menu');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
}

// Theme toggle (persisted)
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const saved = localStorage.getItem('theme');
function applyTheme(mode) {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = (mode === 'light') ? 'light' : 'dark';
}
function initTheme() {
    if (saved) { applyTheme(saved); return; }
    applyTheme(prefersDark.matches ? 'dark' : 'light');
}
themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.style.colorScheme || (prefersDark.matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
});
initTheme();

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    }
}, { threshold: 0.18 });
document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', id);
            navLinks?.classList.remove('open');
            menuBtn?.setAttribute('aria-expanded', 'false');
        }
    })
});

// Current year
document.getElementById('year')?.appendChild(document.createTextNode(new Date().getFullYear()));

// Typewriter roles (longest equals .type-ghost content)
const roles = [
    "Flutter • Kotlin • Java",
    "Android & Firebase",
    "Clean Architecture",
    "Angel English Learning"
];
const el = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;
function tick() {
    const full = roles[roleIndex];
    if (!deleting) {
        charIndex++;
        el.textContent = full.slice(0, charIndex);
        if (charIndex === full.length) {
            deleting = true;
            setTimeout(tick, 1200);
            return;
        }
    } else {
        charIndex--;
        el.textContent = full.slice(0, charIndex);
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }
    setTimeout(tick, deleting ? 35 : 55);
}
if (el) tick();

// Parallax effect for the hero card (only on devices with fine pointer)
const parallaxEl = document.querySelector('.parallax');
if (parallaxEl && window.matchMedia('(pointer: fine)').matches) {
    const strength = 12;
    const onMove = (e) => {
        const rect = parallaxEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        parallaxEl.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const reset = () => parallaxEl.style.transform = 'translate3d(0,0,0)';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', reset);
}

// Scroll progress bar
const progress = document.getElementById('progress');
const setProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = (scrollTop / docHeight) * 100;
    progress.style.width = pct + '%';
};
window.addEventListener('scroll', setProgress);
setProgress();

// ----- Minimal Particles (canvas) -----
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, DPR, particles = [];

    function resize() {
        DPR = window.devicePixelRatio || 1;
        w = canvas.width = Math.floor(innerWidth * DPR);
        h = canvas.height = Math.floor(innerHeight * DPR);
        canvas.style.width = innerWidth + 'px';
        canvas.style.height = innerHeight + 'px';
        initParticles();
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function initParticles() {
        const count = Math.min(110, Math.floor(innerWidth / 10)); // responsive density
        particles = Array.from({ length: count }).map(() => ({
            x: rand(0, w), y: rand(0, h),
            vx: rand(-0.05, 0.05) * DPR, vy: rand(-0.05, 0.05) * DPR,
            r: rand(0.6, 1.6) * DPR,
            hue: Math.random() < .5 ? 145 : 200 // greens & cyans
        }));
    }

    function step() {
        ctx.clearRect(0, 0, w, h);
        // draw links
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist2 = dx * dx + dy * dy;
                if (dist2 < (110 * DPR) * (110 * DPR)) {
                    const alpha = 0.08 * (1 - dist2 / ((110 * DPR) * (110 * DPR)));
                    ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 80%, 60%, ${alpha})`;
                    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                }
            }
        }
        // draw dots
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, .9)`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        requestAnimationFrame(step);
    }

    resize();
    requestAnimationFrame(step);
    addEventListener('resize', resize);
}
