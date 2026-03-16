// ============================================================
// ECOS CLOUD MINING - WELCOME POPUP
// Поп-ап приветствия для страницы cloud-mining
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // ПРОВЕРКА URL - поп-ап ТОЛЬКО на страницах с cloud-mining
    // Работает для всех языков: /en/cloud-mining, /es/cloud-mining, /ru/cloud-mining и т.д.
    // ============================================================
    const currentUrl = window.location.href.toLowerCase();
    
    // Проверяем что URL содержит cloud-mining (работает для всех языков)
    const hasCloudMining = currentUrl.includes('cloud-mining');
    
    // Проверяем что URL НЕ содержит mining-farm (чтобы не пересекаться с Circle Popup)
    const hasMiningFarm = currentUrl.includes('mining-farm');
    
    if (!hasCloudMining || hasMiningFarm) {
        // Поп-ап не должен работать на других страницах
        return;
    }

    // ============================================================
    // КОНФИГУРАЦИЯ
    // ============================================================
    const CONFIG = {
        title: 'TRIPLE YOUR MINING POWER',
        description: 'Get 3X hashrate bonus for your first 30 days.',
        startDelay: 2000,
        localStorageKey: 'ecos_welcome_popup_seen'
    };

    // ============================================================
    // СТИЛИ
    // ============================================================
    const styles = `
        <style>
            * {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .ecos-welcome-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 999997;
                display: none;
                opacity: 0;
                transition: opacity 0.4s ease;
            }

            .ecos-welcome-overlay.active {
                display: block;
                opacity: 1;
            }

            .ecos-welcome-highlight {
                position: fixed;
                z-index: 999998;
                border-radius: 12px;
                border: none;
                pointer-events: none;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                /* Затемнение вокруг кнопок через box-shadow, но сами кнопки остаются четкими */
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75);
            }
            
            /* Убираем затемнение с самих кнопок */
            #cloud-mining-amount-1000,
            #cloud-mining-amount-2000,
            #cloud-mining-amount-3000 {
                position: relative;
                z-index: 999999 !important;
                filter: none !important;
                opacity: 1 !important;
            }

            .ecos-welcome-highlight::before {
                content: '';
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 12px;
                background: linear-gradient(90deg, #5374ed 0%, #8588ea 33%, #b9adff 66%, #dbbbfe 100%);
                z-index: -1;
                box-shadow: 0 0 40px rgba(131, 129, 228, 0.6);
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box, 
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask: 
                    linear-gradient(#fff 0 0) content-box, 
                    linear-gradient(#fff 0 0);
                mask-composite: exclude;
                padding: 4px;
            }

            .ecos-welcome-tooltip {
                position: fixed;
                z-index: 1000000;
                background: #ffffff url('https://files.ecos.am/sasha/JR1INUDb52QEsu039TUMAeinC3TziBuWTyHpu4NV.jpg') center center / cover no-repeat;
                border-radius: 20px;
                padding: 16px;
                max-width: 420px;
                width: 90%;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
                border: none;
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                display: none;
            }

            .ecos-welcome-tooltip.active {
                opacity: 1;
                transform: scale(1);
            }

            .ecos-welcome-title {
                font-size: 20px;
                font-weight: 900;
                color: #000000;
                margin-bottom: 10px;
                line-height: 1.2;
            }

            .ecos-welcome-description {
                color: #444fcf;
                font-size: 14px;
                font-weight: 700;
                line-height: 1.6;
                margin-bottom: 18px;
            }

            .ecos-welcome-buttons {
                display: flex;
                gap: 12px;
                justify-content: center;
            }

            .ecos-welcome-btn {
                flex: 1;
                padding: 10px 20px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 800;
                font-size: 14px;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #ffffff;
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
            }

            .ecos-welcome-btn-skip {
                background: rgba(0, 0, 0, 0.2);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }

            .ecos-welcome-btn-skip:hover {
                background: rgba(0, 0, 0, 0.3);
                color: #ffffff;
                border-color: rgba(255, 255, 255, 0.4);
            }

            .ecos-welcome-btn-next {
                background: linear-gradient(90deg, #5374ed 0%, #8588ea 33%, #b9adff 66%, #dbbbfe 100%);
                color: #ffffff;
                box-shadow: none;
            }

            .ecos-welcome-btn-next:hover {
                background: linear-gradient(90deg, #5374ed 0%, #8588ea 33%, #b9adff 66%, #dbbbfe 100%);
                color: #ffffff;
                transform: translateY(-3px);
                box-shadow: none;
                opacity: 0.9;
            }

            .ecos-welcome-close {
                position: absolute;
                top: 12px;
                right: 12px;
                font-size: 26px;
                color: #667085;
                cursor: pointer;
                line-height: 1;
                z-index: 1000000;
                pointer-events: auto !important;
                user-select: none;
                background: none;
                border: none;
                padding: 0;
                margin: 0;
                outline: none;
                width: 32px;
                height: 32px;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: absolute !important;
            }

            .ecos-welcome-close:hover {
                color: #333;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 50%;
            }
            
            .ecos-welcome-close * {
                pointer-events: none !important;
            }

            @media (max-width: 768px) {
                .ecos-welcome-tooltip {
                    max-width: 95%;
                    width: 95% !important;
                    padding: 20px 16px;
                    border-radius: 16px;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) scale(0.8) !important;
                }

                .ecos-welcome-tooltip.active {
                    transform: translate(-50%, -50%) scale(1) !important;
                }

                .ecos-welcome-title {
                    font-size: 18px;
                    margin-bottom: 12px;
                }

                .ecos-welcome-description {
                    font-size: 14px;
                    margin-bottom: 20px;
                    line-height: 1.5;
                }

                .ecos-welcome-buttons {
                    flex-direction: column;
                    gap: 10px;
                }

                /* Меняем порядок кнопок на мобильных - сначала Contact Us, потом Skip */
                #ecosWelcomeBtnNext {
                    order: 1;
                }

                #ecosWelcomeBtnSkip {
                    order: 2;
                }

                .ecos-welcome-btn {
                    padding: 0;
                    font-size: 14px;
                    height: 48px;
                    width: 100%;
                    flex: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ecos-welcome-close {
                    top: 10px;
                    right: 10px;
                    width: 36px;
                    height: 36px;
                    font-size: 28px;
                }

                .ecos-welcome-highlight {
                    border-radius: 8px;
                }

                .ecos-welcome-highlight::before {
                    border-radius: 8px;
                    padding: 3px;
                }
            }

            @media (max-width: 480px) {
                .ecos-welcome-tooltip {
                    max-width: 92%;
                    width: 92% !important;
                    padding: 18px 14px;
                    border-radius: 14px;
                }

                .ecos-welcome-title {
                    font-size: 16px;
                    margin-bottom: 10px;
                    line-height: 1.3;
                }

                .ecos-welcome-description {
                    font-size: 13px;
                    margin-bottom: 18px;
                    line-height: 1.4;
                }

                .ecos-welcome-btn {
                    padding: 0;
                    font-size: 13px;
                    height: 44px;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ecos-welcome-close {
                    top: 8px;
                    right: 8px;
                    width: 32px;
                    height: 32px;
                    font-size: 24px;
                }
            }

            @media (max-width: 360px) {
                .ecos-welcome-tooltip {
                    max-width: 90%;
                    width: 90% !important;
                    padding: 16px 12px;
                }

                .ecos-welcome-title {
                    font-size: 15px;
                }

                .ecos-welcome-description {
                    font-size: 12px;
                }

                .ecos-welcome-btn {
                    padding: 0;
                    font-size: 12px;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        </style>
    `;

    // ============================================================
    // HTML
    // ============================================================
    const html = `
        <div class="ecos-welcome-overlay" id="ecosWelcomeOverlay"></div>
        <div class="ecos-welcome-highlight" id="ecosWelcomeHighlight"></div>
        <div class="ecos-welcome-tooltip" id="ecosWelcomeTooltip">
            <button class="ecos-welcome-close" id="ecosWelcomeClose" type="button" aria-label="Close">×</button>
            <h2 class="ecos-welcome-title" id="ecosWelcomeTitle">${CONFIG.title}</h2>
            <p class="ecos-welcome-description" id="ecosWelcomeDescription">${CONFIG.description}</p>
            <div class="ecos-welcome-buttons">
                <button class="ecos-welcome-btn ecos-welcome-btn-skip" id="ecosWelcomeBtnSkip">Skip</button>
                <a href="https://wa.me/37493096519?text=Hello%2C%20I%20need%20consultation%20by%20ECOS%20account%20manager." target="_blank" class="ecos-welcome-btn ecos-welcome-btn-next" id="ecosWelcomeBtnNext">Contact Us</a>
            </div>
        </div>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    // ============================================================
    // ПЕРЕМЕННЫЕ
    // ============================================================
    const overlay = document.getElementById('ecosWelcomeOverlay');
    const highlight = document.getElementById('ecosWelcomeHighlight');
    const tooltip = document.getElementById('ecosWelcomeTooltip');

    // Проверка что все элементы созданы
    if (!overlay) console.warn('ECOS Welcome Popup: overlay не найден');
    if (!highlight) console.warn('ECOS Welcome Popup: highlight не найден');
    if (!tooltip) console.warn('ECOS Welcome Popup: tooltip не найден');
    
    if (!overlay || !highlight || !tooltip) {
        console.error('ECOS Welcome Popup: Критические элементы не найдены, скрипт остановлен');
        return;
    }

    // Явно скрываем overlay и highlight при инициализации
    overlay.style.display = 'none';
    highlight.style.display = 'none';

    // ============================================================
    // ПОДСВЕТКА ВСЕХ ТРЕХ КНОПОК
    // ============================================================
    function highlightAmountButtons() {
        // Определяем размеры экрана для адаптивного позиционирования
        const isMobile = window.innerWidth <= 768;
        
        const buttons = [
            document.getElementById('cloud-mining-amount-1000'),
            document.getElementById('cloud-mining-amount-2000'),
            document.getElementById('cloud-mining-amount-3000')
        ].filter(btn => btn !== null);

        if (buttons.length === 0) {
            console.warn('Кнопки сумм не найдены');
            return;
        }

        // Находим общую область всех кнопок
        let minLeft = Infinity;
        let minTop = Infinity;
        let maxRight = -Infinity;
        let maxBottom = -Infinity;

        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            minLeft = Math.min(minLeft, rect.left);
            minTop = Math.min(minTop, rect.top);
            maxRight = Math.max(maxRight, rect.right);
            maxBottom = Math.max(maxBottom, rect.bottom);
            
            // Убираем затемнение с кнопок напрямую
            button.style.position = 'relative';
            button.style.zIndex = '999999';
            button.style.filter = 'none';
            button.style.opacity = '1';
        });

        // На мобильных не показываем подсветку кнопок
        if (!isMobile) {
            // Добавляем отступы (больше на мобильных для лучшей видимости)
            const padding = 6;
            const highlightLeft = minLeft - padding;
            const highlightTop = minTop - padding;
            const highlightWidth = (maxRight - minLeft) + (padding * 2);
            const highlightHeight = (maxBottom - minTop) + (padding * 2);

            // Позиционируем highlight
            highlight.style.left = highlightLeft + 'px';
            highlight.style.top = highlightTop + 'px';
            highlight.style.width = highlightWidth + 'px';
            highlight.style.height = highlightHeight + 'px';
            highlight.style.display = 'block';
        } else {
            // На мобильных скрываем highlight
            highlight.style.display = 'none';
        }
        const tooltipWidth = isMobile ? Math.min(420, window.innerWidth * 0.95) : 420;
        const tooltipHeight = isMobile ? 250 : 250;
        
        // Находим кнопку $2000
        const button2000 = document.getElementById('cloud-mining-amount-2000');
        if (button2000 && !isMobile) {
            // Для десктопа позиционируем поп-ап над кнопкой
            const buttonRect = button2000.getBoundingClientRect();
            let tooltipLeft = buttonRect.left + (buttonRect.width / 2) - (tooltipWidth / 2);
            let tooltipTop = buttonRect.top - tooltipHeight + 50;
            
            // Проверка границ экрана - если не влезает сверху, показываем снизу
            if (tooltipTop < 20) {
                tooltipTop = buttonRect.bottom + 5;
            }
            
            // Проверка горизонтальных границ
            if (tooltipLeft < 20) {
                tooltipLeft = 20;
            } else if (tooltipLeft + tooltipWidth > window.innerWidth - 20) {
                tooltipLeft = window.innerWidth - tooltipWidth - 20;
            }
            
            tooltip.style.left = tooltipLeft + 'px';
            tooltip.style.top = tooltipTop + 'px';
        } else {
            // Для мобильных устройств - центрируем поп-ап по экрану
            if (isMobile) {
                // Точное центрирование по горизонтали и вертикали
                tooltip.style.left = '50%';
                tooltip.style.top = '50%';
                tooltip.style.transform = 'translate(-50%, -50%) scale(0.8)';
            } else {
                // Fallback для десктопа если кнопка не найдена
                let tooltipLeft = (window.innerWidth - tooltipWidth) / 2;
                let tooltipTop = (window.innerHeight - tooltipHeight) / 2;
                tooltip.style.left = tooltipLeft + 'px';
                tooltip.style.top = tooltipTop + 'px';
                tooltip.style.transform = 'scale(0.8)';
            }
        }

        // Анимация появления поп-апа
        setTimeout(() => {
            tooltip.classList.add('active');
            if (isMobile) {
                tooltip.style.transform = 'translate(-50%, -50%) scale(1)';
            } else {
                tooltip.style.transform = 'scale(1)';
            }
        }, 50);
    }

    // Пересчет позиции при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (tooltip.classList.contains('active')) {
                highlightAmountButtons();
            }
        }, 250);
    });

    // ============================================================
    // ПОКАЗАТЬ ПОП-АП
    // ============================================================
    function showPopup() {
        // Сохраняем в localStorage, чтобы поп-ап не показывался повторно
        localStorage.setItem(CONFIG.localStorageKey, 'true');
        
        // Показываем overlay
        overlay.style.display = 'block';
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Показываем tooltip
        tooltip.style.display = 'block';
        
        // Подсвечиваем все три кнопки
        highlightAmountButtons();

        if (typeof carrotquest !== 'undefined') {
            carrotquest.track('ECOS Welcome Popup Shown');
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
        }
    }

    // ============================================================
    // ЗАКРЫТЬ ПОП-АП
    // ============================================================
    function closePopup(e) {
        // Предотвращаем всплытие события
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Убираем класс active у tooltip
        tooltip.classList.remove('active');
        // Скрываем highlight
        highlight.style.display = 'none';
        // Скрываем tooltip полностью
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'scale(0.8)';
        // Скрываем overlay
        overlay.classList.remove('active');
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        // Восстанавливаем скролл
        document.body.style.overflow = '';
        // Сохраняем в localStorage
        localStorage.setItem(CONFIG.localStorageKey, 'true');

        if (typeof carrotquest !== 'undefined') {
            carrotquest.track('ECOS Welcome Popup Closed');
        }
        
        return false;
    }

    // ============================================================
    // СОБЫТИЯ
    // ============================================================
    const closeBtn = document.getElementById('ecosWelcomeClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            closePopup(e);
            return false;
        }, true);
        
        // Также добавляем обработчик без capture для надежности
        closeBtn.addEventListener('click', closePopup, false);
    }
    
    document.getElementById('ecosWelcomeBtnSkip').addEventListener('click', closePopup);
    document.getElementById('ecosWelcomeBtnNext').addEventListener('click', function(e) {
        setTimeout(closePopup, 100);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePopup();
        }
    });

    // ============================================================
    // ОБРАБОТЧИКИ НА КНОПКИ СУММ (делегирование событий)
    // ============================================================
    const amountButtons = [
        'cloud-mining-amount-1000',
        'cloud-mining-amount-2000',
        'cloud-mining-amount-3000'
    ];

    // Делегирование событий - триггер по клику на кнопки сумм
    document.addEventListener('click', function(e){
        // Проверяем ID кликнутого элемента
        var buttonId = e.target.id;
        
        if (!amountButtons.includes(buttonId)) return;
        
        // Проверяем, не был ли поп-ап уже показан
        if (localStorage.getItem(CONFIG.localStorageKey) === 'true') {
            return;
        }
        
        // Задержка 3 секунды перед показом поп-апа
        setTimeout(function() {
            // Повторная проверка перед показом (на случай если пользователь закрыл поп-ап во время задержки)
            if (localStorage.getItem(CONFIG.localStorageKey) !== 'true') {
                showPopup();
            }
        }, 3000);
    }, true);

    window.showEcosWelcomePopup = showPopup;

})();

/* 
═══════════════════════════════════════════════════════════
ECOS CLOUD MINING - WELCOME POPUP
═══════════════════════════════════════════════════════════

УСТАНОВКА В CARROT QUEST:
1. Скопировать весь код
2. Carrot Quest → JS-скрипт → Вставить
3. Триггер: URL содержит /en/cloud-mining
4. Показать: 1 раз

АНАЛИТИКА:
- "ECOS Welcome Popup Shown"
- "ECOS Welcome Popup Closed"
- Метрика "Прочитали"

ТЕСТИРОВАНИЕ:
F12 → showEcosWelcomePopup()

Сброс: localStorage.removeItem('ecos_welcome_popup_seen')

═══════════════════════════════════════════════════════════
*/
