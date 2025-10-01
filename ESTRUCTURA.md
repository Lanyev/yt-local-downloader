# Estructura de Archivos de Salida

## Organización de Videos Descargados

Cada video descargado se organiza en su propia carpeta con el siguiente formato:

```
backend/output/{canal}-{titulo}-{videoId}/
```

### Ejemplo de Estructura

```
backend/output/
├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ/
│   ├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ.mp3        # MP3 único (si no hay segmentación)
│   ├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-001.mp3  # Primera parte (si está segmentado)
│   ├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-002.mp3  # Segunda parte
│   ├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-003.mp3  # Tercera parte
│   ├── TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ.zip       # ZIP con todas las partes
│   └── manifest.json                                      # Metadatos del proceso
```

## Nomenclatura de Archivos

### MP3 Único (Sin Segmentación)
**Formato:** `{canal}-{titulo}-{videoId}.mp3`

**Ejemplo:** `TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ.mp3`

Este archivo se genera cuando el video no requiere segmentación (duración menor al límite configurado).

### Partes de MP3 (Con Segmentación)
**Formato:** `{canal}-{titulo}-{videoId}__part-{numero}.mp3`

**Ejemplos:**
- `TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-001.mp3`
- `TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-002.mp3`
- `TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-003.mp3`

Los números de parte están siempre con 3 dígitos (001, 002, ..., 999).

### Archivo ZIP
**Formato:** `{canal}-{titulo}-{videoId}.zip`

**Ejemplo:** `TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ.zip`

Contiene todos los archivos MP3 (único o partes) comprimidos.

### Manifest JSON
**Archivo:** `manifest.json` (siempre el mismo nombre)

Contiene metadatos completos del proceso de descarga y conversión.

## Estructura del manifest.json

```json
{
  "version": "1.0",
  "createdAt": "2025-09-30T12:00:00.000Z",
  "video": {
    "id": "dQw4w9WgXcQ",
    "title": "Tutorial de Node.js",
    "channel": "TechChannel",
    "channelId": "UC123456789",
    "duration": 1800,
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "description": "Descripción del video..."
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
      "name": "TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-001.mp3",
      "size": 14400000,
      "duration": 600
    },
    {
      "name": "TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-002.mp3",
      "size": 14400000,
      "duration": 600
    },
    {
      "name": "TechChannel-Tutorial-Nodejs-dQw4w9WgXcQ__part-003.mp3",
      "size": 14400000,
      "duration": 600
    }
  ],
  "errors": []
}
```

## Características de la Estructura

### Ventajas
- **Organización Clara:** Cada video tiene su propia carpeta identificable
- **Trazabilidad:** El nombre incluye canal, título y ID del video
- **Metadatos Completos:** manifest.json guarda toda la información del proceso
- **Fácil Gestión:** Simple identificar y gestionar archivos de cada video
- **Compatibilidad:** Nombres sanitizados compatibles con Windows/Linux/macOS

### Sanitización de Nombres
Los caracteres especiales en nombres de canal y título son reemplazados por guiones bajos (`_`):
- Caracteres removidos: `< > : " / \ | ? * y caracteres de control`
- Espacios múltiples colapsados a uno solo
- Longitud máxima: 150 caracteres por componente

### Ejemplo de Sanitización
- Original: `Tech Channel! / How to: Node.js <2025>`
- Sanitizado: `Tech_Channel_How_to_Node.js_2025`

## Integración con Servicios

### paths.service.js
Genera todas las rutas según la estructura definida:
- `generateVideoFolder()` - Carpeta del video
- `generateSingleMp3Path()` - Ruta para MP3 único
- `generateMp3PartPath()` - Ruta para partes de MP3
- `generateZipPath()` - Ruta para archivo ZIP
- `generateManifestPath()` - Ruta para manifest.json

### metadata.service.js
Gestiona el manifest.json:
- `createManifest()` - Crear manifest inicial
- `updateManifest()` - Actualizar manifest existente
- `readManifest()` - Leer manifest

### zip.service.js
Crea archivos ZIP:
- `createZip()` - Comprimir múltiples archivos
- `createZipFromFolder()` - Comprimir carpeta completa
- `validateZip()` - Validar integridad del ZIP

## Flujo de Trabajo

1. **Descarga del video** → Obtener metadata (título, canal, videoId)
2. **Crear carpeta** → `backend/output/{canal}-{titulo}-{videoId}/`
3. **Convertir a MP3** → Guardar con nombre apropiado
4. **Segmentar (opcional)** → Crear partes numeradas si es necesario
5. **Crear ZIP** → Comprimir todos los MP3
6. **Generar manifest** → Guardar metadatos del proceso
7. **Limpiar temporales** → Remover archivos de `backend/tmp/`

## Notas Técnicas

- Todos los MP3 se generan a 320kbps
- El ZIP usa compresión nivel 9 (máxima)
- El manifest.json está formateado (indentación de 2 espacios)
- Los archivos temporales se guardan en `backend/tmp/{jobId}/`
- La limpieza de temporales es automática al finalizar el proceso
