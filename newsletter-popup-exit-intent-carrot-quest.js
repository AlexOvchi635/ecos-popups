(function() {
    'use strict';

    // ============================================================
    // КОНФИГУРАЦИЯ
    // ============================================================
    const CONFIG = {
        exitIntentThreshold: 20,
        exitIntentDelay: 300, // мс — мышь должна задержаться в зоне
        dismissCooldown: 24 * 60 * 60 * 1000, // 24 часа в мс
        localStorageKey: 'ecos_newsletter_popup_seen',

        headline: 'GET X5 MORE POWER FOR YOUR HARDWARE',
        subhead: 'Subscribe to our newsletter and get a bonus',
        phonePlaceholder: 'Phone number',
        emailPlaceholder: 'Email *',
        buttonText: 'Claim now',
        buttonSendingText: 'Sending...',
        successMessage: 'Thank you! Check your email for the bonus.',

        zIndex: 999998,
    };

    // ============================================================
    // URL-ФИЛЬТР
    // ============================================================
    function isBlockedUrl(url) {
        return (
            url.indexOf('asics-marketplace') !== -1 ||
            url.indexOf('blog') !== -1 ||
            url.indexOf('cp.ecos.am') !== -1 ||
            url.indexOf('contracts') !== -1
        );
    }

    // ============================================================
    // ПРОВЕРКА: показывать или нет
    // submitted → никогда
    // timestamp → только если прошло 24ч
    // ============================================================
    function shouldShow() {
        var val = localStorage.getItem(CONFIG.localStorageKey);
        if (!val) return true;
        if (val === 'submitted') return false;
        var dismissedAt = parseInt(val, 10);
        if (isNaN(dismissedAt)) return false;
        return (Date.now() - dismissedAt) >= CONFIG.dismissCooldown;
    }

    // Ранний выход если уже не надо показывать
    if (!shouldShow()) return;

    // Защита от дублирования HTML
    if (!document.getElementById('ecos-newsletter-popup-root')) {

        // ============================================================
        // СТИЛИ
        // ============================================================
        const styles = `
            <style id="ecos-newsletter-popup-styles">
                #ecos-newsletter-popup-root {
                    position: fixed;
                    inset: 0;
                    z-index: ${CONFIG.zIndex};
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                }
                #ecos-newsletter-popup-root.active {
                    display: flex !important;
                }
                .ecos-nl-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.35);
                    cursor: pointer;
                }
                .ecos-nl-container {
                    position: relative;
                    max-width: 720px;
                    width: 100%;
                    background: #f5ebe6;
                    border-radius: 24px;
                    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
                    overflow: hidden;
                    display: flex;
                    flex-direction: row;
                    min-height: 420px;
                    z-index: 1;
                    pointer-events: auto;
                }
                .ecos-nl-left {
                    width: 42%;
                    min-width: 260px;
                    background-image: url('https://files.ecos.am/sasha/r32UjSTFNxMhOPpjDM2kKFt4IQyTRcF5M4m83CrJ.png'), url('https://files.ecos.am/sasha/2ggnlbjOEZvajfACnUX06mYyzKcEAUu0xZxgCXIg.jpg');
                    background-size: 96%, cover;
                    background-position: center, center;
                    background-repeat: no-repeat, no-repeat;
                }
                .ecos-nl-right {
                    flex: 1;
                    background: #fff;
                    padding: 32px 36px 36px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    border-radius: 0 24px 24px 0;
                    box-shadow: -8px 0 24px rgba(0,0,0,0.04);
                    text-align: left;
                }
                .ecos-nl-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: #f0f0f0;
                    border-radius: 50%;
                    cursor: pointer;
                    color: #888;
                    font-size: 18px;
                    line-height: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ecos-nl-close:hover { background: #e5e5e5; color: #333; }
                .ecos-nl-logo { margin-bottom: 20px; }
                .ecos-nl-logo-img { height: 40px; width: auto; display: block; object-fit: contain; }
                .ecos-nl-headline { font-size: 28px; font-weight: 700; color: #111; text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 8px; }
                .ecos-nl-subhead { font-size: 14px; color: #555; margin-bottom: 24px; line-height: 1.4; }
                .ecos-nl-form input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 10px; font-size: 15px; margin-bottom: 12px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
                .ecos-nl-form input:focus { border-color: #b0a6ee; }
                .ecos-nl-form input::placeholder { color: #999; }
                .ecos-nl-form input.error { border-color: #ff6b6b; }
                .ecos-nl-form button { width: 100%; padding: 14px; background: #b0a6ee; color: #fff; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
                .ecos-nl-form button:hover { background: #9a8ee0; }
                .ecos-nl-form button:disabled { background: #ccc; cursor: not-allowed; }
                .ecos-nl-error { color: #ff6b6b; font-size: 12px; margin-top: -8px; margin-bottom: 8px; }
                @media (max-width: 640px) {
                    .ecos-nl-container { flex-direction: column; min-height: auto; }
                    .ecos-nl-left { width: 100%; min-height: 220px; }
                    .ecos-nl-right { border-radius: 0 0 24px 24px; }
                }
            </style>
        `;

        // ============================================================
        // HTML
        // ============================================================
        const html = `
            <div id="ecos-newsletter-popup-root" aria-hidden="true">
                <div class="ecos-nl-overlay" id="ecosNlOverlay"></div>
                <div class="ecos-nl-container" id="ecosNlContainer">
                    <div class="ecos-nl-left"></div>
                    <div class="ecos-nl-right">
                        <button type="button" class="ecos-nl-close" id="ecosNlClose" aria-label="Close">&times;</button>
                        <div class="ecos-nl-logo">
                            <img src="https://files.ecos.am/sasha/rXMPaolTDgCgUJ5b2uD6Jd2E7K70c6Y2noaoX10I.png" alt="Logo" class="ecos-nl-logo-img">
                        </div>
                        <h2 class="ecos-nl-headline">${CONFIG.headline}</h2>
                        <p class="ecos-nl-subhead">${CONFIG.subhead}</p>
                        <form class="ecos-nl-form" id="ecosNlForm">
                            <input type="tel" name="phone" id="ecosNlPhone" placeholder="${CONFIG.phonePlaceholder}">
                            <input type="email" name="email" id="ecosNlEmail" placeholder="${CONFIG.emailPlaceholder}" required>
                            <div class="ecos-nl-error" id="ecosNlError" style="display:none;"></div>
                            <button type="submit" id="ecosNlSubmit">${CONFIG.buttonText}</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // ============================================================
    // ЭЛЕМЕНТЫ
    // ============================================================
    const root       = document.getElementById('ecos-newsletter-popup-root');
    const overlay    = document.getElementById('ecosNlOverlay');
    const container  = document.getElementById('ecosNlContainer');
    const closeBtn   = document.getElementById('ecosNlClose');
    const form       = document.getElementById('ecosNlForm');
    const phoneInput = document.getElementById('ecosNlPhone');
    const emailInput = document.getElementById('ecosNlEmail');
    const submitBtn  = document.getElementById('ecosNlSubmit');
    const errorEl    = document.getElementById('ecosNlError');

    // ============================================================
    // ПОКАЗ
    // ============================================================
    function showPopup() {
        if (!shouldShow()) return;
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Newsletter Pop-up Opened');
        }
    }

    // ============================================================
    // СКРЫТИЕ
    // submitted = true  → никогда больше не показывать
    // submitted = false → сохранить timestamp, показать через 24ч
    // ============================================================
    function hidePopup(submitted) {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (submitted) {
            localStorage.setItem(CONFIG.localStorageKey, 'submitted');
        } else {
            localStorage.setItem(CONFIG.localStorageKey, Date.now().toString());
        }
    }

    // ============================================================
    // ЗАКРЫТИЕ: кнопка, overlay, Escape
    // ============================================================
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        hidePopup(false);
    });
    overlay.addEventListener('click', function(e) {
        e.preventDefault(); e.stopPropagation();
        hidePopup(false);
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && root.classList.contains('active')) hidePopup(false);
    });
    container.addEventListener('click', function(e) { e.stopPropagation(); });

    // ============================================================
    // ОТПРАВКА ФОРМЫ
    // ============================================================
    function validatePhone(phone) {
        return phone.replace(/\D/g, '').length >= 5;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var phone = phoneInput.value.trim();
        var email = emailInput.value.trim();

        errorEl.style.display = 'none';
        errorEl.textContent = '';
        phoneInput.classList.remove('error');
        emailInput.classList.remove('error');

        if (!email) {
            errorEl.textContent = 'Please enter your email';
            errorEl.style.display = 'block';
            emailInput.classList.add('error');
            emailInput.focus();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorEl.textContent = 'Please enter a valid email';
            errorEl.style.display = 'block';
            emailInput.classList.add('error');
            emailInput.focus();
            return;
        }
        if (phone && !validatePhone(phone)) {
            errorEl.textContent = 'Please enter a valid phone number (minimum 5 digits)';
            errorEl.style.display = 'block';
            phoneInput.classList.add('error');
            phoneInput.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = CONFIG.buttonSendingText;

        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Newsletter Pop-up Submitted');
            var identifyData = { '$email': email, 'email': email };
            if (phone) { identifyData['$phone'] = phone; identifyData['phone'] = phone; }
            carrotquest.identify(identifyData);
            carrotquest.track('Newsletter Email Submitted', { email: email, source: 'newsletter_popup' });
            if (phone) carrotquest.track('Newsletter Phone Submitted', { phone: phone, source: 'newsletter_popup' });
            var eventData = { email: email, source: 'newsletter_popup' };
            if (phone) eventData.phone = phone;
            carrotquest.track('Newsletter Pop-up Form Submitted', eventData);
        }

        // submitted=true — больше никогда не показывать
        hidePopup(true);
        form.reset();
        submitBtn.textContent = CONFIG.buttonText;
        submitBtn.disabled = false;
    });

    phoneInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
    });

    // ============================================================
    // EXIT INTENT — подключение и отключение
    // ============================================================
    var exitIntentHandler = null;

    function attachExitIntent() {
        if (exitIntentHandler) return; // уже подключён
        if (!shouldShow()) return;
        if (isBlockedUrl(window.location.href)) return;

        var exitTimer = null;
        exitIntentHandler = function(e) {
            if (e.clientY <= CONFIG.exitIntentThreshold) {
                if (!exitTimer) {
                    exitTimer = setTimeout(function() {
                        showPopup();
                        detachExitIntent();
                    }, CONFIG.exitIntentDelay);
                }
            } else {
                if (exitTimer) {
                    clearTimeout(exitTimer);
                    exitTimer = null;
                }
            }
        };
        document.addEventListener('mousemove', exitIntentHandler);
    }

    function detachExitIntent() {
        if (exitIntentHandler) {
            document.removeEventListener('mousemove', exitIntentHandler);
            exitIntentHandler = null;
        }
    }

    // ============================================================
    // SPA: переподключаем exit intent при каждой смене URL
    // ============================================================
    function onPageChange() {
        // Дать время SPA обновить DOM/URL
        setTimeout(function() {
            if (isBlockedUrl(window.location.href)) {
                detachExitIntent();
                return;
            }
            if (!shouldShow()) return;
            // Переподключаем на новой "странице"
            detachExitIntent();
            attachExitIntent();
        }, 200);
    }

    // Перехватываем history API
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

    // Первый запуск
    attachExitIntent();

    // ============================================================
    // РУЧНОЙ ВЫЗОВ
    // ============================================================
    window.ecosNewsletterPopupShow = showPopup;
    window.ecosNewsletterPopupHide = function() { hidePopup(false); };
})();

/*
ЛОГИКА ПОКАЗА:
- Попап показывается при движении мыши в верхнюю зону (exit intent)
- После ОТПРАВКИ формы → localStorage = 'submitted' → больше никогда не показывать
- После ЗАКРЫТИЯ (×, overlay, Escape) → localStorage = timestamp → показать снова через 24ч
- SPA: при каждой смене URL exit intent переподключается заново

URL-ФИЛЬТР (попап не показывается на):
- asics-marketplace
- blog
- cp.ecos.am

СБРОС ДЛЯ ТЕСТА:
localStorage.removeItem('ecos_newsletter_popup_seen')
*/
