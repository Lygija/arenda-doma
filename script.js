(() => {
  const groups = [
    {
      title: 'Первое знакомство',
      text: 'Первые фотографии дают общее впечатление от дома и его атмосферы. Все кадры относятся к реальному объекту.',
      files: [
        'IMG_20260819_135128_173.jpg','IMG_20260819_135128_242.jpg','IMG_20260819_135128_558.jpg','IMG_20260819_135128_960.jpg','IMG_20260819_135128_992.jpg','IMG_20260819_135129_031.jpg'
      ]
    },
    {
      title: 'Прогулка по дому',
      text: 'Продолжаем знакомство: серия реальных кадров, чтобы перед поездкой можно было рассмотреть объект подробнее.',
      files: [
        'IMG_20260819_135140_773.jpg','IMG_20260819_135140_859.jpg','IMG_20260819_135140_942.jpg','IMG_20260819_135141_011.jpg','IMG_20260819_135141_256.jpg','IMG_20260819_135141_270.jpg','IMG_20260819_135141_283.jpg','IMG_20260819_135141_337.jpg','IMG_20260819_135141_357.jpg','IMG_20260819_135141_370.jpg'
      ]
    },
    {
      title: 'Атмосфера отдыха',
      text: 'Ещё одна серия фотографий дома. Листайте горизонтально на телефоне или откройте любой кадр на весь экран.',
      files: [
        'IMG_20260819_135148_315.jpg','IMG_20260819_135148_409.jpg','IMG_20260819_135148_507.jpg','IMG_20260819_135148_569.jpg','IMG_20260819_135148_622.jpg','IMG_20260819_135148_664.jpg','IMG_20260819_135148_753.jpg','IMG_20260819_135148_879.jpg','IMG_20260819_135149_182.jpg','IMG_20260819_135149_228.jpg'
      ]
    },
    {
      title: 'Дом в деталях',
      text: 'Дополнительные кадры помогают увидеть больше деталей и составить более полное впечатление об объекте.',
      files: [
        'IMG_20260819_135159_364.jpg','IMG_20260819_135159_367.jpg','IMG_20260819_135159_378.jpg','IMG_20260819_135159_597.jpg','IMG_20260819_135159_696.jpg','IMG_20260819_135159_706.jpg','IMG_20260819_135159_741.jpg','IMG_20260819_135159_840.jpg','IMG_20260819_135200_007.jpg','IMG_20260819_135200_301.jpg'
      ]
    },
    {
      title: 'Полный обзор',
      text: 'Финальная часть фотогалереи — ещё восемь реальных кадров гостевого дома Виталины в Калининграде.',
      files: [
        'IMG_20260819_135206_796.jpg','IMG_20260819_135206_945.jpg','IMG_20260819_135206_964.jpg','IMG_20260819_135207_037.jpg','IMG_20260819_135207_068.jpg','IMG_20260819_135207_069.jpg','IMG_20260819_135207_533.jpg','IMG_20260819_135207_655.jpg'
      ]
    }
  ];

  const galleryRoot = document.getElementById('gallery-root');
  const allPhotos = [];
  let number = 0;

  groups.forEach((group, groupIndex) => {
    const section = document.createElement('section');
    section.className = 'gallery-group';

    const head = document.createElement('div');
    head.className = 'gallery-group-head';
    head.innerHTML = `<h3>${String(groupIndex + 1).padStart(2, '0')} · ${group.title}</h3><p>${group.text}</p>`;

    const track = document.createElement('div');
    track.className = 'gallery-track';
    track.setAttribute('aria-label', group.title);

    group.files.forEach((file) => {
      number += 1;
      const src = `assets/${file}`;
      const caption = `Фото ${String(number).padStart(2, '0')} из 44 · Дом Виталины, Калининград`;
      allPhotos.push({ src, caption });

      const button = document.createElement('button');
      button.className = 'gallery-card js-gallery-photo';
      button.type = 'button';
      button.dataset.src = src;
      button.dataset.caption = caption;
      button.setAttribute('aria-label', `Открыть фотографию ${number}`);
      button.innerHTML = `
        <img src="${src}" alt="Гостевой дом Виталины в Калининграде — фотография ${number} из 44" loading="lazy" decoding="async">
        <span class="gallery-card-caption"><b>${group.title}</b><span>Фото ${String(number).padStart(2, '0')} / 44</span></span>
      `;
      track.appendChild(button);
    });

    section.appendChild(head);
    section.appendChild(track);
    galleryRoot?.appendChild(section);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeButton = lightbox?.querySelector('.lightbox-close');
  const prevButton = lightbox?.querySelector('.lightbox-prev');
  const nextButton = lightbox?.querySelector('.lightbox-next');
  let currentIndex = 0;
  let touchStartX = 0;

  const findIndex = (src) => allPhotos.findIndex((photo) => photo.src === src || src.endsWith(photo.src));

  function renderLightbox() {
    const photo = allPhotos[currentIndex];
    if (!photo || !lightboxImage) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.caption;
    if (lightboxCaption) lightboxCaption.textContent = photo.caption;
    if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${allPhotos.length}`;
  }

  function openLightbox(src, fallbackCaption = '') {
    const found = findIndex(src);
    currentIndex = found >= 0 ? found : 0;
    if (found < 0 && allPhotos.length === 0) return;
    renderLightbox();
    if (found < 0 && lightboxCaption) lightboxCaption.textContent = fallbackCaption;
    lightbox?.classList.add('is-open');
    lightbox?.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton?.focus();
  }

  function closeLightbox() {
    lightbox?.classList.remove('is-open');
    lightbox?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function step(delta) {
    if (!allPhotos.length) return;
    currentIndex = (currentIndex + delta + allPhotos.length) % allPhotos.length;
    renderLightbox();
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.js-gallery-photo, .js-open-photo');
    if (trigger) {
      openLightbox(trigger.dataset.src || '', trigger.dataset.caption || '');
      return;
    }
    if (event.target === lightbox) closeLightbox();
  });

  closeButton?.addEventListener('click', closeLightbox);
  prevButton?.addEventListener('click', () => step(-1));
  nextButton?.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (event) => {
    if (!lightbox?.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  });

  lightbox?.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });

  lightbox?.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const distance = endX - touchStartX;
    if (Math.abs(distance) < 45) return;
    step(distance > 0 ? -1 : 1);
  }, { passive: true });

  const revealTargets = document.querySelectorAll('.section, .gallery-group, .hero-collage');
  if ('IntersectionObserver' in window) {
    revealTargets.forEach((el) => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px' });
    revealTargets.forEach((el) => observer.observe(el));
  }
})();
