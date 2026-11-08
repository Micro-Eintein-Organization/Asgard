@echo off
setlocal
cd /d "%~dp0"

node scripts\setup-windows.mjs start
if errorlevel 1 goto failed

exit /b 0

:failed
echo.
echo Asgard did not start. Read the STOPPED message above and the README troubleshooting section.
pause
exit /b 1
