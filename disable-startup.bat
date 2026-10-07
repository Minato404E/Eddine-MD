@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\startup.ps1" -Remove
pause
