/**
 * Servicio para interactuar con yt-dlp
 * Maneja la obtención de metadatos y descarga de videos/audio
 */

// TODO: Importar dependencias necesarias (child_process, path, etc.)

/**
 * TODO: Obtener metadatos de un video de YouTube
 * @param {string} url - URL del video de YouTube
 * @returns {Promise<Object>} Metadatos del video (título, duración, thumbnail, etc.)
 */
async function getVideoMetadata(url) {
  // TODO: Ejecutar yt-dlp con flag --dump-json para obtener metadatos
  // TODO: Parsear y retornar información relevante
}

/**
 * TODO: Descargar audio de un video de YouTube
 * @param {string} url - URL del video de YouTube
 * @param {string} outputPath - Ruta donde guardar el archivo
 * @param {Function} progressCallback - Callback para reportar progreso
 * @returns {Promise<string>} Ruta del archivo descargado
 */
async function downloadAudio(url, outputPath, progressCallback) {
  // TODO: Ejecutar yt-dlp con opciones para descargar mejor calidad de audio
  // TODO: Usar formato bestaudio/best
  // TODO: Reportar progreso de descarga mediante callback
  // TODO: Retornar ruta del archivo descargado
}

/**
 * TODO: Verificar si yt-dlp está instalado y disponible
 * @returns {Promise<boolean>} true si está disponible
 */
async function checkYtDlpAvailability() {
  // TODO: Ejecutar comando para verificar versión de yt-dlp
  // TODO: Retornar true si está disponible, false en caso contrario
}

module.exports = {
  getVideoMetadata,
  downloadAudio,
  checkYtDlpAvailability
};
