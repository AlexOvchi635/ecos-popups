// EMAIL PROMO POPUP - CARROT QUEST

(function() {
    'use strict';

    const CONFIG = {
        imageUrl: 'https://files.ecos.am/sasha/0c2GyqhSc7QBYDv9y0zfR84motQkn7FI1XLTC6kg.jpg',
        icon: '📧',
        title: 'Check Your Email!',
        message: 'We\'ve sent you a <span class="highlight">special offer</span> to your email. Open your inbox to claim it now!',
        showDelay: 2000
    };
    const styles = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            }
            .ecos-promo-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 999998;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                backdrop-filter: blur(5px);
            }

            .ecos-promo-overlay.active {
                display: flex;
                opacity: 1;
            }

            .ecos-promo-container {
                background: #D3D3D3;
                border-radius: 20px;
                max-width: 420px;
                width: 90%;
                position: relative;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
                transform: scale(0.8);
                animation: ecosPromoPopIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                overflow: hidden;
            }

            @keyframes ecosPromoPopIn {
                to { transform: scale(1); }
            }

            .ecos-promo-close {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border: none;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 50%;
                cursor: pointer;
                font-size: 22px;
                color: #D3D3D3;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                z-index: 10;
            }

            .ecos-promo-close:hover {
                background: rgba(0, 0, 0, 0.7);
                transform: rotate(90deg) scale(1.1);
            }

            .ecos-promo-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
                display: block;
            }

            .ecos-promo-image-bg {
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 64px;
            }

            .ecos-promo-content {
                padding: 20px 20px 28px;
                text-align: center;
            }

            .ecos-promo-title {
                font-size: 26px;
                font-weight: 900;
                color: #1a1a1a;
                margin-bottom: 16px;
                line-height: 1.2;
            }

            .ecos-promo-message {
                font-size: 18px;
                line-height: 1.7;
                color: #000;
                font-weight: 700;
                margin-bottom: 0;
            }

            .ecos-promo-message .highlight {
                color: #FF6600;
            }

            @media (max-width: 600px) {
                .ecos-promo-container {
                    width: 95%;
                }

                .ecos-promo-image,
                .ecos-promo-image-bg {
                    height: 160px;
                }

                .ecos-promo-image-bg {
                    font-size: 48px;
                }

                .ecos-promo-content {
                    padding: 24px 20px;
                }

                .ecos-promo-title {
                    font-size: 22px;
                }

                .ecos-promo-message {
                    font-size: 16px;
                }

                .ecos-promo-content {
                    padding: 16px 16px 24px;
                }
            }
        </style>
    `;
    const imageHTML = CONFIG.imageUrl 
        ? `<img src="${CONFIG.imageUrl}" alt="ECOS" class="ecos-promo-image">`
        : `<div class="ecos-promo-image-bg">${CONFIG.icon}</div>`;

    const html = `
        <div class="ecos-promo-overlay" id="ecosPromoOverlay">
            <div class="ecos-promo-container">
                <button class="ecos-promo-close" id="ecosPromoClose">×</button>
                
                ${imageHTML}

                <div class="ecos-promo-content">
                    <h2 class="ecos-promo-title">${CONFIG.title}</h2>
                    
                    <p class="ecos-promo-message">${CONFIG.message}</p>
                </div>
            </div>
        </div>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const overlay = document.getElementById('ecosPromoOverlay');

    function showPromoPopup() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (typeof carrotquest !== 'undefined') {
            carrotquest.track('Email Promo Popup Shown');
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
        }
    }

    function closePromoPopup() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        localStorage.setItem('ecos_promo_popup_seen', 'true');
    }

    document.getElementById('ecosPromoClose').addEventListener('click', closePromoPopup);
    overlay.addEventListener('click', function(e) {
        if (e.target === this) closePromoPopup();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePromoPopup();
    });

    const seen = localStorage.getItem('ecos_promo_popup_seen');
    
    if (!seen) {
        setTimeout(function() {
            showPromoPopup();
        }, CONFIG.showDelay);
    }

    window.showPromoPopup = showPromoPopup;

})();

/* 
УСТАНОВКА:
1. Carrot Quest → JS-скрипт → Вставить код
2. Триггер: URL содержит /dashboard ИЛИ событие user_registered
3. Показать: 1 раз

НАСТРОЙКА:
- imageUrl: ссылка на картинку
- title/message: тексты
- showDelay: задержка в мс

АНАЛИТИКА:
Автоматически отслеживается:
- Просмотры (метрика "Прочитали" в статистике рассылок)
- Событие "Email Promo Popup Shown" в карточке пользователя

ТЕСТИРОВАНИЕ:
F12 → showPromoPopup()
Сброс: localStorage.removeItem('ecos_promo_popup_seen')
*/
