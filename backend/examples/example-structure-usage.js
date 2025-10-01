/**
 * Ejemplo de uso de la estructura de archivos
 * Muestra cómo organizar videos descargados según el formato:
 * backend/output/{canal}-{titulo}-{videoId}/
 */

const pathsService = require('../services/paths.service');
const fileService = require('../services/fileService');
const metadataService = require('../services/metadata.service');
const zipService = require('../services/zip.service');

// ============================================
// EJEMPLO 1: Video sin segmentar (MP3 único)
// ============================================
async function exampleSingleMp3() {
  console.log('\n=== EJEMPLO 1: Video sin segmentar ===\n');

  // Información del video obtenida de YouTube
  const videoInfo = {
    videoId: 'dQw4w9WgXcQ',
    title: 'Tutorial de Node.js',
    channel: 'TechChannel',
    channelId: 'UC123456789',
    duration: 900, // 15 minutos
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    description: 'Un tutorial completo sobre Node.js'
  };

  // 1. Generar rutas
  const outputRoot = './backend/output';
  const videoFolder = pathsService.generateVideoFolder(outputRoot, videoInfo);
  const mp3Path = pathsService.generateSingleMp3Path(videoFolder, videoInfo);
  const manifestPath = pathsService.generateManifestPath(videoFolder);

  console.log('Carpeta del video:', videoFolder);
  // => ./backend/output/TechChannel-Tutorial-de-Node.js-dQw4w9WgXcQ/

  console.log('Archivo MP3:', mp3Path);
  // => ./backend/output/TechChannel-Tutorial-de-Node.js-dQw4w9WgXcQ/TechChannel-Tutorial-de-Node.js-dQw4w9WgXcQ.mp3

  console.log('Manifest:', manifestPath);
  // => ./backend/output/TechChannel-Tutorial-de-Node.js-dQw4w9WgXcQ/manifest.json

  // 2. Crear carpeta del video
  await pathsService.ensureDirectory(videoFolder);

  // 3. Simular que tenemos un MP3 descargado en temporal
  // (En producción, aquí iría el proceso de descarga y conversión)
  console.log('\n[Simulación] MP3 descargado en temporal...');

  // 4. Crear manifest.json
  const manifestData = {
    videoId: videoInfo.videoId,
    title: videoInfo.title,
    channel: videoInfo.channel,
    channelId: videoInfo.channelId,
    duration: videoInfo.duration,
    url: videoInfo.url,
    thumbnailUrl: videoInfo.thumbnailUrl,
    description: videoInfo.description,
    downloadedAt: new Date().toISOString(),
    convertedAt: new Date().toISOString(),
    audioFormat: 'mp3',
    audioBitrate: '320k',
    segmented: false,
    totalParts: 1,
    files: [{
      name: pathsService.getBasename(mp3Path) + '.mp3',
      size: 14400000, // ~14MB para 15 minutos a 320kbps
      duration: 900
    }],
    errors: []
  };

  await metadataService.createManifest(manifestPath, manifestData);
  console.log('\n✓ Manifest creado exitosamente');
}

// ============================================
// EJEMPLO 2: Video segmentado (múltiples partes)
// ============================================
async function exampleMultipartMp3() {
  console.log('\n=== EJEMPLO 2: Video segmentado ===\n');

  // Información del video (duración larga que requiere segmentación)
  const videoInfo = {
    videoId: 'abc123xyz',
    title: 'Curso Completo de JavaScript',
    channel: 'CodeAcademy',
    channelId: 'UC987654321',
    duration: 3600, // 60 minutos
    url: 'https://www.youtube.com/watch?v=abc123xyz',
    thumbnailUrl: 'https://i.ytimg.com/vi/abc123xyz/maxresdefault.jpg',
    description: 'Curso completo desde cero'
  };

  // Configuración: segmentar cada 20 minutos (1200 segundos)
  const segmentDuration = 1200;
  const totalParts = Math.ceil(videoInfo.duration / segmentDuration); // 3 partes

  // 1. Generar rutas
  const outputRoot = './backend/output';
  const videoFolder = pathsService.generateVideoFolder(outputRoot, videoInfo);
  
  // Generar rutas para cada parte
  const mp3Parts = [];
  for (let i = 1; i <= totalParts; i++) {
    const partPath = pathsService.generateMp3PartPath(videoFolder, videoInfo, i, totalParts);
    mp3Parts.push(partPath);
  }

  const zipPath = pathsService.generateZipPath(videoFolder, videoInfo);
  const manifestPath = pathsService.generateManifestPath(videoFolder);

  console.log('Carpeta del video:', videoFolder);
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/

  console.log('\nPartes MP3:');
  mp3Parts.forEach((part, i) => {
    console.log(`  Parte ${i + 1}:`, part);
  });
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz__part-001.mp3
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz__part-002.mp3
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz__part-003.mp3

  console.log('\nArchivo ZIP:', zipPath);
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz.zip

  console.log('Manifest:', manifestPath);
  // => ./backend/output/CodeAcademy-Curso-Completo-de-JavaScript-abc123xyz/manifest.json

  // 2. Crear carpeta del video
  await pathsService.ensureDirectory(videoFolder);

  // 3. Simular creación de partes MP3
  console.log('\n[Simulación] Creando partes MP3...');

  // 4. Crear manifest.json
  const manifestData = {
    videoId: videoInfo.videoId,
    title: videoInfo.title,
    channel: videoInfo.channel,
    channelId: videoInfo.channelId,
    duration: videoInfo.duration,
    url: videoInfo.url,
    thumbnailUrl: videoInfo.thumbnailUrl,
    description: videoInfo.description,
    downloadedAt: new Date().toISOString(),
    convertedAt: new Date().toISOString(),
    audioFormat: 'mp3',
    audioBitrate: '320k',
    segmented: true,
    totalParts: totalParts,
    segmentDuration: segmentDuration,
    files: mp3Parts.map((part, i) => ({
      name: pathsService.getBasename(part) + '.mp3',
      size: 28800000, // ~28MB para 20 minutos a 320kbps
      duration: i < totalParts - 1 ? segmentDuration : (videoInfo.duration % segmentDuration)
    })),
    errors: []
  };

  await metadataService.createManifest(manifestPath, manifestData);
  console.log('\n✓ Manifest creado exitosamente');

  // 5. Simular creación de ZIP (en producción se haría con archivos reales)
  console.log('\n[Simulación] ZIP se crearía con las 3 partes MP3');
}

