/**
 * Servicio para manejo de rutas y nombres de archivo
 * Sanitización y generación de rutas seguras
 * Estructura: backend/output/{canal}-{titulo}-{videoId}/
 */

const path = require('path');
const fs = require('fs').promises;

/**
 * Sanitizar nombre de archivo removiendo caracteres no permitidos
 * @param {string} filename - Nombre de archivo a sanitizar
 * @param {string} replacement - Carácter de reemplazo (default: '_')
 * @returns {string} Nombre de archivo sanitizado
 */
function sanitizeFilename(filename, replacement = '_') {
  if (!filename) return 'unnamed';
  
  // Remover caracteres especiales: <>:"/\|?*
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1f]/g, replacement);
  
  // Remover espacios al inicio y final
  sanitized = sanitized.trim();
  
  // Reemplazar múltiples espacios/guiones por uno solo
  sanitized = sanitized.replace(/\s+/g, ' ').replace(/-+/g, '-');
  
  // Limitar longitud máxima del nombre (150 caracteres)
  if (sanitized.length > 150) {
    sanitized = sanitized.substring(0, 150);
  }
  
  return sanitized || 'unnamed';
}

/**
 * Generar nombre base para carpeta del video: {canal}-{titulo}-{videoId}
 * @param {Object} videoInfo - Información del video (channel, title, videoId)
 * @returns {string} Nombre base sanitizado
 */
function generateVideoBaseName(videoInfo) {
  const channel = sanitizeFilename(videoInfo.channel || 'unknown-channel');
  const title = sanitizeFilename(videoInfo.title || 'unknown-title');
  const videoId = videoInfo.videoId || videoInfo.id || 'unknown-id';
  
  return `${channel}-${title}-${videoId}`;
}

/**
 * Generar carpeta de salida para un video específico
 * @param {string} outputRoot - Directorio raíz de salida
 * @param {Object} videoInfo - Información del video
 * @returns {string} Ruta completa de la carpeta del video
 */
function generateVideoFolder(outputRoot, videoInfo) {
  const baseName = generateVideoBaseName(videoInfo);
  return path.join(outputRoot, baseName);
}

/**
 * Generar ruta para MP3 único (sin partes)
 * @param {string} videoFolder - Carpeta del video
 * @param {Object} videoInfo - Información del video
 * @returns {string} Ruta completa para el archivo MP3
 */
function generateSingleMp3Path(videoFolder, videoInfo) {
  const baseName = generateVideoBaseName(videoInfo);
  return path.join(videoFolder, `${baseName}.mp3`);
}

/**
 * Generar ruta para parte de MP3
 * @param {string} videoFolder - Carpeta del video
 * @param {Object} videoInfo - Información del video
 * @param {number} partNumber - Número de parte
 * @param {number} totalParts - Total de partes
 * @returns {string} Ruta completa para la parte del MP3
 */
function generateMp3PartPath(videoFolder, videoInfo, partNumber, totalParts) {
  const baseName = generateVideoBaseName(videoInfo);
  const partStr = String(partNumber).padStart(3, '0');
  return path.join(videoFolder, `${baseName}__part-${partStr}.mp3`);
}

/**
 * Generar ruta para archivo ZIP
 * @param {string} videoFolder - Carpeta del video
 * @param {Object} videoInfo - Información del video
 * @returns {string} Ruta completa para el archivo ZIP
 */
function generateZipPath(videoFolder, videoInfo) {
  const baseName = generateVideoBaseName(videoInfo);
  return path.join(videoFolder, `${baseName}.zip`);
}

/**
 * Generar ruta para manifest.json
 * @param {string} videoFolder - Carpeta del video
 * @returns {string} Ruta completa para manifest.json
 */
function generateManifestPath(videoFolder) {
  return path.join(videoFolder, 'manifest.json');
}

/**
 * Generar nombre único para archivo si ya existe
 * @param {string} filePath - Ruta completa del archivo
 * @returns {Promise<string>} Nombre de archivo único
 */
async function generateUniqueFilename(filePath) {
  try {
    await fs.access(filePath);
    // El archivo existe, generar nombre único
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    
    let counter = 1;
    let newPath = filePath;
    
    while (true) {
      newPath = path.join(dir, `${base}_(${counter})${ext}`);
      try {
        await fs.access(newPath);
        counter++;
      } catch {
        return newPath;
      }
    }
  } catch {
    // El archivo no existe, retornar el mismo
    return filePath;
  }
}

/**
 * Generar rutas para archivos temporales
 * @param {string} tmpDir - Directorio temporal
 * @param {string} jobId - ID del trabajo
 * @param {string} filename - Nombre base del archivo
 * @returns {string} Ruta para archivo temporal
 */
function generateTempPath(tmpDir, jobId, filename) {
  return path.join(tmpDir, jobId, filename);
}

/**
 * Crear estructura de directorios si no existe
 * @param {string} dirPath - Ruta del directorio a crear
 * @returns {Promise<boolean>} true si se creó o ya existía
 */
async function ensureDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Error creando directorio ${dirPath}:`, error);
    return false;
  }
}

/**
 * Limpiar archivos temporales de un trabajo
 * @param {string} tmpDir - Directorio temporal base
 * @param {string} jobId - ID del trabajo a limpiar
 * @returns {Promise<boolean>} true si se limpió correctamente
 */
async function cleanupTempFiles(tmpDir, jobId) {
  try {
    const jobTmpDir = path.join(tmpDir, jobId);
    await fs.rm(jobTmpDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error(`Error limpiando archivos temporales del job ${jobId}:`, error);
    return false;
  }
}

/**
 * Obtener extensión de archivo desde nombre
 * @param {string} filename - Nombre de archivo
 * @returns {string} Extensión (sin punto)
 */
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase().replace('.', '');
}

/**
 * Obtener nombre base sin extensión
 * @param {string} filename - Nombre de archivo
 * @returns {string} Nombre base sin extensión
 */
function getBasename(filename) {
  return path.basename(filename, path.extname(filename));
}

module.exports = {
  sanitizeFilename,
  generateVideoBaseName,
  generateVideoFolder,
  generateSingleMp3Path,
  generateMp3PartPath,
  generateZipPath,
  generateManifestPath,
  generateUniqueFilename,
  generateTempPath,
  ensureDirectory,
  cleanupTempFiles,
  getFileExtension,
  getBasename
};
