// ============================================================
// MARKETPLACE OFFERS POP-UP — подписка на офферы (б/у майнеры)
// Показ по скроллу. Телефон (свободная форма, можно +) + email. Опциональный блок продукта сверху. Компактный попап.
// ============================================================

(function() {
    'use strict';

    const CONFIG = {
        showOnce: true,
        localStorageKey: 'ecos_marketplace_offers_popup_seen',

        // Картинка сверху попапа (пустая строка — блок не показывается)
        topImageUrl: 'https://files.ecos.am/sasha/rhAsdHT7JLsUlC5HodQYt8x1VimaRicf8vldnd8R.png',

        headline: 'Stay updated on latest offers!',
        phonePlaceholder: 'Phone number',
        emailPlaceholder: 'Enter your email',
        buttonText: 'Subscribe',
        buttonSendingText: 'Sending...',
        zIndex: 999998
    };

    if (document.getElementById('ecos-marketplace-popup-root')) return;
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) return;

    const topImageHtml = CONFIG.topImageUrl ? `<div class="ecos-mp-top-img"><img src="${CONFIG.topImageUrl}" alt=""></div>` : '';

    const styles = `
        <style id="ecos-marketplace-popup-styles">
            #ecos-marketplace-popup-root {
                position: fixed; inset: 0; z-index: ${CONFIG.zIndex};
                display: none; align-items: flex-start; justify-content: flex-end; padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #ecos-marketplace-popup-root.active { display: flex !important; }
            .ecos-mp-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); cursor: pointer; }
            .ecos-mp-box {
                position: relative; max-width: 380px; width: 100%;
                background: #1a1a2e url('https://files.ecos.am/sasha/bqpn29TnD7vn7Xuch1qx4j3HihVFhp54Iowhqesc.jpg') right top/cover no-repeat;
                border-radius: 16px; box-shadow: 0 16px 48px rgba(0,0,0,0.18);
                overflow: hidden; z-index: 1; pointer-events: auto; text-align: left;
                padding: 20px 22px 22px; color: #fff;
            }
            .ecos-mp-close {
                position: absolute; top: 14px; right: 14px; width: 32px; height: 32px; padding: 0;
                border: none; background: rgba(255,255,255,0.25); border-radius: 50%; cursor: pointer; color: #fff;
                display: flex; align-items: center; justify-content: center;
            }
            .ecos-mp-close:hover { background: rgba(255,255,255,0.4); color: #fff; }
            .ecos-mp-close-icon { display: block; flex-shrink: 0; }
            .ecos-mp-top-img { margin-bottom: 14px; border-radius: 10px; overflow: hidden; }
            .ecos-mp-top-img img { width: 100%; height: auto; display: block; object-fit: contain; }
            .ecos-mp-headline { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 12px; line-height: 1.3; }
            .ecos-mp-form input {
                width: 100%; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.4); border-radius: 8px;
                font-size: 14px; margin-bottom: 8px; outline: none; box-sizing: border-box;
                background: rgba(255,255,255,0.12); color: #fff;
            }
            .ecos-mp-form input::placeholder { color: rgba(255,255,255,0.7); }
            .ecos-mp-form input:focus { border-color: rgba(255,255,255,0.7); }
            .ecos-mp-form button {
                width: 100%; padding: 11px; background: rgba(255,255,255,0.95); color: #1a1a2e; border: none;
                border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 2px;
                transition: background 0.2s, color 0.2s;
            }
            .ecos-mp-form button:hover { background: #fff; color: #1a1a2e; }
            .ecos-mp-form button:disabled { opacity: 0.6; cursor: not-allowed; }
            .ecos-mp-error { color: #ffb3b3; font-size: 12px; margin-top: -6px; margin-bottom: 6px; }
            @media (max-width: 440px) {
                .ecos-mp-box { padding: 16px 18px 18px; max-width: 100%; }
                .ecos-mp-headline { font-size: 16px; }
            }
        </style>`;

    const html = `
        <div id="ecos-marketplace-popup-root" aria-hidden="true">
            <div class="ecos-mp-overlay" id="ecosMpOverlay"></div>
            <div class="ecos-mp-box" id="ecosMpBox">
                <button type="button" class="ecos-mp-close" id="ecosMpClose" aria-label="Close"><svg class="ecos-mp-close-icon" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/></svg></button>
                ${topImageHtml}
                <h2 class="ecos-mp-headline">${CONFIG.headline}</h2>
                <form class="ecos-mp-form" id="ecosMpForm">
                    <input type="tel" id="ecosMpPhone" placeholder="${CONFIG.phonePlaceholder}" autocomplete="tel" inputmode="tel">
                    <input type="email" id="ecosMpEmail" placeholder="${CONFIG.emailPlaceholder}" required autocomplete="email">
                    <div class="ecos-mp-error" id="ecosMpError" style="display:none;"></div>
                    <button type="submit" id="ecosMpSubmit">${CONFIG.buttonText}</button>
                </form>
            </div>
        </div>`;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const root = document.getElementById('ecos-marketplace-popup-root');
    const overlay = document.getElementById('ecosMpOverlay');
    const closeBtn = document.getElementById('ecosMpClose');
    const form = document.getElementById('ecosMpForm');
    const phoneInput = document.getElementById('ecosMpPhone');
    const emailInput = document.getElementById('ecosMpEmail');
    const submitBtn = document.getElementById('ecosMpSubmit');
    const errorEl = document.getElementById('ecosMpError');

    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Marketplace Offers Pop-up Opened');
        }
    }

    function hidePopup() {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (CONFIG.showOnce) localStorage.setItem(CONFIG.localStorageKey, 'true');
    }

    closeBtn.addEventListener('click', function(e) { e.preventDefault(); hidePopup(); });
    overlay.addEventListener('click', function(e) { e.preventDefault(); hidePopup(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && root.classList.contains('active')) hidePopup(); });
    document.getElementById('ecosMpBox').addEventListener('click', function(e) { e.stopPropagation(); });

    phoneInput.addEventListener('keypress', function(e) {
        var key = e.key;
        if (key.length === 1 && !/[\d\s+]/.test(key)) e.preventDefault();
    });
    phoneInput.addEventListener('input', function(e) {
        var v = e.target.value.replace(/[^\d\s+]/g, '');
        if (v.length > 20) v = v.slice(0, 20);
        e.target.value = v;
    });
    phoneInput.addEventListener('paste', function(e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^\d\s+]/g, '').slice(0, 20);
        var start = phoneInput.selectionStart, end = phoneInput.selectionEnd, val = phoneInput.value;
        phoneInput.value = val.slice(0, start) + text + val.slice(end);
        phoneInput.selectionStart = phoneInput.selectionEnd = start + text.length;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var phone = (phoneInput && phoneInput.value) ? phoneInput.value.trim() : '';
        var email = (emailInput && emailInput.value) ? emailInput.value.trim() : '';

        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

        var digitsOnly = (phone || '').replace(/\D/g, '');
        if (!phone || digitsOnly.length < 6) {
            if (errorEl) { errorEl.textContent = 'Please enter your phone number'; errorEl.style.display = 'block'; }
            phoneInput.focus();
            return;
        }
        if (!email) {
            if (errorEl) { errorEl.textContent = 'Please enter your email'; errorEl.style.display = 'block'; }
            emailInput.focus();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            if (errorEl) { errorEl.textContent = 'Please enter a valid email'; errorEl.style.display = 'block'; }
            emailInput.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = CONFIG.buttonSendingText;

        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Marketplace Offers Pop-up Submitted');
            carrotquest.identify({ '$email': email, 'email': email, '$phone': phone, 'phone': phone });
            carrotquest.track('Marketplace Offers Lead', { email: email, phone: phone });
            carrotquest.track('Marketplace Pop-up Lead', { email: email, phone: phone });
        }

        hidePopup();
        form.reset();
        submitBtn.textContent = CONFIG.buttonText;
        submitBtn.disabled = false;
    });

    window.ecosMarketplacePopupShow = showPopup;
    window.ecosMarketplacePopupHide = hidePopup;

    // При запуске скрипта (когда Carrot срабатывает по триггеру) — показываем попап
    showPopup();
})();