// ============================================
// EJEMPLO 3: Uso completo con fileService
// ============================================
async function exampleCompleteWorkflow() {
  console.log('\n=== EJEMPLO 3: Flujo completo con fileService ===\n');

  const videoInfo = {
    videoId: 'xyz789abc',
    title: 'Python para Principiantes',
    channel: 'Learn Python',
    channelId: 'UC456789123',
    duration: 1500, // 25 minutos
    url: 'https://www.youtube.com/watch?v=xyz789abc',
    thumbnailUrl: 'https://i.ytimg.com/vi/xyz789abc/maxresdefault.jpg',
    description: 'Aprende Python desde cero'
  };

  // 1. Crear carpeta del video usando fileService
  const videoFolder = await fileService.createVideoFolder(videoInfo);
  console.log('Carpeta creada:', videoFolder);

  // 2. Simular lista de archivos MP3 procesados (en tmp)
  const mp3Files = [
    './backend/tmp/job123/temp-output.mp3'
  ];

  // 3. Información del proceso
  const processInfo = {
    downloadedAt: new Date().toISOString(),
    convertedAt: new Date().toISOString(),
    segmentDuration: null, // No segmentado
    createZip: false, // No crear ZIP para un solo archivo
    errors: []
  };

  // 4. Organizar archivos (moveŕía MP3 a carpeta final y crearía manifest)
  console.log('\n[Simulación] Organizando archivos...');
  // const result = await fileService.organizeVideoFiles(videoFolder, videoInfo, mp3Files, processInfo);
  console.log('Archivos organizados (simulación)');

  // 5. Obtener estadísticas
  console.log('\n[Simulación] Obteniendo estadísticas...');
  // const stats = await fileService.getFileStats(videoFolder);
  // console.log('Estadísticas:', stats);
}

// ============================================
// EJEMPLO 4: Sanitización de nombres
// ============================================
function exampleSanitization() {
  console.log('\n=== EJEMPLO 4: Sanitización de nombres ===\n');

  const testCases = [
    'Tech Channel! / How to: Node.js <2025>',
    'Programming: C++ & Python | Full Tutorial',
    'Video con "comillas" y más*caracteres?especiales',
    'Título muy largo que necesita ser truncado porque excede el límite de caracteres permitidos en el sistema de archivos y podría causar problemas'
  ];

  testCases.forEach(original => {
    const sanitized = pathsService.sanitizeFilename(original);
    console.log('Original: ', original);
    console.log('Sanitizado:', sanitized);
    console.log('');
  });
}

// ============================================
// EJEMPLO 5: Gestión de nombres duplicados
// ============================================
async function exampleDuplicateHandling() {
  console.log('\n=== EJEMPLO 5: Manejo de duplicados ===\n');

  // Si ya existe un video con el mismo nombre (mismo videoId)
  // el sistema lo detecta porque usa el videoId único
  
  const videoInfo = {
    videoId: 'same123', // Mismo ID
    title: 'Tutorial Duplicado',
    channel: 'TestChannel',
    channelId: 'UC111222333',
    duration: 600,
    url: 'https://www.youtube.com/watch?v=same123'
  };

  const outputRoot = './backend/output';
  const videoFolder = pathsService.generateVideoFolder(outputRoot, videoInfo);
  
  console.log('Carpeta generada:', videoFolder);
  console.log('\nSi el videoId es el mismo, la carpeta será la misma.');
  console.log('Los archivos se sobrescribirán (o se puede implementar versioning).');
  console.log('El manifest.json se actualizará con la nueva fecha de procesamiento.');
}

// ============================================
// Ejecutar ejemplos
// ============================================
async function runExamples() {
  try {
    await exampleSingleMp3();
    await exampleMultipartMp3();
    await exampleCompleteWorkflow();
    exampleSanitization();
    await exampleDuplicateHandling();
    
    console.log('\n✓ Todos los ejemplos ejecutados exitosamente\n');
  } catch (error) {
    console.error('\n✗ Error en ejemplos:', error);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runExamples();
}

module.exports = {
  exampleSingleMp3,
  exampleMultipartMp3,
  exampleCompleteWorkflow,
  exampleSanitization,
  exampleDuplicateHandling
};
