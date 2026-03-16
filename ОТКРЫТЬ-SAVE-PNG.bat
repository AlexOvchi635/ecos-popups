@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Сохранить в PNG — запуск сервера
echo ========================================
echo.

REM Проверяем, что доступно (PowerShell — встроен в Windows)
set "SERVER_CMD="
set "USE_PS=0"
python --version >nul 2>&1 && set "SERVER_CMD=python -m http.server 8080"
if not defined SERVER_CMD py --version >nul 2>&1 && set "SERVER_CMD=py -m http.server 8080"
if not defined SERVER_CMD npx --version >nul 2>&1 && set "SERVER_CMD=npx -y http-server -p 8080"
if not defined SERVER_CMD php -v >nul 2>&1 && set "SERVER_CMD=php -S 127.0.0.1:8080"
if not defined SERVER_CMD set "SERVER_CMD=%~dp0run-ps-server.bat" & set "USE_PS=1"

if not defined SERVER_CMD (
    echo [ОШИБКА] Не найден ни один сервер.
    echo.
    echo Установите один из вариантов:
    echo   1. Python: https://www.python.org/downloads/
    echo      При установке отметьте "Add Python to PATH"
    echo.
    echo   2. Node.js: https://nodejs.org/
    echo.
    echo   3. PHP: https://windows.php.net/download/
    echo      Добавьте php.exe в PATH
    echo.
    pause
    exit /b 1
)

if "%USE_PS%"=="1" (echo Запуск: PowerShell-сервер) else (echo Запуск: %SERVER_CMD%)
echo.
if "%USE_PS%"=="1" (start "Сервер" "%SERVER_CMD%") else (start "Сервер" cmd /k "%SERVER_CMD%")

timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8080/save-as-png.html"

echo Открыто в браузере.
echo Окно "Сервер" не закрывайте, пока работаете.
echo.
pause
