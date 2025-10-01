// Configuración
const API_BASE_URL = 'http://localhost:5050';
const STATUS_CHECK_INTERVAL = 2000; // 2 segundos

// Estado global
let activeJobs = new Map();
let statusCheckInterval = null;

// Elementos del DOM
let elements = {};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        linksTextarea: document.getElementById('links'),
        videoFormat: document.getElementById('videoFormat'),
        audioFormat: document.getElementById('audioFormat'),
        splitMinutes: document.getElementById('splitMinutes'),
        processBtn: document.getElementById('processBtn'),
        btnText: document.querySelector('.btn-text'),
        btnLoader: document.querySelector('.btn-loader'),
        resultsSection: document.getElementById('resultsSection'),
        progressTableBody: document.getElementById('progressTableBody')
    };

    // Event Listener para el botón de procesar
    elements.processBtn.addEventListener('click', handleProcess);
});

// Función principal para procesar
async function handleProcess() {
    const links = elements.linksTextarea.value
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

    if (links.length === 0) {
        alert('Por favor, ingresa al menos un link de YouTube');
        return;
    }

    const videoChecked = elements.videoFormat.checked;
    const audioChecked = elements.audioFormat.checked;

    if (!videoChecked && !audioChecked) {
        alert('Por favor, selecciona al menos un formato (Video o Audio)');
        return;
    }

    const formats = [];
    if (videoChecked) formats.push('mp4');
    if (audioChecked) formats.push('mp3');

    const splitMinutes = parseInt(elements.splitMinutes.value);

    // Deshabilitar botón y mostrar loader
    setButtonLoading(true);

    try {
        // Enviar petición al backend
        const response = await fetch(`${API_BASE_URL}/api/process`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                urls: links,
                formats: formats,
                splitMinutes: splitMinutes
            })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }

        const data = await response.json();
        
        // Agregar trabajos al estado global
        if (data.jobs && Array.isArray(data.jobs)) {
            data.jobs.forEach(job => {
                activeJobs.set(job.jobId, {
                    jobId: job.jobId,
                    url: job.url,
                    format: job.format,
                    status: 'pending',
                    progress: 0,
                    title: job.url,
                    downloadUrl: null
                });
                addJobToTable(job.jobId);
            });

            // Mostrar sección de resultados
            elements.resultsSection.style.display = 'block';

            // Iniciar monitoreo de estado
            startStatusChecking();
        }

    } catch (error) {
        console.error('Error al procesar:', error);
        alert(`Error al procesar las descargas: ${error.message}`);
    } finally {
        setButtonLoading(false);
    }
}

// Agregar trabajo a la tabla
function addJobToTable(jobId) {
    const job = activeJobs.get(jobId);
    if (!job) return;

    const row = document.createElement('tr');
    row.id = `job-${jobId}`;
    row.innerHTML = `
        <td class="job-title">${escapeHtml(job.title)}</td>
        <td class="job-format">${job.format.toUpperCase()}</td>
        <td class="job-status">
            <span class="status-badge status-pending">Pendiente</span>
        </td>
        <td class="job-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">0%</span>
            </div>
        </td>
        <td class="job-download">
            <span class="download-pending">-</span>
        </td>
    `;

    elements.progressTableBody.appendChild(row);
}

// Actualizar trabajo en la tabla
function updateJobInTable(jobId, jobData) {
    const row = document.getElementById(`job-${jobId}`);
    if (!row) return;

    const job = activeJobs.get(jobId);
    
    // Actualizar título si está disponible
    if (jobData.title && jobData.title !== job.title) {
        job.title = jobData.title;
        row.querySelector('.job-title').textContent = jobData.title;
    }

    // Actualizar estado
    job.status = jobData.status;
    const statusBadge = row.querySelector('.job-status .status-badge');
    statusBadge.className = `status-badge status-${jobData.status}`;
    statusBadge.textContent = getStatusText(jobData.status);

    // Actualizar progreso
    if (jobData.progress !== undefined) {
        job.progress = jobData.progress;
        const progressFill = row.querySelector('.progress-fill');
        const progressText = row.querySelector('.progress-text');
        progressFill.style.width = `${jobData.progress}%`;
        progressText.textContent = `${Math.round(jobData.progress)}%`;
    }

    // Actualizar enlace de descarga
    if (jobData.status === 'completed' && jobData.downloadUrl) {
        job.downloadUrl = jobData.downloadUrl;
        const downloadCell = row.querySelector('.job-download');
        
        // Verificar si es un array de URLs (archivo partido) o una sola URL
        if (Array.isArray(jobData.downloadUrl)) {
            downloadCell.innerHTML = jobData.downloadUrl.map((url, index) => 
                `<a href="${API_BASE_URL}${url}" class="download-link" download>Parte ${index + 1}</a>`
            ).join(' ');
        } else {
            downloadCell.innerHTML = `<a href="${API_BASE_URL}${jobData.downloadUrl}" class="download-link" download>📥 Descargar</a>`;
        }
    } else if (jobData.status === 'failed') {
        const downloadCell = row.querySelector('.job-download');
        downloadCell.innerHTML = `<span class="error-text">Error: ${escapeHtml(jobData.error || 'Desconocido')}</span>`;
    }
}

// Consultar estado de los trabajos
async function checkJobsStatus() {
    const pendingJobs = Array.from(activeJobs.values())
        .filter(job => job.status !== 'completed' && job.status !== 'failed');

    if (pendingJobs.length === 0) {
        stopStatusChecking();
        return;
    }

    for (const job of pendingJobs) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/status/${job.jobId}`);
            
            if (!response.ok) {
                console.error(`Error al obtener estado del trabajo ${job.jobId}`);
                continue;
            }

            const data = await response.json();
            updateJobInTable(job.jobId, data);

        } catch (error) {
            console.error(`Error al consultar trabajo ${job.jobId}:`, error);
        }
    }
}

// Iniciar monitoreo de estado
function startStatusChecking() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    statusCheckInterval = setInterval(checkJobsStatus, STATUS_CHECK_INTERVAL);
}

// Detener monitoreo de estado
function stopStatusChecking() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        statusCheckInterval = null;
    }
}

// Utilidades
function setButtonLoading(isLoading) {
    elements.processBtn.disabled = isLoading;
    elements.btnText.style.display = isLoading ? 'none' : 'inline';
    elements.btnLoader.style.display = isLoading ? 'inline' : 'none';
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'downloading': 'Descargando',
        'processing': 'Procesando',
        'completed': 'Completado',
        'failed': 'Error'
    };
    return statusMap[status] || status;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Limpiar al cerrar
window.addEventListener('beforeunload', () => {
    stopStatusChecking();
});