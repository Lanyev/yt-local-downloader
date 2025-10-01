/**
 * Servicio para empaquetado de archivos en formato ZIP
 * Maneja compresión de múltiples partes MP3
 * ZIP generado: {canal}-{titulo}-{videoId}.zip
 */

const archiver = require('archiver');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

/**
 * Crear archivo ZIP con múltiples archivos MP3
 * @param {Array<string>} filePaths - Array con rutas de archivos a incluir
 * @param {string} outputZipPath - Ruta del archivo ZIP de salida
 * @param {Function} progressCallback - Callback para reportar progreso
 * @returns {Promise<string>} Ruta del archivo ZIP creado
 */
async function createZip(filePaths, outputZipPath, progressCallback) {
  return new Promise((resolve, reject) => {
    // Crear directorio de salida si no existe
    const outputDir = path.dirname(outputZipPath);
    fs.mkdirSync(outputDir, { recursive: true });

    // Crear stream de escritura
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Nivel máximo de compresión
    });

    let totalBytes = 0;
    let processedBytes = 0;

    // Eventos del output stream
    output.on('close', () => {
      console.log(`ZIP creado: ${outputZipPath} (${archive.pointer()} bytes)`);
      resolve(outputZipPath);
    });

    output.on('error', (err) => {
      reject(err);
    });

    // Eventos del archiver
    archive.on('error', (err) => {
      reject(err);
    });

    archive.on('progress', (progress) => {
      if (progressCallback && totalBytes > 0) {
        const percentage = (progress.fs.processedBytes / totalBytes) * 100;
        progressCallback(percentage);
      }
    });

    // Conectar archive con output
    archive.pipe(output);

    // Calcular tamaño total
    Promise.all(filePaths.map(fp => fsPromises.stat(fp)))
      .then(stats => {
        totalBytes = stats.reduce((sum, stat) => sum + stat.size, 0);
      });

    // Agregar archivos al ZIP
    filePaths.forEach(filePath => {
      const filename = path.basename(filePath);
      archive.file(filePath, { name: filename });
    });

    // Finalizar archivo
    archive.finalize();
  });
}

/**
 * Crear archivo ZIP con estructura de directorios
 * @param {Object} fileStructure - Objeto con estructura {zipPath: fsPath}
 * @param {string} outputZipPath - Ruta del archivo ZIP de salida
 * @param {Function} progressCallback - Callback para reportar progreso
 * @returns {Promise<string>} Ruta del archivo ZIP creado
 */
async function createZipWithStructure(fileStructure, outputZipPath, progressCallback) {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(outputZipPath);
    fs.mkdirSync(outputDir, { recursive: true });

    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      console.log(`ZIP con estructura creado: ${outputZipPath}`);
      resolve(outputZipPath);
    });

    output.on('error', reject);
    archive.on('error', reject);

    archive.on('progress', (progress) => {
      if (progressCallback) {
        const percentage = (progress.entries.processed / progress.entries.total) * 100;
        progressCallback(percentage);
      }
    });

    archive.pipe(output);

    // Agregar archivos con estructura personalizada
    Object.entries(fileStructure).forEach(([zipPath, fsPath]) => {
      archive.file(fsPath, { name: zipPath });
    });

    archive.finalize();
  });
}

/**
 * Crear ZIP de carpeta completa del video (todas las partes MP3)
 * @param {string} videoFolder - Carpeta del video a comprimir
 * @param {string} outputZipPath - Ruta del archivo ZIP de salida
 * @param {Function} progressCallback - Callback para reportar progreso
 * @returns {Promise<string>} Ruta del archivo ZIP creado
 */
async function createZipFromFolder(videoFolder, outputZipPath, progressCallback) {
  return new Promise(async (resolve, reject) => {
    try {
      // Leer archivos de la carpeta (solo MP3)
      const files = await fsPromises.readdir(videoFolder);
      const mp3Files = files
        .filter(f => f.endsWith('.mp3'))
        .map(f => path.join(videoFolder, f));

      if (mp3Files.length === 0) {
        reject(new Error('No se encontraron archivos MP3 para comprimir'));
        return;
      }

      await createZip(mp3Files, outputZipPath, progressCallback);
      resolve(outputZipPath);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Calcular tamaño total de archivos a comprimir
 * @param {Array<string>} filePaths - Array con rutas de archivos
 * @returns {Promise<number>} Tamaño total en bytes
 */
async function calculateTotalSize(filePaths) {
  try {
    const stats = await Promise.all(
      filePaths.map(fp => fsPromises.stat(fp))
    );
    return stats.reduce((sum, stat) => sum + stat.size, 0);
  } catch (error) {
    console.error('Error calculando tamaño total:', error);
    return 0;
  }
}

/**
 * Validar integridad de archivo ZIP
 * @param {string} zipPath - Ruta del archivo ZIP
 * @returns {Promise<boolean>} true si el ZIP es válido
 */
async function validateZip(zipPath) {
  try {
    // Verificar que el archivo existe
    await fsPromises.access(zipPath);
    
    // Verificar que tiene tamaño mayor a 0
    const stats = await fsPromises.stat(zipPath);
    if (stats.size === 0) {
      return false;
    }

    // TODO: Implementar validación más robusta usando decompress o similar
    console.log(`ZIP validado: ${zipPath} (${stats.size} bytes)`);
    return true;
  } catch (error) {
    console.error('Error validando ZIP:', error);
    return false;
  }
}

module.exports = {
  createZip,
  createZipWithStructure,
  createZipFromFolder,
  calculateTotalSize,
  validateZip
};
