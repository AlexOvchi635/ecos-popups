// ============================================================
// WHATSAPP POP-UP - КОД ДЛЯ CARROT QUEST
// Pop-up для подписки на новости через WhatsApp
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // КОНФИГУРАЦИЯ
    // ============================================================
    const CONFIG = {
        // Задержка перед показом (мс) - установите 0 для ручного вызова
        showDelay: 2000,
        
        // Показывать только один раз (использует localStorage)
        showOnce: true,
        
        // Ключ для localStorage
        localStorageKey: 'ecos_whatsapp_popup_seen',
        
        // Тексты
        title: 'Want exclusive limited-time offers?',
        description: 'Leave your phone number, and we will send you weekly promotional offers',
        checkboxLabel: 'Get reply in WhatsApp',
        buttonText: 'Send',
        buttonSendingText: 'Sending...',
        successMessage: 'Спасибо! Мы свяжемся с вами в WhatsApp',
        defaultMessage: 'Здравствуйте! Я хочу получать новости о новых коллекциях.',
        
        // WhatsApp номер (если нужен фиксированный номер для отправки)
        // Оставьте null, чтобы использовать номер пользователя
        whatsappNumber: null,
        
        // Z-index для pop-up
        zIndex: 999998,
        
        // Список стран с кодами (полный список)
        countries: [
            { code: '+374', name: 'Armenia', flag: '🇦🇲' },
            { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
            { code: '+355', name: 'Albania', flag: '🇦🇱' },
            { code: '+213', name: 'Algeria', flag: '🇩🇿' },
            { code: '+376', name: 'Andorra', flag: '🇦🇩' },
            { code: '+244', name: 'Angola', flag: '🇦🇴' },
            { code: '+54', name: 'Argentina', flag: '🇦🇷' },
            { code: '+61', name: 'Australia', flag: '🇦🇺' },
            { code: '+43', name: 'Austria', flag: '🇦🇹' },
            { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
            { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
            { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
            { code: '+375', name: 'Belarus', flag: '🇧🇾' },
            { code: '+32', name: 'Belgium', flag: '🇧🇪' },
            { code: '+501', name: 'Belize', flag: '🇧🇿' },
            { code: '+229', name: 'Benin', flag: '🇧🇯' },
            { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
            { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
            { code: '+387', name: 'Bosnia', flag: '🇧🇦' },
            { code: '+267', name: 'Botswana', flag: '🇧🇼' },
            { code: '+55', name: 'Brazil', flag: '🇧🇷' },
            { code: '+673', name: 'Brunei', flag: '🇧🇳' },
            { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
            { code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
            { code: '+257', name: 'Burundi', flag: '🇧🇮' },
            { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
            { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
            { code: '+1', name: 'Canada', flag: '🇨🇦' },
            { code: '+238', name: 'Cape Verde', flag: '🇨🇻' },
            { code: '+236', name: 'CAR', flag: '🇨🇫' },
            { code: '+235', name: 'Chad', flag: '🇹🇩' },
            { code: '+56', name: 'Chile', flag: '🇨🇱' },
            { code: '+86', name: 'China', flag: '🇨🇳' },
            { code: '+57', name: 'Colombia', flag: '🇨🇴' },
            { code: '+269', name: 'Comoros', flag: '🇰🇲' },
            { code: '+242', name: 'Congo', flag: '🇨🇬' },
            { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
            { code: '+385', name: 'Croatia', flag: '🇭🇷' },
            { code: '+53', name: 'Cuba', flag: '🇨🇺' },
            { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
            { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
            { code: '+45', name: 'Denmark', flag: '🇩🇰' },
            { code: '+253', name: 'Djibouti', flag: '🇩🇯' },
            { code: '+1', name: 'Dominica', flag: '🇩🇲' },
            { code: '+1', name: 'Dominican Republic', flag: '🇩🇴' },
            { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
            { code: '+20', name: 'Egypt', flag: '🇪🇬' },
            { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
            { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
            { code: '+291', name: 'Eritrea', flag: '🇪🇷' },
            { code: '+372', name: 'Estonia', flag: '🇪🇪' },
            { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
            { code: '+679', name: 'Fiji', flag: '🇫🇯' },
            { code: '+358', name: 'Finland', flag: '🇫🇮' },
            { code: '+33', name: 'France', flag: '🇫🇷' },
            { code: '+241', name: 'Gabon', flag: '🇬🇦' },
            { code: '+220', name: 'Gambia', flag: '🇬🇲' },
            { code: '+995', name: 'Georgia', flag: '🇬🇪' },
            { code: '+49', name: 'Germany', flag: '🇩🇪' },
            { code: '+233', name: 'Ghana', flag: '🇬🇭' },
            { code: '+30', name: 'Greece', flag: '🇬🇷' },
            { code: '+1', name: 'Grenada', flag: '🇬🇩' },
            { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
            { code: '+224', name: 'Guinea', flag: '🇬🇳' },
            { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
            { code: '+592', name: 'Guyana', flag: '🇬🇾' },
            { code: '+509', name: 'Haiti', flag: '🇭🇹' },
            { code: '+504', name: 'Honduras', flag: '🇭🇳' },
            { code: '+36', name: 'Hungary', flag: '🇭🇺' },
            { code: '+354', name: 'Iceland', flag: '🇮🇸' },
            { code: '+91', name: 'India', flag: '🇮🇳' },
            { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
            { code: '+98', name: 'Iran', flag: '🇮🇷' },
            { code: '+964', name: 'Iraq', flag: '🇮🇶' },
            { code: '+353', name: 'Ireland', flag: '🇮🇪' },
            { code: '+972', name: 'Israel', flag: '🇮🇱' },
            { code: '+39', name: 'Italy', flag: '🇮🇹' },
            { code: '+1', name: 'Jamaica', flag: '🇯🇲' },
            { code: '+81', name: 'Japan', flag: '🇯🇵' },
            { code: '+962', name: 'Jordan', flag: '🇯🇴' },
            { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
            { code: '+254', name: 'Kenya', flag: '🇰🇪' },
            { code: '+686', name: 'Kiribati', flag: '🇰🇮' },
            { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
            { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
            { code: '+856', name: 'Laos', flag: '🇱🇦' },
            { code: '+371', name: 'Latvia', flag: '🇱🇻' },
            { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
            { code: '+266', name: 'Lesotho', flag: '🇱🇸' },
            { code: '+231', name: 'Liberia', flag: '🇱🇷' },
            { code: '+218', name: 'Libya', flag: '🇱🇾' },
            { code: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
            { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
            { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
            { code: '+389', name: 'Macedonia', flag: '🇲🇰' },
            { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
            { code: '+265', name: 'Malawi', flag: '🇲🇼' },
            { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
            { code: '+960', name: 'Maldives', flag: '🇲🇻' },
            { code: '+223', name: 'Mali', flag: '🇲🇱' },
            { code: '+356', name: 'Malta', flag: '🇲🇹' },
            { code: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
            { code: '+222', name: 'Mauritania', flag: '🇲🇷' },
            { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
            { code: '+52', name: 'Mexico', flag: '🇲🇽' },
            { code: '+373', name: 'Moldova', flag: '🇲🇩' },
            { code: '+377', name: 'Monaco', flag: '🇲🇨' },
            { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
            { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
            { code: '+212', name: 'Morocco', flag: '🇲🇦' },
            { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
            { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
            { code: '+264', name: 'Namibia', flag: '🇳🇦' },
            { code: '+674', name: 'Nauru', flag: '🇳🇷' },
            { code: '+977', name: 'Nepal', flag: '🇳🇵' },
            { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
            { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
            { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
            { code: '+227', name: 'Niger', flag: '🇳🇪' },
            { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
            { code: '+850', name: 'North Korea', flag: '🇰🇵' },
            { code: '+47', name: 'Norway', flag: '🇳🇴' },
            { code: '+968', name: 'Oman', flag: '🇴🇲' },
            { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
            { code: '+680', name: 'Palau', flag: '🇵🇼' },
            { code: '+970', name: 'Palestine', flag: '🇵🇸' },
            { code: '+507', name: 'Panama', flag: '🇵🇦' },
            { code: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
            { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
            { code: '+51', name: 'Peru', flag: '🇵🇪' },
            { code: '+63', name: 'Philippines', flag: '🇵🇭' },
            { code: '+48', name: 'Poland', flag: '🇵🇱' },
            { code: '+351', name: 'Portugal', flag: '🇵🇹' },
            { code: '+974', name: 'Qatar', flag: '🇶🇦' },
            { code: '+40', name: 'Romania', flag: '🇷🇴' },
            { code: '+7', name: 'Russia', flag: '🇷🇺' },
            { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
            { code: '+290', name: 'Saint Helena', flag: '🇸🇭' },
            { code: '+1', name: 'Saint Kitts', flag: '🇰🇳' },
            { code: '+1', name: 'Saint Lucia', flag: '🇱🇨' },
            { code: '+508', name: 'Saint Pierre', flag: '🇵🇲' },
            { code: '+1', name: 'Saint Vincent', flag: '🇻🇨' },
            { code: '+685', name: 'Samoa', flag: '🇼🇸' },
            { code: '+378', name: 'San Marino', flag: '🇸🇲' },
            { code: '+239', name: 'Sao Tome', flag: '🇸🇹' },
            { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
            { code: '+221', name: 'Senegal', flag: '🇸🇳' },
            { code: '+381', name: 'Serbia', flag: '🇷🇸' },
            { code: '+248', name: 'Seychelles', flag: '🇸🇨' },
            { code: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
            { code: '+65', name: 'Singapore', flag: '🇸🇬' },
            { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
            { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
            { code: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
            { code: '+252', name: 'Somalia', flag: '🇸🇴' },
            { code: '+27', name: 'South Africa', flag: '🇿🇦' },
            { code: '+82', name: 'South Korea', flag: '🇰🇷' },
            { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
            { code: '+34', name: 'Spain', flag: '🇪🇸' },
            { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
            { code: '+249', name: 'Sudan', flag: '🇸🇩' },
            { code: '+597', name: 'Suriname', flag: '🇸🇷' },
            { code: '+268', name: 'Swaziland', flag: '🇸🇿' },
            { code: '+46', name: 'Sweden', flag: '🇸🇪' },
            { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
            { code: '+963', name: 'Syria', flag: '🇸🇾' },
            { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
            { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
            { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
            { code: '+66', name: 'Thailand', flag: '🇹🇭' },
            { code: '+228', name: 'Togo', flag: '🇹🇬' },
            { code: '+676', name: 'Tonga', flag: '🇹🇴' },
            { code: '+1', name: 'Trinidad', flag: '🇹🇹' },
            { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
            { code: '+90', name: 'Turkey', flag: '🇹🇷' },
            { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
            { code: '+1', name: 'Turks and Caicos', flag: '🇹🇨' },
            { code: '+256', name: 'Uganda', flag: '🇺🇬' },
            { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
            { code: '+971', name: 'UAE', flag: '🇦🇪' },
            { code: '+44', name: 'UK', flag: '🇬🇧' },
            { code: '+1', name: 'USA', flag: '🇺🇸' },
            { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
            { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
            { code: '+678', name: 'Vanuatu', flag: '🇻🇺' },
            { code: '+379', name: 'Vatican', flag: '🇻🇦' },
            { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
            { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
            { code: '+681', name: 'Wallis and Futuna', flag: '🇼🇫' },
            { code: '+967', name: 'Yemen', flag: '🇾🇪' },
            { code: '+260', name: 'Zambia', flag: '🇿🇲' },
            { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' }
        ]
    };

    // Защита от дублирования
    if (document.getElementById('ecos-whatsapp-popup-root')) return;

    // Проверка, показывался ли уже pop-up
    if (CONFIG.showOnce && localStorage.getItem(CONFIG.localStorageKey)) {
        return;
    }

    // ============================================================
    // СТИЛИ
    // ============================================================
    const styles = `
        <style id="ecos-whatsapp-popup-styles">
            .ecos-wa-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
                z-index: ${CONFIG.zIndex};
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .ecos-wa-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .ecos-wa-container {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) scale(0.9) !important;
                background: #ffffff !important;
                border-radius: 15px !important;
                box-shadow: 0 18px 38px rgba(0, 0, 0, 0.25) !important;
                max-width: 675px !important;
                width: 90% !important;
                z-index: ${CONFIG.zIndex + 1} !important;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                overflow: visible !important;
                display: flex !important;
            }

            .ecos-wa-container.active {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, -50%) scale(1);
            }

            .ecos-wa-content {
                flex: 0 0 auto;
                padding: 30px 25px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                position: relative;
                z-index: 2;
            }

            .ecos-wa-title {
                font-size: 22px;
                font-weight: 700;
                color: #000000;
                margin-bottom: 12px;
                line-height: 1.3;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-description {
                font-size: 15px;
                color: #666666;
                margin-bottom: 20px;
                line-height: 1.5;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-phone-wrapper {
                margin-bottom: 16px;
                display: flex;
                gap: 8px;
                flex-direction: column;
            }
            
            .ecos-wa-phone-inputs-row {
                display: flex;
                gap: 8px;
                width: 100%;
                box-sizing: border-box;
            }

            .ecos-wa-country-select {
                width: 200px;
                min-width: 0;
                flex-shrink: 0;
                padding: 12px 35px 12px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s ease;
                background: #ffffff;
                color: #000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 10px center;
                line-height: 1.5;
                box-sizing: border-box;
            }
            
            .ecos-wa-country-select option {
                font-size: 16px;
                padding: 10px 8px;
                line-height: 1.8;
            }
            
            .ecos-wa-country-select:focus {
                outline: none;
                border-color: #25D366;
                box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
            }

            .ecos-wa-phone-input {
                flex: 1;
                min-width: 0;
                max-width: 100%;
                padding: 12px 18px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s ease;
                background: #ffffff;
                color: #000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-sizing: border-box;
            }

            .ecos-wa-phone-input:focus {
                outline: none;
                border-color: #25D366;
                box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
            }

            .ecos-wa-phone-input::placeholder {
                color: #999;
            }
            
            .ecos-wa-error-message {
                color: #ff6b6b;
                font-size: 11px;
                margin-top: 6px;
                margin-left: 2px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-checkbox-wrapper {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                cursor: pointer;
            }

            .ecos-wa-checkbox-wrapper input[type="checkbox"] {
                width: 20px;
                height: 20px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #25D366;
            }

            .ecos-wa-checkbox-label {
                font-size: 15px;
                color: #333333;
                cursor: pointer;
                user-select: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-submit {
                width: 100%;
                background: #25D366;
                color: white;
                border: none;
                padding: 14px 25px;
                border-radius: 12px;
                font-size: 17px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                letter-spacing: 0.3px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-submit:hover {
                background: #20BA5A;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(37, 211, 102, 0.3);
            }

            .ecos-wa-submit:active {
                transform: translateY(0);
            }

            .ecos-wa-submit:disabled {
                background: #cccccc;
                cursor: not-allowed;
                transform: none;
            }

            .ecos-wa-logo-section {
                flex: 50;
                background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100%;
                padding: 40px 30px;
                overflow: visible;
                border-radius: 0 15px 15px 0;
            }

            .ecos-wa-logo {
                width: 140px;
                height: 140px;
                position: relative;
                flex-shrink: 0;
            }

            .ecos-wa-icon {
                width: 140px;
                height: 140px;
                background: #ffffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                flex-shrink: 0;
                margin: 0;
            }

            .ecos-wa-icon::before {
                content: '';
                position: absolute;
                width: 80%;
                height: 80%;
                background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2325D366'%3E%3Cpath d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/%3E%3C/svg%3E") no-repeat center;
                background-size: contain;
            }

            .ecos-wa-success {
                display: none;
                text-align: center;
                padding: 20px;
                color: #25D366;
                font-weight: 600;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .ecos-wa-success.active {
                display: block;
            }

            .ecos-wa-checkmark {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #25D366;
                margin: 0 auto 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 32px;
                animation: ecos-wa-checkmark-anim 0.6s ease-in-out;
            }

            @keyframes ecos-wa-checkmark-anim {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            @media (max-width: 768px) {
                .ecos-wa-container {
                    flex-direction: column;
                    max-width: 95%;
                }
                
                .ecos-wa-logo-section {
                    border-radius: 15px 15px 0 0;
                }

                .ecos-wa-logo-section {
                    min-height: 200px;
                    order: -1;
                    overflow: visible;
                    padding: 30px 15px;
                }

                .ecos-wa-logo-section {
                    padding: 30px 20px;
                    overflow: visible;
                }
                
                .ecos-wa-logo {
                    width: 140px;
                    height: 140px;
                }
                
                .ecos-wa-icon {
                    width: 140px;
                    height: 140px;
                    margin: 0;
                }

                .ecos-wa-content {
                    padding: 30px 20px;
                }

                .ecos-wa-title {
                    font-size: 20px;
                }

                .ecos-wa-description {
                    font-size: 14px;
                }
            }

            @media (max-width: 480px) {
                .ecos-wa-container {
                    width: 100%;
                    border-radius: 0;
                    max-width: 100%;
                }

                .ecos-wa-content {
                    padding: 25px 15px;
                }

                .ecos-wa-phone-inputs-row {
                    width: 100%;
                    max-width: 100%;
                    box-sizing: border-box;
                }

                .ecos-wa-country-select {
                    width: 140px;
                    min-width: 120px;
                    font-size: 14px;
                    padding: 12px 30px 12px 10px;
                }

                .ecos-wa-phone-input {
                    min-width: 0;
                    max-width: 100%;
                    font-size: 16px;
                    padding: 12px 12px;
                }

                .ecos-wa-logo-section {
                    min-height: 150px;
                    overflow: visible;
                    padding: 20px 10px;
                }

                .ecos-wa-logo-section {
                    padding: 20px 15px;
                    overflow: visible;
                }
                
                .ecos-wa-logo {
                    width: 100px;
                    height: 100px;
                }
                
                .ecos-wa-icon {
                    width: 100px;
                    height: 100px;
                    margin: 0;
                }
            }
        </style>
    `;

    // ============================================================
    // HTML
    // ============================================================
    const html = `
        <div class="ecos-wa-overlay" id="ecosWaOverlay"></div>
        <div class="ecos-wa-container" id="ecosWaContainer">
            <div class="ecos-wa-content">
                <h2 class="ecos-wa-title">${CONFIG.title}</h2>
                <p class="ecos-wa-description">${CONFIG.description}</p>
                <form id="ecosWaForm">
                    <div class="ecos-wa-phone-wrapper">
                        <div class="ecos-wa-phone-inputs-row">
                            <select class="ecos-wa-country-select" id="ecosWaCountry">
                                ${CONFIG.countries.map(country => 
                                    `<option value="${country.code}" ${country.code === '+374' ? 'selected' : ''}>${country.name} ${country.code}</option>`
                                ).join('')}
                            </select>
                            <input 
                                type="tel" 
                                class="ecos-wa-phone-input" 
                                id="ecosWaPhone" 
                                placeholder="99 123456"
                                pattern="[0-9\\s]+"
                            >
                        </div>
                        <div class="ecos-wa-error-message" id="ecosWaErrorMessage" style="display: none;">Please enter your phone number</div>
                    </div>
                    <div class="ecos-wa-checkbox-wrapper">
                        <input type="checkbox" id="ecosWaCheckbox">
                        <label for="ecosWaCheckbox" class="ecos-wa-checkbox-label">${CONFIG.checkboxLabel}</label>
                    </div>
                    <button type="submit" class="ecos-wa-submit" id="ecosWaSubmit" disabled>
                        ${CONFIG.buttonText}
                    </button>
                </form>
                <div class="ecos-wa-success" id="ecosWaSuccess">
                    <div class="ecos-wa-checkmark">✓</div>
                    <p>${CONFIG.successMessage}</p>
                </div>
            </div>
            <div class="ecos-wa-logo-section">
                <div class="ecos-wa-logo">
                    <div class="ecos-wa-icon"></div>
                </div>
            </div>
        </div>
    `;

    // Вставляем стили и HTML
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('beforeend', html);

    // ============================================================
    // ПЕРЕМЕННЫЕ
    // ============================================================
    const overlay = document.getElementById('ecosWaOverlay');
    const container = document.getElementById('ecosWaContainer');
    const countrySelect = document.getElementById('ecosWaCountry');
    const phoneInput = document.getElementById('ecosWaPhone');
    const form = document.getElementById('ecosWaForm');
    const submitBtn = document.getElementById('ecosWaSubmit');
    const successMessage = document.getElementById('ecosWaSuccess');
    const checkbox = document.getElementById('ecosWaCheckbox');
    
    // Убеждаемся, что чекбокс не отмечен при инициализации
    checkbox.checked = false;

    // ============================================================
    // МАСКА ТЕЛЕФОНА (С ВЫБОРОМ СТРАНЫ)
    // ============================================================
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Удаляем все кроме цифр
        value = value.replace(/\D/g, '');
        
        // Ограничиваем максимальную длину (15 цифр)
        if (value.length > 15) {
            value = value.substring(0, 15);
        }
        
        // Форматируем номер с пробелами для читаемости
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 3 === 0) {
                formatted += ' ';
            }
            formatted += value[i];
        }
        
        e.target.value = formatted;
    });

    // ============================================================
    // УПРАВЛЕНИЕ АКТИВНОСТЬЮ КНОПКИ ПО ЧЕКБОКСУ
    // ============================================================
    function updateSubmitButton() {
        if (checkbox.checked) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Инициализация состояния кнопки
    updateSubmitButton();

    // Обработчик изменения чекбокса
    checkbox.addEventListener('change', updateSubmitButton);

    // ============================================================
    // ПОКАЗ POP-UP
    // ============================================================
    function showPopup() {
        overlay.classList.add('active');
        container.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Отслеживание в CarrotQuest
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'read');
            carrotquest.track('WhatsApp Pop-up Opened');
        }
    }

    // ============================================================
    // СКРЫТИЕ POP-UP
    // ============================================================
    function hidePopup() {
        overlay.classList.remove('active');
        container.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        if (CONFIG.showOnce) {
            localStorage.setItem(CONFIG.localStorageKey, 'true');
        }
    }

    // ============================================================
    // ОБРАБОТКА ФОРМЫ
    // ============================================================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const phoneNumber = phoneInput.value.trim();
        const countryCode = countrySelect.value;
        const useWhatsApp = checkbox.checked;
        
        // Получаем название выбранной страны
        const selectedCountry = CONFIG.countries.find(c => c.code === countryCode);
        const countryName = selectedCountry ? selectedCountry.name : countryCode;
        
        const errorMessage = document.getElementById('ecosWaErrorMessage');
        
        if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 6) {
            phoneInput.style.borderColor = '#ff6b6b';
            phoneInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
            
            setTimeout(() => {
                phoneInput.style.borderColor = '#e0e0e0';
                phoneInput.style.boxShadow = 'none';
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }, 2000);
            return;
        }
        
        // Скрываем сообщение об ошибке если валидация прошла
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }

        // Отключаем форму
        submitBtn.disabled = true;
        submitBtn.textContent = CONFIG.buttonSendingText;
        form.style.display = 'none';

        // Объединяем код страны и номер
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        const fullPhoneNumber = countryCode + cleanPhoneNumber;

        // Отслеживание отправки в CarrotQuest
        if (typeof carrotquest !== 'undefined') {
            carrotquest.trackMessageInteraction('{{ sending_id }}', 'clicked');
            carrotquest.track('WhatsApp Pop-up Submitted');
            
            carrotquest.identify({
                '$phone': fullPhoneNumber,
                'phone': fullPhoneNumber,
                'country_code': countryCode,
                'country_name': countryName,
                'whatsapp_enabled': useWhatsApp
            });
            
            carrotquest.track('WhatsApp Pop-up Phone Submitted', {
                phone: fullPhoneNumber,
                country_code: countryCode,
                country_name: countryName,
                whatsapp_enabled: useWhatsApp
            });
        }

        // Сразу скрываем pop-up после отправки
        hidePopup();
        
        // Сброс формы
        form.reset();
        form.style.display = 'block';
        successMessage.classList.remove('active');
        submitBtn.textContent = CONFIG.buttonText;
        checkbox.checked = false;
        updateSubmitButton();
    });

    // ============================================================
    // СОБЫТИЯ
    // ============================================================
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hidePopup();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && container.classList.contains('active')) {
            hidePopup();
        }
    });

    container.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // ============================================================
    // АВТОЗАПУСК
    // ============================================================
    if (CONFIG.showDelay > 0) {
        setTimeout(function() {
            showPopup();
        }, CONFIG.showDelay);
    }

    // ============================================================
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ
    // ============================================================
    window.ecosWhatsAppPopupShow = showPopup;
    window.ecosWhatsAppPopupHide = hidePopup;

})();

/* 
УСТАНОВКА В CARROT QUEST:
1. Сообщения → Создать → JS-скрипт
2. Скопировать весь код → Вставить
3. Триггер: настройте по необходимости (URL, событие, время и т.д.)
4. Показать: 1 раз (если CONFIG.showOnce = true)

НАСТРОЙКА:
Измените параметры в CONFIG:
- showDelay: задержка перед показом (0 = ручной вызов)
- showOnce: показывать только один раз
- title, description: тексты pop-up
- whatsappNumber: фиксированный номер для отправки (null = номер пользователя)
- defaultMessage: сообщение для WhatsApp

РУЧНОЙ ВЫЗОВ:
window.ecosWhatsAppPopupShow() - показать
window.ecosWhatsAppPopupHide() - скрыть

АНАЛИТИКА:
Автоматически отслеживается:
- "WhatsApp Pop-up Opened" - открытие
- "WhatsApp Pop-up Submitted" - отправка формы
- Метрика "Прочитали" (read)
- Метрика "Кликнули" (clicked)

ТЕСТИРОВАНИЕ:
F12 → window.ecosWhatsAppPopupShow()
Для сброса localStorage: localStorage.removeItem('ecos_whatsapp_popup_seen')
*/
