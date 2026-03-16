@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0http-server.ps1"
pause
