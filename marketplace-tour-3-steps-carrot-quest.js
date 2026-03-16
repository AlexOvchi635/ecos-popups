// ============================================================
// ECOS MARKETPLACE TOUR - 3 ШАГА (ЗНАКОМСТВО + ПРОДАЖА)
// Простой и эффективный тур для конверсии
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // КОНФИГУРАЦИЯ - 3 ШАГА
    // ============================================================
    const TOUR_CONFIG = {
        tourName: 'ECOS Marketplace Tour',
        startDelay: 2000,
        
        steps: [
            // ШАГ 1: ЗНАКОМСТВО С MARKETPLACE
            {
                selectors: [
                    'h1',
                    '.page-title',
                    '.marketplace-header',
                    'main',
                    '.container'
                ],
                title: '🏪 Welcome to ECOS Marketplace!',
                description: 'Buy ASIC miners hosted in our Armenia data center.',
                position: 'center'
            },
            
            // ШАГ 2: ФИЛЬТРЫ И ПОДБОР
            {
                selectors: [
                    '.filters__row',
                    '[class*="filter"]',
                    '[class*="search"]',
                    'input[type="search"]',
                    '.sidebar',
                    '[class*="sidebar"]',
                    'aside',
                    '.product-card:first-of-type'
                ],
                title: '🎚️ Фильтры и поиск',
                description: 'Отфильтруйте майнеры по хешрейту, цене и энергопотреблению для быстрого подбора оптимального оборудования. Используйте поиск для нахождения конкретной модели ASIC. Все характеристики обновляются в реальном времени.',
                position: 'right'
            },
            
            // ШАГ 3: ПОКУПКА И БЫСТРЫЙ СТАРТ (ОБЪЕДИНЕННЫЙ - АНГЛИЙСКИЙ)
            {
                selectors: [
                    '.used__body',
                    '.online',
                    '.filters__row',
                    'button[class*="buy"]',
                    'button[class*="add"]',
                    '.buy-button',
                    '.add-to-cart',
                    'a[class*="buy"]',
                    'button:contains("Купить")',
                    'button:contains("Buy")',
                    '[data-action="buy"]'
                ],
                title: '🚀 Start Mining in 24 Hours',
                description: 'Each card shows model, hashrate, power consumption and price. Use filters to find the best equipment for your budget. Equipment goes online within 24 hours — start earning Bitcoin tomorrow!',
                position: 'top'
            }
        ]
    };

    // ============================================================
    // СТИЛИ
    // ============================================================
    const styles = `
        <style>
            * {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .ecos-tour-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: 999997;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .ecos-tour-overlay.active {
                display: block;
                opacity: 1;
            }

            .ecos-tour-highlight {
                position: fixed;
                z-index: 999999;
                border: 4px solid #ff721d;
                border-radius: 16px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75),
                            0 0 40px rgba(255, 114, 29, 0.8);
                pointer-events: none;
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                background: transparent;
            }
            
            /* Подсветка элемента - делаем его видимым */
            .ecos-tour-highlight::before {
                content: '';
                position: absolute;
                top: -4px;
                left: -4px;
                right: -4px;
                bottom: -4px;
                border-radius: 16px;
                background: rgba(255, 114, 29, 0.05);
                pointer-events: none;
            }
            
            /* Поднимаем выделенный элемент над затемнением */
            .ecos-tour-active-element {
                position: relative !important;
                z-index: 999998 !important;
                pointer-events: auto !important;
            }

            .ecos-tour-tooltip {
                position: fixed;
                z-index: 1000000;
                background: linear-gradient(135deg, #18171C 0%, #1a2330 100%);
                border-radius: 20px;
                padding: 32px;
                max-width: 420px;
                box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
                border: 2px solid rgba(255, 114, 29, 0.4);
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            .ecos-tour-tooltip.active {
                opacity: 1;
                transform: scale(1);
            }

            .ecos-tour-progress {
                color: #ff721d;
                font-size: 14px;
                font-weight: 800;
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            }

            .ecos-tour-title {
                font-size: 28px;
                font-weight: 900;
                background: linear-gradient(90deg, #ff721d 0%, #45c9fd 50%, #0050b4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 14px;
                line-height: 1.2;
            }

            .ecos-tour-description {
                color: #a0a0a0;
                font-size: 17px;
                line-height: 1.8;
                margin-bottom: 28px;
            }

            .ecos-tour-buttons {
                display: flex;
                gap: 14px;
            }

            .ecos-tour-btn {
                flex: 1;
                padding: 14px 28px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 800;
                font-size: 16px;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .ecos-tour-btn-skip {
                background: rgba(255, 255, 255, 0.08);
                color: #888;
                border: 2px solid rgba(255, 255, 255, 0.15);
            }

            .ecos-tour-btn-skip:hover {
                background: rgba(255, 255, 255, 0.12);
                color: #aaa;
                border-color: rgba(255, 255, 255, 0.25);
            }

            .ecos-tour-btn-next {
                background: linear-gradient(90deg, #ff721d 0%, #ff8e53 100%);
                color: white;
                box-shadow: 0 6px 20px rgba(255, 114, 29, 0.5);
            }

            .ecos-tour-btn-next:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(255, 114, 29, 0.6);
            }

            .ecos-tour-btn-finish {
                background: linear-gradient(90deg, #0050b4 0%, #45c9fd 100%);
                color: white;
                box-shadow: 0 6px 20px rgba(69, 201, 253, 0.5);
            }

            .ecos-tour-btn-finish:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(69, 201, 253, 0.6);
            }

            .ecos-tour-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 36px;
                height: 36px;
                border: none;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                cursor: pointer;
                font-size: 22px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }

            .ecos-tour-close:hover {
                background: rgba(255, 114, 29, 0.3);
                transform: rotate(90deg) scale(1.1);
            }

            /* Специальная позиция для центрального размещения (шаг 1) */
            .ecos-tour-tooltip.position-center {
                left: 50% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) scale(0.8);
            }

            .ecos-tour-tooltip.position-center.active {
                transform: translate(-50%, -50%) scale(1);
            }

            @media (max-width: 768px) {
                .ecos-tour-tooltip {
                    max-width: 90%;
                    padding: 24px;
                    left: 5% !important;
                }

                .ecos-tour-tooltip.position-center {
                    left: 50% !important;
                    transform: translate(-50%, -50%) scale(0.8);
                }

                .ecos-tour-tooltip.position-center.active {
                    transform: translate(-50%, -50%) scale(1);
                }

                .ecos-tour-title {
                    font-size: 22px;
                }

                .ecos-tour-description {
                    font-size: 15px;
                }

                .ecos-tour-btn {
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
        </style>
    `;

    // ============================================================
    // HTML
    // ============================================================
    const html = `
        <div class="ecos-tour-overlay" id="ecosTourOverlay"></div>
        <div class="ecos-tour-highlight" id="ecosTourHighlight"></div>
        <div class="ecos-tour-tooltip" id="ecosTourTooltip">
            <button class="ecos-tour-close" id="ecosTourClose">×</button>
            <div class="ecos-tour-progress" id="ecosTourProgress">Step 1 of 3</div>
            <h2 class="ecos-tour-title" id="ecosTourTitle">Title</h2>
            <p class="ecos-tour-description" id="ecosTourDescription">Description</p>
            <div class="ecos-tour-buttons">
                <button class="ecos-tour-btn ecos-tour-btn-skip" id="ecosTourBtnSkip">Skip</button>
                <button class="ecos-tour-btn ecos-tour-btn-next" id="ecosTourBtnNext">Next</button>
            </div>
        </div>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    // ============================================================
    // ПЕРЕМЕННЫЕ
    // ============================================================
    let currentStep = 0;
    let availableSteps = [];
    let currentHighlightedElement = null;
    const overlay = document.getElementById('ecosTourOverlay');
    const highlight = document.getElementById('ecosTourHighlight');
    const tooltip = document.getElementById('ecosTourTooltip');

    // ============================================================
    // ПОИСК ЭЛЕМЕНТА
    // ============================================================
    function findElement(selectors) {
        for (const selector of selectors) {
            try {
                const element = document.querySelector(selector);
                if (element && element.offsetParent !== null) {
                    return element;
                }
            } catch (e) {
                // Игнорируем невалидные селекторы
            }
        }
        return null;
    }

    // ============================================================
    // ПОДГОТОВКА ТУРА
    // ============================================================
    function prepareTour() {
        availableSteps = [];

        TOUR_CONFIG.steps.forEach((step, index) => {
            const element = findElement(step.selectors);
            if (element || step.position === 'center') {
                availableSteps.push({
                    ...step,
                    element: element,
                    index: index
                });
            }
        });

        console.log(`✅ ECOS Tour: Найдено ${availableSteps.length} шагов`);
        return availableSteps.length > 0;
    }

    // ============================================================
    // ЗАПУСК ТУРА
    // ============================================================
    function startTour() {
        if (!prepareTour()) {
            console.warn('❌ ECOS Tour: Не найдено элементов');
            return;
        }

        console.log('🚀 ECOS Tour: Запуск тура');
        currentStep = 0;
        overlay.classList.add('active');
        showStep(currentStep);

        if (typeof carrotquest !== 'undefined') {
            carrotquest.track(TOUR_CONFIG.tourName + ' Started');
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
        }
    }

    // ============================================================
    // ПОКАЗ ШАГА
    // ============================================================
    function showStep(index) {
        if (index >= availableSteps.length) {
            closeTour();
            return;
        }

        const step = availableSteps[index];
        console.log(`📍 Шаг ${index + 1}/${availableSteps.length}: ${step.title}`);

        // Для центральной позиции (шаг 1)
        if (step.position === 'center') {
            // Скрываем подсветку
            highlight.style.display = 'none';
            
            // Центрируем тултип
            tooltip.className = 'ecos-tour-tooltip position-center';
            
            setTimeout(() => {
                tooltip.classList.add('active');
            }, 100);
        } else {
            // Обычная подсветка элемента
            highlight.style.display = 'block';
            const element = step.element;

            if (!element) {
                nextStep();
                return;
            }

            // Убираем класс с предыдущего элемента
            if (currentHighlightedElement) {
                currentHighlightedElement.classList.remove('ecos-tour-active-element');
            }
            
            // Добавляем класс к текущему элементу
            element.classList.add('ecos-tour-active-element');
            currentHighlightedElement = element;

            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });

            setTimeout(() => {
                const rect = element.getBoundingClientRect();

                // Подсветка
                highlight.style.left = rect.left + 'px';
                highlight.style.top = rect.top + 'px';
                highlight.style.width = rect.width + 'px';
                highlight.style.height = rect.height + 'px';

                // Позиция тултипа (НЕ перекрывает выделенный элемент)
                let tooltipLeft, tooltipTop;
                const tooltipWidth = 420;
                const tooltipHeight = 300;
                const gap = 20; // Отступ от выделенного элемента
                
                if (step.position === 'right') {
                    // Справа от элемента
                    tooltipLeft = rect.right + gap;
                    tooltipTop = rect.top + (rect.height / 2) - (tooltipHeight / 2);
                    
                    // Если не влезает справа - показываем слева
                    if (tooltipLeft + tooltipWidth > window.innerWidth - 10) {
                        tooltipLeft = rect.left - tooltipWidth - gap;
                    }
                } else if (step.position === 'top') {
                    // Сверху от элемента
                    tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                    tooltipTop = rect.top - tooltipHeight - gap;
                    
                    // Если не влезает сверху - показываем снизу
                    if (tooltipTop < 10) {
                        tooltipTop = rect.bottom + gap;
                    }
                } else {
                    // Снизу от элемента
                    tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                    tooltipTop = rect.bottom + gap;
                }

                // Проверка границ экрана
                tooltipLeft = Math.max(10, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 10));
                tooltipTop = Math.max(10, Math.min(tooltipTop, window.innerHeight - tooltipHeight - 10));

                tooltip.className = 'ecos-tour-tooltip';
                tooltip.style.left = tooltipLeft + 'px';
                tooltip.style.top = tooltipTop + 'px';

                setTimeout(() => {
                    tooltip.classList.add('active');
                }, 100);
            }, 400);
        }

        // Контент
        document.getElementById('ecosTourProgress').textContent = 
            `Step ${index + 1} of ${availableSteps.length}`;
        document.getElementById('ecosTourTitle').textContent = step.title;
        document.getElementById('ecosTourDescription').textContent = step.description;

        // Кнопка
        const btnNext = document.getElementById('ecosTourBtnNext');
        if (index === availableSteps.length - 1) {
            btnNext.textContent = 'Start Shopping!';
            btnNext.className = 'ecos-tour-btn ecos-tour-btn-finish';
            btnNext.onclick = closeTour;
        } else {
            btnNext.textContent = 'Next';
            btnNext.className = 'ecos-tour-btn ecos-tour-btn-next';
            btnNext.onclick = nextStep;
        }
    }

    // ============================================================
    // СЛЕДУЮЩИЙ ШАГ
    // ============================================================
    function nextStep() {
        tooltip.classList.remove('active');
        
        setTimeout(() => {
            if (currentStep < availableSteps.length - 1) {
                currentStep++;
                showStep(currentStep);
            } else {
                closeTour();
            }
        }, 300);
    }

    // ============================================================
    // ЗАКРЫТЬ ТУР
    // ============================================================
    function closeTour() {
        tooltip.classList.remove('active');
        highlight.style.display = 'none';
        
        // Убираем класс с выделенного элемента
        if (currentHighlightedElement) {
            currentHighlightedElement.classList.remove('ecos-tour-active-element');
            currentHighlightedElement = null;
        }
        
        setTimeout(() => {
            overlay.classList.remove('active');
            // Полностью удаляем элементы из DOM
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            if (highlight.parentNode) highlight.parentNode.removeChild(highlight);
            if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
        }, 300);
        
        if (typeof carrotquest !== 'undefined') {
            carrotquest.track(TOUR_CONFIG.tourName + ' Completed', {
                steps_completed: currentStep + 1,
                completed_fully: currentStep === availableSteps.length - 1
            });
        }
        
        console.log('✅ Тур завершен');
    }

    // ============================================================
    // СОБЫТИЯ
    // ============================================================
    document.getElementById('ecosTourBtnSkip').addEventListener('click', closeTour);
    document.getElementById('ecosTourClose').addEventListener('click', closeTour);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeTour();
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeTour();
        }
    });

    // ============================================================
    // АВТОЗАПУСК
    // ============================================================
    setTimeout(() => {
        startTour();
    }, TOUR_CONFIG.startDelay);

    window.startEcosTour = startTour;

})();

/* 
═══════════════════════════════════════════════════════════
ECOS MARKETPLACE TOUR - 3 ШАГА
═══════════════════════════════════════════════════════════

СТРУКТУРА:
✅ Шаг 1: Приветствие (центр экрана)
✅ Шаг 2: Выбор майнера (карточка товара)
✅ Шаг 3: Покупка (кнопка + преимущества ECOS)

УСТАНОВКА В CARROT QUEST:
1. Скопировать весь код
2. Carrot Quest → JS-скрипт → Вставить
3. Триггер: URL содержит /asics-marketplace
4. Показать: 1 раз

АНАЛИТИКА:
- "ECOS Marketplace Tour Started"
- "ECOS Marketplace Tour Completed"
- Метрика "Прочитали"

ТЕСТИРОВАНИЕ:
F12 → startEcosTour()

═══════════════════════════════════════════════════════════
*/
