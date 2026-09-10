# Tareas de desarrollo: Power Pong Arena

Cada tarea debe completarse y revisarse antes de comenzar la siguiente. La intención es que cada paso sea pequeño, explicable durante la defensa y fácil de probar.

## Cómo trabajar cada tarea

Para cada tarea:

1. Leer el objetivo antes de editar.
2. Implementar solo el alcance indicado.
3. Ejecutar la verificación de la tarea.
4. Revisar el diff y explicar qué aprendiste.
5. Anotar decisiones o cambios importantes en `docs/`.

## Fase 0: Preparación

### T01. [x] Convertir el TRD en checklist

- **Objetivo:** transformar los requisitos de `TRD.md` y del PDF del examen en una lista verificable.
- **Conceptos:** requisitos funcionales y no funcionales.
- **Resultado:** `docs/requirements-checklist.md` con checklist de juego, API, pruebas, documentación, entrega, defensa y despliegue.
- **Revisión:** cada requisito del TRD y del PDF aparece en una categoría.
- **Depende de:** ninguna.

### T02. [x] Elegir la estructura del proyecto

- **Objetivo:** crear la estructura `client`, `server`, `tests`, `docs` y `.github`.
- **Conceptos:** separación frontend/backend.
- **Resultado:** carpetas vacías y README de orientación si hace falta.
- **Revisión:** cada carpeta tiene una responsabilidad clara.
- **Depende de:** T01.

### T03. [x] Inicializar React con TypeScript

- **Objetivo:** preparar el cliente con Vite y React.
- **Conceptos:** entrypoint, JSX, TypeScript y build.
- **Resultado:** una pantalla React mínima que compila.
- **Verificación:** ejecutar el script de desarrollo y `build` del cliente.
- **Depende de:** T02.

### T04. [x] Inicializar Express con TypeScript

- **Objetivo:** preparar el servidor HTTP.
- **Conceptos:** Express, servidor, puerto y compilación TypeScript.
- **Resultado:** servidor que responde una ruta de salud en JSON.
- **Verificación:** consultar la ruta con el navegador o `curl`.
- **Depende de:** T02.

### T05. [x] Configurar scripts de calidad

- **Objetivo:** definir scripts de desarrollo, build, lint y start.
- **Conceptos:** scripts npm y automatización.
- **Resultado:** los comandos principales están documentados y funcionan.
- **Verificación:** ejecutar lint y build sin errores.
- **Depende de:** T03 y T04.

## Fase 1: Modelo y contrato

### T06. [x] Definir los tipos de la partida

- **Objetivo:** crear los tipos TypeScript de `GameState`, pelota, paletas, poderes, cápsulas y competidores.
- **Conceptos:** interfaces, uniones literales y composición de tipos.
- **Resultado:** un contrato legible que representa al jugador humano y a la computadora controlada por backend.
- **Verificación:** TypeScript detecta estados inválidos.
- **Depende de:** T05.

### T07. [x] Definir constantes de reglas

- **Objetivo:** centralizar dimensiones, velocidades, duración del escudo y puntuación objetivo.
- **Conceptos:** configuración y reglas explícitas.
- **Resultado:** ningún número crítico queda disperso en la lógica.
- **Verificación:** cambiar una constante modifica el comportamiento esperado.
- **Depende de:** T06.

### T08. [x] Crear el estado inicial

- **Objetivo:** representar una partida en estado `ready`.
- **Conceptos:** estado inicial y valores por defecto.
- **Resultado:** una función crea partidas limpias y reproducibles.
- **Verificación:** iniciar dos partidas produce el mismo esquema inicial.
- **Depende de:** T06 y T07.

### T09. [x] Documentar el contrato de la API

- **Objetivo:** especificar cuerpos, respuestas y errores de cada endpoint.
- **Conceptos:** API REST y contrato entre frontend/backend.
- **Resultado:** `docs/api.md` refleja lo implementado.
- **Verificación:** comparar documentación con los tipos del servidor.
- **Depende de:** T06.

## Fase 2: Backend básico

### T10. [x] Implementar `POST /api/game/start`

- **Objetivo:** crear o reiniciar una partida en memoria.
- **Conceptos:** POST, mutación de estado y respuestas JSON.
- **Resultado:** devuelve un estado `playing` con puntajes en cero.
- **Verificación:** dos llamadas consecutivas reinician el puntaje.
- **Depende de:** T08.

### T11. [x] Implementar `GET /api/game/state`

- **Objetivo:** consultar el estado actual.
- **Conceptos:** GET y lectura del estado del servidor.
- **Resultado:** devuelve la partida sin modificarla.
- **Verificación:** consultar dos veces produce el mismo estado si no hay tick.
- **Depende de:** T10.

