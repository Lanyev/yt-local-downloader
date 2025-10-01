/**
 * Servicio para manejo de estados y progreso de trabajos
 * Estados: queued, downloading, converting-mp3, splitting, tagging, zipping, done, error
 */

// TODO: Importar dependencias necesarias (eventos, etc.)

/**
 * Estados posibles de un trabajo
 */
const JOB_STATES = {
  QUEUED: 'queued',
  DOWNLOADING: 'downloading',
  CONVERTING_MP3: 'converting-mp3',
  SPLITTING: 'splitting',
  TAGGING: 'tagging',
  ZIPPING: 'zipping',
  DONE: 'done',
  ERROR: 'error'
};

/**
 * TODO: Crear un nuevo registro de progreso para un trabajo
 * @param {string} jobId - ID único del trabajo
 * @param {Object} initialData - Datos iniciales del trabajo
 * @returns {Object} Objeto de progreso inicializado
 */
function createProgressTracker(jobId, initialData = {}) {
  // TODO: Crear objeto de progreso con estado inicial 'queued'
  // TODO: Incluir: jobId, state, progress (0-100), currentStep, message, startTime, etc.
  // TODO: Almacenar en estructura de datos (Map o similar)
  // TODO: Retornar objeto de progreso
}

/**
 * TODO: Actualizar estado de un trabajo
 * @param {string} jobId - ID del trabajo
 * @param {string} newState - Nuevo estado del trabajo
 * @param {Object} additionalData - Datos adicionales a actualizar
 * @returns {Object} Objeto de progreso actualizado
 */
function updateJobState(jobId, newState, additionalData = {}) {
  // TODO: Validar que el estado sea válido
  // TODO: Obtener progreso actual del trabajo
  // TODO: Actualizar estado y datos adicionales
  // TODO: Actualizar timestamp de última modificación
  // TODO: Emitir evento de actualización
  // TODO: Retornar progreso actualizado
}

/**
 * TODO: Actualizar progreso porcentual de un trabajo
 * @param {string} jobId - ID del trabajo
 * @param {number} progress - Progreso (0-100)
 * @param {string} message - Mensaje descriptivo opcional
 * @returns {Object} Objeto de progreso actualizado
 */
function updateJobProgress(jobId, progress, message = '') {
  // TODO: Validar rango de progreso (0-100)
  // TODO: Obtener progreso actual
  // TODO: Actualizar porcentaje y mensaje
  // TODO: Emitir evento de actualización
  // TODO: Retornar progreso actualizado
}

/**
 * TODO: Obtener estado actual de un trabajo
 * @param {string} jobId - ID del trabajo
 * @returns {Object|null} Objeto de progreso o null si no existe
 */
function getJobProgress(jobId) {
  // TODO: Buscar trabajo en estructura de datos
  // TODO: Retornar copia del objeto de progreso
}

/**
 * TODO: Obtener todos los trabajos en progreso
 * @returns {Array<Object>} Array con todos los trabajos
 */
function getAllJobs() {
  // TODO: Obtener todos los trabajos de la estructura
  // TODO: Retornar array con copias de objetos de progreso
}

/**
 * TODO: Marcar trabajo como completado
 * @param {string} jobId - ID del trabajo
 * @param {Object} result - Resultado final del trabajo
 * @returns {Object} Objeto de progreso actualizado
 */
function markJobAsComplete(jobId, result = {}) {
  // TODO: Actualizar estado a 'done'
  // TODO: Establecer progreso a 100
  // TODO: Agregar información de resultado
  // TODO: Registrar tiempo de finalización
  // TODO: Emitir evento de completado
  // TODO: Retornar progreso actualizado
}

/**
 * TODO: Marcar trabajo como fallido
 * @param {string} jobId - ID del trabajo
 * @param {Error|string} error - Error que causó la falla
 * @returns {Object} Objeto de progreso actualizado
 */
function markJobAsError(jobId, error) {
  // TODO: Actualizar estado a 'error'
  // TODO: Registrar información del error
  // TODO: Registrar tiempo de fallo
  // TODO: Emitir evento de error
  // TODO: Retornar progreso actualizado
}

/**
 * TODO: Limpiar trabajo completado del registro
 * @param {string} jobId - ID del trabajo
 * @returns {boolean} true si se eliminó correctamente
 */
function removeJob(jobId) {
  // TODO: Verificar que trabajo existe
  // TODO: Eliminar de estructura de datos
  // TODO: Retornar resultado
}

/**
 * TODO: Limpiar trabajos antiguos completados/fallidos
 * @param {number} maxAgeMinutes - Edad máxima en minutos
 * @returns {number} Cantidad de trabajos eliminados
 */
function cleanupOldJobs(maxAgeMinutes = 60) {
  // TODO: Obtener timestamp límite
  // TODO: Filtrar trabajos con estado 'done' o 'error' más antiguos que límite
  // TODO: Eliminar trabajos filtrados
  // TODO: Retornar cantidad eliminada
}

/**
 * TODO: Registrar listener para eventos de progreso
 * @param {string} event - Tipo de evento ('update', 'complete', 'error')
 * @param {Function} callback - Función a ejecutar
 * @returns {Function} Función para remover listener
 */
function onProgressEvent(event, callback) {
  // TODO: Registrar callback en event emitter
  // TODO: Retornar función para remover listener
}

/**
 * TODO: Obtener resumen de estados de todos los trabajos
 * @returns {Object} Objeto con conteo por estado
 */
function getJobsSummary() {
  // TODO: Contar trabajos por cada estado
  // TODO: Retornar objeto con conteos: {queued: 0, downloading: 1, ...}
}

module.exports = {
  JOB_STATES,
  createProgressTracker,
  updateJobState,
  updateJobProgress,
  getJobProgress,
  getAllJobs,
  markJobAsComplete,
  markJobAsError,
  removeJob,
  cleanupOldJobs,
  onProgressEvent,
  getJobsSummary
};
