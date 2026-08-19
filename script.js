(() => {
  const revealTargets = document.querySelectorAll('.section, .detail-card, .photo-placeholder');

  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px' });

    revealTargets.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) target.setAttribute('tabindex', '-1');
    });
  });
})();
