/**
 * JavaScript principal para la interfaz de usuario
 * Maneja interacción con formularios, progreso y comunicación con API
 * 
 * TODO: Implementar funcionalidades principales:
 * - Validación de formulario de descarga
 * - Comunicación con API backend
 * - Monitoreo de progreso en tiempo real
 * - Gestión de lista de trabajos
 * - Descarga de archivos procesados
 * - Notificaciones y feedback visual
 */

class YouTubeDownloaderApp {
    constructor() {
        this.apiBase = '/api'; // TODO: Configurar según entorno
        this.currentJob = null;
        this.progressInterval = null;
        this.init();
    }

    /**
     * Inicializa la aplicación y event listeners
     * TODO: Configurar event listeners para formularios
     * TODO: Cargar lista inicial de trabajos
     * TODO: Configurar actualización periódica de estado
     */
    init() {
        console.log('TODO: Inicializando aplicación YouTube Downloader');
        
        // TODO: Event listeners para formulario
        this.setupFormListeners();
        
        // TODO: Event listeners para control de trabajos
        this.setupJobControlListeners();
        
        // TODO: Event listeners para filtros de trabajos
        this.setupJobFilterListeners();
        
        // TODO: Cargar trabajos existentes
        this.loadJobs();
        
        // TODO: Actualizar estado cada 2 segundos si hay job activo
        this.startPeriodicUpdate();
    }

