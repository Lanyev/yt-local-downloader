/**
 * Archivo principal de la aplicación Express
 * Configura el servidor, middlewares y rutas principales
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5050;

// Configurar middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configurar rutas API
app.use('/api', routes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Manejar rutas no encontradas para SPA
app.get('*', (req, res) => {
  // Si es una ruta API, devolver 404 JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  // Para otras rutas, servir index.html (SPA)
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
  console.log(`📁 Directorio de salida: ${process.env.OUTPUT_ROOT || './backend/output'}`);
  console.log(`🔧 Concurrencia máxima: ${process.env.CONCURRENCY || 3}`);
});

module.exports = app;