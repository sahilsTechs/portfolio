// Replace no-js class
document.documentElement.classList.remove('no-js');

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.getElementById('menu');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
document.getElementById('year').textContent = new Date().getFullYear();

// Typewriter roles (longest is in .type-ghost to lock width)
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
    const speed = deleting ? 35 : 55;
    setTimeout(tick, speed);
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
