## README.md no actualizado

### Venga Tu Reino - Miniserie

Sitio web estático de la miniserie **"Venga Tu Reino"**, con listado de episodios, página individual por episodio, transcripciones en Markdown y video de YouTube embebido por episodio.

## Descripción

El proyecto presenta una serie de mensajes centrados en la transformación de vida a la luz de la Palabra de Dios. El contenido se administra desde un archivo JSON y archivos Markdown, sin backend ni framework.

## Características actuales

- Navegación responsive (desktop y móvil).
- Lista de episodios dinámica desde `data/episodios.json`.
- Página individual `episodio.html?id=...` con:
  - Título, número y fecha.
  - Video de YouTube embebido.
  - Transcripción renderizada desde Markdown.
  - Navegación entre episodio anterior y siguiente.
- Manejo de estados de carga, vacío y error.
- Cache en memoria de transcripciones para evitar recargas repetidas.

## Stack

- `HTML5`
- `CSS3`
- `JavaScript` (vanilla)
- `JSON` para metadatos de episodios
- `Markdown` para transcripciones
- Librería externa: `marked` (CDN) para parseo Markdown

## Estructura del proyecto

```text
VengaTuReino-MiniSerie/
├── assets/
│   └── images/
│       ├── leo.jpeg
│       ├── logo-iglesia-restauracion.jpg
│       └── pastor-waltescalante.jpg
│
├── css/
│   ├── base/
│   │   ├── reset.css
│   │   ├── responsive.css
│   │   ├── typography.css
│   │   └── variables.css
│   ├── components/
│   │   ├── episodios.css
│   │   ├── header.css
│   │   ├── hero.css
│   │   └── loading.css
│   └── layout/
│       └── container.css
│
├── data/
│   └── episodios.json
├── js/
│   ├── core/
│   │   └── navigation.js
│   └── modules/
│       └── episodios.js
│
├── transcripciones/
│   ├── Episodio01.md
│   ├── Episodio02.md
│   ├── Episodio03.md
│   ├── Episodio04.md
│   └── Episodio05.md
│
├── episodio.html
├── episodios.html
├── index.html
├── sobre.html
├── PROMPT_ORIGINAL.md
└── README.md
```

## Flujo de datos

1. `js/modules/episodios.js` carga `data/episodios.json`.
2. Según la página:
   - `index.html` muestra episodios recientes (`data-limite="5"`).
   - `episodios.html` muestra todos los episodios.
   - `episodio.html?id=N` busca el episodio por `id`.
3. Si existe `archivo`, carga la transcripción Markdown y la renderiza con `marked`.
4. Si existe `videoUrl`, genera el `embed` de YouTube en la página individual.

## Formato de `data/episodios.json`

Cada episodio sigue esta estructura:

```json
{
  "id": 6,
  "numero": 6,
  "titulo": "TÍTULO DEL EPISODIO",
  "fecha": "2026-02-11",
  "archivo": "transcripciones/Episodio06.md",
  "disponible": true,
  "videoUrl": "https://youtu.be/VIDEO_ID",
  "descripcion": "Resumen breve del episodio"
}
```

## Cómo agregar un nuevo episodio

1. Crear la transcripción en `transcripciones/` con nombre consistente, por ejemplo: `Episodio06.md`.
2. Agregar el nuevo objeto en `data/episodios.json`.
3. Verificar:
   - Que `id` no se repita.
   - Que `archivo` apunte al `.md` correcto.
   - Que `videoUrl` sea una URL válida de YouTube.
4. Al recargar, el episodio aparece automáticamente en el listado y en su vista individual.

## Desarrollo local

Como el proyecto usa `fetch()` para leer JSON y Markdown, conviene servirlo con un servidor local (no abrir con doble clic):

```bash
# Opción 1: VS Code Live Server
# Abrir la carpeta y usar "Open with Live Server"

# Opción 2: Python (la que usó)
python -m http.server 5000
```

Luego abrir `http://localhost:5000`.

---

## Créditos

- Dirección de la miniserie: **Pr. Walter Escalante**
- Desarrollo: **Leonardo Bringas** y **Claude Sonnet 4.5**

