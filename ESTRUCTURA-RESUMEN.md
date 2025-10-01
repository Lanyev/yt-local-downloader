# Estructura de Carpetas y Archivos - Resumen Visual

## 📁 Estructura General

```
yt-local-downloader/
├── backend/
│   ├── output/                                    # 🎯 Archivos finales organizados
│   │   ├── {canal}-{titulo}-{videoId}/           # Carpeta por video
│   │   │   ├── {canal}-{titulo}-{videoId}.mp3    # MP3 único (sin segmentar)
│   │   │   ├── {canal}-{titulo}-{videoId}__part-001.mp3  # Parte 1 (segmentado)
│   │   │   ├── {canal}-{titulo}-{videoId}__part-002.mp3  # Parte 2
│   │   │   ├── {canal}-{titulo}-{videoId}__part-00N.mp3  # Parte N
│   │   │   ├── {canal}-{titulo}-{videoId}.zip    # ZIP con todas las partes
│   │   │   └── manifest.json                     # Metadatos del proceso
│   │   │
│   │   └── [más carpetas de videos...]
│   │
│   ├── tmp/                                       # 🔧 Archivos temporales
│   │   └── {jobId}/                              # Carpeta temporal por job
│   │       └── [archivos temporales de descarga/conversión]
│   │
│   └── services/                                  # 📦 Servicios implementados
│       ├── paths.service.js      ✅              # Generación de rutas
│       ├── metadata.service.js   ✅              # Gestión de manifest.json
│       ├── zip.service.js        ✅              # Creación de archivos ZIP
│       └── fileService.js        ✅              # Organización de archivos
│
├── frontend/
└── ...
```

## 📝 Nomenclatura de Archivos

### Patrón de Nombres

```
Formato base: {canal}-{titulo}-{videoId}

Componentes:
  {canal}    → Nombre del canal sanitizado (max 150 chars)
  {titulo}   → Título del video sanitizado (max 150 chars)
  {videoId}  → ID único del video de YouTube (11 chars)
```

### Ejemplos Reales

```
Canal: "Tech Channel"
Título: "Tutorial de Node.js"
VideoId: "dQw4w9WgXcQ"

📁 Carpeta:
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ/

📄 MP3 único:
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ.mp3

📦 Partes (si está segmentado):
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ__part-001.mp3
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ__part-002.mp3
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ__part-003.mp3

🗜️ ZIP:
   Tech_Channel-Tutorial_de_Node.js-dQw4w9WgXcQ.zip

📋 Manifest:
   manifest.json
```

## 🔧 Servicios Implementados

### 1️⃣ `paths.service.js` - Gestión de Rutas

**Funciones Principales:**

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `sanitizeFilename()` | Limpia nombres de archivo | `string` |
| `generateVideoBaseName()` | Crea nombre base del video | `string` |
| `generateVideoFolder()` | Ruta de carpeta del video | `string` |
| `generateSingleMp3Path()` | Ruta para MP3 único | `string` |
| `generateMp3PartPath()` | Ruta para parte de MP3 | `string` |
| `generateZipPath()` | Ruta para archivo ZIP | `string` |
| `generateManifestPath()` | Ruta para manifest.json | `string` |

**Ejemplo de Uso:**

```javascript
const pathsService = require('./services/paths.service');

const videoInfo = {
  channel: 'Tech Channel',
  title: 'Tutorial Node.js',
  videoId: 'dQw4w9WgXcQ'
};

// Generar carpeta del video
const folder = pathsService.generateVideoFolder('./backend/output', videoInfo);
// => ./backend/output/Tech_Channel-Tutorial_Node.js-dQw4w9WgXcQ

// Generar ruta para MP3 único
const mp3Path = pathsService.generateSingleMp3Path(folder, videoInfo);
// => ./backend/output/Tech_Channel-Tutorial_Node.js-dQw4w9WgXcQ/Tech_Channel-Tutorial_Node.js-dQw4w9WgXcQ.mp3

// Generar ruta para parte 1 de 3
const part1 = pathsService.generateMp3PartPath(folder, videoInfo, 1, 3);
// => ./backend/output/Tech_Channel-Tutorial_Node.js-dQw4w9WgXcQ/Tech_Channel-Tutorial_Node.js-dQw4w9WgXcQ__part-001.mp3
```

### 2️⃣ `metadata.service.js` - Gestión de Manifest

**Funciones Principales:**

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `createManifest()` | Crea nuevo manifest.json | `Promise<boolean>` |
| `readManifest()` | Lee manifest existente | `Promise<Object>` |
| `updateManifest()` | Actualiza manifest | `Promise<boolean>` |
| `applyId3Tags()` | Aplica tags ID3 a MP3 | `Promise<boolean>` |
| `downloadThumbnail()` | Descarga thumbnail | `Promise<string>` |

**Estructura del Manifest:**

