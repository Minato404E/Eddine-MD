. (Join-Path $PSScriptRoot 'panel-address.ps1')
$tokenPath = Join-Path $projectRoot 'data\panel-token.txt'
if (-not (Test-Path -LiteralPath $tokenPath)) { Write-Host 'Start the bot first with start.bat.'; exit 1 }
$panelToken = (Get-Content -LiteralPath $tokenPath -Raw).Trim()
Start-Process ($localPanelUrl + '/#token=' + $panelToken)
