// ============================================================
// MARKETPLACE SUBSCRIBE POP-UP — подписка на обновления/офферы (hashrate marketplace)
// Показ только на /en/hashrate-marketplace и /ru/hashrate-marketplace, через 5 сек.
// Позиция: верхний левый угол. Поле email + кнопка. События Carrotquest для лида.
// ============================================================

(function() {
    'use strict';

    const isPreview = window.ECOS_POPUP_PREVIEW === true;
    const allowedPaths = ['/en/hashrate-marketplace', '/ru/hashrate-marketplace'];
    const onAllowedPage = isPreview || (location.hostname === 'ecos.am' && allowedPaths.some(function(p) { return location.pathname === p; }));
    if (!onAllowedPage) return;

    const CONFIG = {
        showOnce: true,
        localStorageKey: 'ecos_marketplace_subscribe_popup_seen',
        reopenAfterMs: 60 * 60 * 1000,
        submittedKey: 'ecos_marketplace_subscribe_popup_submitted',
        lastClosedKey: 'ecos_marketplace_subscribe_popup_closed_at',
        delayMs: isPreview ? 2000 : 5000,
        logoUrl: 'https://files.ecos.am/sasha/rXMPaolTDgCgUJ5b2uD6Jd2E7K70c6Y2noaoX10I.png',
        headline: 'Get the best offers first',
        subline: "Subscribe and we'll notify you about new hashrate listings and special deals.",
        emailPlaceholder: 'Enter your email',
        buttonText: 'Subscribe',
        buttonSendingText: 'Sending...',
        zIndex: 999998
    };

    if (document.getElementById('ecos-mps-popup-root')) return;
    if (!isPreview) {
        if (localStorage.getItem(CONFIG.submittedKey) === 'true') return;
        const lastClosedRaw = localStorage.getItem(CONFIG.lastClosedKey);
        if (lastClosedRaw) {
            const lastClosed = parseInt(lastClosedRaw, 10);
            if (!Number.isNaN(lastClosed) && Date.now() - lastClosed < CONFIG.reopenAfterMs) {
                return;
            }
        }
    }

    const styles = `
        <style id="ecos-mps-popup-styles">
            #ecos-mps-popup-root {
                position: fixed; inset: 0; z-index: ${CONFIG.zIndex};
                display: none; align-items: flex-start; justify-content: flex-start; padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            #ecos-mps-popup-root.active { display: flex !important; }
            .ecos-mps-overlay { position: absolute; inset: 0; background: transparent; pointer-events: none; }
            .ecos-mps-box {
                position: relative; max-width: 300px; width: 100%;
                background: #fff;
                border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                overflow: hidden; z-index: 1; pointer-events: auto; text-align: left;
                padding: 18px 16px 20px; color: #1a1a2e;
            }
            .ecos-mps-close {
                position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; padding: 0;
                border: none; background: #eee; border-radius: 50%; cursor: pointer; color: #555;
                display: flex; align-items: center; justify-content: center;
            }
            .ecos-mps-close:hover { background: #e0e0e0; color: #333; }
            .ecos-mps-close-icon { display: block; flex-shrink: 0; }
            .ecos-mps-logo { margin-bottom: 12px; }
            .ecos-mps-logo img { height: 28px; width: auto; display: block; }
            .ecos-mps-headline { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0 0 6px 0; line-height: 1.3; }
            .ecos-mps-subline { font-size: 12px; color: #666; line-height: 1.45; margin: 0 0 14px 0; }
            .ecos-mps-form input {
                width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px;
                font-size: 13px; margin-bottom: 8px; outline: none; box-sizing: border-box;
                background: #fff; color: #333;
            }
            .ecos-mps-form input::placeholder { color: #999; }
            .ecos-mps-form input:focus { border-color: #ff6b2c; }
            .ecos-mps-form button {
                position: relative; width: 100%; padding: 10px;
                background: linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, transparent 60%), linear-gradient(90deg, #ff6b2c 0%, #ff8f5a 100%);
                color: #fff; border: none; border-radius: 6px; font-size: 13px; font-weight: 600;
                cursor: pointer; margin-top: 0; transition: transform 0.2s ease; box-shadow: 0 1px 0 rgba(255,255,255,0.2) inset;
            }
            .ecos-mps-form button:hover:not(:disabled) { transform: scale(1.06); }
            .ecos-mps-form button:disabled { opacity: 0.6; cursor: not-allowed; }
            .ecos-mps-error { color: #c62828; font-size: 11px; margin-top: -4px; margin-bottom: 4px; }
            @media (max-width: 360px) {
                .ecos-mps-box { padding: 14px 12px 16px; max-width: 100%; }
                .ecos-mps-headline { font-size: 15px; }
            }
        </style>`;

    const html = `
        <div id="ecos-mps-popup-root" aria-hidden="true">
            <div class="ecos-mps-overlay" id="ecosMpsOverlay"></div>
            <div class="ecos-mps-box" id="ecosMpsBox">
                <button type="button" class="ecos-mps-close" id="ecosMpsClose" aria-label="Close"><svg class="ecos-mps-close-icon" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/></svg></button>
                <div class="ecos-mps-logo"><img src="${CONFIG.logoUrl}" alt="ECOS"></div>
                <h2 class="ecos-mps-headline">${CONFIG.headline}</h2>
                <p class="ecos-mps-subline">${CONFIG.subline}</p>
                <form class="ecos-mps-form" id="ecosMpsForm" novalidate>
                    <input type="email" id="ecosMpsEmail" placeholder="${CONFIG.emailPlaceholder}" autocomplete="email">
                    <div class="ecos-mps-error" id="ecosMpsError" style="display:none;"></div>
                    <button type="submit" id="ecosMpsSubmit">${CONFIG.buttonText}</button>
                </form>
            </div>
        </div>`;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const root = document.getElementById('ecos-mps-popup-root');
    const overlay = document.getElementById('ecosMpsOverlay');
    const closeBtn = document.getElementById('ecosMpsClose');
    const form = document.getElementById('ecosMpsForm');
    const emailInput = document.getElementById('ecosMpsEmail');
    const submitBtn = document.getElementById('ecosMpsSubmit');
    const errorEl = document.getElementById('ecosMpsError');

    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (typeof carrotquest !== 'undefined') {
            carrotquest.track('Marketplace Hashrate Subscribe Pop-up Opened');
        }
    }

    function hidePopup(reason) {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (reason === 'submitted') {
            localStorage.setItem(CONFIG.submittedKey, 'true');
        } else if (reason === 'close') {
            localStorage.setItem(CONFIG.lastClosedKey, String(Date.now()));
        }
    }

    closeBtn.addEventListener('click', function(e) { e.preventDefault(); hidePopup('close'); });
    overlay.addEventListener('click', function(e) { e.preventDefault(); hidePopup('close'); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && root.classList.contains('active')) hidePopup('close'); });
    document.getElementById('ecosMpsBox').addEventListener('click', function(e) { e.stopPropagation(); });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = (emailInput && emailInput.value) ? emailInput.value.trim() : '';

        if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }

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
            carrotquest.identify({ '$email': email, 'email': email });
            carrotquest.track('Marketplace Hashrate Subscribe Pop-up Submitted');
            carrotquest.track('Marketplace Hashrate Subscribe Lead', { email: email });
        }

        hidePopup('submitted');
        form.reset();
        submitBtn.textContent = CONFIG.buttonText;
        submitBtn.disabled = false;
    });

    window.ecosMarketplaceSubscribePopupShow = showPopup;
    window.ecosMarketplaceSubscribePopupHide = hidePopup;

    setTimeout(showPopup, CONFIG.delayMs);
})();
