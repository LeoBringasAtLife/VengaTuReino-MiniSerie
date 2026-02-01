let episodiosData = [];

async function cargarEpisodios() {
    try {
        const response = await fetch('data/episodios.json');
        const data = await response.json();
        episodiosData = data.episodios;
        return episodiosData;
    } catch (error) {
        console.error('Error al cargar episodios:', error);
        return [];
    }
}

// formatear fecha de los episodios
function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-AR', options);
}

// Renderizar lista de los episodios
function renderizarListaEpisodios(container, limite = null) {
    if (!container) return;
    
    const episodios = limite ? episodiosData.slice(0, limite) : episodiosData;
    
    const html = episodios.map(episodio => {
        const fecha = formatearFecha(episodio.fecha);
        const estado = episodio.disponible ? 'Disponible' : 'Proximamente';
        const estadoTexto = episodio.disponible ? 'Disponible' : 'Próximamente';
        const enlace = episodio.disponible ? `episodio.html?id=${episodio.id}` : '#';
        
        return `
            <li class="episodio-item">
                <a href="${enlace}" class="episodio-link">
                    <div class="episodio-header">
                        <span class="episodio-number">Episodio ${episodio.numero}</span>
                        ${fecha ? `<span class="episodio-date">${fecha}</span>` : ''}
                    </div>
                    <h3 class="episodio-title">${episodio.titulo}</h3>
                    <span class="episodio-status ${estado}">${estadoTexto}</span>
                </a>
            </li>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Cargar contenido de episodio desde archivo .txt
async function cargarContenidoEpisodio(archivo) {
    try {
        const response = await fetch(archivo);
        const texto = await response.text();
        return procesarTranscripcion(texto);
    } catch (error) {
        console.error('Error al cargar contenido del episodio:', error);
        return { contenido: '<p>Error al cargar el contenido del episodio.</p>', titulo: '' };
    }
}

// Procesar transcripción: formatear timestamps y párrafos
function procesarTranscripcion(texto) {
    if (!texto) return { contenido: '', titulo: '' };
    
    // Dividir en líneas manteniendo las vacías para procesamiento
    const lineas = texto.split('\n');
    let titulo = '';
    let contenidoInicio = 0;
    
    // Extraer título de la primera línea
    if (lineas.length > 0 && lineas[0].trim().includes('Transcripción')) {
        titulo = lineas[0].trim();
        contenidoInicio = 1;
        // Saltar línea vacía después del título
        if (lineas[1] && !lineas[1].trim()) {
            contenidoInicio = 2;
        }
    }
    
    // Procesar el contenido
    let contenidoHTML = '';
    let parrafoActual = '';
    let timestampActual = '';
    
    for (let i = contenidoInicio; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaTrim = linea.trim();
        
        // Detectar timestamp (formato: 0:00, 1:23, 10:45, etc.)
        const timestampMatch = lineaTrim.match(/^(\d+:\d+)$/);
        
        if (timestampMatch) {
            // Si hay un párrafo acumulado, cerrarlo antes del nuevo timestamp
            if (parrafoActual) {
                contenidoHTML += `<p>${parrafoActual}</p>`;
                parrafoActual = '';
            }
            timestampActual = timestampMatch[1];
        } else if (lineaTrim) {
            // Agregar línea al párrafo actual
            if (parrafoActual) {
                parrafoActual += ' ';
            }
            // Agregar timestamp si existe antes del texto
            if (timestampActual) {
                parrafoActual += `<span class="episodio-timestamp">[${timestampActual}]</span> `;
                timestampActual = '';
            }
            parrafoActual += lineaTrim;
        } else if (parrafoActual) {
            // Línea vacía: cerrar párrafo actual
            contenidoHTML += `<p>${parrafoActual}</p>`;
            parrafoActual = '';
            timestampActual = ''; // Reset timestamp si hay línea vacía
        }
    }
    
    // Cerrar último párrafo si existe
    if (parrafoActual) {
        contenidoHTML += `<p>${parrafoActual}</p>`;
    }
    
    return { contenido: contenidoHTML, titulo };
}

// Extraer videoId de una URL de YouTube
function extraerVideoId(url) {
    if (!url) return '';
    
    // Formato: https://youtu.be/VIDEO_ID
    const match1 = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match1) return match1[1];
    
    // Formato: https://www.youtube.com/watch?v=VIDEO_ID
    const match2 = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match2) return match2[1];
    
    // Si ya es un ID directo
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }
    
    return '';
}

// Generar embed de YouTube desde URL o videoId
function generarYouTubeEmbed(videoUrl) {
    if (!videoUrl) return '';
    const videoId = extraerVideoId(videoUrl);
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}`;
}

// Renderizar sección de videos en episodios.html
function renderizarVideos(container) {
    if (!container) return;
    
    // Filtrar episodios que tienen videoUrl
    const episodiosConVideo = episodiosData.filter(e => e.videoUrl && e.videoUrl.trim() !== '');
    
    if (episodiosConVideo.length === 0) {
        // Ocultar la sección si no hay videos
        const videosSection = document.getElementById('videos-section');
        if (videosSection) {
            videosSection.style.display = 'none';
        }
        return;
    }
    
    const html = episodiosConVideo.map(episodio => {
        const embedUrl = generarYouTubeEmbed(episodio.videoUrl);
        return `
            <div class="video-item">
                <div class="video-wrapper">
                    <iframe 
                        src="${embedUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// Renderizar página individual de episodio
async function renderizarEpisodio(episodioId, container) {
    if (!container) return;
    
    const episodio = episodiosData.find(e => e.id === parseInt(episodioId));
    if (!episodio) {
        container.innerHTML = '<p>Episodio no encontrado.</p>';
        return;
    }
    
    // Cargar contenido
    const { contenido, titulo } = await cargarContenidoEpisodio(episodio.archivo);
    
    // Encontrar episodios anterior y siguiente
    const indiceActual = episodiosData.findIndex(e => e.id === episodio.id);
    const episodioAnterior = indiceActual > 0 ? episodiosData[indiceActual - 1] : null;
    const episodioSiguiente = indiceActual < episodiosData.length - 1 ? episodiosData[indiceActual + 1] : null;
    
    const fecha = formatearFecha(episodio.fecha);
    
    // Generar video si existe
    const videoHTML = episodio.videoUrl && episodio.videoUrl.trim() !== '' 
        ? `
            <div class="episodio-video">
                <div class="episodio-video-wrapper">
                    <iframe 
                        src="${generarYouTubeEmbed(episodio.videoUrl)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `
        : '';
    
    const html = `
        <article class="episodio-page">
            <header class="episodio-page-header">
                <h1 class="episodio-page-title">${episodio.titulo}</h1>
                <div class="episodio-page-meta">
                    <span>Episodio ${episodio.numero}</span>
                    ${fecha ? `<span>${fecha}</span>` : ''}
                </div>
            </header>
            
            ${videoHTML}
            
            <div class="episodio-content">
                ${contenido || '<p>Contenido no disponible.</p>'}
            </div>
            
            <nav class="episodio-navigation">
                ${episodioAnterior && episodioAnterior.disponible 
                    ? `<a href="episodio.html?id=${episodioAnterior.id}" class="nav-link">← Episodio ${episodioAnterior.numero}</a>`
                    : '<span class="nav-link disabled">← Anterior</span>'
                }
                <a href="episodios.html" class="back-link">← Volver a Episodios</a>
                ${episodioSiguiente && episodioSiguiente.disponible 
                    ? `<a href="episodio.html?id=${episodioSiguiente.id}" class="nav-link">Episodio ${episodioSiguiente.numero} →</a>`
                    : '<span class="nav-link disabled">Siguiente →</span>'
                }
            </nav>
        </article>
    `;
    
    container.innerHTML = html;
    
    // Actualizar título de la página
    document.title = `${episodio.titulo} - Venga Tu Reino`;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    await cargarEpisodios();
    
    // Si hay un contenedor de lista de episodios
    const listaContainer = document.getElementById('episodios-lista');
    if (listaContainer) {
        const limite = listaContainer.dataset.limite ? parseInt(listaContainer.dataset.limite) : null;
        renderizarListaEpisodios(listaContainer, limite);
    }
    
    // Si hay un contenedor de videos (en episodios.html)
    const videosContainer = document.getElementById('videos-grid');
    if (videosContainer) {
        renderizarVideos(videosContainer);
    }
    
    // Si estamos en la página de episodio individual
    const episodioContainer = document.getElementById('episodio-contenido');
    if (episodioContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const episodioId = urlParams.get('id');
        if (episodioId) {
            await renderizarEpisodio(episodioId, episodioContainer);
        } else {
            episodioContainer.innerHTML = '<p>No se especificó un episodio.</p>';
        }
    }
});
