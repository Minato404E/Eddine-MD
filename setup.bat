@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Install Node.js 24 or a supported Node 22 version, then retry.
 pause
 exit /b 1
)
node -e "const [m,n]=process.versions.node.split('.').map(Number);if(!((m===22&&n>=13)||m>=24))process.exit(1)"
if errorlevel 1 (
 echo Node.js 22.13+ or 24+ is required.
 pause
 exit /b 1
)
call npm ci --no-fund --no-audit
if errorlevel 1 (
 echo Dependency installation failed. Review the error above.
 pause
 exit /b 1
)
node scripts\setup.js
if errorlevel 1 (
 pause
 exit /b 1
)
echo Ready. Run start.bat, then panel.bat to pair your account.
echo Optional: enable-startup.bat enables Windows login startup.
pause
