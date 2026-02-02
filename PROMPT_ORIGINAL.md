# Prompt del Proyecto

Este archivo contiene el prompt completo que se utilizó para desarrollar este proyecto desde cero.

## Prompt Original (Reconstruido)

Necesito crear un sitio web completo para una miniserie de verano llamada "Venga Tu Reino", dirigida por el Pastor Walter Escalante. El sitio debe ser profesional, moderno y fácil de usar.

**Concepto del proyecto:**
- Es una miniserie que invita a una confrontación constante con la Palabra de Dios para alcanzar una genuina transformación de vida
- El sitio debe presentar los episodios de manera organizada y accesible
- Debe incluir transcripciones completas de cada episodio con timestamps
- Debe integrar videos de YouTube embebidos

**Páginas necesarias:**
1. **Página principal (index.html)**: 
   - Hero section con título y descripción de la serie
   - Lista de los 4 episodios más recientes
   - Diseño atractivo y moderno

2. **Página de episodios (episodios.html)**:
   - Lista completa de todos los episodios disponibles
   - Cada episodio debe mostrar: número, título, fecha, estado (disponible/próximamente)
   - Sección de videos embebidos de YouTube

3. **Página individual de episodio (episodio.html)**:
   - Muestra el contenido completo del episodio
   - Video de YouTube embebido (si está disponible)
   - Transcripción completa formateada con timestamps visibles
   - Navegación entre episodios (anterior/siguiente)
   - Botón para volver a la lista de episodios

4. **Página "Sobre" (sobre.html)**:
   - Información sobre la serie
   - Información sobre el Pastor Walter Escalante
   - Imagen del pastor

**Funcionalidades técnicas:**
- Los episodios deben cargarse dinámicamente desde un archivo JSON (episodios.json)
- Las transcripciones están en archivos .txt con formato específico:
  - Primera línea: "Transcripción de Episodio X..."
  - Luego timestamps en formato "0:00", "1:23", "10:45", etc.
  - Después de cada timestamp viene el texto correspondiente
- El JavaScript debe procesar estos archivos .txt y convertirlos en HTML formateado
- Los timestamps deben mostrarse visualmente en el contenido (como etiquetas o badges)
- El sitio debe ser completamente responsive (móvil, tablet, desktop)
- Menú hamburguesa para móviles
- Header que cambia de estilo al hacer scroll
- Navegación suave entre secciones

**Diseño:**
- Paleta de colores: tonos oscuros y elegantes (negro, gris oscuro, blanco)
- Tipografía moderna y legible (sugerencia: 'Inter' de Google Fonts)
- Diseño limpio y minimalista
- Espaciado generoso y cómodo para la lectura
- Variables CSS para mantener consistencia en todo el sitio
- Efectos de hover suaves y transiciones

**Estructura de datos (episodios.json):**
Cada episodio debe tener:
- id (número)
- numero (número del episodio)
- titulo (título completo)
- fecha (fecha de publicación en formato YYYY-MM-DD)
- archivo (ruta al archivo .txt de transcripción)
- disponible (true/false)
- videoUrl (URL de YouTube o vacío)
- descripcion (descripción breve del episodio)

**Detalles adicionales:**
- El sitio debe funcionar sin necesidad de servidor (solo HTML, CSS, JS)
- Usar JavaScript vanilla (sin frameworks)
- Código limpio, bien organizado y comentado
- SEO básico (meta tags apropiados)
- Accesibilidad básica (aria-labels donde sea necesario)

**Organización de archivos:**
- CSS separado por secciones (styles.css, header.css, hero.css, episodios.css, variable.css, main.css, responsive.css, base.css)
- JavaScript modular (main.js para funcionalidad general, episodios.js para lógica de episodios)
- Carpeta para assets (imágenes)
- Carpeta para transcripciones (archivos .txt)
- Carpeta para datos (JSON)

Por favor, crea el sitio completo con todas estas características. El diseño debe ser profesional y adecuado para un proyecto religioso/sermones, pero moderno y atractivo.

---

**Nota**: Este prompt fue utilizado por Leonardo Bringas en colaboración con Claude Sonnet 4.5 para desarrollar el sitio web de "Venga Tu Reino - Miniserie".
