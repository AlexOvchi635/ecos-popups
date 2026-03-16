(function () {
  'use strict';

  // ==========================
  // ПРОВЕРКА URL - поп-ап НЕ должен работать на страницах с cloud-mining
  // Работает для всех языков: /en/cloud-mining, /es/cloud-mining, /ru/cloud-mining и т.д.
  // ==========================
  var currentUrl = window.location.href.toLowerCase();
  
  // Проверяем что URL НЕ содержит cloud-mining (работает для всех языков)
  var hasCloudMining = currentUrl.includes('cloud-mining');
  
  if (hasCloudMining) {
    // Поп-ап не должен работать на страницах cloud-mining
    return;
  }

  // ==========================
  // CONFIG (edit if needed)
  // ==========================
  var CONFIG = {
    showDelayMs: 1200, // delay before first show
    localStorageKey: 'ecos_circle_popup_seen',
    buttonText: 'Special Offer',
    title: 'Get Your Best Performing Mining Plan',
    message: 'Talk to our expert and get a tailored strategy plus special bonus.',
    ctaText: 'Book a Session',
    ctaHref: 'https://calendly.com/ecos-m/btc-mining-strategy',
    finePrint: 'Bonus: exclusive promo code during the call'
  };

  // Avoid duplicate injection
  if (document.getElementById('ecos-circle-popup-root')) return;

  // ==========================
  // Styles (namespaced)
  // ==========================
  var styles = '\
  @import url(https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap);\
  .ecos-circle-root{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:999998;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif} \
  .ecos-circle-button{font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;text-transform:uppercase;font-weight:700;position:fixed;height:44px;width:226.4px;background:linear-gradient(90deg,#5374ed 0%,#8588ea 33%,#b9adff 66%,#dbbbfe 100%);color:#fff;border-radius:8px;border:0;font-size:16px;letter-spacing:.5px;outline:0;cursor:pointer;z-index:999999;display:none;box-sizing:border-box} \
  .ecos-circle-button.active{display:block} \
  .ecos-circle-inner{display:none;position:relative} \
  .ecos-circle-open{display:block;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(650px,92vw);max-height:82vh;overflow:auto;border-radius:12px;background:#ffffff;box-shadow:0 20px 60px rgba(0,0,0,.12);z-index:9999998} \
  .ecos-circle-content{padding:24px 22px;text-align:center;opacity:0;transition:opacity .25s;background-image:url(https://files.ecos.am/sasha/JR1INUDb52QEsu039TUMAeinC3TziBuWTyHpu4NV.jpg);background-size:cover;background-position:center;background-repeat:no-repeat;border-radius:12px} \
  .ecos-circle-content-open{opacity:1} \
  .ecos-circle-close{position:absolute;top:10px;right:12px;font-size:26px;color:#667085;cursor:pointer;line-height:1;z-index:9999999!important;pointer-events:auto!important;user-select:none;background:none;border:none;padding:0;margin:0;outline:none;width:32px;height:32px;display:flex!important;align-items:center;justify-content:center;position:absolute!important} \
  .ecos-circle-close:hover{color:#333;background:rgba(0,0,0,0.05);border-radius:50%} \
  .ecos-circle-close *{pointer-events:none!important} \
  .ecos-circle-title{margin:20px 0 10px;color:#000000;font-weight:900;font-size:28px} \
  .ecos-circle-msg{margin:0 0 16px;color:#000000;font-weight:600;font-size:18px} \
  .ecos-circle-msg .highlight{color:#000000;font-weight:700;white-space:nowrap} \
  .ecos-circle-cta{display:inline-flex;align-items:center;justify-content:center;height:44px;width:280px;border-radius:8px;color:#fff;text-decoration:none;background:linear-gradient(90deg,#5374ed 0%,#8588ea 33%,#b9adff 66%,#dbbbfe 100%);font-weight:800;letter-spacing:.5px} \
  .ecos-circle-fine{margin:12px 0 0;color:#98a2b3;font-size:12px} \
  .ecos-circle-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:999997;display:none} \
  .ecos-circle-overlay.active{display:block} \
  /* Скрываем WhatsApp виджеты внутри поп-апа */ \
  .ecos-circle-inner [href*="whatsapp"], \
  .ecos-circle-inner [href*="wa.me"], \
  .ecos-circle-inner [class*="whatsapp"], \
  .ecos-circle-inner [id*="whatsapp"] { display: none !important; } \
  /* Скрываем WhatsApp виджеты поверх поп-апа */ \
  .ecos-circle-open ~ [href*="whatsapp"], \
  .ecos-circle-open ~ [href*="wa.me"], \
  .ecos-circle-open ~ [class*="whatsapp"], \
  .ecos-circle-open ~ [id*="whatsapp"] { display: none !important; z-index: 1 !important; } \
  /* Скрываем WhatsApp виджеты когда поп-ап открыт */ \
  body:has(.ecos-circle-open) [href*="whatsapp"]:not(.ecos-circle-cta), \
  body:has(.ecos-circle-open) [href*="wa.me"]:not(.ecos-circle-cta), \
  body:has(.ecos-circle-open) [class*="whatsapp"]:not(.ecos-circle-cta), \
  body:has(.ecos-circle-open) [id*="whatsapp"]:not(.ecos-circle-cta) { display: none !important; z-index: 1 !important; } \
  ';

  var styleEl = document.createElement('style');
  styleEl.id = 'ecos-circle-popup-styles';
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // ==========================
  // DOM
  // ==========================
  var overlay = document.createElement('div');
  overlay.className = 'ecos-circle-overlay';
  overlay.id = 'ecos-circle-overlay';

  // Кнопка "Special Offer" создаётся отдельно от корня, чтобы не наследовать transform
  var specialOfferBtn = document.createElement('button');
  specialOfferBtn.type = 'button';
  specialOfferBtn.className = 'ecos-circle-button';
  specialOfferBtn.id = 'ecosCircleButton';
  specialOfferBtn.textContent = 'Special Offer';
  document.body.appendChild(specialOfferBtn);
  
  var root = document.createElement('div');
  root.className = 'ecos-circle-root';
  root.id = 'ecos-circle-popup-root';
  root.innerHTML = ''+
    '<div class="ecos-circle-inner" id="ecosCircleInner">'+
      '<div class="ecos-circle-content" id="ecosCircleContent">'+
        '<button type="button" class="ecos-circle-close" id="ecosCircleClose">×</button>'+
        '<h3 class="ecos-circle-title">'+CONFIG.title+'</h3>'+
        '<p class="ecos-circle-msg">Talk to our expert and get a tailored strategy plus <span class="highlight">special bonus</span>.</p>'+
        '<div style="text-align:center; max-width:520px; margin:0 auto 12px auto; color:#000000; font-size:14px; line-height:1.8">'+
           '<div style="display:flex; align-items:center; justify-content:center"><span style="color:#6a5bef;font-weight:700;width:20px;flex-shrink:0">✓</span><span> Expert consultation to optimize your mining</span></div>'+
           '<div style="display:flex; align-items:center; justify-content:center"><span style="color:#6a5bef;font-weight:700;width:20px;flex-shrink:0">✓</span><span> Best performing plan for your budget</span></div>'+
           '<div style="display:flex; align-items:center; justify-content:center"><span style="color:#6a5bef;font-weight:700;width:20px;flex-shrink:0">✓</span><span> Exclusive ECOS company bonuses</span></div>'+
           '<div style="display:flex; align-items:center; justify-content:center"><span style="color:#6a5bef;font-weight:700;width:20px;flex-shrink:0">✓</span><span> Access to premium equipment offers</span></div>'+
        '</div>'+
        '<a class="ecos-circle-cta" id="ecosCircleCTA" target="_blank" href="'+CONFIG.ctaHref+'">'+CONFIG.ctaText+'</a>'+
      '</div>'+
    '</div>';

  document.body.appendChild(overlay);
  document.body.appendChild(root);

  var specialOfferButton = document.getElementById('ecosCircleButton');
  var inner = document.getElementById('ecosCircleInner');
  var content = document.getElementById('ecosCircleContent');
  var closeBtn = document.getElementById('ecosCircleClose');
  var cta = document.getElementById('ecosCircleCTA');
  var detailsButtonId = 'mining-farm-offer-details-91'; // ID кнопки Details для обновления позиции

  // Проверка что все элементы созданы
  if (!specialOfferButton) console.warn('ECOS Circle Popup: specialOfferButton не найден');
  if (!inner) console.warn('ECOS Circle Popup: inner не найден');
  if (!content) console.warn('ECOS Circle Popup: content не найден');
  if (!closeBtn) console.warn('ECOS Circle Popup: closeBtn не найден');
  if (!cta) console.warn('ECOS Circle Popup: cta не найден');
  
  if (!specialOfferButton || !inner || !content || !cta) {
    console.error('ECOS Circle Popup: Критические элементы не найдены, скрипт остановлен');
    return;
  }

  function isOpen(){ return inner.classList.contains('ecos-circle-open'); }
  
  function showSpecialOfferButton(targetButton){
    if (!targetButton || !targetButton.getBoundingClientRect) return;
    
    // Используем requestAnimationFrame для гарантии, что DOM обновился
    requestAnimationFrame(function(){
      var rect = targetButton.getBoundingClientRect();
      
      // Позиционируем "Special Offer" точно поверх кнопки Details
      // getBoundingClientRect() возвращает координаты относительно viewport
      // что идеально для position: fixed
      specialOfferButton.style.left = rect.left + 'px';
      specialOfferButton.style.top = rect.top + 'px';
      specialOfferButton.style.transform = 'none'; // Убираем transform если был
      specialOfferButton.classList.add('active');
      
      // Удаляем старые обработчики если были
      if (window.ecosSpecialOfferScrollHandler) {
        window.removeEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
        document.removeEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
      }
      if (window.ecosSpecialOfferResizeHandler) {
        window.removeEventListener('resize', window.ecosSpecialOfferResizeHandler);
      }
      
      // Создаём обработчик скролла для обновления позиции (без requestAnimationFrame для мгновенного обновления)
      window.ecosSpecialOfferScrollHandler = function(){
        updateSpecialOfferPosition();
      };
      
      // Создаём обработчик resize для обновления позиции при изменении размера окна
      window.ecosSpecialOfferResizeHandler = function(){
        updateSpecialOfferPosition();
      };
      
      // Добавляем обработчики (capture phase для перехвата всех событий)
      window.addEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
      document.addEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
      window.addEventListener('resize', window.ecosSpecialOfferResizeHandler);
    });
  }
  
  function hideSpecialOfferButton(){
    specialOfferButton.classList.remove('active');
    // Удаляем обработчики скролла и resize когда кнопка скрыта
    if (window.ecosSpecialOfferScrollHandler) {
      window.removeEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
      document.removeEventListener('scroll', window.ecosSpecialOfferScrollHandler, true);
      window.ecosSpecialOfferScrollHandler = null;
    }
    if (window.ecosSpecialOfferResizeHandler) {
      window.removeEventListener('resize', window.ecosSpecialOfferResizeHandler);
      window.ecosSpecialOfferResizeHandler = null;
    }
  }
  
  function updateSpecialOfferPosition(){
    var detailsButton = document.getElementById(detailsButtonId);
    if (!detailsButton || !specialOfferButton.classList.contains('active')) return;
    
    var rect = detailsButton.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    
    specialOfferButton.style.left = rect.left + 'px';
    specialOfferButton.style.top = rect.top + 'px';
  }

  function openAtButton(buttonElement){
    // Поп-ап всегда открывается по центру экрана
    inner.style.left = '50%';
    inner.style.top = '50%';
    inner.style.transform = 'translate(-50%,-50%)';
    
    overlay.classList.add('active');
    inner.classList.add('ecos-circle-open');
    document.documentElement.style.overflow = 'hidden';
    
    // Удаляем WhatsApp виджеты на странице полностью (повторная проверка)
    setTimeout(function() {
      var whatsappWidgets = document.querySelectorAll('[href*="whatsapp"], [href*="wa.me"], [class*="whatsapp"], [id*="whatsapp"], [class*="WhatsApp"], [id*="WhatsApp"], [class*="wa-widget"], [id*="wa-widget"]');
      // Также проверяем iframe
      var iframes = document.querySelectorAll('iframe');
      iframes.forEach(function(iframe) {
        if (iframe.src && (iframe.src.indexOf('whatsapp') !== -1 || iframe.src.indexOf('wa.me') !== -1)) {
          whatsappWidgets = Array.prototype.slice.call(whatsappWidgets);
          whatsappWidgets.push(iframe);
        }
      });
      
      whatsappWidgets.forEach(function(widget) {
        // Не удаляем нашу кнопку CTA если она есть
        if (!widget.classList.contains('ecos-circle-cta') && !widget.closest('.ecos-circle-inner')) {
          // Сохраняем ссылку на родителя перед удалением
          var parent = widget.parentNode;
          if (parent) {
            widget.setAttribute('data-ecos-removed', 'true');
            parent.removeChild(widget);
          } else {
            // Если нет родителя, просто скрываем
            widget.style.display = 'none';
            widget.style.visibility = 'hidden';
            widget.style.opacity = '0';
            widget.style.pointerEvents = 'none';
            widget.setAttribute('data-ecos-hidden', 'true');
          }
        }
      });
    }, 200);
    
    // Также периодически проверяем и удаляем новые WhatsApp виджеты
    var whatsappCheckInterval = setInterval(function() {
      if (!isOpen()) {
        clearInterval(whatsappCheckInterval);
        return;
      }
      var whatsappWidgets = document.querySelectorAll('[href*="whatsapp"]:not([data-ecos-removed]), [href*="wa.me"]:not([data-ecos-removed]), [class*="whatsapp"]:not([data-ecos-removed]), [id*="whatsapp"]:not([data-ecos-removed])');
      whatsappWidgets.forEach(function(widget) {
        if (!widget.classList.contains('ecos-circle-cta') && !widget.closest('.ecos-circle-inner')) {
          var parent = widget.parentNode;
          if (parent) {
            widget.setAttribute('data-ecos-removed', 'true');
            parent.removeChild(widget);
          }
        }
      });
    }, 500);
    
    // Сохраняем интервал для очистки при закрытии
    window.ecosWhatsAppCheckInterval = whatsappCheckInterval;
    
    setTimeout(function(){ content.classList.add('ecos-circle-content-open'); }, 120);
    
    if (typeof carrotquest !== 'undefined') {
      carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
    }
  }

  function close(){
    content.classList.remove('ecos-circle-content-open');
    inner.classList.remove('ecos-circle-open');
    overlay.classList.remove('active');
    hideSpecialOfferButton();
    document.documentElement.style.overflow = '';
    localStorage.setItem(CONFIG.localStorageKey, 'true');
    
    // Останавливаем проверку WhatsApp виджетов
    if (window.ecosWhatsAppCheckInterval) {
      clearInterval(window.ecosWhatsAppCheckInterval);
      window.ecosWhatsAppCheckInterval = null;
    }
  }

  // Events - обработчик крестика с максимальным приоритетом
  if (closeBtn) {
    // Функция закрытия с максимальным приоритетом
    function handleClose(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      if (isOpen()) {
        close();
      }
      return false;
    }
    
    // Используем несколько обработчиков для максимальной надежности
    closeBtn.onclick = handleClose;
    closeBtn.onmousedown = function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };
    
    closeBtn.addEventListener('click', handleClose, true);
    closeBtn.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }, true);
    
    // Также обрабатываем клик на родительском элементе
    closeBtn.addEventListener('click', handleClose, false);
  }
  
  // Делегирование событий на document для надежности (только для крестика)
  // Используем capture phase для максимального приоритета
  document.addEventListener('click', function(e){
    // Проверяем только крестик, не блокируем другие клики
    var target = e.target;
    if (target && (target.id === 'ecosCircleClose' || target.classList.contains('ecos-circle-close')) && isOpen()) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      close();
      return false;
    }
  }, true);
  
  // Также добавляем обработчик mousedown на document
  document.addEventListener('mousedown', function(e){
    var target = e.target;
    if (target && (target.id === 'ecosCircleClose' || target.classList.contains('ecos-circle-close')) && isOpen()) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);
  
  overlay.addEventListener('click', function(e){ if (e.target === overlay && isOpen()) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && isOpen()) close(); });
  cta.addEventListener('click', function(e){ 
    localStorage.setItem(CONFIG.localStorageKey,'true');
    if (typeof carrotquest !== 'undefined') {
      carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
    }
  });
  
  // Клик на кнопку "Special Offer" - открывает поп-ап
  specialOfferButton.addEventListener('click', function(){
    // Проверяем, не показывался ли уже поп-ап
    if (localStorage.getItem(CONFIG.localStorageKey)) {
      // Поп-ап уже был показан, просто скрываем кнопку
      hideSpecialOfferButton();
      return;
    }
    
    // Сохраняем флаг, что поп-ап был показан - блокируем повторный показ
    localStorage.setItem(CONFIG.localStorageKey, 'true');
    
    // Находим кнопку Details по ID
    var detailsButton = document.getElementById('mining-farm-offer-details-91');
    if (detailsButton) {
      openAtButton(detailsButton);
      hideSpecialOfferButton();
    }
  });
  
  // Delegate trigger from page - триггер по клику на .offer__toggle-button (More)
  // При клике показывается кнопка "Special Offer" на месте Details (id="mining-farm-offer-details-91")
  document.addEventListener('click', function(e){
    // Проверяем, кликнули ли на кнопку .offer__toggle-button (More)
    var triggerButton = e.target.closest && e.target.closest('.offer__toggle-button');
    if (!triggerButton) return;
    
    // Проверяем, не показывался ли уже поп-ап после клика на Special Offer
    // Если поп-ап уже был показан, не показываем кнопку "Special Offer" снова
    if (localStorage.getItem(CONFIG.localStorageKey)) {
      return; // Поп-ап уже был показан, блокируем показ кнопки "Special Offer"
    }
    
    // Ждем немного, чтобы кнопка Details успела появиться после клика на More
    setTimeout(function() {
      // Находим кнопку Details по ID
      var detailsButton = document.getElementById('mining-farm-offer-details-91');
      if (!detailsButton) {
        console.warn('Кнопка Details с ID mining-farm-offer-details-91 не найдена');
        return;
      }
      
      // Проверяем, что кнопка видна
      var rect = detailsButton.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Кнопка Details не видна или скрыта');
        return;
      }
      
      // Показываем кнопку "Special Offer" поверх кнопки Details
      showSpecialOfferButton(detailsButton);
    }, 100);
  }, true);

  // Expose for manual testing
  window.ecosCircleOpen = function(){ openAtButton(null); };
  window.ecosCircleClose = close;
})();
