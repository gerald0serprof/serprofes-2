# CineDB

Aplicación educativa para descubrir películas y series con TMDB y mantener un pequeño catálogo personal. La búsqueda es el punto de entrada: permite filtrar por tipo, género, año y director/creador; el detalle concentra la información, el tráiler, el reparto y las acciones de edición.

## Tecnologías

- Frontend: React 19, Vite y CSS.
- Backend: Node.js, Express, Axios y CORS.
- Datos externos: API v3 de The Movie Database (TMDB).

## Instalación

1. Instala Node.js (versión 18 o posterior).
2. En `backend-peliculas`, ejecuta `npm install`.
3. Copia `backend-peliculas/.env.example` como `backend-peliculas/.env` y añade tu clave: `TMDB_API_KEY=...`. El archivo `.env` no se versiona.
4. En otra terminal, entra en `frontend-peliculas` y ejecuta `npm install`.
5. Inicia el backend con `node server.js` desde `backend-peliculas`.
6. Inicia el frontend con `npm run dev` desde `frontend-peliculas` y abre la URL que muestra Vite.

## Uso

- **Buscar**: introduce un título, elige el tipo y abre los filtros avanzados si los necesitas.
- **Detalle**: pulsa una tarjeta para ver portada, título e idioma originales, nota global, géneros, tráiler y reparto. Las obras personalizadas permiten editar o eliminar aquí.
- **Añadir película / serie**: usa las pestañas dedicadas para crear contenido propio.
- **Próximamente**: selecciona una fecha en el calendario para consultar estrenos de películas o series de ese día.

## Estructura

```text
backend-peliculas/
  config.js        Configuración y variables de entorno
  server.js        API, CRUD, búsqueda, detalle y estrenos
  .env.example     Plantilla de configuración privada
frontend-peliculas/
  src/components/  Vistas reutilizables
  src/services/    Cliente de la API
  src/App.jsx      Estado y navegación de la aplicación
  src/App.css      Hoja de estilos consolidada
```

## Endpoints principales

- `GET /api/search?q=&type=&genre=&year=&director=`
- `GET /api/upcoming?type=movie|tv&date=AAAA-MM-DD`
- CRUD en `/api/peliculas` y `/api/series` (solo el contenido personalizado es modificable).

## Notas

Los datos personalizados se almacenan en memoria y se pierden al reiniciar el backend. TMDB exige una clave válida y puede no disponer de tráiler, reparto o estrenos para todos los títulos.
