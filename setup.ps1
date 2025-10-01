#!/usr/bin/env pwsh

# Script de configuración inicial para YouTube Local Downloader
# Se ejecuta automáticamente para preparar el entorno de desarrollo

Write-Host "🚀 Configurando YouTube Local Downloader..." -ForegroundColor Green

# Verificar que Node.js esté instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor, instala Node.js desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar que npm esté disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está disponible" -ForegroundColor Red
    exit 1
}

# Instalar dependencias de Node.js
Write-Host "📦 Instalando dependencias de Node.js..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias de Node.js" -ForegroundColor Red
    exit 1
}

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. Puedes editarlo para personalizar la configuración." -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Verificar FFmpeg
Write-Host "🔍 Verificando FFmpeg..." -ForegroundColor Yellow
try {
    $ffmpegVersion = ffmpeg -version 2>$null | Select-Object -First 1
    Write-Host "✅ FFmpeg detectado: $($ffmpegVersion.Split(' ')[2])" -ForegroundColor Green
} catch {
    Write-Host "⚠️  FFmpeg no detectado. Se requiere para procesamiento de audio/video." -ForegroundColor Yellow
    Write-Host "   Instala FFmpeg desde: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host "   O usando Chocolatey: choco install ffmpeg" -ForegroundColor Yellow
}

# Verificar yt-dlp
Write-Host "🔍 Verificando yt-dlp..." -ForegroundColor Yellow
try {
    $ytdlpVersion = yt-dlp --version 2>$null
    Write-Host "✅ yt-dlp detectado: $ytdlpVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  yt-dlp no detectado. Se requiere para descargar videos de YouTube." -ForegroundColor Yellow
    Write-Host "   Instala yt-dlp desde: https://github.com/yt-dlp/yt-dlp/releases" -ForegroundColor Yellow
    Write-Host "   O usando pip: pip install yt-dlp" -ForegroundColor Yellow
}

# Crear directorios necesarios
$directories = @("backend/tmp", "backend/output")
foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Directorio creado: $dir" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar la aplicación:" -ForegroundColor Cyan
Write-Host "  Desarrollo: npm run dev" -ForegroundColor White
Write-Host "  Producción: npm start" -ForegroundColor White
Write-Host ""
Write-Host "La aplicación estará disponible en: http://localhost:5050" -ForegroundColor Cyan