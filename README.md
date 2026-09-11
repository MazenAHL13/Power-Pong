# Power Pong Arena

Juego web inspirado en Pong para el proyecto final de certificacion.

URL publica:

```text
https://power-pong.onrender.com
```

## Resumen

Power Pong Arena enfrenta a un jugador humano contra una computadora controlada por el backend. El jugador mueve la paleta izquierda con `W` y `S`. La computadora mueve la paleta derecha desde Express. La pelota rebota en paredes y paletas, y gana el primero que llega a 7 puntos.

Durante la partida aparecen capsulas de poder:

- Azul: escudo, agranda temporalmente la paleta.
- Amarilla: turbo, guarda un golpe mas fuerte para el siguiente impacto.

La aplicacion usa una sola URL en produccion: Express sirve la API JSON y el frontend compilado bajo el mismo dominio y puerto.

## Requisitos

- Node.js 22.
- npm.
- Navegador compatible con Chromium para pruebas E2E.

## Instalacion

```bash
npm install
```

## Comandos

Desarrollo del frontend:

```bash
npm run dev:client
```

Desarrollo del backend:

```bash
npm run dev:server
```

Validar linters:

```bash
npm run lint
```

Compilar frontend y backend:

```bash
npm run build
```

Ejecutar produccion local despues de compilar:

```bash
npm run start
```

Pruebas E2E headless:

```bash
npm run test:e2e
```

Pruebas E2E visuales en Chrome:

```bash
npm run test:e2e:headed
```

Prueba E2E visual contra la URL publicada:

```bash
PLAYWRIGHT_BASE_URL=https://power-pong.onrender.com npm run test:e2e:prod
```

## Arquitectura

```text
client/       React + TypeScript + CSS propio
server/       Express + TypeScript y reglas principales del juego
shared/       Tipos compartidos entre frontend y backend
tests/e2e/    Pruebas Playwright
docs/         Documentacion tecnica del proyecto
.github/      Workflows de lint, E2E y despliegue
```

React se encarga de mostrar la cancha, marcador, instrucciones, estado, resultado y errores. Tambien captura el teclado y llama a la API con `fetch`.

Express conserva la partida en memoria, valida acciones, mueve la computadora, calcula movimiento, colisiones, puntos, poderes, ganador y devuelve respuestas JSON.

## Endpoints JSON

- `GET /api/health`: comprueba que el servidor esta activo.
- `POST /api/game/start`: inicia o reinicia una partida.
- `POST /api/game/reset`: vuelve a estado `ready`.
- `GET /api/game/state`: devuelve la partida actual.
- `POST /api/game/action`: recibe movimiento del jugador.
- `POST /api/game/tick`: avanza la simulacion.
- `POST /api/game/difficulty`: cambia la dificultad.
- `POST /api/test/scenario`: endpoint solo para pruebas cuando `TEST_MODE=true`.

La documentacion completa de entrada, salida y ejemplos esta en `docs/api.md`.

## Variables de entorno

- `PORT`: puerto usado por Express. Render lo define automaticamente.
- `TEST_MODE`: si vale `true`, activa el endpoint de escenarios E2E.
- `PLAYWRIGHT_BASE_URL`: URL usada por Playwright para probar una app publicada.
- `E2E_PAUSE_MS`: pausa visual entre pasos del E2E en modo defensa.
- `RENDER_DEPLOY_HOOK_URL`: secreto de GitHub Actions para activar despliegue en Render.

## GitHub Actions y despliegue

El repositorio incluye tres workflows:

- `Lint`: ejecuta `npm run lint` para frontend y backend.
- `E2E`: instala Chromium y ejecuta `npm run test:e2e` en modo headless.
- `Deploy`: ejecuta `npm run build` y activa el despliegue mediante un deploy hook de Render.

Render usa:

```text
Build Command: npm install && npm run build
Start Command: npm run start
```

Para que `Deploy` publique la aplicacion, GitHub debe tener el secreto `RENDER_DEPLOY_HOOK_URL` con la URL del deploy hook del servicio en Render.

## Documentos principales

- `docs/introduccion.md`: proposito, experiencia y boceto.
- `docs/reglas.md`: jugadores, reglas, estados, empate e interaccion.
- `docs/api.md`: contrato HTTP REST.
- `docs/decisiones.md`: decisiones tecnicas y cambios importantes.
- `docs/riesgos.md`: riesgos y mitigaciones.
- `docs/investigacion.md`: pruebas E2E, despliegue, puerto, variables y limitaciones.
- `docs/uso-ia.md`: registro del uso de IA.
- `docs/requirements-checklist.md`: checklist de requisitos del examen.

## Entrega y defensa

El repositorio de GitHub debe estar actualizado como maximo hasta el 15 de septiembre de 2026 a horas 16:00, segun GitHub.

La defensa dura maximo 10 minutos e incluye:

- ejecucion E2E visual en Chrome contra produccion;
- cambio solicitado por el docente;
- validacion con linters;
- E2E headless;
- despliegue de la aplicacion completa;
- cambio visible en la URL publicada.

Tambien se debe preparar un video de 3 a 5 minutos mostrando una partida, una solicitud JSON, una prueba E2E en Chrome, GitHub Actions y la aplicacion publicada.