    /**
     * Configura event listeners para el formulario de descarga
     */
    setupFormListeners() {
        const startBtn = document.getElementById('start-download');
        const urlsTextarea = document.getElementById('urls');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startDownload();
            });
        }
        
        if (urlsTextarea) {
            urlsTextarea.addEventListener('input', () => {
                this.validateUrls();
            });
        }
        
        console.log('✅ Event listeners del formulario configurados');
    }

    /**
     * Configura listeners para control de trabajos
     * TODO: Cancelar trabajo activo
     * TODO: Descargar archivos completados
     * TODO: Ver detalles de trabajo
     */
    setupJobControlListeners() {
        // TODO: Implementar listeners de control
        console.log('TODO: Configurar event listeners de control de trabajos');
    }

    /**
     * Configura listeners para filtros de lista de trabajos
     * TODO: Filtrar por estado (todos, activos, completados, fallidos)
     * TODO: Actualizar vista según filtro seleccionado
     */
    setupJobFilterListeners() {
        // TODO: Implementar listeners de filtros
        console.log('TODO: Configurar event listeners de filtros');
    }

    /**
     * Inicia una nueva descarga
     */
    async startDownload() {
        try {
            console.log('🚀 Iniciando proceso de descarga...');
            
            // Recopilar datos del formulario
            const formData = this.getFormData();
            console.log('📝 Datos del formulario:', formData);
            
            // Validar datos
            if (!this.validateFormData(formData)) {
                return;
            }
            
            // Mostrar feedback visual
            const startBtn = document.getElementById('start-download');
            if (startBtn) {
                startBtn.disabled = true;
                startBtn.innerHTML = '⏳ Procesando...';
            }
            
            // TODO: Enviar petición al backend (por ahora simulamos)
            this.showSuccess('Descarga iniciada correctamente (modo demo)');
            
            // Simular jobId y mostrar monitor de progreso
            const jobId = `demo-${Date.now()}`;
            this.startJobMonitoring(jobId);
            
            // Simular progreso
            this.simulateProgress();
            
        } catch (error) {
            this.showError('Error al iniciar descarga: ' + error.message);
        }
    }

    /**
     * Recopila datos del formulario de descarga
     * TODO: Obtener URLs y limpiar líneas vacías
     * TODO: Obtener formato seleccionado
     * TODO: Obtener configuración de segmentación
     */
    getFormData() {
        // TODO: Implementar recopilación de datos
        const urls = document.getElementById('urls').value
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);
            
        const format = document.querySelector('input[name="format"]:checked').value;
        const segmentMinutes = parseInt(document.getElementById('segment').value);
        
        return {
            urls,
            config: {
                format,
                segmentMinutes,
                quality: '320'
            }
        };
    }

    /**
     * Valida datos del formulario
     * TODO: Verificar que hay al menos una URL
     * TODO: Validar formato de URLs de YouTube
     * TODO: Verificar parámetros de configuración
     */
    validateFormData(formData) {
        // TODO: Implementar validación completa
        if (formData.urls.length === 0) {
            this.showError('Debe ingresar al menos una URL de YouTube');
            return false;
        }
        
        // TODO: Validar cada URL
        for (const url of formData.urls) {
            if (!this.isValidYouTubeUrl(url)) {
                this.showError(`URL no válida: ${url}`);
                return false;
            }
        }
        
        return true;
    }

    /**
     * Valida si una URL es de YouTube
     * TODO: Verificar dominios youtube.com y youtu.be
     * TODO: Soportar diferentes formatos de URL
     */
    isValidYouTubeUrl(url) {
        // TODO: Implementar validación de URL de YouTube
        const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    }

    /**
     * Inicia monitoreo de progreso para un trabajo
     */
    startJobMonitoring(jobId) {
        this.currentJob = jobId;
        
        const progressMonitor = document.querySelector('.progress-monitor');
        const currentJobId = document.getElementById('current-job-id');
        
        if (progressMonitor) {
            progressMonitor.style.display = 'block';
        }
        
        if (currentJobId) {
            currentJobId.textContent = jobId;
        }
        
        // Configurar botón de cancelar
        const cancelBtn = document.getElementById('cancel-job');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                this.cancelCurrentJob();
            };
        }
        
        console.log(`🔍 Iniciando monitoreo del job ${jobId}`);
    }

    /**
     * Cancela el trabajo actual
     */
    cancelCurrentJob() {
        if (!this.currentJob) return;
        
        if (confirm('¿Estás seguro de que quieres cancelar este trabajo?')) {
            console.log(`❌ Cancelando job ${this.currentJob}`);
            this.showSuccess(`Trabajo ${this.currentJob} cancelado`);
            
            // Ocultar monitor de progreso
            const progressMonitor = document.querySelector('.progress-monitor');
            if (progressMonitor) {
                progressMonitor.style.display = 'none';
            }
            
            // Resetear estado
            this.currentJob = null;
            
            // Restaurar botón de inicio
            const startBtn = document.getElementById('start-download');
            if (startBtn) {
                startBtn.disabled = false;
                startBtn.innerHTML = '🚀 Iniciar Descarga';
            }
        }
    }

    /**
     * Inicia polling periódico del estado del trabajo
     * TODO: Consultar estado cada 2 segundos
     * TODO: Actualizar barra de progreso
     * TODO: Detectar finalización o errores
     */
    startProgressPolling() {
        // TODO: Implementar polling de progreso
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(async () => {
            // TODO: Consultar estado del trabajo actual
            await this.updateJobProgress();
        }, 2000);
        
        console.log('TODO: Iniciar polling de progreso');
    }

    /**
     * Actualiza información de progreso del trabajo actual
     * TODO: Consultar API /status/:jobId
     * TODO: Actualizar barra de progreso visual
     * TODO: Actualizar información de etapa actual
     * TODO: Detectar finalización y mostrar botón de descarga
     */
    async updateJobProgress() {
        // TODO: Implementar actualización de progreso
        if (!this.currentJob) return;
        
        try {
            // TODO: Consultar estado del trabajo
            // const jobStatus = await this.apiRequest('GET', `/status/${this.currentJob}`);
            
            // TODO: Actualizar UI con información de progreso
            // this.updateProgressUI(jobStatus);
            
            console.log(`TODO: Actualizar progreso del job ${this.currentJob}`);
            
        } catch (error) {
            console.error('Error actualizando progreso:', error);
        }
    }

    /**
     * Actualiza elementos visuales de progreso
     */
    updateProgressUI(jobStatus) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const currentStage = document.getElementById('current-stage');
        const jobStatusEl = document.getElementById('job-status');
        const processedCount = document.getElementById('processed-count');
        const totalCount = document.getElementById('total-count');
        
        if (jobStatus.progress) {
            const { percentage, stage, processedUrls, totalUrls } = jobStatus.progress;
            
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${percentage}%`;
            }
            
            if (currentStage) {
                currentStage.textContent = stage;
            }
            
            if (processedCount) {
                processedCount.textContent = processedUrls || 0;
            }
            
            if (totalCount) {
                totalCount.textContent = totalUrls || 0;
            }
        }
        
        if (jobStatusEl) {
            jobStatusEl.textContent = jobStatus.status;
            jobStatusEl.className = `status-${jobStatus.status}`;
        }
    }

    /**
     * Carga y muestra lista de trabajos
     * TODO: Consultar API /jobs
     * TODO: Renderizar trabajos en lista
     * TODO: Aplicar filtros activos
     */
    async loadJobs() {
        // TODO: Implementar carga de trabajos
        try {
            // TODO: Consultar lista de trabajos
            // const jobs = await this.apiRequest('GET', '/jobs');
            
            // TODO: Renderizar lista
            // this.renderJobsList(jobs);
            
            console.log('TODO: Cargar lista de trabajos');
            
        } catch (error) {
            console.error('Error cargando trabajos:', error);
        }
    }

    /**
     * Renderiza lista de trabajos en el DOM
     * TODO: Crear elementos HTML para cada trabajo
     * TODO: Mostrar información relevante (estado, progreso, archivos)
     * TODO: Añadir botones de acción (cancelar, descargar, detalles)
     */
    renderJobsList(jobs) {
        // TODO: Implementar renderizado de lista
        const container = document.getElementById('jobs-container');
        
        if (jobs.length === 0) {
            container.innerHTML = '<div class="no-jobs">No hay trabajos disponibles</div>';
            return;
        }
        
        // TODO: Crear elementos para cada trabajo
        console.log('TODO: Renderizar lista de trabajos', jobs);
    }

    /**
     * Realiza petición HTTP a la API
     * TODO: Configurar headers apropiados
     * TODO: Manejar errores HTTP
     * TODO: Parsear respuestas JSON
     */
    async apiRequest(method, endpoint, data = null) {
        // TODO: Implementar cliente API
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        // TODO: Realizar petición y manejar respuesta
        console.log(`TODO: ${method} ${this.apiBase}${endpoint}`, data);
        
        // Placeholder para desarrollo
        throw new Error('API no implementada aún');
    }

    /**
     * Inicia actualización periódica general
     * TODO: Actualizar lista de trabajos cada 10 segundos
     * TODO: Verificar trabajos activos
     */
    startPeriodicUpdate() {
        // TODO: Implementar actualización periódica
        setInterval(() => {
            // TODO: Actualizar trabajos si no hay job activo siendo monitoreado
            if (!this.currentJob) {
                this.loadJobs();
            }
        }, 10000);
        
        console.log('TODO: Iniciar actualización periódica');
    }

    /**
     * Muestra mensaje de error al usuario
     * TODO: Crear elemento toast con mensaje de error
     * TODO: Auto-ocultar después de unos segundos
     */
    showError(message) {
        // TODO: Implementar sistema de notificaciones
        console.error('Error:', message);
        alert(`Error: ${message}`); // Placeholder temporal
    }

    /**
     * Muestra mensaje de éxito al usuario
     */
    showSuccess(message) {
        console.log('✅', message);
        this.showToast(message, 'success');
    }

    /**
     * Muestra notificación toast
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <strong>${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</strong>
            ${message}
        `;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 5000);
        }
    }

    /**
     * Simula progreso para modo demo
     */
    simulateProgress() {
        let progress = 0;
        const stages = [
            'Validando URLs...',
            'Descargando metadata...',
            'Descargando audio...',
            'Procesando con FFmpeg...',
            'Aplicando metadata...',
            'Creando archivos finales...',
            'Completado ✅'
        ];
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            const stageIndex = Math.floor((progress / 100) * (stages.length - 1));
            
            this.updateProgressUI({
                progress: {
                    percentage: Math.round(progress),
                    stage: stages[stageIndex],
                    processedUrls: Math.min(Math.floor(progress / 50), 2),
                    totalUrls: 2
                },
                status: progress >= 100 ? 'completed' : 'processing'
            });
            
            if (progress >= 100) {
                clearInterval(interval);
                this.showJobCompleted();
            }
        }, 800);
    }

    /**
     * Muestra interfaz de job completado
     */
    showJobCompleted() {
        const downloadBtn = document.getElementById('download-files');
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-flex';
            downloadBtn.addEventListener('click', () => {
                this.showSuccess('Descarga de archivos iniciada (modo demo)');
            });
        }
        
        const startBtn = document.getElementById('start-download');
        if (startBtn) {
            startBtn.disabled = false;
            startBtn.innerHTML = '🚀 Iniciar Descarga';
        }
    }

    /**
     * Valida URLs en tiempo real
     */
    validateUrls() {
        const urlsTextarea = document.getElementById('urls');
        const startBtn = document.getElementById('start-download');
        
        if (urlsTextarea && startBtn) {
            const urls = urlsTextarea.value.trim();
            startBtn.disabled = urls.length === 0;
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new YouTubeDownloaderApp();
    console.log('✅ Aplicación YouTube Downloader inicializada');
    
    // Mostrar mensaje de bienvenida temporal
    setTimeout(() => {
        const container = document.querySelector('.container');
        if (container) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            `;
            welcomeMsg.innerHTML = '✅ Aplicación cargada correctamente';
            document.body.appendChild(welcomeMsg);
            
            setTimeout(() => {
                welcomeMsg.remove();
            }, 3000);
        }
    }, 500);
});