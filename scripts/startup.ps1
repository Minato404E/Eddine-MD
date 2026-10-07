param([switch]$Remove)
$projectRoot = Split-Path $PSScriptRoot -Parent
$startupRegistry = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
if ($Remove) { Remove-ItemProperty -Path $startupRegistry -Name 'Eddine-MD' -ErrorAction SilentlyContinue; Write-Host 'Automatic startup disabled.'; exit }
New-Item -Path $startupRegistry -Force | Out-Null
$startupCommand = 'wscript.exe "' + (Join-Path $projectRoot 'scripts\start-hidden.vbs') + '"'
Set-ItemProperty -Path $startupRegistry -Name 'Eddine-MD' -Value $startupCommand
Write-Host 'Eddine-MD will start when you sign in to Windows. Keep this folder at this location.'
