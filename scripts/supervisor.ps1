$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'panel-address.ps1')
Set-Location -LiteralPath $projectRoot
New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot 'data') | Out-Null
$nodePath = (Get-Command node -ErrorAction Stop).Source
while ($true) {
    if (Get-NetTCPConnection -LocalPort $panelPort -State Listen -ErrorAction SilentlyContinue) { break }
    & $nodePath (Join-Path $projectRoot 'index.js') *>> (Join-Path $projectRoot 'data\host.log')
    $botExitCode = $LASTEXITCODE
    if ($botExitCode -eq 0) { break }
    if (Get-NetTCPConnection -LocalPort $panelPort -State Listen -ErrorAction SilentlyContinue) { break }
    Start-Sleep -Seconds 5
}
