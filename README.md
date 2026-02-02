# Venga Tu Reino - Miniserie

Un sitio web para la miniserie de verano "Venga Tu Reino", dirigida por el Pastor Walter Escalante. Este proyecto nació de la idea de crear una plataforma donde las personas puedan acceder fácilmente a los episodios, sus transcripciones y videos de manera organizada y accesible.

## Sobre el Proyecto

Este sitio web está diseñado para presentar una miniserie que invita a una confrontación constante con la Palabra de Dios para alcanzar una genuina transformación de vida. La idea original fue concebida por **Leonardo Bringas**, quien trabajó en conjunto con inteligencia artificial (Claude Sonnet 4.5) para desarrollar este proyecto desde cero.

El sitio permite navegar por los diferentes episodios, leer las transcripciones completas con timestamps (en realidad no va con timestamps, sino que ahora las transcrippciones estan en crudo), ver los videos embebidos de YouTube, y conocer más sobre la serie y el pastor que la dirige.

## Características

- **Navegación intuitiva**: Menú responsive que se adapta a dispositivos móviles y desktop
- **Episodios dinámicos**: Los episodios se cargan desde un archivo JSON, facilitando la actualización del contenido
- **Transcripciones formateadas**: Las transcripciones se procesan automáticamente y se formatean en párrafos legibles
- **Videos embebidos**: Integración directa con YouTube para reproducir los videos de cada episodio
- **Diseño responsive**: Funciona perfectamente en cualquier dispositivo
- **Navegación entre episodios**: Enlaces para moverse entre episodios anteriores y siguientes

## Estructura del Proyecto

```
VengaTuReino-MiniSerie/
├── assets/
│   └── images/
│       └── leo3.jpeg          # Imagen del pastor (es mi foto, para probar las dimensiones)
├── css/
│   ├── base/
│   │   ├── variables.css       # Variables CSS y fuentes
│   │   ├── reset.css           # Reset y estilos base
│   │   ├── typography.css      # Tipografía (h1-h6, p, a)
│   │   └── responsive.css      # Media queries responsive
│   ├── layout/
│   │   └── container.css       # Container y utilidades
│   └── components/
│       ├── header.css          # Estilos del header y navegación
│       ├── hero.css            # Estilos de la sección hero
│       └── episodios.css       # Estilos de episodios y contenido
├── data/
│   └── episodios.json          # Datos de todos los episodios
├── js/
│   ├── core/
│   │   └── navigation.js       # Funcionalidad de navegación (menú, scroll)
│   └── modules/
│       └── episodios.js        # Lógica de carga y renderizado de episodios
├── transcripciones/
│   ├── Episodio01.txt
│   ├── Episodio02.txt
│   ├── Episodio03.txt
│   ├── Episodio04.txt
│   └── Episodio05.txt
├── index.html                  # Página principal
├── episodios.html              # Lista de todos los episodios
├── episodio.html               # Página individual de cada episodio
├── sobre.html                  # Página "Sobre la serie"
├── README.md                   # Documentación del proyecto
└── PROMPT_ORIGINAL.md          # Prompt original usado para crear el proyecto
```

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica.
- **CSS3**: Estilos con variables CSS para mantener consistencia.
- **JavaScript (Vanilla)**: Sin frameworks, JavaScript totalmente puro para la funcionalidad.
- **JSON**: Para almacenar y gestionar los datos de todos los episodios.

## Cómo Funciona

### Carga de Episodios

Los episodios se cargan dinámicamente desde `data/episodios.json`. Este archivo contiene toda la información de cada episodio:

- Título y número
- Fecha de publicación
- URL del video de YouTube
- Ruta al archivo de transcripción
- Estado de disponibilidad
- Descripción

### Procesamiento de Transcripciones

Las transcripciones se encuentran en archivos `.txt` dentro de la carpeta `transcripciones/`. El JavaScript procesa estos archivos para:
- Convertir el texto plano en párrafos HTML formateados
- Mantener el formato original del texto
- Mostrar el contenido de manera legible en el sitio

### Navegación

El sitio incluye:
- Menú 'mobile'.
- Header que cambia de estilo al hacer scroll
- Navegación entre episodios (anterior/siguiente)
- Enlaces de regreso a la lista de episodios

## Cómo Agregar un Nuevo Episodio

1. **Agregar la transcripción**: Crea un nuevo archivo `.txt` en la carpeta `transcripciones/` (ej: `Episodio06.txt`)

2. **Actualizar el JSON**: Agrega un nuevo objeto en `data/episodios.json`:
```json
{
  "id": 6,
  "numero": 6,
  "titulo": "Venga Tu Reino | Episodio 06",
  "fecha": "2026-02-11",
  "archivo": "transcripciones/Episodio06.txt",
  "disponible": true,
  "videoUrl": "https://youtu.be/VIDEO_ID",
  "descripcion": "Descripción del episodio"
}
```

3. **Listo**: El nuevo episodio aparecerá automáticamente en todas las páginas del sitio

## Formato de Transcripciones

Las transcripciones deben seguir este formato:

```
Transcripción del Episodio XX (título)

Texto del inicio del episodio... (contenido)
Continuación del contenido... (contenido)
Más contenido... (contenido)
```

El sistema procesa automáticamente el texto y lo formatea en párrafos HTML para una lectura cómoda en el sitio.

## Desarrollo

Este proyecto fue desarrollado con la colaboración de inteligencia artificial (Claude Sonnet 4.5), pero la idea original, la visión y la dirección del proyecto provienen de **Leonardo Bringas**. La IA ayudó en la implementación técnica, pero el concepto y los objetivos fueron definidos completamente por el creador humano.

## Licencia

© 2025 Venga Tu Reino - Pastor Walter Escalante

---

*Desarrollado con la idea original de Leonardo Bringas y asistencia de Claude Sonnet 4.5*
