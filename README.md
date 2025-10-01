# YouTube Local Downloader

## 🎵 Descripción

Aplicación local para Windows que permite descargar y procesar videos de YouTube con las siguientes características:

- ✅ Recibe uno o varios links de YouTube
- ✅ Descarga video (MP4 opcional) y/o audio MP3
- ✅ Convierte a MP3 320 kbps
- ✅ Parte el MP3 en segmentos configurables (1/5/10/15/20 min o sin partir)
- ✅ Añade metadatos ID3 (título, artista=canal, álbum=YouTube, año, carátula del thumbnail)
- ✅ Crea una carpeta por video dentro de `backend/output/`
- ✅ Ofrece progreso por etapa y descarga de archivos finales (mp3/mp4/zip)

## 🚀 Instalación

### Prerequisitos

- **Node.js** (versión 16 o superior)
- **FFmpeg** instalado y disponible en PATH
- **yt-dlp** instalado y disponible en PATH

### Instalación de dependencias externas

#### Windows:

```powershell
# Instalar FFmpeg usando Chocolatey
choco install ffmpeg

# O descargar desde https://ffmpeg.org/download.html

# Instalar yt-dlp usando pip
pip install yt-dlp

# O descargar desde https://github.com/yt-dlp/yt-dlp/releases
```

### Configuración del proyecto

1. Clonar o descargar el proyecto
2. Instalar dependencias de Node.js:

```bash
npm install
```

3. Copiar archivo de configuración:

```bash
copy .env.example .env
```

4. Editar `.env` según tu configuración:

```env
PORT=5050
OUTPUT_ROOT=./backend/output
TMP_ROOT=./backend/tmp
CONCURRENCY=3
FFMPEG_PATH=ffmpeg
YTDLP_PATH=yt-dlp
LOUDNESS_NORMALIZE=true
```

## 🎯 Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:5050`

## 📁 Estructura del Proyecto

```
yt-local-downloader/
├── backend/
│   ├── app.js                 # Servidor Express principal
│   ├── routes.js              # Definición de rutas API
│   ├── controllers/           # Controladores HTTP
│   │   ├── downloadController.js
│   │   └── jobController.js
│   ├── services/              # Lógica de negocio
│   │   ├── downloadService.js
│   │   ├── ffmpegService.js
│   │   ├── metadataService.js
│   │   ├── fileService.js
│   │   └── jobManager.js
│   ├── jobs/                  # Procesos de trabajo
│   │   └── downloadJob.js
│   ├── tmp/                   # Archivos temporales
│   └── output/                # Archivos finales organizados
├── frontend/
│   ├── index.html             # Interfaz principal
│   ├── main.js                # JavaScript de la aplicación
│   └── styles.css             # Estilos CSS
├── package.json
├── .env.example
└── README.md
```

## 🔧 Configuración

### Variables de entorno

- `PORT`: Puerto del servidor (default: 5050)
- `OUTPUT_ROOT`: Directorio de archivos finales
- `TMP_ROOT`: Directorio de archivos temporales
- `CONCURRENCY`: Número máximo de descargas simultáneas
- `FFMPEG_PATH`: Ruta al ejecutable de FFmpeg
- `YTDLP_PATH`: Ruta al ejecutable de yt-dlp
- `LOUDNESS_NORMALIZE`: Habilitar normalización de volumen

### Organización de archivos de salida

Cada video descargado se organiza en:

```
backend/output/
└── [Nombre del Video - ID]/
    ├── audio/
    │   ├── [nombre].mp3           # Audio principal 320kbps
    │   └── segments/              # Segmentos (si aplica)
    │       ├── [nombre]_01.mp3
    │       ├── [nombre]_02.mp3
    │       └── ...
    ├── video/                     # Solo si se descarga video
    │   └── [nombre].mp4
    ├── images/
    │   └── thumbnail.jpg          # Carátula del video
    ├── README.txt                 # Información del video
    └── [Nombre del Video].zip     # ZIP con todos los archivos
```

