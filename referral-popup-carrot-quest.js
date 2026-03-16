// ============================================================
// REFERRAL POP-UP — КОД ДЛЯ CARROT QUEST
// Покупка уже совершена. Показываем через N секунд после визита.
// Английский текст, белая карточка, фирменная кнопка.
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // CONFIG
    // ============================================================
    const CONFIG = {
        // Через сколько миллисекунд после загрузки скрипта показать попап
        // (для аудитории «совершил покупку» в Carrot Quest).
        showDelay: 12000, // 12 секунд

        // Показывать только один раз на браузер (через localStorage)
        showOnce: true,
        localStorageKey: 'ecos_referral_popup_seen',

        // Тексты (EN)
        congrats: 'Congratulations on your mining investment!',
        headline: 'Want to speed up your payback?',
        subhead: 'Invite your friends and earn up to 7% of their mining spend. Track your referral income in real time in your account.',
        buttonText: 'Invite friends',
        buttonSecondaryText: 'View dashboard',

        // Ссылки
        referralsUrl: 'https://cp.ecos.am/referrals',  // Invite friends
        accountUrl: 'https://cp.ecos.am/',              // Go to my account

        zIndex: 999998
    };

    // Защита от дублирования
    if (document.getElementById('ecos-referral-popup-root')) return;
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) return;

    // ============================================================
    // СТИЛИ
    // ============================================================
    const styles = `
    <style id="ecos-referral-popup-styles">
        #ecos-referral-popup-root {
            position: fixed;
            inset: 0;
            z-index: ${CONFIG.zIndex};
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        #ecos-referral-popup-root.active {
            display: flex !important;
        }
        .ecos-ref-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.45);
            cursor: pointer;
        }
        .ecos-ref-box {
            position: relative;
            max-width: 560px;
            width: 100%;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.2);
            padding: 28px 44px 30px 36px;
            z-index: 1;
            pointer-events: auto;
            text-align: left;
            display: flex;
            flex-direction: column;
        }
        .ecos-ref-close {
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
        .ecos-ref-close:hover {
            background: #e5e5e5;
            color: #333;
        }
        .ecos-ref-close-icon {
            display: block;
            flex-shrink: 0;
        }
        .ecos-ref-congrats {
            font-size: 24px;
            font-weight: 700;
            color: #000;
            line-height: 1.25;
            margin: 0 0 8px;
        }
        .ecos-ref-headline {
            font-size: 24px;
            font-weight: 700;
            color: #000;
            line-height: 1.25;
            margin: 0 0 12px;
        }
        .ecos-ref-subhead {
            font-size: 14px;
            color: #444;
            line-height: 1.5;
            margin: 0 0 20px;
        }
        .ecos-ref-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 4px;
        }
        .ecos-ref-primary,
        .ecos-ref-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 18px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: none;
            box-sizing: border-box;
            white-space: nowrap;
        }
        .ecos-ref-primary {
            background: #8b7ed8;
            color: #fff;
        }
        .ecos-ref-primary:hover {
            background: #7a6bce;
        }
        .ecos-ref-secondary {
            background: transparent;
            color: #5a4a7a;
            border: 1px solid rgba(0,0,0,0.08);
        }
        .ecos-ref-secondary:hover {
            background: #f5f3ff;
            border-color: rgba(0,0,0,0.16);
        }
        @media (max-width: 640px) {
            .ecos-ref-box {
                padding: 24px 20px 26px;
            }
            .ecos-ref-congrats,
            .ecos-ref-headline {
                font-size: 20px;
            }
            .ecos-ref-actions {
                flex-direction: column;
                align-items: stretch;
            }
            .ecos-ref-primary,
            .ecos-ref-secondary {
                width: 100%;
                justify-content: center;
            }
        }
    </style>
    `;

    // ============================================================
    // HTML
    // ============================================================
    const html = `
    <div id="ecos-referral-popup-root" aria-hidden="true">
        <div class="ecos-ref-overlay" id="ecosRefOverlay"></div>
        <div class="ecos-ref-box" id="ecosRefBox">
            <button type="button" class="ecos-ref-close" id="ecosRefClose" aria-label="Close">
                <svg class="ecos-ref-close-icon" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/>
                </svg>
            </button>
            <p class="ecos-ref-congrats">${CONFIG.congrats}</p>
            <h2 class="ecos-ref-headline">${CONFIG.headline}</h2>
            <p class="ecos-ref-subhead">${CONFIG.subhead}</p>
            <div class="ecos-ref-actions">
                <button type="button" class="ecos-ref-primary" id="ecosRefPrimary">${CONFIG.buttonText}</button>
                <button type="button" class="ecos-ref-secondary" id="ecosRefSecondary">${CONFIG.buttonSecondaryText}</button>
            </div>
        </div>
    </div>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    // ============================================================
    // ЭЛЕМЕНТЫ
    // ============================================================
    const root = document.getElementById('ecos-referral-popup-root');
    const overlay = document.getElementById('ecosRefOverlay');
    const box = document.getElementById('ecosRefBox');
    const closeBtn = document.getElementById('ecosRefClose');
    const primaryBtn = document.getElementById('ecosRefPrimary');
    const secondaryBtn = document.getElementById('ecosRefSecondary');

    // ============================================================
    // ПОКАЗ / СКРЫТИЕ
    // ============================================================
    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Referral Pop-up Opened');
        }
    }

    function hidePopup() {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (CONFIG.showOnce) {
            localStorage.setItem(CONFIG.localStorageKey, 'true');
        }
    }

    // ============================================================
    // ЗАКРЫТИЕ
    // ============================================================
    closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        hidePopup();
    });

    overlay.addEventListener('click', function (e) {
        e.preventDefault();
        hidePopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && root.classList.contains('active')) {
            hidePopup();
        }
    });

    box.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // ============================================================
    // КНОПКИ
    // ============================================================
    function handleClick(payload) {
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Referral Pop-up Clicked', payload);
        }
    }

    primaryBtn.addEventListener('click', function (e) {
        e.preventDefault();
        handleClick({
            action: 'invite_friends',
            button: 'Invite friends',
            link: CONFIG.referralsUrl || ''
        });
        if (CONFIG.referralsUrl) {
            window.open(CONFIG.referralsUrl, '_blank');
        }
        hidePopup();
    });

    secondaryBtn.addEventListener('click', function (e) {
        e.preventDefault();
        handleClick({
            action: 'go_to_account',
            button: 'View dashboard',
            link: CONFIG.accountUrl || ''
        });
        if (CONFIG.accountUrl) {
            window.open(CONFIG.accountUrl, '_blank');
        }
        hidePopup();
    });

    // ============================================================
    // АВТОЗАПУСК: задержка после загрузки скрипта
    // ============================================================
    if (CONFIG.showDelay && CONFIG.showDelay > 0) {
        setTimeout(showPopup, CONFIG.showDelay);
    } else {
        // На случай, если захотите запускать сразу
        showPopup();
    }

    // Ручной вызов из консоли / других скриптов
    window.ecosReferralPopupShow = showPopup;
    window.ecosReferralPopupHide = hidePopup;
})();
