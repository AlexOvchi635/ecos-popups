(function() {
    'use strict';

    const CONFIG = {
        showOnce: true,
        localStorageKey: 'ecos_marketplace_launch_popup_seen_en',

        badge:      'NEW LAUNCH',
        headline:   'ECOS Hashrate\nMarketplace',
        subline:    'Buy and sell cloud mining contracts — directly between users.',
        description:'A secondary market for cloud mining contracts. Browse listings, compare contract details, and trade on your own terms.',
        buttonText: 'Explore the Marketplace',
        buttonUrl:  'https://ecos.am/en/hashrate-marketplace',

        zIndex: 999998
    };

    if (document.getElementById('ecos-mpl-popup-root')) return;
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) return;

    const styles = `
        <style id="ecos-mpl-popup-styles">
            #ecos-mpl-popup-root {
                position: fixed; inset: 0; z-index: ${CONFIG.zIndex};
                display: none; align-items: center; justify-content: center;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            #ecos-mpl-popup-root.active { display: flex !important; }
            .ecos-mpl-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); cursor: pointer; }
            .ecos-mpl-container {
                position: relative; max-width: 700px; width: 100%;
                border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.25);
                overflow: hidden; display: flex; flex-direction: row;
                min-height: 310px; z-index: 1; pointer-events: auto;
            }
            /* Левая колонка */
            .ecos-mpl-left {
                width: 48%; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 55%, #0f3460 100%);
                padding: 36px 32px 55px 32px; display: flex; flex-direction: column; justify-content: space-between;
            }
            .ecos-mpl-badge {
                display: inline-block;
                background: linear-gradient(90deg, #ff6b2c 0%, #ff8f5a 100%);
                color: #fff; font-size: 10px; font-weight: 700;
                letter-spacing: 2px; text-transform: uppercase;
                padding: 4px 14px; border-radius: 20px;
                align-self: flex-start; margin-bottom: 20px;
            }
            .ecos-mpl-headline {
                font-size: 26px; font-weight: 800; color: #fff;
                line-height: 1.2; margin: 0 0 12px 0;
            }
            .ecos-mpl-subline {
                font-size: 17px; color: #a8b4c8; line-height: 1.6; margin: 0 0 16px 0;
            }
            .ecos-mpl-divider {
                width: 100%; height: 1px; background: rgba(255,255,255,0.12); margin: 4px 0;
            }
            .ecos-mpl-stats {
                display: flex; align-items: center; justify-content: center;
            }
            .ecos-mpl-stat {
                flex: 1; text-align: center; padding: 10px 0;
            }
            .ecos-mpl-stat-val { font-size: 20px; font-weight: 700; color: #fff; }
            .ecos-mpl-stat-label { font-size: 12px; color: #a8b4c8; margin-top: 4px; }
            .ecos-mpl-stat-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.15); flex-shrink: 0; }
            /* Правая колонка */
            .ecos-mpl-right {
                flex: 1; background: #fff;
                padding: 36px 32px; display: flex; flex-direction: column;
                justify-content: center; position: relative;
                border-radius: 0 20px 20px 0;
            }
            .ecos-mpl-close {
                position: absolute; top: 14px; right: 14px; width: 30px; height: 30px;
                border: none; background: #f0f0f0; border-radius: 50%;
                cursor: pointer; color: #888;
                display: flex; align-items: center; justify-content: center; padding: 0;
            }
            .ecos-mpl-close:hover { background: #e2e2e2; color: #333; }
            .ecos-mpl-logo { margin-bottom: 24px; }
            .ecos-mpl-logo img { height: 36px; width: auto; display: block; }
            .ecos-mpl-right-title {
                font-size: 20px; font-weight: 700; color: #1a1a1a;
                margin: 0 0 12px 0; line-height: 1.3;
            }
            .ecos-mpl-desc {
                font-size: 14px; color: #666; line-height: 1.7; margin: 0 0 28px 0;
            }
            .ecos-mpl-btn {
                display: block; width: 100%; padding: 14px;
                background: linear-gradient(90deg, #ff6b2c 0%, #ff8f5a 100%);
                color: #fff; border: none; border-radius: 10px;
                font-size: 15px; font-weight: 700; letter-spacing: 0.4px;
                text-transform: uppercase; text-align: center;
                cursor: pointer; text-decoration: none;
                box-sizing: border-box; transition: opacity 0.2s;
            }
            .ecos-mpl-btn:hover { opacity: 0.88; }
            @media (max-width: 640px) {
                .ecos-mpl-container { flex-direction: column; min-height: auto; }
                .ecos-mpl-left { width: 100%; padding: 28px 24px; }
                .ecos-mpl-right { border-radius: 0 0 20px 20px; padding: 28px 24px; }
            }
        </style>`;

    const html = `
        <div id="ecos-mpl-popup-root" aria-hidden="true">
            <div class="ecos-mpl-overlay" id="ecosMplOverlay"></div>
            <div class="ecos-mpl-container" id="ecosMplContainer">
                <!-- Левая панель -->
                <div class="ecos-mpl-left">
                    <div>
                        <div class="ecos-mpl-badge">${CONFIG.badge}</div>
                        <h2 class="ecos-mpl-headline">ECOS Hashrate<br>Marketplace</h2>
                        <p class="ecos-mpl-subline">${CONFIG.subline}</p>
                    </div>
                    <div class="ecos-mpl-divider"></div>
                    <div class="ecos-mpl-stats">
                        <div class="ecos-mpl-stat">
                            <div class="ecos-mpl-stat-val">P2P</div>
                            <div class="ecos-mpl-stat-label">Trading</div>
                        </div>
                        <div class="ecos-mpl-stat-sep"></div>
                        <div class="ecos-mpl-stat">
                            <div class="ecos-mpl-stat-val">BTC</div>
                            <div class="ecos-mpl-stat-label">Daily payouts</div>
                        </div>
                        <div class="ecos-mpl-stat-sep"></div>
                        <div class="ecos-mpl-stat">
                            <div class="ecos-mpl-stat-val">24/7</div>
                            <div class="ecos-mpl-stat-label">Live market</div>
                        </div>
                    </div>
                </div>
                <!-- Правая панель -->
                <div class="ecos-mpl-right">
                    <button type="button" class="ecos-mpl-close" id="ecosMplClose" aria-label="Close"><svg viewBox="0 0 12 12" width="16" height="16" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/></svg></button>
                    <div class="ecos-mpl-logo">
                        <img src="https://files.ecos.am/sasha/rXMPaolTDgCgUJ5b2uD6Jd2E7K70c6Y2noaoX10I.png" alt="ECOS">
                    </div>
                    <h3 class="ecos-mpl-right-title">A new way to manage<br>your hashrate</h3>
                    <p class="ecos-mpl-desc">${CONFIG.description}</p>
                    <a href="${CONFIG.buttonUrl}" class="ecos-mpl-btn" id="ecosMplBtn" target="_blank" rel="noopener">${CONFIG.buttonText}</a>
                </div>
            </div>
        </div>`;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const root      = document.getElementById('ecos-mpl-popup-root');
    const overlay   = document.getElementById('ecosMplOverlay');
    const closeBtn  = document.getElementById('ecosMplClose');
    const container = document.getElementById('ecosMplContainer');
    const btn       = document.getElementById('ecosMplBtn');

    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Marketplace Launch Pop-up Opened');
        }
    }

    function hidePopup() {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (CONFIG.showOnce) localStorage.setItem(CONFIG.localStorageKey, 'true');
    }

    btn.addEventListener('click', function() {
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Marketplace Launch Pop-up CTA Clicked');
        }
        hidePopup();
    });

    closeBtn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); hidePopup(); });
    overlay.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); hidePopup(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && root.classList.contains('active')) hidePopup(); });
    container.addEventListener('click', function(e) { e.stopPropagation(); });

    window.ecosMarketplaceLaunchPopupShow = showPopup;
    window.ecosMarketplaceLaunchPopupHide = hidePopup;

    showPopup();
})();