## 🌐 API Endpoints

### POST /api/download
Inicia una nueva descarga

**Body:**
```json
{
  "urls": ["https://youtube.com/watch?v=...", "..."],
  "config": {
    "format": "mp3",           // "mp3", "mp4", "both"
    "segmentMinutes": 5,       // 0, 1, 5, 10, 15, 20
    "quality": "320",          // Bitrate MP3
    "includeVideo": false
  }
}
```

**Response:**
```json
{
  "jobId": "uuid-del-trabajo",
  "status": "pending",
  "message": "Descarga iniciada"
}
```

### GET /api/status/:jobId
Consulta el estado de una descarga

**Response:**
```json
{
  "id": "uuid-del-trabajo",
  "status": "processing",
  "progress": {
    "stage": "converting",
    "percentage": 65,
    "currentUrl": "https://...",
    "processedUrls": 2,
    "totalUrls": 3
  },
  "files": ["archivo1.mp3", "archivo2.zip"],
  "createdAt": "2023-...",
  "startedAt": "2023-...",
  "completedAt": null
}
```

### GET /api/download/:jobId
Descarga archivos procesados

**Query params:**
- `type`: "zip" (todos los archivos) | "files" (individual)

### GET /api/jobs
Lista todos los trabajos

### DELETE /api/job/:jobId
Cancela un trabajo activo

## 🛠️ Desarrollo

### TODO List Principal

Este proyecto está en fase inicial con estructura completa pero implementación pendiente:

- [ ] **Backend Core**
  - [ ] Configurar servidor Express con middlewares
  - [ ] Implementar rutas API completas
  - [ ] Integrar controladores con servicios

- [ ] **Servicios de Descarga**
  - [ ] Implementar integración con yt-dlp
  - [ ] Configurar procesamiento con FFmpeg
  - [ ] Sistema de metadata ID3
  - [ ] Gestión de archivos y organización

- [ ] **Sistema de Jobs**
  - [ ] Gestor de trabajos con cola
  - [ ] Monitoreo de progreso en tiempo real
  - [ ] Manejo de concurrencia y cancelación

- [ ] **Frontend**
  - [ ] Conectar formulario con API
  - [ ] Implementar monitoreo de progreso
  - [ ] Sistema de notificaciones
  - [ ] Lista de trabajos interactiva

- [ ] **Optimizaciones**
  - [ ] Manejo de errores robusto
  - [ ] Logging y debugging
  - [ ] Validaciones de entrada
  - [ ] Limpieza automática de archivos antiguos

### Scripts de desarrollo

```bash
# Desarrollo con recarga automática
npm run dev

# Producción
npm start

# Linting (cuando se configure)
npm run lint

# Tests (cuando se implementen)
npm test
```

## 📝 Notas Técnicas

### Dependencias principales

- **express**: Servidor web
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno
- **uuid**: Generación de IDs únicos
- **archiver**: Creación de archivos ZIP
- **fluent-ffmpeg**: Wrapper para FFmpeg
- **node-id3**: Manejo de metadata MP3

### Limitaciones conocidas

- Requiere instalación manual de FFmpeg y yt-dlp
- Almacenamiento temporal de jobs (se pierde al reiniciar)
- Sin autenticación (aplicación local)
- Sin interfaz de administración avanzada

## 🤝 Contribución

Este es un proyecto en desarrollo activo. Las contribuciones son bienvenidas:

1. Fork del repositorio
2. Crear branch de feature
3. Implementar funcionalidad
4. Agregar tests si es posible
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🆘 Soporte

Para problemas o preguntas:

1. Revisar la documentación de prerequisitos
2. Verificar logs en consola del servidor
3. Verificar que FFmpeg y yt-dlp están instalados correctamente
4. Crear issue en el repositorio con detalles del problema

---

**Estado del proyecto**: 🚧 En desarrollo - Estructura completa, implementación en progreso