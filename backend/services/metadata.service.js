/**
 * Servicio para manejo de metadatos ID3 en archivos MP3 y manifest.json
 * Aplica tags y carátulas usando node-id3
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');
// TODO: Importar node-id3 cuando esté instalado
// const NodeID3 = require('node-id3');

/**
 * Crear manifest.json con metadatos del proceso
 * @param {string} manifestPath - Ruta donde guardar manifest.json
 * @param {Object} metadata - Objeto con metadatos completos
 * @returns {Promise<boolean>} true si se creó correctamente
 */
async function createManifest(manifestPath, metadata) {
  try {
    const manifest = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      video: {
        id: metadata.videoId,
        title: metadata.title,
        channel: metadata.channel,
        channelId: metadata.channelId,
        duration: metadata.duration,
        url: metadata.url,
        thumbnailUrl: metadata.thumbnailUrl,
        description: metadata.description
      },
      processing: {
        downloadedAt: metadata.downloadedAt,
        convertedAt: metadata.convertedAt,
        audioFormat: metadata.audioFormat || 'mp3',
        audioBitrate: metadata.audioBitrate || '320k',
        segmented: metadata.segmented || false,
        totalParts: metadata.totalParts || 1,
        segmentDuration: metadata.segmentDuration
      },
      files: metadata.files || [],
      errors: metadata.errors || []
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`Manifest creado: ${manifestPath}`);
    return true;
  } catch (error) {
    console.error('Error creando manifest:', error);
    return false;
  }
}

/**
 * Leer manifest.json existente
 * @param {string} manifestPath - Ruta del manifest.json
 * @returns {Promise<Object|null>} Objeto con metadatos o null si no existe
 */
async function readManifest(manifestPath) {
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error leyendo manifest:', error);
    return null;
  }
}

/**
 * Actualizar manifest.json existente
 * @param {string} manifestPath - Ruta del manifest.json
 * @param {Object} updates - Objeto con campos a actualizar
 * @returns {Promise<boolean>} true si se actualizó correctamente
 */
async function updateManifest(manifestPath, updates) {
  try {
    const manifest = await readManifest(manifestPath) || {};
    const updatedManifest = { ...manifest, ...updates, updatedAt: new Date().toISOString() };
    await fs.writeFile(manifestPath, JSON.stringify(updatedManifest, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error actualizando manifest:', error);
    return false;
  }
}

/**
 * Aplicar tags ID3 a un archivo MP3
 * @param {string} mp3Path - Ruta del archivo MP3
 * @param {Object} tags - Objeto con tags ID3 (title, artist, album, etc.)
 * @returns {Promise<boolean>} true si se aplicaron correctamente
 */
async function applyId3Tags(mp3Path, tags) {
  try {
    // TODO: Implementar cuando node-id3 esté disponible
    console.log(`Aplicando tags ID3 a ${mp3Path}:`, tags);
    
    // const id3Tags = {
    //   title: tags.title,
    //   artist: tags.artist || tags.channel,
    //   album: tags.album || tags.title,
    //   year: tags.year || new Date().getFullYear().toString(),
    //   comment: {
    //     language: 'eng',
    //     text: tags.comment || `Downloaded from YouTube: ${tags.url}`
    //   }
    // };
    
    // const success = NodeID3.write(id3Tags, mp3Path);
    // return success;
    
    return true;
  } catch (error) {
    console.error('Error aplicando tags ID3:', error);
    return false;
  }
}

/**
 * Aplicar carátula (album art) a un archivo MP3
 * @param {string} mp3Path - Ruta del archivo MP3
 * @param {string|Buffer} imagePath - Ruta de la imagen o buffer con datos
 * @returns {Promise<boolean>} true si se aplicó correctamente
 */
async function applyAlbumArt(mp3Path, imagePath) {
  try {
    // TODO: Implementar cuando node-id3 esté disponible
    console.log(`Aplicando carátula a ${mp3Path}`);
    
    // let imageBuffer;
    // if (Buffer.isBuffer(imagePath)) {
    //   imageBuffer = imagePath;
    // } else {
    //   imageBuffer = await fs.readFile(imagePath);
    // }
    
    // const tags = {
    //   image: {
    //     mime: 'image/jpeg',
    //     type: { id: 3, name: 'front cover' },
    //     description: 'Album Art',
    //     imageBuffer: imageBuffer
    //   }
    // };
    
    // const success = NodeID3.write(tags, mp3Path);
    // return success;
    
    return true;
  } catch (error) {
    console.error('Error aplicando carátula:', error);
    return false;
  }
}

/**
 * Aplicar tags completos (incluyendo carátula) a un archivo MP3
 * @param {string} mp3Path - Ruta del archivo MP3
 * @param {Object} metadata - Objeto con metadatos completos
 * @param {string|Buffer} coverImage - Imagen de carátula
 * @returns {Promise<boolean>} true si se aplicó correctamente
 */
async function applyCompleteMetadata(mp3Path, metadata, coverImage) {
  try {
    const tagsSuccess = await applyId3Tags(mp3Path, metadata);
    
    if (coverImage) {
      const artSuccess = await applyAlbumArt(mp3Path, coverImage);
      return tagsSuccess && artSuccess;
    }
    
    return tagsSuccess;
  } catch (error) {
    console.error('Error aplicando metadatos completos:', error);
    return false;
  }
}

/**
 * Aplicar metadatos a múltiples archivos (partes)
 * @param {Array<string>} mp3Paths - Array con rutas de archivos MP3
 * @param {Object} baseMetadata - Metadatos base a aplicar
 * @param {string|Buffer} coverImage - Imagen de carátula
 * @returns {Promise<Array<boolean>>} Array con resultados para cada archivo
 */
async function applyMetadataToMultipleParts(mp3Paths, baseMetadata, coverImage) {
  const results = [];
  const totalParts = mp3Paths.length;
  
  for (let i = 0; i < mp3Paths.length; i++) {
    const mp3Path = mp3Paths[i];
    const partMetadata = {
      ...baseMetadata,
      title: `${baseMetadata.title} - Parte ${i + 1}/${totalParts}`,
      comment: `Parte ${i + 1} de ${totalParts} - ${baseMetadata.comment || ''}`
    };
    
    const success = await applyCompleteMetadata(mp3Path, partMetadata, coverImage);
    results.push(success);
  }
  
  return results;
}

/**
 * Descargar imagen de thumbnail desde URL
 * @param {string} thumbnailUrl - URL de la imagen
 * @param {string} outputPath - Ruta donde guardar la imagen
 * @returns {Promise<string>} Ruta de la imagen descargada
 */
async function downloadThumbnail(thumbnailUrl, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = thumbnailUrl.startsWith('https') ? https : http;
    
    protocol.get(thumbnailUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Error descargando thumbnail: ${response.statusCode}`));
        return;
      }
      
      const fileStream = require('fs').createWriteStream(outputPath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Thumbnail descargado: ${outputPath}`);
        resolve(outputPath);
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(outputPath).catch(() => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

module.exports = {
  createManifest,
  readManifest,
  updateManifest,
  applyId3Tags,
  applyAlbumArt,
  applyCompleteMetadata,
  applyMetadataToMultipleParts,
  downloadThumbnail
};
