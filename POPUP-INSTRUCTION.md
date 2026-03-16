# Инструкция по созданию поп-апов для Carrot Quest

Справочник по верстке, событиям и тонкостям реализации. Основано на `newsletter-popup-exit-intent-carrot-quest.js` и других поп-апах портфолио.

---

## 1. Крестик закрытия (SVG)

### Рекомендуемый SVG-крестик

```html
<button type="button" class="popup-close" id="popupClose" aria-label="Close">
  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
    <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/>
  </svg>
</button>
```

**Почему SVG, а не `&times;`:**
- Масштабируется без потери качества
- Цвет через `currentColor` — наследует цвет текста
- Одинаково выглядит во всех браузерах
- `stroke-linecap="round"` — скруглённые концы линий

### Альтернатива: символ ×

```html
<button type="button" class="popup-close" aria-label="Close">&times;</button>
```

Работает, но может отличаться по виду в разных шрифтах.

### Стили кнопки закрытия

```css
.popup-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-close:hover {
  background: #e5e5e5;
  color: #333;
}
.popup-close svg {
  flex-shrink: 0; /* не сжимать иконку */
}
```

---

## 2. Структура HTML

### Базовая разметка

```html
<div id="popup-root" aria-hidden="true">
  <div class="popup-overlay" id="popupOverlay"></div>
  <div class="popup-container" id="popupContainer">
    <button type="button" class="popup-close" id="popupClose" aria-label="Close">...</button>
    <!-- контент -->
  </div>
</div>
```

**Важно:**
- `aria-hidden="true"` — скрыт для скринридеров
- Overlay — для закрытия по клику вне контейнера
- Контейнер — `e.stopPropagation()` чтобы клик внутри не закрывал

---

## 3. Стили корневого элемента

```css
#popup-root {
  position: fixed;
  inset: 0;
  z-index: 999998;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
#popup-root.active {
  display: flex !important;
}
```

**Z-index:** 999998 — выше большинства виджетов, ниже Carrot Quest (обычно 999999).

---

## 4. Overlay

```css
.popup-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
}
```

Для toast-попапов без overlay (правый верхний угол):

```css
.popup-overlay {
  background: transparent;
  pointer-events: none;
}
```

---

## 5. События Carrot Quest

### При открытии поп-апа

```javascript
function showPopup() {
  root.style.display = 'flex';
  root.classList.add('active');
  root.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (typeof carrotquest !== 'undefined') {
    carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
    carrotquest.track('Название Pop-up Opened');
  }
}
```

### При закрытии (крестик, overlay, Escape)

Обычно не трекаем — только сохраняем в localStorage.

### При отправке формы (CTA)

```javascript
if (typeof carrotquest !== 'undefined') {
  carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
  carrotquest.track('Название Pop-up Submitted');
  carrotquest.identify({ '$email': email, 'email': email });
  carrotquest.track('Название Lead', { email: email });
}
```

### При клике на CTA-ссылку (без формы)

```javascript
btn.addEventListener('click', function() {
  if (typeof carrotquest !== 'undefined') {
    carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
    carrotquest.track('Название Pop-up CTA Clicked');
  }
  hidePopup();
});
```

**Сводка событий:**

| Действие | trackMessageInteraction | track |
|----------|-------------------------|-------|
| Открытие | `'read'` | `'Popup Opened'` |
| Отправка формы / клик CTA | `'clicked'` | `'Popup Submitted'` / `'CTA Clicked'` |
| Закрытие | — | обычно не трекаем |

---

## 6. Логика открытия и закрытия

### showPopup()

```javascript
function showPopup() {
  root.style.display = 'flex';
  root.classList.add('active');
  root.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  // Carrot Quest events...
}
```

### hidePopup()

```javascript
function hidePopup(submitted) {
  root.style.display = 'none';
  root.classList.remove('active');
  root.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // localStorage...
}
```

### Обработчики закрытия

