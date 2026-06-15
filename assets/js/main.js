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
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
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

  // ===== TESTIMONIALS DOT NAVIGATION (mobile, index.html) =====
  const dots = document.querySelectorAll('.testimonial-dot');
  const cards = document.querySelectorAll('.testimonial-card');
  if (dots.length && cards.length) {
    let current = 0;
    const show = (idx) => {
      cards.forEach((c, i) => {
        c.style.display = i === idx ? 'flex' : 'none';
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
    };
    const initCarousel = () => {
      if (window.innerWidth <= 1200) {
        show(current);
      } else {
        cards.forEach(c => { c.style.display = 'flex'; });
        dots.forEach(d => d.classList.remove('active'));
      }
    };
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { current = i; show(i); });
    });
    initCarousel();
    window.addEventListener('resize', initCarousel);
    setInterval(() => {
      if (window.innerWidth <= 1200) {
        current = (current + 1) % cards.length;
        show(current);
      }
    }, 5000);
  }

});
