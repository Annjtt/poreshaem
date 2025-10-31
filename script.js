// Инициализация AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, загружена ли AOS библиотека
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1200,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom'
    });
  } else {
    // Fallback для случаев, когда AOS не загрузилась
    console.warn('AOS library not loaded, using fallback animations');
    initFallbackAnimations();
  }

  // Мобильное меню
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  // Функция для управления скроллом
  function toggleBodyScroll(disable) {
    if (disable) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.classList.add('menu-open');
    } else {
      // Восстанавливаем скролл
      const scrollY = document.body.style.top;
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  hamburger.addEventListener('click', function() {
    const isActive = navMenu.classList.contains('active');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Управляем скроллом
    toggleBodyScroll(!isActive);
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      toggleBodyScroll(false); // Восстанавливаем скролл
    });
  });
  
  // Закрытие меню при клике вне его или на оверлей
  document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active')) {
      // Проверяем, кликнули ли вне меню или на оверлей
      const isClickInsideMenu = navMenu.contains(e.target);
      const isClickOnHamburger = hamburger.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnHamburger) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        toggleBodyScroll(false);
      }
    }
  });

  // Плавный скролл для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Изменение прозрачности header при скролле
  const header = document.querySelector('.header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.style.background = 'rgba(78, 103, 23, 0.98)';
    } else {
      header.style.background = 'rgba(78, 103, 23, 0.95)';
    }

    // Скрытие/показ header при скролле
    if (scrollTop > lastScrollTop && scrollTop > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });

  // Маска для телефона
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let input = e.target;
      let value = input.value.replace(/\D/g, '');
      
      // Ограничиваем количество цифр (11 для российского номера)
      if (value.length > 11) {
        value = value.substring(0, 11);
      }
      
      // Форматируем номер
      let formattedValue = '';
      if (value.length === 0) {
        formattedValue = '';
      } else if (value.length === 1) {
        formattedValue = '+7 (' + value;
      } else if (value.length <= 4) {
        formattedValue = '+7 (' + value.substring(1);
      } else if (value.length <= 7) {
        formattedValue = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4);
      } else if (value.length <= 9) {
        formattedValue = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7);
      } else {
        formattedValue = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9);
      }
      
      input.value = formattedValue;
    });
    
    // Обработка клавиш
    phoneInput.addEventListener('keydown', function(e) {
      // Разрешаем: цифры, Backspace, Delete, Tab, Escape, Enter, стрелки
      if (e.key.match(/[0-9]/) || 
          ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }
      // Блокируем все остальные клавиши
      e.preventDefault();
    });
    
    // Обработка вставки
    phoneInput.addEventListener('paste', function(e) {
      e.preventDefault();
      let paste = (e.clipboardData || window.clipboardData).getData('text');
      let numbers = paste.replace(/\D/g, '');
      
      if (numbers.length > 0) {
        // Если номер начинается с 8, заменяем на 7
        if (numbers.startsWith('8')) {
          numbers = '7' + numbers.substring(1);
        }
        
        // Если номер начинается с 7, оставляем как есть
        if (!numbers.startsWith('7')) {
          numbers = '7' + numbers;
        }
        
        phoneInput.value = numbers;
        phoneInput.dispatchEvent(new Event('input'));
      }
    });
  }

  // Обработка формы
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Собираем данные формы
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Валидация
      if (!data.name || !data.phone || !data.age) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
      }
      
      // Проверка согласия с политикой конфиденциальности
      if (!data.consent) {
        showNotification('Пожалуйста, подтвердите согласие с политикой конфиденциальности', 'error');
        return;
      }
      
      // Имитация отправки
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправляем...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Система уведомлений
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
      hideNotification(notification);
    }, 5000);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
      hideNotification(notification);
    });
  }
  
  function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Lazy loading для изображений (если будут добавлены)
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Убираем параллакс эффект для hero секции
  // (удалено для улучшения производительности и UX)

  // Анимация счетчиков статистики в hero секции
  function animateHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(statNumber => {
      const text = statNumber.textContent;
      const target = parseInt(text.replace(/[^\d]/g, ''));
      const suffix = text.replace(/[\d]/g, '');
      
      if (target && !isNaN(target)) {
        const duration = 3000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            statNumber.textContent = target + suffix;
            clearInterval(timer);
          } else {
            statNumber.textContent = Math.floor(current) + suffix;
          }
        }, 16);
      }
    });
  }

  // Запуск анимации счетчиков при появлении в viewport
  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateHeroStats(); // Запускаем БЕЗ ЗАДЕРЖКИ — одновременно с появлением
        heroStatsObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    heroStatsObserver.observe(heroStats);
  }

  // Добавление класса для анимации при скролле
  const animateElements = document.querySelectorAll('.advantage-card, .service-card');
  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Для карточек услуг добавляем класс появления слева/справа
        if (entry.target.classList.contains('service-card')) {
          entry.target.classList.add('appear-in');
        }
        animateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animateElements.forEach(el => animateObserver.observe(el));

  // Кнопка "Наверх"
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  // Показываем/скрываем кнопку при скролле
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });
  
  // Функция прокрутки наверх
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Обработка клавиатуры для навигации
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Закрытие мобильного меню
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      toggleBodyScroll(false);
    }
  });

  // Предзагрузка критических ресурсов
  function preloadCriticalResources() {
    const criticalImages = [
      // Добавить пути к критическим изображениям
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  preloadCriticalResources();

  // Обработка ошибок
  window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
  });

  // Проверка поддержки современных функций
  if (!('IntersectionObserver' in window)) {
    // Fallback для старых браузеров
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.classList.add('aos-animate');
    });
  }

  console.log('Сайт "Порешаем" успешно загружен! 🎉');
  
  // Инициализация 3D галереи Swiper (как в референсе)
  if (typeof Swiper !== 'undefined') {
    const gallerySwiper = new Swiper('#gallerySwiper', {
      loop: true,
      speed: 800,
      grabCursor: true,
      centeredSlides: true,
      effect: 'coverflow',
      slidesPerView: 'auto',
      spaceBetween: 0,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.gallery-button-next',
        prevEl: '.gallery-button-prev',
      },
      pagination: {
        el: '.gallery-pagination',
        clickable: true,
        dynamicBullets: false,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      // Адаптивность
      breakpoints: {
        320: {
          effect: 'slide',
          slidesPerView: 1,
          spaceBetween: 0,
          coverflowEffect: {},
        },
        768: {
          effect: 'coverflow',
          slidesPerView: 'auto',
          spaceBetween: 0,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          },
        },
      },
    });
    
    // Устанавливаем data-атрибут для CSS селекторов
    const swiperEl = document.getElementById('gallerySwiper');
    if (swiperEl) {
      const updateEffectAttribute = () => {
        const currentEffect = gallerySwiper.params.effect;
        swiperEl.setAttribute('data-effect', currentEffect || 'coverflow');
      };
      
      // Устанавливаем начальный атрибут
      const isMobile = window.innerWidth < 768;
      swiperEl.setAttribute('data-effect', isMobile ? 'slide' : 'coverflow');
      
      // Обновляем атрибут при изменении эффекта
      gallerySwiper.on('setTransition', updateEffectAttribute);
      
      // Функция для обеспечения видимости 3 слайдов (только для coverflow)
      const ensureThreeVisibleSlides = () => {
        if (gallerySwiper.params.effect !== 'coverflow') return;
        
        const slides = Array.from(swiperEl.querySelectorAll('.swiper-slide'));
        const activeSlide = swiperEl.querySelector('.swiper-slide-active');
        
        if (!activeSlide || slides.length === 0) return;
        
        const activeIndex = slides.indexOf(activeSlide);
        
        slides.forEach((slide, index) => {
          // Проверяем классы Swiper
          const hasActive = slide.classList.contains('swiper-slide-active');
          const hasPrev = slide.classList.contains('swiper-slide-active-prev') || 
                         slide.classList.contains('swiper-slide-prev');
          const hasNext = slide.classList.contains('swiper-slide-active-next') || 
                         slide.classList.contains('swiper-slide-next');
          
          // Также проверяем расстояние от активного слайда
          let distance = Math.abs(index - activeIndex);
          if (gallerySwiper.params.loop && slides.length > 0) {
            distance = Math.min(distance, slides.length - distance);
          }
          
          // Показываем активный и два соседних (расстояние <= 1)
          const isVisible = hasActive || hasPrev || hasNext || distance <= 1;
          
          if (isVisible) {
            // Убираем любые inline стили, которые могут скрывать слайд
            slide.style.opacity = '';
            slide.style.visibility = '';
            slide.style.pointerEvents = '';
            slide.style.display = '';
            // НЕ трогаем transform, так как его управляет Swiper
          } else {
            // Скрываем только слайды, которые действительно далеко
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.pointerEvents = 'none';
          }
        });
        
        // Логирование для отладки
        const visibleSlides = slides.filter(s => {
          const idx = slides.indexOf(s);
          let dist = Math.abs(idx - activeIndex);
          if (gallerySwiper.params.loop && slides.length > 0) {
            dist = Math.min(dist, slides.length - dist);
          }
          return dist <= 1;
        });
      };
      
      // Обновляем видимость при переключении слайдов
      gallerySwiper.on('slideChange', () => {
        setTimeout(ensureThreeVisibleSlides, 200);
      });
      gallerySwiper.on('transitionEnd', ensureThreeVisibleSlides);
      gallerySwiper.on('setTranslate', () => {
        requestAnimationFrame(ensureThreeVisibleSlides);
      });
      gallerySwiper.on('progress', ensureThreeVisibleSlides);
      
      // Инициализируем
      setTimeout(ensureThreeVisibleSlides, 500);
    }
    
    // Обновляем настройки при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        gallerySwiper.update();
      }, 250);
    });
    
    console.log('3D галерея Swiper инициализирована! 🎨');
  } else {
    console.warn('Swiper библиотека не загружена');
  }
  
  // Интерактивное свечение карточек услуг от курсора
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    // Небольшой 3D-tilt эффект
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (e.clientX - rect.left - cx) / cx;
      const dy = (e.clientY - rect.top - cy) / cy;
      const tiltX = (-dy * 4).toFixed(2);
      const tiltY = (dx * 4).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
  });
});