### T12. [x] Implementar acciones de movimiento

- **Objetivo:** aceptar movimiento arriba/abajo del jugador.
- **Conceptos:** validación del body y actualización de posición.
- **Resultado:** la paleta se mueve dentro de los límites.
- **Verificación:** enviar una acción válida cambia la posición.
- **Depende de:** T10 y T11.

### T13. [x] Validar movimientos inválidos

- **Objetivo:** impedir que la paleta salga de la cancha.
- **Conceptos:** reglas de validación y feedback de error.
- **Resultado:** respuesta `ok: false` con mensaje claro.
- **Verificación:** intentar cruzar un límite devuelve error y conserva un estado válido.
- **Depende de:** T12.

### T14. [x] Implementar el movimiento automático

- **Objetivo:** mover la paleta de la computadora hacia la pelota.
- **Conceptos:** algoritmo de seguimiento simple y velocidad limitada.
- **Resultado:** la computadora reacciona sin intervención del navegador.
- **Verificación:** después de varios ticks, su posición se aproxima a la pelota.
- **Depende de:** T06 y T07.

## Fase 3: Física y reglas

### T15. [x] Implementar el movimiento de la pelota

- **Objetivo:** actualizar la posición usando velocidad y dirección.
- **Conceptos:** coordenadas, vectores simples y tick.
- **Resultado:** la pelota cambia de posición en cada tick.
- **Verificación:** dos ticks consecutivos producen posiciones distintas.
- **Depende de:** T07 y T08.

### T16. [x] Implementar rebotes en paredes

- **Objetivo:** invertir la dirección vertical al tocar los límites superior/inferior.
- **Conceptos:** colisión con límites.
- **Resultado:** la pelota nunca atraviesa la pared.
- **Verificación:** probar posiciones cercanas a ambos límites.
- **Depende de:** T15.

### T17. [x] Implementar colisiones con paletas

- **Objetivo:** detectar contacto entre pelota y paleta e invertir su dirección horizontal.
- **Conceptos:** detección de rectángulos y zonas de colisión.
- **Resultado:** una paleta devuelve la pelota cuando el contacto es válido.
- **Verificación:** probar contacto y casi-contacto.
- **Depende de:** T12, T14 y T15.

### T18. [x] Implementar el endpoint `POST /api/game/tick`

- **Objetivo:** ejecutar una actualización completa del juego.
- **Conceptos:** composición de reglas en un ciclo controlado.
- **Resultado:** el endpoint actualiza pelota, computadora y colisiones.
- **Verificación:** la respuesta contiene el estado actualizado.
- **Depende de:** T14, T16 y T17.

### T19. [x] Implementar puntos

- **Objetivo:** detectar cuando la pelota sale por un lateral y sumar al rival.
- **Conceptos:** reglas de puntuación y reinicio parcial.
- **Resultado:** el marcador cambia correctamente.
- **Verificación:** simular salida izquierda y derecha.
- **Depende de:** T18.

### T20. [x] Reiniciar la pelota después de un punto

- **Objetivo:** devolver la pelota al centro con nueva dirección.
- **Conceptos:** reset de estado y variabilidad controlada.
- **Resultado:** la siguiente jugada comienza desde el centro.
- **Verificación:** la posición central se respeta después de puntuar.
- **Depende de:** T19.

### T21. [x] Implementar victoria y finalización

- **Objetivo:** terminar la partida al alcanzar 7 puntos y dejar definida la regla de empate.
- **Conceptos:** máquina de estados y condición terminal.
- **Resultado:** se guarda el ganador, el estado pasa a `finished` y el empate queda documentado como no aplicable por reglas.
- **Verificación:** un estado terminado no vuelve a `playing` con un tick y no existe un resultado ambiguo.
- **Depende de:** T19.

### T22. [x] Bloquear acciones después de terminar

- **Objetivo:** impedir movimientos y poderes después de la victoria.
- **Conceptos:** guardas de estado y acciones inválidas.
- **Resultado:** el servidor responde con un error visible.
- **Verificación:** enviar acción tras finalizar conserva el estado.
- **Depende de:** T21.

## Fase 4: Cápsulas y poderes

### T23. [x] Generar cápsulas aleatorias

- **Objetivo:** crear cápsulas con posición y tipo durante la partida.
- **Conceptos:** aleatoriedad acotada y variabilidad.
- **Resultado:** puede existir una cápsula activa en la cancha.
- **Verificación:** las posiciones siempre están dentro de los límites.
- **Depende de:** T18.

### T24. [x] Detectar recogida de cápsulas

