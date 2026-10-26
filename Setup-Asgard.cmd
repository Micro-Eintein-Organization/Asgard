@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 24.19.0 or later within Node 24 is required.
  echo Install it from https://nodejs.org/dist/v24.19.0/ and run this file again.
  pause
  exit /b 1
)

node scripts\setup-windows.mjs
set "setup_result=%errorlevel%"
if not "%setup_result%"=="0" pause
exit /b %setup_result%