// Fallback анимации для случаев, когда AOS не загрузилась
function initFallbackAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => {
    // Устанавливаем начальные стили
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    observer.observe(el);
  });
}

// Стили для уведомлений
const notificationStyles = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: var(--card-bg);
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    border: 1px solid var(--card-border);
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
    max-width: 400px;
  }

  .notification.show {
    transform: translateX(0);
    opacity: 1;
  }

  .notification-content {
    display: flex;
    align-items: center;
    padding: 1rem;
    gap: 0.5rem;
  }

  .notification-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  }

  .notification-success .notification-icon {
    background: #4CAF50;
    color: white;
  }

  .notification-error .notification-icon {
    background: #f44336;
    color: white;
  }

  .notification-info .notification-icon {
    background: var(--accent);
    color: var(--primary-bg);
  }

  .notification-message {
    flex: 1;
    color: var(--text);
    font-size: 14px;
  }

  .notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
  }

  .notification-close:hover {
    background: rgba(255,255,255,0.1);
    color: var(--text);
  }

  .lazy {
    opacity: 0;
    transition: opacity 0.3s;
  }

  .lazy.loaded {
    opacity: 1;
  }

  .animate-in {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  @media (max-width: 768px) {
    .notification {
      right: 10px;
      left: 10px;
      max-width: none;
      transform: translateY(-100px);
    }

    .notification.show {
      transform: translateY(0);
    }
  }
`;

// Добавление стилей для уведомлений
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Функция для копирования email в буфер обмена
function copyEmailToClipboard(event) {
  const email = 'poreshaem.vl@gmail.com';
  
  // Пытаемся скопировать в буфер обмена
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(() => {
      showNotification('Email скопирован в буфер обмена!', 'success');
    }).catch(() => {
      // Fallback для старых браузеров
      fallbackCopyTextToClipboard(email);
    });
  } else {
    // Fallback для старых браузеров
    fallbackCopyTextToClipboard(email);
  }
}

// Fallback функция для копирования
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Email скопирован в буфер обмена!', 'success');
    } else {
      showNotification('Не удалось скопировать email. Адрес: ' + text, 'info');
    }
  } catch (err) {
    showNotification('Не удалось скопировать email. Адрес: ' + text, 'info');
  }
  
  document.body.removeChild(textArea);
}