/**
 * Servicio para gestión de archivos y organización de salida
 * Maneja creación de carpetas, archivos ZIP y limpieza
 * Estructura: backend/output/{canal}-{titulo}-{videoId}/
 */

const fs = require('fs').promises;
const path = require('path');
const pathsService = require('./paths.service');
const zipService = require('./zip.service');
const metadataService = require('./metadata.service');

class FileService {
  constructor() {
    this.outputRoot = process.env.OUTPUT_ROOT || './backend/output';
    this.tmpRoot = process.env.TMP_ROOT || './backend/tmp';
  }

  /**
   * Crea carpeta organizada para un video específico
   * Formato: {canal}-{titulo}-{videoId}
   * @param {Object} videoInfo - Información del video (channel, title, videoId)
   * @returns {Promise<string>} Ruta de la carpeta creada
   */
  async createVideoFolder(videoInfo) {
    try {
      const videoFolder = pathsService.generateVideoFolder(this.outputRoot, videoInfo);
      await pathsService.ensureDirectory(videoFolder);
      console.log(`Carpeta de video creada: ${videoFolder}`);
      return videoFolder;
    } catch (error) {
      console.error('Error creando carpeta de video:', error);
      throw error;
    }
  }

  /**
   * Organiza archivos procesados en la estructura final
   * @param {string} videoFolder - Carpeta destino del video
   * @param {Object} videoInfo - Información del video
   * @param {Array<string>} mp3Files - Lista de archivos MP3 procesados
   * @param {Object} processInfo - Información del proceso
   * @returns {Promise<Object>} Resultado de la organización
   */
  async organizeVideoFiles(videoFolder, videoInfo, mp3Files, processInfo) {
    try {
      const result = {
        videoFolder,
        mp3Files: [],
        zipFile: null,
        manifestFile: null
      };

      // Mover archivos MP3 a la carpeta del video
      for (const mp3File of mp3Files) {
        const filename = path.basename(mp3File);
        const destPath = path.join(videoFolder, filename);
        
        await fs.copyFile(mp3File, destPath);
        result.mp3Files.push(destPath);
        console.log(`MP3 organizado: ${destPath}`);
      }

      // Crear archivo ZIP si hay múltiples partes
      if (mp3Files.length > 1 || processInfo.createZip) {
        const zipPath = pathsService.generateZipPath(videoFolder, videoInfo);
        await zipService.createZip(result.mp3Files, zipPath);
        result.zipFile = zipPath;
        console.log(`ZIP creado: ${zipPath}`);
      }

      // Crear manifest.json
      const manifestPath = pathsService.generateManifestPath(videoFolder);
      const manifestData = {
        videoId: videoInfo.videoId || videoInfo.id,
        title: videoInfo.title,
        channel: videoInfo.channel,
        channelId: videoInfo.channelId,
        duration: videoInfo.duration,
        url: videoInfo.url,
        thumbnailUrl: videoInfo.thumbnailUrl,
        description: videoInfo.description,
        downloadedAt: processInfo.downloadedAt,
        convertedAt: processInfo.convertedAt,
        audioFormat: 'mp3',
        audioBitrate: '320k',
        segmented: mp3Files.length > 1,
        totalParts: mp3Files.length,
        segmentDuration: processInfo.segmentDuration,
        files: result.mp3Files.map(f => ({
          name: path.basename(f),
          size: 0, // Se actualizará después
          duration: processInfo.segmentDuration || videoInfo.duration
        })),
        errors: processInfo.errors || []
      };

      await metadataService.createManifest(manifestPath, manifestData);
      result.manifestFile = manifestPath;

      console.log(`Archivos organizados en: ${videoFolder}`);
      return result;
    } catch (error) {
      console.error('Error organizando archivos:', error);
      throw error;
    }
  }

  /**
   * Obtiene información estadística de archivos generados
   * @param {string} folderPath - Ruta de la carpeta
   * @returns {Promise<Object>} Estadísticas de archivos
   */
  async getFileStats(folderPath) {
    try {
      const files = await fs.readdir(folderPath);
      let totalSize = 0;
      let audioFiles = 0;
      let videoFiles = 0;

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);
        
        if (file.endsWith('.mp3')) {
          audioFiles++;
          totalSize += stats.size;
        } else if (file.endsWith('.mp4')) {
          videoFiles++;
          totalSize += stats.size;
        }
      }

      return {
        totalSize,
        audioFiles,
        videoFiles,
        totalDuration: 0 // Se calcula con ffprobe si es necesario
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalSize: 0,
        audioFiles: 0,
        videoFiles: 0,
        totalDuration: 0
      };
    }
  }

  /**
   * Limpia archivos antiguos según política de retención
   * @param {number} maxAgeDays - Edad máxima en días
   * @returns {Promise<Object>} Resultado de la limpieza
   */
  async cleanupOldFiles(maxAgeDays = 7) {
    try {
      const now = Date.now();
      const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
      let deletedFolders = 0;
      let freedSpace = 0;

      const folders = await fs.readdir(this.outputRoot);

      for (const folder of folders) {
        const folderPath = path.join(this.outputRoot, folder);
        const stats = await fs.stat(folderPath);

        if (stats.isDirectory() && (now - stats.mtimeMs) > maxAge) {
          // Calcular tamaño antes de eliminar
          const folderStats = await this.getFileStats(folderPath);
          freedSpace += folderStats.totalSize;

          // Eliminar carpeta
          await fs.rm(folderPath, { recursive: true, force: true });
          deletedFolders++;
          console.log(`Carpeta antigua eliminada: ${folder}`);
        }
      }

      return {
        deletedFolders,
        freedSpace,
        maxAgeDays
      };
    } catch (error) {
      console.error('Error limpiando archivos antiguos:', error);
      throw error;
    }
  }

  /**
   * Verifica disponibilidad de espacio en disco
   * @param {number} estimatedSize - Tamaño estimado en bytes
   * @returns {Promise<boolean>} true si hay espacio suficiente
   */
  async checkDiskSpace(estimatedSize) {
    try {
      // TODO: Implementar verificación real de espacio en disco
      // Por ahora, asumimos que hay espacio suficiente
      console.log(`Verificando espacio en disco para ${estimatedSize} bytes`);
      return true;
    } catch (error) {
      console.error('Error verificando espacio en disco:', error);
      return false;
    }
  }

  /**
   * Crea directorio temporal para un job
   * @param {string} jobId - ID del trabajo
   * @returns {Promise<string>} Ruta del directorio temporal
   */
  async createTempDirectory(jobId) {
    const tempDir = path.join(this.tmpRoot, jobId);
    await pathsService.ensureDirectory(tempDir);
    return tempDir;
  }

  /**
   * Limpia directorio temporal de un job
   * @param {string} jobId - ID del trabajo
   * @returns {Promise<boolean>} true si se limpió correctamente
   */
  async cleanupTempDirectory(jobId) {
    return await pathsService.cleanupTempFiles(this.tmpRoot, jobId);
  }
}

module.exports = new FileService();