```json
{
  "version": "1.0",
  "createdAt": "2025-09-30T12:00:00.000Z",
  "video": {
    "id": "dQw4w9WgXcQ",
    "title": "Tutorial de Node.js",
    "channel": "Tech Channel",
    "channelId": "UC123456789",
    "duration": 1800,
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "thumbnailUrl": "https://...",
    "description": "..."
  },
  "processing": {
    "downloadedAt": "2025-09-30T12:00:00.000Z",
    "convertedAt": "2025-09-30T12:05:00.000Z",
    "audioFormat": "mp3",
    "audioBitrate": "320k",
    "segmented": true,
    "totalParts": 3,
    "segmentDuration": 600
  },
  "files": [
    {
      "name": "video__part-001.mp3",
      "size": 14400000,
      "duration": 600
    }
  ],
  "errors": []
}
```

### 3️⃣ `zip.service.js` - Creación de ZIP

**Funciones Principales:**

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `createZip()` | Crea ZIP de archivos | `Promise<string>` |
| `createZipFromFolder()` | Crea ZIP de carpeta | `Promise<string>` |
| `createZipWithStructure()` | ZIP con estructura custom | `Promise<string>` |
| `validateZip()` | Valida integridad del ZIP | `Promise<boolean>` |

**Ejemplo de Uso:**

```javascript
const zipService = require('./services/zip.service');

// Crear ZIP con archivos específicos
const files = [
  './output/video__part-001.mp3',
  './output/video__part-002.mp3',
  './output/video__part-003.mp3'
];

const zipPath = './output/video.zip';

await zipService.createZip(files, zipPath, (progress) => {
  console.log(`Progreso: ${progress.toFixed(1)}%`);
});
```

### 4️⃣ `fileService.js` - Organización de Archivos

**Funciones Principales:**

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `createVideoFolder()` | Crea carpeta del video | `Promise<string>` |
| `organizeVideoFiles()` | Organiza todos los archivos | `Promise<Object>` |
| `getFileStats()` | Estadísticas de archivos | `Promise<Object>` |
| `cleanupOldFiles()` | Limpia archivos antiguos | `Promise<Object>` |

**Ejemplo de Uso:**

```javascript
const fileService = require('./services/fileService');

// Crear carpeta para video
const videoFolder = await fileService.createVideoFolder({
  channel: 'Tech Channel',
  title: 'Tutorial Node.js',
  videoId: 'dQw4w9WgXcQ'
});

// Organizar archivos procesados
const result = await fileService.organizeVideoFiles(
  videoFolder,
  videoInfo,
  mp3Files,
  processInfo
);
```

## 🎨 Reglas de Sanitización

### Caracteres Removidos/Reemplazados

| Carácter | Acción | Reemplazo |
|----------|--------|-----------|
| `< > : " / \ | ? *` | Reemplazar | `_` |
| Espacios múltiples | Colapsar | Un espacio |
| Guiones múltiples | Colapsar | Un guión |
| Control chars (`\x00-\x1f`) | Remover | - |

### Límites

- **Longitud máxima:** 150 caracteres por componente
- **Longitud total carpeta:** ~450 caracteres máximo
- **Compatible con:** Windows, Linux, macOS

### Ejemplos de Sanitización

| Original | Sanitizado |
|----------|------------|
| `Tech Channel! / How to: Node.js` | `Tech_Channel_How_to_Node.js` |
| `"Video" con *caracteres* <especiales>` | `Video_con_caracteres_especiales` |
| `C++ & Python \| Tutorial` | `C++_&_Python_Tutorial` |

## 🔄 Flujo de Trabajo

```
1. Descarga de YouTube
   ↓
2. Obtener metadata (título, canal, videoId)
   ↓
3. Generar nombre base: {canal}-{titulo}-{videoId}
   ↓
4. Crear carpeta: backend/output/{nombre-base}/
   ↓
5. Convertir a MP3 320kbps
   ↓
6. ¿Segmentar?
   ├─ NO  → Guardar: {nombre-base}.mp3
   └─ SÍ  → Guardar: {nombre-base}__part-00N.mp3
   ↓
7. Crear ZIP (si múltiples partes): {nombre-base}.zip
   ↓
8. Crear manifest.json con metadatos
   ↓
9. Limpiar archivos temporales
   ↓
10. ✅ Completado
```

## 📊 Ventajas de esta Estructura

✅ **Organización Clara:** Cada video en su carpeta identificable  
✅ **Trazabilidad:** VideoId único evita duplicados  
✅ **Metadatos Completos:** manifest.json con toda la info  
✅ **Fácil Gestión:** Simple ubicar y gestionar archivos  
✅ **Compatibilidad:** Funciona en Windows/Linux/macOS  
✅ **Escalable:** Soporta miles de videos sin conflictos  

## 🚀 Próximos Pasos

- [ ] Implementar servicios ytdlp.service.js y ffmpeg.service.js
- [ ] Integrar con downloadJob.js para uso real
- [ ] Agregar tests unitarios para cada servicio
- [ ] Implementar descarga real de thumbnails
- [ ] Agregar tags ID3 con node-id3
- [ ] Implementar limpieza automática de archivos antiguos
- [ ] Agregar sistema de logging detallado

## 📖 Referencias

- **Documentación completa:** Ver `ESTRUCTURA.md`
- **Ejemplos de uso:** Ver `backend/examples/example-structure-usage.js`
- **Servicios:** Ver carpeta `backend/services/`
