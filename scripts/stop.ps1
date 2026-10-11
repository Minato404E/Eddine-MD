$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'panel-address.ps1')
$tokenPath = Join-Path $projectRoot 'data\panel-token.txt'
if (-not (Test-Path -LiteralPath $tokenPath)) { Write-Host 'No running host found.'; exit 0 }
$panelToken = (Get-Content -LiteralPath $tokenPath -Raw).Trim()
try { Invoke-RestMethod -Method Post -Uri ($localPanelUrl + '/api/shutdown') -Headers @{ Authorization = 'Bearer ' + $panelToken } -ContentType 'application/json' -Body '{}' | Out-Null; Write-Host 'Host is saving and stopping.' } catch { Write-Host 'No running host found, or token mismatch.' }
