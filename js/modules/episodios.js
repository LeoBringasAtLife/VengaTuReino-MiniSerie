let episodiosData = [];
const transcripcionesCache = new Map();
let cargando = false;

// FUNCIONES DE CARGA Y CACHÉ

async function cargarEpisodios() {
    try {
        const response = await fetch('data/episodios.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        episodiosData = data.episodios;
        return episodiosData;
    } catch (error) {
        console.error('Error al cargar episodios:', error);
        return [];
    }
}

// Función para cargar con reintentos
async function cargarEpisodiosConReintento(intentos = 3, delay = 500) {
    for (let i = 0; i < intentos; i++) {
        try {
            await cargarEpisodios();
            
            if (episodiosData.length > 0) {
                console.log(`✓ Episodios cargados exitosamente (${episodiosData.length} episodios)`);
                return true;
            }
        } catch (error) {
            console.warn(`Intento ${i + 1}/${intentos} falló:`, error);
            
            if (i < intentos - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    console.error('No se pudieron cargar los episodios después de varios intentos');
    return false;
}

// INDICADORES DE CARGA

function mostrarLoading(container, mensaje = 'Cargando episodios...') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">${mensaje}</p>
        </div>
    `;
}

function ocultarLoading(container) {
    if (!container) return;
    
    const loadingDiv = container.querySelector('.loading-container');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function mostrarMensajeError(container, mensaje) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-container">
            <p class="error-text">${mensaje}</p>
            <button class="btn-retry" onclick="location.reload()">Reintentar</button>
        </div>
    `;
}

function mostrarMensajeVacio(container, mensaje = 'No hay episodios disponibles en este momento.') {
    if (!container) return;
    
    container.innerHTML = `
        <div class="empty-container">
            <p class="empty-text">${mensaje}</p>
            <a href="index.html" class="btn-volver">Volver al inicio</a>
        </div>
    `;
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-AR', options);
}


function renderizarListaEpisodios(container, limite = null) {
    if (!container) return;
    
    const episodios = limite ? episodiosData.slice(0, limite) : episodiosData;
    
    if (episodios.length === 0) {
        mostrarMensajeVacio(container);
        return;
    }
    
    const html = episodios.map(episodio => {
        const fecha = formatearFecha(episodio.fecha);
        const estado = episodio.disponible ? 'disponible' : 'proximamente';
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

// CARGA Y PROCESAMIENTO DE TRANSCRIPCIONES

async function cargarContenidoEpisodio(archivo) {
    // Verificar caché primero
    if (transcripcionesCache.has(archivo)) {
        console.log('Transcripción cargada desde caché:', archivo);
        return transcripcionesCache.get(archivo);
    }
    
    try {
        const response = await fetch(archivo);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const texto = await response.text();
        const resultado = procesarTranscripcion(texto);
        
        // Guardar en caché
        transcripcionesCache.set(archivo, resultado);
        
        return resultado;
    } catch (error) {
        console.error('Error al cargar contenido del episodio:', error);
        return { 
            contenido: '<p class="error-text">Error al cargar el contenido del episodio. Por favor, intenta nuevamente.</p>', 
            titulo: '' 
        };
    }
}

function procesarTranscripcion(texto) {
    if (!texto) return { contenido: '', titulo: '' };
    
    const lineas = texto.split('\n');
    let titulo = '';
    let contenidoInicio = 0;
    
    if (lineas.length > 0 && lineas[0].trim().includes('Transcripción')) {
        titulo = lineas[0].trim();
        contenidoInicio = 1;

        if (lineas[1] && !lineas[1].trim()) {
            contenidoInicio = 2;
        }
    }
    
    let contenidoHTML = '';
    let parrafoActual = '';
    let timestampActual = '';
    
    for (let i = contenidoInicio; i < lineas.length; i++) {
        const linea = lineas[i];
        const lineaTrim = linea.trim();
        
        const timestampMatch = lineaTrim.match(/^(\d+:\d+)$/);
        
        if (timestampMatch) {
            if (parrafoActual) {
                contenidoHTML += `<p>${parrafoActual}</p>`;
                parrafoActual = '';
            }
            timestampActual = timestampMatch[1];
        } else if (lineaTrim) {
            if (parrafoActual) {
                parrafoActual += ' ';
            }
            // Agregar timestamp si existe
            if (timestampActual) {
                parrafoActual += `<span class="episodio-timestamp">[${timestampActual}]</span> `;
                timestampActual = '';
            }
            parrafoActual += lineaTrim;
        } else if (parrafoActual) {
            contenidoHTML += `<p>${parrafoActual}</p>`;
            parrafoActual = '';
            timestampActual = '';
        }
    }

    if (parrafoActual) {
        contenidoHTML += `<p>${parrafoActual}</p>`;
    }

    return { contenido: contenidoHTML, titulo };
}

// MANEJO DE VIDEOS DE YOUTUBE

function extraerVideoId(url) {
    if (!url) return '';
    
    const match1 = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match1) return match1[1];
    
    const match2 = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match2) return match2[1];
    
    if (url.length === 11 && !url.includes('/') && !url.includes('?')) {
        return url;
    }
    
    return '';
}

function generarYouTubeEmbed(videoUrl) {
    if (!videoUrl) return '';
    const videoId = extraerVideoId(videoUrl);
    if (!videoId) return '';
    
    // Agregar parámetros para mejor rendimiento
    return `https://www.youtube.com/embed/${videoId}`;
}

// RENDERIZADO DE VIDEOS

function renderizarVideos(container) {
    if (!container) return;
    
    const episodiosConVideo = episodiosData.filter(e => e.videoUrl && e.videoUrl.trim() !== '');
    
    if (episodiosConVideo.length === 0) {
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
                        loading="lazy"
                        title="${episodio.titulo}">
                    </iframe>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// RENDERIZADO DE EPISODIO INDIVIDUAL

async function renderizarEpisodio(episodioId, container) {
    if (!container) return;
    
    mostrarLoading(container, 'Cargando episodio...');
    
    const episodio = episodiosData.find(e => e.id === parseInt(episodioId));
    
    if (!episodio) {
        mostrarMensajeError(container, 'Episodio no encontrado.');
        return;
    }
    
    const { contenido, titulo } = await cargarContenidoEpisodio(episodio.archivo);
    
    const indiceActual = episodiosData.findIndex(e => e.id === episodio.id);
    const episodioAnterior = indiceActual > 0 ? episodiosData[indiceActual - 1] : null;
    const episodioSiguiente = indiceActual < episodiosData.length - 1 ? episodiosData[indiceActual + 1] : null;
    
    const fecha = formatearFecha(episodio.fecha);
    
    const videoHTML = episodio.videoUrl && episodio.videoUrl.trim() !== '' 
        ? `
            <div class="episodio-video">
                <div class="episodio-video-wrapper">
                    <iframe 
                        src="${generarYouTubeEmbed(episodio.videoUrl)}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        loading="lazy"
                        title="${episodio.titulo}">
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
                <a href="episodios.html" class="back-link">Volver a los Episodios</a>
                ${episodioSiguiente && episodioSiguiente.disponible 
                    ? `<a href="episodio.html?id=${episodioSiguiente.id}" class="nav-link">Episodio ${episodioSiguiente.numero} →</a>`
                    : '<span class="nav-link disabled">Siguiente →</span>'
                }
            </nav>
        </article>
    `;
    
    container.innerHTML = html;
    
    document.title = `${episodio.titulo} - Venga Tu Reino`;
    
    window.scrollTo(0, 0);
}

// INICIALIZACIÓN

document.addEventListener('DOMContentLoaded', async function() {
    try {
        if (cargando) {
            return;
        }
        
        cargando = true;
        
        // Identificar contenedores
        const listaContainer = document.getElementById('episodios-lista');
        const videosContainer = document.getElementById('videos-grid');
        const episodioContainer = document.getElementById('episodio-contenido');
        
        // Mostrar loading en los contenedores presentes
        if (listaContainer) mostrarLoading(listaContainer);
        if (videosContainer) mostrarLoading(videosContainer, 'Cargando videos...');
        if (episodioContainer) mostrarLoading(episodioContainer);
        
        // Cargar episodios con reintentos
        const cargaExitosa = await cargarEpisodiosConReintento(3, 500);
        
        if (!cargaExitosa || episodiosData.length === 0) {
            throw new Error('No se pudieron cargar los episodios');
        }
        
        // Renderizar lista de episodios (index.html o episodios.html)
        if (listaContainer) {
            const limite = listaContainer.dataset.limite ? parseInt(listaContainer.dataset.limite) : null;
            renderizarListaEpisodios(listaContainer, limite);
            console.log('Lista de episodios renderizada');
        }
        
        // Renderizar videos (episodios.html)
        if (videosContainer) {
            renderizarVideos(videosContainer);
            console.log('Videos renderizados');
        }
        
        // Renderizar episodio individual (episodio.html)
        if (episodioContainer) {
            const urlParams = new URLSearchParams(window.location.search);
            const episodioId = urlParams.get('id');
            
            if (episodioId) {
                await renderizarEpisodio(episodioId, episodioContainer);
                console.log('✓ Episodio individual renderizado');
            } else {
                mostrarMensajeError(episodioContainer, 'No se especificó un episodio válido.');
            }
        }

        
    } catch (error) {
        console.error('Error crítico en la inicialización:', error);
        
        const containers = [
            document.getElementById('episodios-lista'),
            document.getElementById('videos-grid'),
            document.getElementById('episodio-contenido')
        ];
        
        containers.forEach(container => {
            if (container) {
                mostrarMensajeError(
                    container, 
                    'Error al cargar la aplicación. Por favor, recarga la página.'
                );
            }
        });
    } finally {
        cargando = false;
    }
});