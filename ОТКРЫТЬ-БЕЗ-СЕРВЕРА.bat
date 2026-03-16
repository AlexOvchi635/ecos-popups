@echo off
chcp 65001 >nul
cd /d "%~dp0"
start "" "save-as-png.html"
echo Открыто. Картинки могут не попасть в PNG — если так, установите Python и используйте ОТКРЫТЬ-SAVE-PNG.bat
timeout /t 3 >nul
