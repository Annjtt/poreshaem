document.addEventListener('DOMContentLoaded', function() {
  // --- Прелоадер: фразы ---
  const preloaderPhrases = [
    "Готовим летнее приключение...",
    "Пакуем рюкзаки для весёлого лагеря...",
    "Заряжаем солнечные лучи и хорошее настроение...",
    "Обновляем карту новых впечатлений...",
    "Завариваем кружку веселья!",
    "Скоро будем исследовать и творить вместе!",
    "Проветриваем комнату для летней сказки...",
    "Завязываем шнурки удивительных открытий...",
    "Включаем летние мечты на максимум...",
    "Готовим настоящее путешествие для юных исследователей..."
  ];

  // Показываем случайную фразу при загрузке
  const phraseElem = document.getElementById("preloaderPhrase");
  if (phraseElem) {
    const phrase = preloaderPhrases[Math.floor(Math.random() * preloaderPhrases.length)];
    phraseElem.textContent = phrase;
  }

  // --- Основной прелоадер ---
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  // Добавляем класс для скрытия контента во время загрузки
  document.body.classList.add('preloader-active');
  
  // Пауза анимаций пока прелоадер активен
  document.querySelectorAll('.cloud, .float-item, .sun-ray').forEach(el => {
    el.style.animationPlayState = 'paused';
  });
  
  // Анимация прогресс-бара на 3.5 секунд
  function animateProgress(duration) {
    const startTime = Date.now();
    
    function update() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing для плавности
      const easedProgress = progress < 0.35 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      progressFill.style.width = `${easedProgress * 100}%`;
      progressText.textContent = `${Math.round(easedProgress * 100)}%`;
      
      if (easedProgress > 0.1) {
        progressFill.classList.add('active');
      }
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  // Запускаем прогресс на 3.5 секунд
  animateProgress(3500);
  
  // Завершение загрузки
  setTimeout(() => {
    progressFill.style.width = '100%';
    progressText.textContent = '100%';
    
    setTimeout(() => {
      // Скрываем прелоадер
      preloader.classList.add('preloader-hiding');
      
      // Показываем контент
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-loaded');
      
      // Запускаем анимации
      document.querySelectorAll('.cloud, .float-item, .sun-ray').forEach(el => {
        el.style.animationPlayState = 'running';
      });
      
      // Удаляем прелоадер из DOM после исчезновения
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 300);
  }, 3500);
  
  // Swiper
  if (typeof Swiper !== 'undefined') {
    const flipSwiper = new Swiper('#flipSwiper', {
      effect: 'flip',
      flipEffect: { slideShadows: false },
      navigation: { nextEl: '.flip-next', prevEl: '.flip-prev' },
      loop: false,
      speed: 500,
      preloadImages: true,
      watchSlidesProgress: true
    });
  }
  
  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Отключение анимаций на слабых устройствах
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
      navigator.connection?.saveData ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    
    const style = document.createElement('style');
    style.textContent = `
      .clouds-container, .floating-elements, .promo-sun-rays { display: none !important; }
      .cloud, .float-item, .sun-ray { animation: none !important; opacity: 0.6 !important; }
    `;
    document.head.appendChild(style);
  }
});