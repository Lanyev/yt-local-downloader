/**
 * Controlador principal para manejo de descargas
 * Gestiona las peticiones HTTP relacionadas con descarga y procesamiento
 */

const path = require('path');
const fs = require('fs');
// TODO: Descomentar cuando estén implementados los servicios
// const downloadService = require('../services/downloadService');
// const jobManager = require('../services/jobManager');

class DownloadController {
  /**
   * POST /api/download
   * Inicia el proceso de descarga para una o múltiples URLs
   */
  async startDownload(req, res) {
    try {
      const { urls, config = {} } = req.body;
      
      // Validar entrada
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({
          error: 'Se requiere al menos una URL en el array "urls"'
        });
      }
      
      // Validar que sean URLs de YouTube
      const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
      const invalidUrls = urls.filter(url => !youtubeRegex.test(url));
      
      if (invalidUrls.length > 0) {
        return res.status(400).json({
          error: 'URLs inválidas detectadas',
          invalidUrls
        });
      }
      
      // Validar configuración
      const validFormats = ['mp3', 'mp4', 'both'];
      const validSegments = [0, 1, 5, 10, 15, 20];
      
      if (config.format && !validFormats.includes(config.format)) {
        return res.status(400).json({
          error: 'Formato inválido. Valores permitidos: mp3, mp4, both'
        });
      }
      
      if (config.segmentMinutes !== undefined && !validSegments.includes(config.segmentMinutes)) {
        return res.status(400).json({
          error: 'Segmentación inválida. Valores permitidos: 0, 1, 5, 10, 15, 20'
        });
      }
      
      // TODO: Implementar creación de job y procesamiento
      // const jobId = await jobManager.createJob(urls, config);
      // await downloadService.startDownload(jobId);
      
      // Respuesta temporal hasta implementar los servicios
      const jobId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      res.status(202).json({
        jobId,
        status: 'pending',
        message: 'Descarga iniciada',
        urls: urls.length,
        config
      });
      
    } catch (error) {
      console.error('Error en startDownload:', error);
      res.status(500).json({
        error: 'Error interno al iniciar descarga',
        details: error.message
      });
    }
  }

  /**
   * GET /api/download/:jobId
   * Descarga archivos procesados (individual o ZIP)
   */
  async downloadFiles(req, res) {
    try {
      const { jobId } = req.params;
      const { type = 'zip' } = req.query;
      
      if (!jobId) {
        return res.status(400).json({
          error: 'Se requiere jobId en la URL'
        });
      }
      
      // TODO: Implementar lógica de descarga de archivos
      // const job = await jobManager.getJob(jobId);
      // if (!job || job.status !== 'completed') {
      //   return res.status(404).json({ error: 'Job no encontrado o no completado' });
      // }
      
      // const filePath = await fileService.getJobFiles(jobId, type);
      // res.download(filePath);
      
      // Respuesta temporal
      res.status(501).json({
        message: 'TODO: Implementar descarga de archivos',
        jobId,
        type
      });
      
    } catch (error) {
      console.error('Error en downloadFiles:', error);
      res.status(500).json({
        error: 'Error interno al descargar archivos',
        details: error.message
      });
    }
  }
}

module.exports = new DownloadController();