```javascript
closeBtn.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  hidePopup(false);
});

overlay.addEventListener('click', function(e) {
  e.preventDefault();
  hidePopup(false);
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && root.classList.contains('active')) {
    hidePopup(false);
  }
});

container.addEventListener('click', function(e) {
  e.stopPropagation(); // клик внутри не закрывает
});
```

---

## 7. LocalStorage

### Вариант 1: один раз навсегда

```javascript
localStorage.setItem('popup_seen', 'true');
// Проверка: if (localStorage.getItem('popup_seen')) return;
```

### Вариант 2: закрытие vs отправка

```javascript
// submitted → никогда не показывать
// close → показать снова через 24ч
function hidePopup(submitted) {
  if (submitted) {
    localStorage.setItem('popup_seen', 'submitted');
  } else {
    localStorage.setItem('popup_seen', Date.now().toString());
  }
}

function shouldShow() {
  var val = localStorage.getItem('popup_seen');
  if (!val) return true;
  if (val === 'submitted') return false;
  var dismissedAt = parseInt(val, 10);
  return (Date.now() - dismissedAt) >= 24 * 60 * 60 * 1000;
}
```

### Вариант 3: submitted + lastClosed

```javascript
submittedKey: 'popup_submitted',
lastClosedKey: 'popup_closed_at',
reopenAfterMs: 60 * 60 * 1000, // 1 час
```

---

## 8. Защита от дублирования

```javascript
if (document.getElementById('popup-root')) return;
```

Перед вставкой HTML — чтобы скрипт не добавлял разметку дважды.

---

## 9. URL-фильтр

```javascript
function isBlockedUrl(url) {
  return (
    url.indexOf('asics-marketplace') !== -1 ||
    url.indexOf('blog') !== -1 ||
    url.indexOf('cp.ecos.am') !== -1
  );
}
if (isBlockedUrl(window.location.href)) return;
```

---

## 10. SPA (React, Vue и т.п.)

Переподключение при смене URL:

```javascript
var _pushState = history.pushState;
history.pushState = function() {
  _pushState.apply(history, arguments);
  onPageChange();
};
var _replaceState = history.replaceState;
history.replaceState = function() {
  _replaceState.apply(history, arguments);
  onPageChange();
};
window.addEventListener('popstate', onPageChange);
```

---

## 11. Exit Intent

```javascript
var exitIntentThreshold = 20; // пикселей от верха
var exitIntentDelay = 300;   // мс задержки

document.addEventListener('mousemove', function(e) {
  if (e.clientY <= exitIntentThreshold) {
    setTimeout(showPopup, exitIntentDelay);
    document.removeEventListener('mousemove', arguments.callee);
  }
});
```

---

## 12. Валидация формы

### Email

```javascript
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  errorEl.textContent = 'Please enter a valid email';
  errorEl.style.display = 'block';
  return;
}
```

### Телефон (минимум цифр)

```javascript
function validatePhone(phone) {
  return phone.replace(/\D/g, '').length >= 5;
}
```

### Маска телефона (только цифры, пробелы, +)

```javascript
phoneInput.addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
});
```

---

## 13. Ручной вызов для теста

```javascript
window.popupShow = showPopup;
window.popupHide = function() { hidePopup(false); };
```

В консоли: `popupShow()` или `popupHide()`.

---

## 14. Сброс для тестирования

```javascript
localStorage.removeItem('ecos_newsletter_popup_seen');
```

---

## 15. Чек-лист перед деплоем

- [ ] SVG-крестик с `aria-label="Close"`
- [ ] `aria-hidden` переключается при открытии/закрытии
- [ ] `document.body.style.overflow = 'hidden'` при открытии
- [ ] Закрытие: крестик, overlay, Escape
- [ ] `e.stopPropagation()` на контейнере
- [ ] Carrot Quest: `trackMessageInteraction` + `track` при открытии и отправке
- [ ] `carrotquest.identify()` при отправке формы
- [ ] Проверка `typeof carrotquest !== 'undefined'`
- [ ] Защита от дублирования HTML
- [ ] Уникальный `localStorageKey`
- [ ] Z-index 999998
- [ ] Адаптивность (media queries)
