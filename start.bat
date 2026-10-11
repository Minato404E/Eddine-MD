@echo off
cd /d "%~dp0"
if not exist "node_modules\@whiskeysockets\baileys\package.json" (
  echo Run setup.bat first.
  pause
  exit /b 1
)
node --input-type=module -e "import {ownerConfigured} from './src/runtime-config.js';if(!ownerConfigured)process.exit(1)"
if errorlevel 1 (
 echo Run setup.bat to configure your owner number first.
 pause
 exit /b 1
)
start "" wscript.exe "%~dp0scripts\start-hidden.vbs"
echo Eddine-MD is starting. Open panel.bat after a few seconds.
