// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById('scrollProgress').style.width = scrollPercent + '%';
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ============================================
// MOBILE MENU
// ============================================
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileNav.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});
function closeMenu() {
  menuToggle.classList.remove('active');
  mobileNav.classList.remove('active');
  document.body.style.overflow = '';
}

// ============================================
// DARK MODE TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
let isDark = false;
themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  sunIcon.style.display = isDark ? 'none' : 'block';
  moonIcon.style.display = isDark ? 'block' : 'none';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  isDark = true;
  document.documentElement.setAttribute('data-theme', 'dark');
  sunIcon.style.display = 'none';
  moonIcon.style.display = 'block';
}

// ============================================
// SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ============================================
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// COUNT-UP ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.getAttribute('data-target'));
      const suffix = entry.target.textContent.includes('%') ? '%' : (entry.target.textContent.includes('+') ? '+' : '');
      animateCount(entry.target, target, suffix);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNumbers.forEach(el => countObserver.observe(el));

function animateCount(element, target, suffix) {
  let current = 0;
  const duration = 2000;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

// ============================================
// TESTIMONIAL SLIDER
// ============================================
let currentSlide = 0;
const track = document.getElementById('testimonialTrack');
const slides = track.children;
const navContainer = document.getElementById('testimonialNav');
let autoSlideInterval;

// Create dots
for (let i = 0; i < slides.length; i++) {
  const dot = document.createElement('div');
  dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
  dot.onclick = () => goToSlide(i);
  navContainer.appendChild(dot);
}

function updateSlider() {
  track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlider();
  resetAutoSlide();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlider();
  resetAutoSlide();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 5000);
}
autoSlideInterval = setInterval(nextSlide, 5000);

// Pause on hover
const slider = document.querySelector('.testimonial-slider');
slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
slider.addEventListener('mouseleave', resetAutoSlide);

// ============================================
// FAQ ACCORDION
// ============================================
function toggleFaq(button) {
  const item = button.parentElement;
  const isActive = item.classList.contains('active');
  // Close all
  document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
  // Open clicked if it was not active
  if (!isActive) {
    item.classList.add('active');
  }
}

// ============================================
// NEWSLETTER FORM VALIDATION
// ============================================
function handleSubscribe(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset states
  input.classList.remove('error', 'success');

  if (!email) {
    input.classList.add('error');
    showToast('Please enter your email address.', 'error');
    return;
  }
  if (!emailRegex.test(email)) {
    input.classList.add('error');
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  input.classList.add('success');
  showToast('Welcome to the roast list! Check your inbox for a confirmation.', 'success');
  input.value = '';
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;

  const iconSvg = type === 'success'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  toast.innerHTML = iconSvg + '<span>' + message + '</span>';
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// COOKIE BANNER
// ============================================
function dismissCookie() {
  document.getElementById('cookieBanner').classList.remove('show');
  localStorage.setItem('cookiesAccepted', 'true');
}
// Show cookie banner after 2 seconds if not dismissed
setTimeout(() => {
  if (!localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookieBanner').classList.add('show');
  }
}, 2000);

// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// RIPPLE EFFECT ON BUTTONS
// ============================================
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// KEYBOARD NAVIGATION (ESC to close menu)
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});
