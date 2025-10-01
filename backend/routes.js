/**
 * Definición de rutas API para la aplicación
 * Maneja endpoints para descarga, procesamiento y monitoreo
 */

const express = require('express');
const router = express.Router();

// Importar controladores
const downloadController = require('./controllers/downloadController');
const jobsController = require('./controllers/jobs.controller');

// Rutas principales de descarga (según README)
router.post('/download', downloadController.startDownload);
router.get('/status/:jobId', jobsController.getStatus);
router.get('/download/:jobId', downloadController.downloadFiles);

// Rutas adicionales de gestión de trabajos
router.get('/jobs', jobsController.listJobs);
router.delete('/job/:jobId', jobsController.cancelJob);

// Ruta de salud del sistema
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

module.exports = router;