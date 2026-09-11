# Registro de uso de IA

## Uso general

Se uso IA como asistente para planificar, revisar requisitos, proponer codigo, explicar errores, generar pruebas y preparar documentacion. El estudiante mantiene la responsabilidad de entender, ejecutar, verificar y defender el proyecto.

## Solicitudes relevantes

### Revision de requisitos

Solicitud: revisar el PDF del examen y comparar los requisitos contra el estado del repositorio.

Respuesta incorporada: se identificaron requisitos cumplidos y pendientes, especialmente documentacion, workflows, E2E, deployment y URL publica.

Verificacion del estudiante: se reviso `docs/requirements-checklist.md` y se fueron marcando casillas segun evidencia real.

### Instrucciones visibles

Solicitud: agregar una tarjeta con instrucciones antes de iniciar la partida.

Respuesta incorporada: se agrego texto visible con controles, capsulas y objetivo de victoria.

Verificacion del estudiante: se ejecuto lint y build.

### Estado visible de la partida

Solicitud: mostrar el estado actual de la partida.

Respuesta incorporada: se agrego un indicador `Estado: Listo/Jugando/Terminado/Cargando` basado en `game.status`.

Verificacion del estudiante: se ejecuto lint y build.

### GitHub Actions

Solicitud: configurar CI, E2E y despliegue.

Respuesta incorporada: se agregaron workflows para lint, Playwright E2E y deploy mediante Render deploy hook.

Verificacion del estudiante: se revisaron workflows, se configuro el secreto `RENDER_DEPLOY_HOOK_URL` y se comprobo la ejecucion en GitHub Actions.

### Pruebas E2E mas visibles

Solicitud: hacer la prueba visual mas larga para defensa.

Respuesta incorporada: se agregaron pausas configurables con `E2E_PAUSE_MS` y scripts headed.

Verificacion del estudiante: se ejecuto la prueba visual localmente.

### Pruebas de poderes

Solicitud: hacer que E2E pruebe power-ups.

Respuesta incorporada: se usaron escenarios deterministas para probar escudo y turbo.

Verificacion del estudiante: se ejecuto `npm run test:e2e` y pasaron las pruebas.

### Despliegue en Render

Solicitud: orientar la publicacion en Render.

Respuesta incorporada: se configuro el flujo con Render, deploy hook y correccion de ruta estatica para servir el frontend.

Verificacion del estudiante: se publico la URL `https://power-pong.onrender.com` y se comprobo la API.

## Que verifico el estudiante

- Que el juego abre en navegador.
- Que se puede iniciar partida.
- Que el backend responde JSON.
- Que los comandos `npm run lint`, `npm run build` y `npm run test:e2e` funcionan.
- Que GitHub Actions ejecuta lint, E2E y deployment.
- Que la URL publicada corresponde al repositorio.

## Responsabilidad academica

El codigo y la documentacion deben poder explicarse durante la defensa. La IA se uso como apoyo, no como reemplazo de comprension. El estudiante debe poder modificar el proyecto, justificar las decisiones y demostrar el funcionamiento.
