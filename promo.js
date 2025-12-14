// Промо-страница JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.promo-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Применяем анимацию к элементам
  const animatedElements = document.querySelectorAll(
    '.promo-schedule-day, .promo-activity-item, .promo-info-item, .promo-info-box-content, .promo-contact-item, .flip-swiper, .promo-flip .swiper-button-prev, .promo-flip .swiper-button-next'
  );

  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ease ${index * 0.01}s, transform 0.4s ease ${index * 0.01}s`;
    observer.observe(el);
  });

  // Анимация звезд (дополнительное мерцание)
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, index) => {
    const delay = index * 0.3;
    star.style.animationDelay = `${delay}s`;
  });

  // Эффект параллакса для фоновых звезд (легкий)
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const starsContainer = document.querySelector('.promo-stars');
    
    if (starsContainer) {
      const parallaxSpeed = 0.5;
      starsContainer.style.transform = `translateY(${scrollTop * parallaxSpeed}px)`;
    }
    
    lastScrollTop = scrollTop;
  });

  // Добавление интерактивности к карточкам расписания
  const scheduleDays = document.querySelectorAll('.promo-schedule-day');
  scheduleDays.forEach(day => {
    day.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(0)';
    });
    
    day.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Анимация счетчика дат (опционально)
  const datesFrom = document.querySelector('.promo-dates-from');
  const datesTo = document.querySelector('.promo-dates-to');
  
  if (datesFrom && datesTo) {
    const datesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Простая анимация появления
          datesFrom.style.animation = 'fadeInUp 0.8s ease forwards';
          datesTo.style.animation = 'fadeInUp 0.8s ease 0.2s forwards';
          datesObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const datesSection = document.querySelector('.promo-dates');
    if (datesSection) {
      datesObserver.observe(datesSection);
    }
  }

  // Добавление CSS анимации для fadeInUp
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  const pageFlipContainer = document.getElementById('flipSwiper');

  function setAspectAndInitialSlide(swiper, container) {
    const portrait = window.matchMedia('(orientation: portrait)').matches;
    if (container) {
      container.style.setProperty('--card-aspect', '3/4');
    }
    if (swiper) {
      const targetIndex = portrait ? 0 : 1;
      swiper.slideTo(targetIndex, 0);
    }
  }

  let flipSwiper = null;
  if (pageFlipContainer && window.Swiper) {
    const prevBtn = pageFlipContainer.querySelector('.flip-prev');
    const nextBtn = pageFlipContainer.querySelector('.flip-next');
    flipSwiper = new Swiper(pageFlipContainer, {
      effect: 'flip',
      loop: false,
      speed: 600,
      allowTouchMove: true,
      simulateTouch: true,
      grabCursor: true,
      keyboard: { enabled: true },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn
      }
    });
    setAspectAndInitialSlide(flipSwiper, pageFlipContainer);
    window.addEventListener('orientationchange', () => setAspectAndInitialSlide(flipSwiper, pageFlipContainer));
    window.addEventListener('resize', () => setAspectAndInitialSlide(flipSwiper, pageFlipContainer));

    // no extra tilt effects
  }

  // Modal logic on main page
  const promoAlertButton = document.getElementById('promoAlertButton');
  const promoModal = document.getElementById('promoModal');
  const promoModalOverlay = document.getElementById('promoModalOverlay');
  const promoModalClose = document.getElementById('promoModalClose');
  const promoModalDetails = document.getElementById('promoModalDetails');
  const modalFlipContainer = document.getElementById('flipSwiperModal');
  let modalFlipSwiper = null;

  function openPromoModal(e) {
    if (e) e.preventDefault();
    if (!promoModal) return;
    promoModal.classList.add('show');
    promoModal.setAttribute('aria-hidden', 'false');
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.classList.add('modal-open');
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    if (modalFlipContainer && window.Swiper) {
      if (!modalFlipSwiper) {
        const prevBtnM = modalFlipContainer.querySelector('.flip-prev');
        const nextBtnM = modalFlipContainer.querySelector('.flip-next');
        modalFlipSwiper = new Swiper(modalFlipContainer, {
          effect: 'flip',
          loop: false,
          speed: 600,
          allowTouchMove: true,
          simulateTouch: true,
          grabCursor: true,
          keyboard: { enabled: true },
          navigation: {
            nextEl: nextBtnM,
            prevEl: prevBtnM
          }
        });
      } else {
        modalFlipSwiper.update();
        modalFlipSwiper.updateSize();
      }
      setAspectAndInitialSlide(modalFlipSwiper, modalFlipContainer);
    }
  }

  function closePromoModal() {
    if (!promoModal) return;
    promoModal.classList.remove('show');
    promoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  if (promoAlertButton && promoModal) {
    promoAlertButton.addEventListener('click', openPromoModal);
  }
  if (promoModalOverlay) {
    promoModalOverlay.addEventListener('click', closePromoModal);
  }
  if (promoModalClose) {
    promoModalClose.addEventListener('click', closePromoModal);
  }
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closePromoModal();
  });

  // Обработка изменения размера окна
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Пересчитываем позиции при изменении размера
      const scheduleDays = document.querySelectorAll('.promo-schedule-day');
      scheduleDays.forEach(day => {
        day.style.transform = '';
      });
    }, 250);
  });

  // Улучшение производительности: отключение анимаций при уменьшенной анимации в системе
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
    });
  }

  console.log('Промо-страница "Новогодний лагерь" загружена! 🎄');
});

