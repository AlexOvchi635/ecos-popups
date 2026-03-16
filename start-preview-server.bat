@echo off
chcp 65001 >nul
echo ========================================
echo   Локальный сервер для превью шаблонов
echo ========================================
echo.
echo Откройте в браузере: http://127.0.0.1:8080/preview.html
echo.
echo Для остановки нажмите Ctrl+C
echo ========================================
echo.

cd /d "%~dp0"

python -m http.server 8080 2>nul
if errorlevel 1 (
    echo Python не найден. Пробуем py...
    py -m http.server 8080
)