- **Objetivo:** entregar la cápsula cuando una paleta la toca.
- **Conceptos:** reutilización de colisiones y transición de estado.
- **Resultado:** la cápsula desaparece y se asigna su poder.
- **Verificación:** una cápsula recogida no puede recogerse dos veces.
- **Depende de:** T23.

### T25. [x] Implementar el escudo

- **Objetivo:** aumentar la paleta durante 30 segundos y luego restaurarla.
- **Conceptos:** tiempo, expiración y estado derivado.
- **Resultado:** el escudo se activa, se muestra y expira.
- **Verificación:** comprobar activación y expiración con un reloj controlable.
- **Depende de:** T24.

### T26. [x] Implementar el golpe turbo

- **Objetivo:** acelerar la pelota en el siguiente impacto y consumir el poder.
- **Conceptos:** recurso de un solo uso y efecto diferido.
- **Resultado:** el turbo desaparece después del impacto.
- **Verificación:** comprobar que no se consume antes ni permanece después.
- **Depende de:** T24 y T17.

### T27. [x] Añadir el modo determinista de pruebas

- **Objetivo:** permitir escenarios controlados solo en entorno de pruebas.
- **Conceptos:** test hooks, configuración y aislamiento.
- **Resultado:** E2E puede provocar cápsulas, puntos y resultado.
- **Verificación:** el modo no está activo en producción normal.
- **Depende de:** T23-T26.

## Fase 5: Frontend

### T28. [x] Crear el cliente API

- **Objetivo:** centralizar llamadas `fetch`, JSON y errores.
- **Conceptos:** funciones asíncronas y contratos compartidos.
- **Resultado:** React no repite lógica HTTP.
- **Verificación:** iniciar y consultar usan las rutas correctas.
- **Depende de:** T09-T11.

### T29. Crear la pantalla de inicio

- **Objetivo:** permitir iniciar una partida desde la interfaz.
- **Conceptos:** eventos, estado de carga y feedback.
- **Resultado:** el botón llama al backend y muestra la respuesta.
- **Verificación:** la interfaz cambia a estado de juego.
- **Depende de:** T28.

### T30. Renderizar la cancha

- **Objetivo:** mostrar pelota, paletas, límites, instrucciones visibles y recursos visuales del juego.
- **Conceptos:** renderizado basado en estado y CSS propio.
- **Resultado:** la cancha ocupa el área visible del navegador e integra escenario, controles, marcador y estado.
- **Verificación:** los elementos aparecen en posiciones correctas.
- **Depende de:** T29.

### T31. Renderizar marcador y estado

- **Objetivo:** mostrar puntajes, estado, ganador y mensajes.
- **Conceptos:** componentes presentacionales y feedback accesible.
- **Resultado:** ningún estado importante depende de la consola.
- **Verificación:** cambiar el fixture del estado cambia la UI.
- **Depende de:** T30.

### T32. Renderizar poderes y temporizadores

- **Objetivo:** mostrar cápsulas, turbo disponible y escudo activo.
- **Conceptos:** estados visuales y tiempo restante.
- **Resultado:** el usuario entiende cuándo puede usar un poder.
- **Verificación:** probar estados disponible, activo y consumido.
- **Depende de:** T31 y T25-T26.

### T33. Capturar controles del teclado

- **Objetivo:** traducir `W` y `S` en acciones del jugador.
- **Conceptos:** eventos de teclado y ciclo de vida de efectos.
- **Resultado:** las teclas mueven la paleta sin desplazar la página.
- **Verificación:** E2E observa un cambio de posición.
- **Depende de:** T30.

### T34. Coordinar el ciclo de ticks

- **Objetivo:** enviar ticks periódicos y actualizar el estado.
- **Conceptos:** intervalos, limpieza de efectos y sincronización.
- **Resultado:** la partida avanza mientras está activa.
- **Verificación:** no existen intervalos duplicados al re-renderizar.
- **Depende de:** T18 y T31.

### T35. Manejar errores y reinicio

- **Objetivo:** mostrar errores de red/acción y permitir nueva partida.
- **Conceptos:** estados de error y flujo de recuperación.
- **Resultado:** el usuario nunca queda sin feedback.
- **Verificación:** simular error HTTP y reiniciar desde resultado.
- **Depende de:** T29-T34.

### T36. Revisar responsive y accesibilidad

- **Objetivo:** asegurar uso cómodo en escritorio y móvil.
- **Conceptos:** CSS responsive, foco, etiquetas, contraste y uso significativo de pantalla.
- **Resultado:** controles, instrucciones y estados son legibles y navegables.
- **Verificación:** revisar tamaños de pantalla y navegación por teclado.
- **Depende de:** T30-T35.

