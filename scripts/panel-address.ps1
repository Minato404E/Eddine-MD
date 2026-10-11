$projectRoot = Split-Path $PSScriptRoot -Parent
$configPath = Join-Path $projectRoot 'panel.config.json'
$settings = @{ port = 8787; bind = '127.0.0.1' }
if (Test-Path -LiteralPath $configPath) { $settings = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json }
$panelPort = $settings.port
foreach ($value in @($env:PANEL_PORT, $env:SERVER_PORT, $env:PORT)) { if ($value) { $panelPort = $value; break } }
if (-not $panelPort) { $panelPort = 8787 }
# Open/stop through local loopback, even when the host panel listens publicly.
$panelBind = $settings.bind
if ($env:PANEL_HOST) { $panelBind = $env:PANEL_HOST }
$loopbackHost = '127.0.0.1'
if ($panelBind -eq '::1') { $loopbackHost = '[::1]' }
$localPanelUrl = 'http://' + $loopbackHost + ':' + $panelPort
