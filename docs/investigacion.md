# Investigacion tecnica

## Pruebas E2E

Se uso Playwright porque permite probar la aplicacion como usuario real en un navegador. Las pruebas abren la pagina, verifican contenido visible, presionan botones, usan teclado y consultan respuestas del backend.

Comando headless:

```bash
npm run test:e2e
```

Comando visual en Chrome para defensa:

```bash
npm run test:e2e:headed
```

Comando visual contra produccion:

```bash
PLAYWRIGHT_BASE_URL=https://power-pong.onrender.com npm run test:e2e:prod
```

## Cobertura E2E

Las pruebas cubren:

- carga de la cancha;
- marcador inicial;
- instrucciones visibles;
- estado `Listo`;
- inicio de partida;
- estado `Jugando`;
- paletas y pelota visibles;
- movimiento del jugador con teclado;
- movimiento de la pelota;
- recoleccion de escudo;
- crecimiento de la paleta con escudo;
- recoleccion de turbo;
- comunicacion con el backend mediante API real.

## Modo determinista

Para probar poderes se usa:

```text
POST /api/test/scenario
```

Este endpoint solo responde cuando `TEST_MODE=true`. En produccion normal devuelve `404`.

## Publicacion

Se eligio Render porque el proyecto necesita ejecutar Express. GitHub Pages sirve sitios estaticos, pero no ejecuta un backend Node/Express por si solo.

URL publica:

```text
https://power-pong.onrender.com
```

Configuracion de Render:

```text
Environment: Node
Build Command: npm install && npm run build
Start Command: npm run start
```

Render define `PORT` automaticamente. El servidor Express lee esa variable:

```ts
const port = Number(process.env.PORT ?? 3000);
```

## GitHub Actions

Se agregaron tres workflows:

- `Lint`: valida frontend y backend con ESLint.
- `E2E`: instala Chromium y ejecuta Playwright headless.
- `Deploy`: compila y activa Render mediante deploy hook.

El secreto usado para deployment es:

```text
RENDER_DEPLOY_HOOK_URL
```

## Fuentes consultadas

- Documentacion oficial de Playwright para ejecucion headless, headed y configuracion `baseURL`.
- Documentacion oficial de GitHub Actions para workflows, secrets y artifacts.
- Documentacion oficial de Render para Web Services, puerto `PORT` y deploy hooks.
- Documentacion de Express para `express.static` y rutas JSON.

## Limitaciones

- La partida se guarda en memoria. Si el servidor reinicia, se pierde el estado.
- No hay cuentas, base de datos ni ranking.
- La prueba E2E contra produccion no usa el endpoint privado de escenarios, porque ese endpoint esta pensado solo para pruebas locales con `TEST_MODE=true`.
- Docker no se uso porque Render puede ejecutar el servicio Node directamente.
