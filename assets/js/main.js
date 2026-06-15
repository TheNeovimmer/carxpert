document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR =====
  const cursor = {
    dot: document.querySelector('.cursor-dot'),
    outline: document.querySelector('.cursor-outline'),
    x: 0, y: 0, ox: 0, oy: 0,
    init() {
      if (!this.dot || !this.outline) return;
      document.addEventListener('mousemove', (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        this.dot.style.left = this.x + 'px';
        this.dot.style.top = this.y + 'px';
      });
      const animate = () => {
        this.ox += (this.x - this.ox) * 0.15;
        this.oy += (this.y - this.oy) * 0.15;
        this.outline.style.left = this.ox + 'px';
        this.outline.style.top = this.oy + 'px';
        requestAnimationFrame(animate);
      };
      animate();
      document.querySelectorAll('a, button, .btn, input, textarea, .service-card, .pricing-card, .blog-card')
        .forEach(el => {
          el.addEventListener('mouseenter', () => {
            this.dot.classList.add('hover');
            this.outline.classList.add('hover');
          });
          el.addEventListener('mouseleave', () => {
            this.dot.classList.remove('hover');
            this.outline.classList.remove('hover');
          });
        });
    }
  };
  cursor.init();

  // ===== MOBILE HAMBURGER =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  const navClose = document.querySelector('.nav-close');

  const closeNav = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
  };

  const openNav = () => {
    hamburger.classList.add('active');
    navLinks.classList.add('open');
    if (navOverlay) navOverlay.classList.add('active');
  };

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) closeNav();
      else openNav();
    });

    if (navClose) navClose.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // ===== NAV SCROLL =====
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ===== SCROLL REVEAL =====
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== COUNTER ANIMATION =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (isNaN(target)) return;
        const duration = 2000;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = (target * eased).toFixed(0);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Sent!';
        btn.style.background = '#28a745';
        btn.style.borderColor = '#28a745';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 2000);
      }, 1000);
    });
  }

  // ===== PRICING CARD HOVER =====
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ===== BUY NOW BUTTONS =====
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.closest('.pricing-card')?.querySelector('.plan-name')?.textContent || 'Plan';
      alert(`Thank you for choosing the ${plan}! This is a demo interaction.`);
    });
  });

  // ===== INSTAGRAM ICON CLICK (footer) =====
  document.querySelectorAll('.footer-social a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const icon = link.querySelector('svg');
      if (icon) {
        icon.style.transform = 'scale(1.3)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 300);
      }
      alert('Social media links are demo placeholders.');
    });
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const testimonialsSection = document.getElementById('testimonials');
  if (testimonialsSection) {
    const track = testimonialsSection.querySelector('.testimonials-track');
    const cards = testimonialsSection.querySelectorAll('.testimonial-card');
    const dots = testimonialsSection.querySelectorAll('.testimonial-dot');
    const prevBtn = testimonialsSection.querySelector('.testimonials-prev');
    const nextBtn = testimonialsSection.querySelector('.testimonials-next');
    if (!track || !cards.length) return;

    let current = 0;
    let autoPlayTimer = null;
    let isDragging = false;
    let startX = 0;
    let prevTranslate = 0;
    let currentTranslate = 0;

    const getSlideWidth = () => track.querySelector('.testimonial-card').offsetWidth;

    const goTo = (index) => {
      current = Math.max(0, Math.min(index, cards.length - 1));
      const slideWidth = getSlideWidth();
      prevTranslate = current * -slideWidth;
      track.style.transform = `translateX(${prevTranslate}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      prevBtn.style.opacity = current === 0 ? '0.4' : '1';
      nextBtn.style.opacity = current === cards.length - 1 ? '0.4' : '1';
    };

    const next = () => { if (current < cards.length - 1) goTo(current + 1); };
    const prev = () => { if (current > 0) goTo(current - 1); };

    // Arrows
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    // Dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Drag / Swipe
    const getPointerX = (e) => e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;

    const dragStart = (e) => {
      isDragging = true;
      track.classList.add('dragging');
      startX = getPointerX(e);
      currentTranslate = prevTranslate;
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const diff = getPointerX(e) - startX;
      const slideWidth = getSlideWidth();
      const maxTranslate = -(cards.length - 1) * slideWidth;
      currentTranslate = prevTranslate + diff;
      currentTranslate = Math.max(maxTranslate - slideWidth * 0.3, Math.min(slideWidth * 0.3, currentTranslate));
      track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      const slideWidth = getSlideWidth();
      const movedBy = prevTranslate - currentTranslate;
      if (Math.abs(movedBy) > slideWidth * 0.2) {
        if (movedBy > 0 && current < cards.length - 1) current++;
        else if (movedBy < 0 && current > 0) current--;
      }
      goTo(current);
    };

    track.addEventListener('mousedown', dragStart);
    track.addEventListener('mousemove', dragMove);
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    track.addEventListener('touchstart', dragStart, { passive: true });
    track.addEventListener('touchmove', dragMove, { passive: false });
    track.addEventListener('touchend', dragEnd);

    // Auto-play
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (current >= cards.length - 1) goTo(0);
        else next();
      }, 5000);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; }
    };

    testimonialsSection.addEventListener('mouseenter', stopAutoPlay);
    testimonialsSection.addEventListener('mouseleave', startAutoPlay);

    // Resize
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => goTo(current), 100);
    };
    window.addEventListener('resize', onResize);

    // Init
    goTo(0);
    startAutoPlay();
  }

});
