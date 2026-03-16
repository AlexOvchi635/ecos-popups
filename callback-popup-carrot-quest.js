// ============================================================
// CALLBACK POP-UP — заявка на обратный звонок
// Показ при 60% скролла. Email + телефон (как в WA), кнопка «Заказать звонок».
// ============================================================

(function() {
    'use strict';

    const CONFIG = {
        scrollTriggerPercent: 30,
        showOnce: true,
        localStorageKey: 'ecos_callback_popup_seen',
        headline: 'Why is now the best time to start mining Bitcoin?',
        subhead: 'Leave your details — we\'ll call you back with a personal offer',
        emailPlaceholder: 'Email *',
        phonePlaceholder: 'Phone number *',
        buttonText: 'Request a call',
        buttonSendingText: 'Sending...',
        zIndex: 999998,
        logoUrl: 'https://files.ecos.am/sasha/rXMPaolTDgCgUJ5b2uD6Jd2E7K70c6Y2noaoX10I.png',
        countries: [
            { code: '+374', name: 'Armenia' }, { code: '+93', name: 'Afghanistan' }, { code: '+355', name: 'Albania' },
            { code: '+213', name: 'Algeria' }, { code: '+376', name: 'Andorra' }, { code: '+244', name: 'Angola' },
            { code: '+54', name: 'Argentina' }, { code: '+61', name: 'Australia' }, { code: '+43', name: 'Austria' },
            { code: '+994', name: 'Azerbaijan' }, { code: '+973', name: 'Bahrain' }, { code: '+880', name: 'Bangladesh' },
            { code: '+375', name: 'Belarus' }, { code: '+32', name: 'Belgium' }, { code: '+501', name: 'Belize' },
            { code: '+229', name: 'Benin' }, { code: '+975', name: 'Bhutan' }, { code: '+591', name: 'Bolivia' },
            { code: '+387', name: 'Bosnia' }, { code: '+267', name: 'Botswana' }, { code: '+55', name: 'Brazil' },
            { code: '+673', name: 'Brunei' }, { code: '+359', name: 'Bulgaria' }, { code: '+226', name: 'Burkina Faso' },
            { code: '+257', name: 'Burundi' }, { code: '+855', name: 'Cambodia' }, { code: '+237', name: 'Cameroon' },
            { code: '+1', name: 'Canada' }, { code: '+238', name: 'Cape Verde' }, { code: '+236', name: 'CAR' },
            { code: '+235', name: 'Chad' }, { code: '+56', name: 'Chile' }, { code: '+86', name: 'China' },
            { code: '+57', name: 'Colombia' }, { code: '+269', name: 'Comoros' }, { code: '+242', name: 'Congo' },
            { code: '+506', name: 'Costa Rica' }, { code: '+385', name: 'Croatia' }, { code: '+53', name: 'Cuba' },
            { code: '+357', name: 'Cyprus' }, { code: '+420', name: 'Czech Republic' }, { code: '+45', name: 'Denmark' },
            { code: '+253', name: 'Djibouti' }, { code: '+1', name: 'Dominica' }, { code: '+1', name: 'Dominican Republic' },
            { code: '+593', name: 'Ecuador' }, { code: '+20', name: 'Egypt' }, { code: '+503', name: 'El Salvador' },
            { code: '+240', name: 'Equatorial Guinea' }, { code: '+291', name: 'Eritrea' }, { code: '+372', name: 'Estonia' },
            { code: '+251', name: 'Ethiopia' }, { code: '+679', name: 'Fiji' }, { code: '+358', name: 'Finland' },
            { code: '+33', name: 'France' }, { code: '+241', name: 'Gabon' }, { code: '+220', name: 'Gambia' },
            { code: '+995', name: 'Georgia' }, { code: '+49', name: 'Germany' }, { code: '+233', name: 'Ghana' },
            { code: '+30', name: 'Greece' }, { code: '+1', name: 'Grenada' }, { code: '+502', name: 'Guatemala' },
            { code: '+224', name: 'Guinea' }, { code: '+245', name: 'Guinea-Bissau' }, { code: '+592', name: 'Guyana' },
            { code: '+509', name: 'Haiti' }, { code: '+504', name: 'Honduras' }, { code: '+36', name: 'Hungary' },
            { code: '+354', name: 'Iceland' }, { code: '+91', name: 'India' }, { code: '+62', name: 'Indonesia' },
            { code: '+98', name: 'Iran' }, { code: '+964', name: 'Iraq' }, { code: '+353', name: 'Ireland' },
            { code: '+972', name: 'Israel' }, { code: '+39', name: 'Italy' }, { code: '+1', name: 'Jamaica' },
            { code: '+81', name: 'Japan' }, { code: '+962', name: 'Jordan' }, { code: '+7', name: 'Kazakhstan' },
            { code: '+254', name: 'Kenya' }, { code: '+686', name: 'Kiribati' }, { code: '+965', name: 'Kuwait' },
            { code: '+996', name: 'Kyrgyzstan' }, { code: '+856', name: 'Laos' }, { code: '+371', name: 'Latvia' },
            { code: '+961', name: 'Lebanon' }, { code: '+266', name: 'Lesotho' }, { code: '+231', name: 'Liberia' },
            { code: '+218', name: 'Libya' }, { code: '+423', name: 'Liechtenstein' }, { code: '+370', name: 'Lithuania' },
            { code: '+352', name: 'Luxembourg' }, { code: '+389', name: 'Macedonia' }, { code: '+261', name: 'Madagascar' },
            { code: '+265', name: 'Malawi' }, { code: '+60', name: 'Malaysia' }, { code: '+960', name: 'Maldives' },
            { code: '+223', name: 'Mali' }, { code: '+356', name: 'Malta' }, { code: '+692', name: 'Marshall Islands' },
            { code: '+222', name: 'Mauritania' }, { code: '+230', name: 'Mauritius' }, { code: '+52', name: 'Mexico' },
            { code: '+373', name: 'Moldova' }, { code: '+377', name: 'Monaco' }, { code: '+976', name: 'Mongolia' },
            { code: '+382', name: 'Montenegro' }, { code: '+212', name: 'Morocco' }, { code: '+258', name: 'Mozambique' },
            { code: '+95', name: 'Myanmar' }, { code: '+264', name: 'Namibia' }, { code: '+674', name: 'Nauru' },
            { code: '+977', name: 'Nepal' }, { code: '+31', name: 'Netherlands' }, { code: '+64', name: 'New Zealand' },
            { code: '+505', name: 'Nicaragua' }, { code: '+227', name: 'Niger' }, { code: '+234', name: 'Nigeria' },
            { code: '+850', name: 'North Korea' }, { code: '+47', name: 'Norway' }, { code: '+968', name: 'Oman' },
            { code: '+92', name: 'Pakistan' }, { code: '+680', name: 'Palau' }, { code: '+970', name: 'Palestine' },
            { code: '+507', name: 'Panama' }, { code: '+675', name: 'Papua New Guinea' }, { code: '+595', name: 'Paraguay' },
            { code: '+51', name: 'Peru' }, { code: '+63', name: 'Philippines' }, { code: '+48', name: 'Poland' },
            { code: '+351', name: 'Portugal' }, { code: '+974', name: 'Qatar' }, { code: '+40', name: 'Romania' },
            { code: '+7', name: 'Russia' }, { code: '+250', name: 'Rwanda' }, { code: '+290', name: 'Saint Helena' },
            { code: '+1', name: 'Saint Kitts' }, { code: '+1', name: 'Saint Lucia' }, { code: '+508', name: 'Saint Pierre' },
            { code: '+1', name: 'Saint Vincent' }, { code: '+685', name: 'Samoa' }, { code: '+378', name: 'San Marino' },
            { code: '+239', name: 'Sao Tome' }, { code: '+966', name: 'Saudi Arabia' }, { code: '+221', name: 'Senegal' },
            { code: '+381', name: 'Serbia' }, { code: '+248', name: 'Seychelles' }, { code: '+232', name: 'Sierra Leone' },
            { code: '+65', name: 'Singapore' }, { code: '+421', name: 'Slovakia' }, { code: '+386', name: 'Slovenia' },
            { code: '+677', name: 'Solomon Islands' }, { code: '+252', name: 'Somalia' }, { code: '+27', name: 'South Africa' },
            { code: '+82', name: 'South Korea' }, { code: '+211', name: 'South Sudan' }, { code: '+34', name: 'Spain' },
            { code: '+94', name: 'Sri Lanka' }, { code: '+249', name: 'Sudan' }, { code: '+597', name: 'Suriname' },
            { code: '+268', name: 'Swaziland' }, { code: '+46', name: 'Sweden' }, { code: '+41', name: 'Switzerland' },
            { code: '+963', name: 'Syria' }, { code: '+886', name: 'Taiwan' }, { code: '+992', name: 'Tajikistan' },
            { code: '+255', name: 'Tanzania' }, { code: '+66', name: 'Thailand' }, { code: '+228', name: 'Togo' },
            { code: '+676', name: 'Tonga' }, { code: '+1', name: 'Trinidad' }, { code: '+216', name: 'Tunisia' },
            { code: '+90', name: 'Turkey' }, { code: '+993', name: 'Turkmenistan' }, { code: '+1', name: 'Turks and Caicos' },
            { code: '+256', name: 'Uganda' }, { code: '+380', name: 'Ukraine' }, { code: '+971', name: 'UAE' },
            { code: '+44', name: 'UK' }, { code: '+1', name: 'USA' }, { code: '+598', name: 'Uruguay' },
            { code: '+998', name: 'Uzbekistan' }, { code: '+678', name: 'Vanuatu' }, { code: '+379', name: 'Vatican' },
            { code: '+58', name: 'Venezuela' }, { code: '+84', name: 'Vietnam' }, { code: '+681', name: 'Wallis and Futuna' },
            { code: '+967', name: 'Yemen' }, { code: '+260', name: 'Zambia' }, { code: '+263', name: 'Zimbabwe' }
        ]
    };

    if (document.getElementById('ecos-callback-popup-root')) return;
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) return;

    const styles = `
        <style id="ecos-callback-popup-styles">
            #ecos-callback-popup-root {
                position: fixed; inset: 0; z-index: ${CONFIG.zIndex};
                display: none; align-items: center; justify-content: center; padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            #ecos-callback-popup-root.active { display: flex !important; }
            .ecos-cb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); cursor: pointer; }
            .ecos-cb-box {
                position: relative; max-width: 820px; width: 100%; min-height: 320px;
                background: #e0dcd8 url('https://files.ecos.am/sasha/x8rHgYORVAJSw5jsQ9g7jyAHqClWbVZIe96e0uVr.jpg') right bottom/cover no-repeat;
                border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                overflow: hidden; display: flex; flex-direction: row; align-items: stretch;
                z-index: 1; pointer-events: auto; text-align: left;
            }
            .ecos-cb-left {
                flex: 1; padding: 32px 36px 36px; display: flex; flex-direction: column; justify-content: center;
                min-height: 0;
            }
            .ecos-cb-logo { margin-bottom: 16px; }
            .ecos-cb-logo img { height: 36px; width: auto; display: block; object-fit: contain; }
            .ecos-cb-headline {
                font-size: 24px; font-weight: 700; color: #000; line-height: 1.25; margin-bottom: 8px;
                white-space: nowrap;
            }
            .ecos-cb-subhead { font-size: 14px; color: #000; margin-bottom: 20px; line-height: 1.4; }
            .ecos-cb-form input, .ecos-cb-form select {
                width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 10px;
                font-size: 15px; margin-bottom: 10px; outline: none; box-sizing: border-box;
                background: #fff;
            }
            .ecos-cb-form select {
                padding-right: 40px;
                appearance: none; -webkit-appearance: none; -moz-appearance: none;
                background-color: #fff;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 14px center;
                background-size: 10px;
            }
            .ecos-cb-form input:focus, .ecos-cb-form select:focus { border-color: #b0a6ee; }
            .ecos-cb-phone-row { display: flex; gap: 8px; margin-bottom: 10px; }
            .ecos-cb-phone-row select { width: 140px; flex-shrink: 0; }
            .ecos-cb-phone-row input { flex: 1; min-width: 0; }
            .ecos-cb-form button {
                width: 100%; padding: 14px; background: #fff; color: #5a4a7a; border: 2px solid #b0a6ee;
                border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 4px;
                transition: background 0.2s, color 0.2s;
            }
            .ecos-cb-form button:hover { background: #b0a6ee; color: #fff; }
            .ecos-cb-form button:disabled { opacity: 0.6; cursor: not-allowed; }
            .ecos-cb-close {
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
            .ecos-cb-close:hover { background: #e5e5e5; color: #333; }
            .ecos-cb-close-icon { display: block; flex-shrink: 0; }
            .ecos-cb-right {
                width: 38%; min-width: 200px; min-height: 0;
                display: flex; align-items: center; justify-content: center; padding: 24px;
            }
            .ecos-cb-error { color: #c00; font-size: 12px; margin-top: -6px; margin-bottom: 6px; }
            @media (max-width: 640px) {
                .ecos-cb-box { flex-direction: column; }
                .ecos-cb-right { width: 100%; min-height: 80px; }
                .ecos-cb-headline { white-space: normal; }
            }
        </style>`;

    const html = `
        <div id="ecos-callback-popup-root" aria-hidden="true">
            <div class="ecos-cb-overlay" id="ecosCbOverlay"></div>
            <div class="ecos-cb-box" id="ecosCbBox">
                <button type="button" class="ecos-cb-close" id="ecosCbClose" aria-label="Close"><svg class="ecos-cb-close-icon" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 2l8 8M10 2L2 10"/></svg></button>
                <div class="ecos-cb-left">
                    <div class="ecos-cb-logo"><img src="${CONFIG.logoUrl}" alt=""></div>
                    <h2 class="ecos-cb-headline">${CONFIG.headline}</h2>
                    <p class="ecos-cb-subhead">${CONFIG.subhead}</p>
                    <form class="ecos-cb-form" id="ecosCbForm">
                        <input type="email" id="ecosCbEmail" placeholder="${CONFIG.emailPlaceholder}" required>
                        <div class="ecos-cb-phone-row">
                            <select id="ecosCbCountry">${CONFIG.countries.map(c => `<option value="${c.code}" ${c.code === '+1' ? 'selected' : ''}>${c.name} ${c.code}</option>`).join('')}</select>
                            <input type="tel" id="ecosCbPhone" placeholder="${CONFIG.phonePlaceholder}" pattern="[0-9\\s]+">
                        </div>
                        <div class="ecos-cb-error" id="ecosCbError" style="display:none;"></div>
                        <button type="submit" id="ecosCbSubmit">${CONFIG.buttonText}</button>
                    </form>
                </div>
                <div class="ecos-cb-right"></div>
            </div>
        </div>`;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    const root = document.getElementById('ecos-callback-popup-root');
    const overlay = document.getElementById('ecosCbOverlay');
    const closeBtn = document.getElementById('ecosCbClose');
    const form = document.getElementById('ecosCbForm');
    const emailInput = document.getElementById('ecosCbEmail');
    const countrySelect = document.getElementById('ecosCbCountry');
    const phoneInput = document.getElementById('ecosCbPhone');
    const submitBtn = document.getElementById('ecosCbSubmit');
    const errorEl = document.getElementById('ecosCbError');

    function showPopup() {
        root.style.display = 'flex';
        root.classList.add('active');
        root.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('Callback Pop-up Opened');
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
    document.getElementById('ecosCbBox').addEventListener('click', function(e) { e.stopPropagation(); });

    phoneInput.addEventListener('input', function(e) {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 15) v = v.slice(0, 15);
        e.target.value = v.replace(/(.{3})/g, '$1 ').trim();
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = (emailInput && emailInput.value) ? emailInput.value.trim() : '';
        var phone = (phoneInput && phoneInput.value) ? phoneInput.value.replace(/\D/g, '') : '';
        var countryCode = countrySelect.value;

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
        if (!phone || phone.length < 6) {
            if (errorEl) { errorEl.textContent = 'Please enter your phone number'; errorEl.style.display = 'block'; }
            phoneInput.focus();
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = CONFIG.buttonSendingText;

        var fullPhone = countryCode + phone;

        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('Callback Pop-up Submitted');
            carrotquest.identify({ '$email': email, 'email': email, '$phone': fullPhone, 'phone': fullPhone });
            carrotquest.track('Callback Pop-up Lead', { email: email, phone: fullPhone });
        }

        hidePopup();
        form.reset();
        submitBtn.textContent = CONFIG.buttonText;
        submitBtn.disabled = false;
    });

    var scrollTrigger = CONFIG.scrollTriggerPercent / 100;
    function checkScroll() {
        var doc = document.documentElement;
        var scrollTop = window.pageYOffset || doc.scrollTop;
        var scrollable = (doc.scrollHeight - window.innerHeight) || 1;
        if (scrollable <= 0) return;
        if (scrollTop / scrollable >= scrollTrigger) {
            showPopup();
            window.removeEventListener('scroll', checkScroll);
        }
    }
    window.addEventListener('scroll', checkScroll);
    setTimeout(checkScroll, 200);

    window.ecosCallbackPopupShow = showPopup;
    window.ecosCallbackPopupHide = hidePopup;
})();
