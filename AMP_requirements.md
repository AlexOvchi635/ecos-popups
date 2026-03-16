AMP for Email: что нужно, чтобы письма с формой проходили

1) Базовые требования отправителя
- Отправляйте с домена с корректно настроенными SPF, DKIM и DMARC (p=none или выше).
- Хорошая репутация домена и IP, отсутствие спама/жалоб.
- Обслуживающий ESP должен поддерживать мульти‑часть письма: text/plain + text/html (fallback) + text/x-amp-html.

2) Регистрация отправителя для AMP
- Gmail: заявка на whitelisting для AMP for Email: https://developers.google.com/gmail/ampemail/register
  - Требуется стабильная отправка не менее нескольких недель, валидные заголовки, корректная отписка.
- Yahoo Mail: регистрация отправителя: https://senders.yahooinc.com/amp/
- После одобрения AMP‑версия начнёт обрабатываться у этих провайдеров.

3) Структура письма
- Письмо должно содержать 3 части:
  - text/plain — простая версия
  - text/html — обычная HTML‑версия (наш вариант с one‑click)
  - text/x-amp-html — AMP‑версия (см. Welcome_Offer_EN.amp.html)
- ESP/шаблонизатор должен уметь отправлять multipart/alternative с этими частями.

4) Ограничения AMP‑контента
- Нельзя использовать произвольный JS, только компоненты AMP (amp-form, amp-img, amp-bind и т.д.)
- Все CSS должны быть внутри <style amp-custom> и <= 50KB.
- Все изображения через <amp-img> с width/height.

5) Отправка формы (amp-form)
- Используется метод POST с action-xhr на ваш HTTPS‑эндпоинт, например: https://yourdomain.com/amp/collect
- Требования к CORS для AMP:
  - Ответ должен содержать заголовок: Access-Control-Allow-Origin: https://mail.google.com
    (и/или https://mail.yahoo.com при отправках для Yahoo)
  - Access-Control-Allow-Credentials: true (если используются cookies)
  - AMP-Access-Control-Allow-Source-Origin: https://yourdomain.com
  - Vary: Origin
  - Content-Type: application/json
  - Ответ на submit-success должен вернуть JSON, который подставится в шаблон <template type="amp-mustache">.

Пример минимального ответа 200 JSON:
{
  "ok": true,
  "message": "Thank you"
}

6) Безопасность и конфиденциальность
- Не принимайте email в теле формы — используйте uid/токен из ESP, валидация на бэкенде.
- Логируйте user-agent/geo/utm для атрибуции.

7) Тестирование
- Отправляйте тестовые письма на Gmail и Yahoo реальным ящикам.
- Проверяйте в DevTools Network, что action-xhr отдаёт нужные CORS‑заголовки.
- Валидация AMP: вставьте AMP‑часть в валидатор https://amp.dev/validator/

8) Падение в fallback
- Для клиентов без AMP показывается HTML‑версия с one‑click ссылками.
- Это обеспечивает 100% доставку функциональности.

9) Дальнейшая автоматизация
- По получении данных с /amp/collect отправляйте промокод через ESP API.
- Ставьте TTL на промокод (4 дня) и логируйте redemption.

