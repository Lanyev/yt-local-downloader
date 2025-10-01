/**
 * Controlador de trabajos (jobs) para gestión y monitoreo
 * Maneja las peticiones HTTP para consultar estado, listar y cancelar trabajos
 */

// TODO: Importar servicios necesarios
// const jobManager = require('../services/jobManager');

class JobsController {

  /**
   * GET /api/status/:jobId
   * Consulta el estado actual de un trabajo de procesamiento
   * 
   * TODO: Buscar job por ID usando jobManager
   * TODO: Retornar progreso detallado por etapas
   * TODO: Incluir información de archivos generados
   * TODO: Manejar caso de job no encontrado
   */
  async getStatus(req, res) {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({
          error: 'Se requiere jobId en la URL'
        });
      }
      
      // TODO: Buscar job en jobManager
      // TODO: Retornar información completa del job
      // TODO: Manejar job no encontrado
      
      res.status(501).json({
        message: 'TODO: Implementar getStatus',
        jobId
      });
      
    } catch (error) {
      console.error('Error en getStatus:', error);
      res.status(500).json({
        error: 'Error interno al consultar estado',
        details: error.message
      });
    }
  }



  /**
   * GET /api/jobs
   * Lista todos los trabajos con filtros opcionales
   * 
   * TODO: Obtener lista de jobs desde jobManager
   * TODO: Aplicar filtros por estado si se especifican
   * TODO: Paginar resultados si hay muchos jobs
   * TODO: Ordenar por fecha de creación (más recientes primero)
   */
  async listJobs(req, res) {
    try {
      const { status, limit = 50, offset = 0 } = req.query;
      
      // TODO: Obtener jobs desde jobManager con filtros
      // TODO: Aplicar paginación
      // TODO: Formatear respuesta con metadata de paginación
      
      res.status(501).json({
        message: 'TODO: Implementar listJobs',
        filters: { status, limit, offset }
      });
      
    } catch (error) {
      console.error('Error en listJobs:', error);
      res.status(500).json({
        error: 'Error interno al listar trabajos',
        details: error.message
      });
    }
  }

  /**
   * DELETE /api/job/:jobId
   * Cancela un trabajo activo y limpia sus recursos
   * 
   * TODO: Validar que el job existe
   * TODO: Verificar que el job se puede cancelar (está activo)
   * TODO: Usar jobManager para cancelar el job
   * TODO: Limpiar archivos temporales asociados
   * TODO: Actualizar estado del job
   */
  async cancelJob(req, res) {
    try {
      const { jobId } = req.params;
      
      if (!jobId) {
        return res.status(400).json({
          error: 'Se requiere jobId en la URL'
        });
      }
      
      // TODO: Verificar que el job existe
      // TODO: Verificar que se puede cancelar
      // TODO: Cancelar usando jobManager
      // TODO: Retornar confirmación de cancelación
      
      res.status(501).json({
        message: 'TODO: Implementar cancelJob',
        jobId
      });
      
    } catch (error) {
      console.error('Error en cancelJob:', error);
      res.status(500).json({
        error: 'Error interno al cancelar trabajo',
        details: error.message
      });
    }
  }
}

module.exports = new JobsController();