## Fase 6: Pruebas y documentación

### T37. Crear E2E de inicio

- **Objetivo:** comprobar que la pantalla inicial carga y permite iniciar.
- **Verificación:** prueba headless en navegador real.
- **Depende de:** T29.

### T38. Crear E2E de cancha y comunicación

- **Objetivo:** comprobar render de elementos y respuesta del backend.
- **Verificación:** interceptar o observar la petición real a la API.
- **Depende de:** T30-T34.

### T39. Crear E2E de controles y acción inválida

- **Objetivo:** comprobar movimiento y feedback de una acción inválida.
- **Verificación:** usar teclado y assertions visibles.
- **Depende de:** T33 y T35.

### T40. Crear E2E determinista de poderes y resultado

- **Objetivo:** comprobar cápsula, escudo/turbo y finalización.
- **Verificación:** usar el modo determinista de pruebas.
- **Depende de:** T27, T32 y T35.

### T41. Documentar reglas y decisiones

- **Objetivo:** crear `docs/introduccion.md`, `docs/reglas.md`, `docs/decisiones.md` y `docs/riesgos.md`.
- **Verificación:** otra persona puede explicar nombre, proposito, reglas, jugadores, empate no aplicable, movimientos, estados, interaccion, decisiones, riesgos y cambios importantes leyendo la documentación.
- **Depende de:** T21-T26.

### T42. Documentar API, E2E, publicación y uso de IA

- **Objetivo:** registrar contrato, investigación, despliegue, variables de entorno, puerto, fuentes consultadas, limitaciones y uso de herramientas de IA.
- **Verificación:** la documentación coincide con la implementación final e indica solicitudes relevantes de IA, respuestas incorporadas y verificaciones del estudiante.
- **Depende de:** T09, T27 y T40.

### T43. Completar el README

- **Objetivo:** documentar requisitos, instalación, comandos, arquitectura, endpoints JSON, variables de entorno, ejecución local, pruebas, despliegue y URL pública.
- **Verificación:** clonar el repositorio y seguir el README desde cero.
- **Depende de:** T05, T40 y T42.

## Fase 7: CI/CD y entrega

### T44. Configurar workflow de lint

- **Objetivo:** ejecutar lint de frontend y backend en GitHub Actions.
- **Verificación:** el workflow falla ante un error intencional y pasa en main.
- **Depende de:** T05.

### T45. Configurar workflow E2E

- **Objetivo:** instalar navegadores, levantar la aplicación y ejecutar E2E headless.
- **Verificación:** el workflow completa sin interacción manual y existe comando equivalente para ejecutar visualmente en Chrome durante la defensa.
- **Depende de:** T37-T40.

### T46. Preparar despliegue en Render

- **Objetivo:** definir build, start, puerto y serving del frontend.
- **Verificación:** la configuración puede crear un servicio Node único.
- **Depende de:** T05 y T43.

### T47. Crear workflow de deployment

- **Objetivo:** publicar la aplicación mediante el mecanismo elegido.
- **Verificación:** el workflow produce un deployment identificable y puede reflejar un cambio solicitado durante la defensa.
- **Depende de:** T46.

### T48. Verificar la URL pública

- **Objetivo:** comprobar frontend, API, flujo principal y prueba E2E visual en producción.
- **Verificación:** una sola URL sirve la aplicación, las acciones funcionan y Playwright o herramienta equivalente puede usar Chrome visual contra esa URL.
- **Depende de:** T47.

### T49. Ejecutar checklist final

- **Objetivo:** revisar todos los requisitos del TRD antes de la defensa.
- **Verificación:** cada requisito tiene evidencia: código, prueba, documento, workflow, video o URL; el repositorio está actualizado antes del 15 de septiembre de 2026 a horas 16:00.
- **Depende de:** T41-T48.

### T50. Preparar la defensa

- **Objetivo:** crear una explicación breve de arquitectura, estado, API, física, decisiones, uso de IA y estrategia de despliegue.
- **Verificación:** poder explicar y modificar las partes principales en menos de 10 minutos, ejecutar E2E en producción, activar GitHub Actions y demostrar el cambio publicado.
- **Depende de:** T49.

### T51. Preparar video de entrega

- **Objetivo:** grabar un video de 3 a 5 minutos con la evidencia solicitada por el examen.
- **Conceptos:** comunicacion tecnica y evidencia de entrega.
- **Resultado:** video que muestra una partida, una solicitud JSON, una prueba E2E visual en Chrome, resultados de GitHub Actions y la aplicacion publicada.
- **Verificación:** el video dura entre 3 y 5 minutos y corresponde al mismo repositorio y URL publicados.
- **Depende de:** T48.
