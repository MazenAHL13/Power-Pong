# Power Pong Arena

Juego web inspirado en Pong para el proyecto final de certificacion.

## Resumen

Power Pong Arena tendra un frontend en React + TypeScript y un backend en Express + TypeScript. El juego enfrenta a un jugador humano contra una computadora controlada por una estrategia del backend, cumpliendo el requisito de al menos dos competidores.

La aplicacion usara una sola URL en produccion: Express servira la API JSON y el frontend compilado bajo el mismo dominio y puerto.

## Documentos principales

- `TRD.md`: requisitos del proyecto adaptados al juego.
- `specs.md`: especificacion funcional y tecnica.
- `tasks.md`: plan de desarrollo verificable por fases.
- `docs/`: documentacion tecnica requerida durante el desarrollo.

## Requisitos del examen cubiertos por el plan

- React, Express y TypeScript.
- Comunicacion real con `fetch` y JSON.
- Al menos un endpoint `GET` y un endpoint `POST` de la partida.
- CSS propio, sin Bootstrap, Tailwind, Axios, React Router, Redux, motores de juegos ni bibliotecas de componentes.
- Juego con dos competidores, movimiento, interaccion, tres o mas tipos de estado, acciones validas e invalidas, victoria, empate definido y finalizacion.
- Variabilidad mediante capsulas aleatorias y estrategia variable de la computadora.
- Retroalimentacion visual, instrucciones visibles y recursos graficos del juego.
- Pruebas E2E headless en GitHub Actions y visuales en Chrome durante la defensa.
- Workflows de lint, E2E y deployment.
- URL publica funcional para frontend y backend.
- Documentacion en Markdown, README completo y registro del uso de IA.

## Entrega y defensa

El repositorio de GitHub debe estar actualizado como maximo hasta el 15 de septiembre de 2026 a horas 16:00, segun GitHub. La defensa dura maximo 10 minutos e incluye una prueba E2E visual contra produccion y un cambio solicitado que debe pasar lint, E2E headless y deployment.

Tambien se debe preparar un video de 3 a 5 minutos mostrando una partida, una solicitud JSON, una prueba E2E en Chrome, GitHub Actions y la aplicacion publicada.

## GitHub Actions y despliegue

El repositorio incluye tres workflows:

- `Lint`: ejecuta `npm run lint` para frontend y backend.
- `E2E`: instala Chromium y ejecuta `npm run test:e2e` en modo headless.
- `Deploy`: ejecuta `npm run build` y activa el despliegue mediante un deploy hook de Render.

Para que `Deploy` publique la aplicacion, GitHub debe tener el secreto
`RENDER_DEPLOY_HOOK_URL` con la URL del deploy hook del servicio en Render.

Para ejecutar la prueba E2E visual contra la aplicacion publicada durante la
defensa:

```bash
PLAYWRIGHT_BASE_URL=https://TU-URL-PUBLICA npm run test:e2e:prod
```
