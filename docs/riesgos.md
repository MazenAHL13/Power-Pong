# Riesgos y mitigaciones

## Riesgo: que el backend no participe lo suficiente

Mitigacion: la logica principal vive en Express. El servidor conserva estado, valida movimientos, mueve la computadora, calcula colisiones, puntos, poderes y ganador.

## Riesgo: que la interfaz no muestre estado suficiente

Mitigacion: la pantalla muestra cancha, marcador, estado de la partida, instrucciones, controles, resultado y errores visibles.

## Riesgo: aleatoriedad dificil de probar

Mitigacion: existe `TEST_MODE=true` con escenarios deterministas para pruebas E2E. Asi se pueden probar capsulas, escudo, turbo y puntos sin esperar eventos aleatorios.

## Riesgo: deployment incompleto

Mitigacion: Express sirve frontend y API desde una sola URL. El proyecto usa Render para ejecutar Node en produccion y GitHub Actions para activar deployment mediante deploy hook.

## Riesgo: E2E visual demasiado rapido para defensa

Mitigacion: se agrego `E2E_PAUSE_MS` y scripts visuales para que la prueba pueda verse con calma en Chrome.

## Riesgo: rutas estaticas distintas entre local y Render

Mitigacion: el servidor busca `client/dist` en varias rutas posibles para soportar ejecucion desde la raiz del repo o desde el workspace del servidor.

## Riesgo: cambio solicitado durante defensa

Mitigacion: el proyecto mantiene reglas simples, archivos pequenos y comandos claros: `npm run lint`, `npm run build`, `npm run test:e2e` y workflow `Deploy`.

## Riesgo: dependencia de secretos

Mitigacion: el deploy hook de Render no se guarda en el codigo. Se configura como secreto de GitHub Actions con el nombre `RENDER_DEPLOY_HOOK_URL`.
