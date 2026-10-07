$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$toolsPath = Join-Path $projectRoot 'tools'
New-Item -ItemType Directory -Force -Path $toolsPath | Out-Null
$downloadPath = Join-Path $toolsPath 'yt-dlp.exe.download'
Write-Host 'Downloading the official yt-dlp Windows release...'
Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' -OutFile $downloadPath
Move-Item -LiteralPath $downloadPath -Destination (Join-Path $toolsPath 'yt-dlp.exe') -Force
& (Join-Path $toolsPath 'yt-dlp.exe') --version
if ($LASTEXITCODE -ne 0) { throw 'yt-dlp could not start.' }
Write-Host 'Downloader ready. FFmpeg/FFprobe are installed by npm.'
