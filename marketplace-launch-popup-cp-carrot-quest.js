(function() {
    'use strict';

    const CONFIG = {
        showOnce: true,
        localStorageKey: 'ecos_marketplace_launch_popup_cp_seen_en',

        messageHtml: 'Already visited our <span class="ecos-mpl-cp-accent">new</span> <span class="ecos-mpl-cp-accent">Hashrate Marketplace</span>? Here\'s the <span class="ecos-mpl-cp-accent">link</span>.',
        buttonText: 'Open Marketplace',
        buttonUrl:  'https://cp.ecos.am/hashrate-marketplace',
        logoUrl:    'https://files.ecos.am/sasha/rXMPaolTDgCgUJ5b2uD6Jd2E7K70c6Y2noaoX10I.png',

        zIndex: 999998
    };

    if (document.getElementById('ecos-mpl-cp-popup-root')) return;
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) return;
    if (window.location.href.indexOf('https://cp.ecos.am/') === -1) return;

    const styles = `
        <style id="ecos-mpl-cp-popup-styles">
            #ecos-mpl-cp-popup-root {
                position: fixed; top: 20px; right: 20px; left: auto; bottom: auto;
                z-index: ${CONFIG.zIndex}; display: none; justify-content: flex-end; align-items: flex-start;
                padding: 0; pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }
            #ecos-mpl-cp-popup-root.active { display: flex !important; pointer-events: auto; }
            #ecos-mpl-cp-popup-root.active .ecos-mpl-cp-container { pointer-events: auto; }
            .ecos-mpl-cp-container {
                position: relative; max-width: 300px; width: 100%;
                background: #fff; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
                overflow: hidden; padding: 20px 20px 22px;
                display: flex; flex-direction: column; gap: 14px;
                border-left: 4px solid #ff6b2c;
            }
            .ecos-mpl-cp-close {
                position: absolute; top: 10px; right: 10px; width: 26px; height: 26px;
                border: none; background: #f0f0f0; border-radius: 50%;
                cursor: pointer; color: #888;
                display: flex; align-items: center; justify-content: center; padding: 0;
            }
            .ecos-mpl-cp-close:hover { background: #e5e5e5; color: #333; }
            .ecos-mpl-cp-close svg { flex-shrink: 0; }
            .ecos-mpl-cp-logo { margin-bottom: 4px; }
            .ecos-mpl-cp-logo img { height: 28px; width: auto; display: block; }
            .ecos-mpl-cp-msg { font-size: 13px; color: #555; line-height: 1.5; margin: 0; }
            .ecos-mpl-cp-accent { color: #1a1a1a; font-weight: 600; }
            .ecos-mpl-cp-btn {
                display: block; width: 100%; padding: 10px 14px;
                background: linear-gradient(90deg, #ff6b2c 0%, #ff8f5a 100%);
                color: #fff; border: none; border-radius: 8px;
                font-size: 13px; font-weight: 600; text-align: center;
                cursor: pointer; text-decoration: none; box-sizing: border-box; transition: opacity 0.2s;
            }
            .ecos-mpl-cp-btn:hover { opacity: 0.9; }
            @media (max-width: 360px) {
                #ecos-mpl-cp-popup-root { right: 12px; left: 12px; top: 12px; }
                .ecos-mpl-cp-container { max-width: none; }
            }
        </style>`;

    const html = `
        <div id="ecos-mpl-cp-popup-root" aria-hidden="true">
            <div class="ecos-mpl-cp-container" id="ecosMplCpContainer">
                <button type="button" class="ecos-mpl-cp-close" id="ecosMplCpClose" aria-label="Close"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/></svg></button>
                <div class="ecos-mpl-cp-logo"><img src="${CONFIG.logoUrl}" alt="ECOS"></div>
                <p class="ecos-mpl-cp-msg">${CONFIG.messageHtml}</p>
                <a href="${CONFIG.buttonUrl}" class="ecos-mpl-cp-btn" id="ecosMplCpBtn" target="_blank" rel="noopener">${CONFIG.buttonText}</a>
            </div>
        </div>`;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const root     = document.getElementById('ecos-mpl-cp-popup-root');
    const closeBtn = document.getElementById('ecosMplCpClose');
    const container = document.getElementById('ecosMplCpContainer');
    const btn      = document.getElementById('ecosMplCpBtn');

    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Marketplace Launch Pop-up Opened CP');
        }
    }

    function hidePopup() {
        root.style.display = 'none';
        root.classList.remove('active');
        root.setAttribute('aria-hidden', 'true');
        if (CONFIG.showOnce) localStorage.setItem(CONFIG.localStorageKey, 'true');
    }

    btn.addEventListener('click', function() {
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Marketplace Launch Pop-up CTA Clicked CP');
        }
        hidePopup();
    });

    closeBtn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); hidePopup(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && root.classList.contains('active')) hidePopup(); });
    container.addEventListener('click', function(e) { e.stopPropagation(); });

    window.ecosMarketplaceLaunchPopupCPShow = showPopup;
    window.ecosMarketplaceLaunchPopupCPHide = hidePopup;

    showPopup();
})();
