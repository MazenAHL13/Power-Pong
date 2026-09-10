# TDR - Proyecto Final: Power Pong Arena

## Objetivo

Desarrollar un juego web llamado **Power Pong Arena**, inspirado en Pong, usando **React + TypeScript** para el frontend y **Express + TypeScript** para el backend.

El objetivo principal no es hacer un juego complejo, sino construir una aplicación sencilla, jugable, fácil de explicar, fácil de modificar durante la defensa y que cumpla todos los requisitos del proyecto final.

## Prioridades del proyecto

1. Simplicidad antes que complejidad.
2. Código legible y organizado.
3. Nombres claros para variables, funciones y componentes.
4. Comentarios breves en partes importantes de la lógica del juego.
5. Reglas fáciles de explicar.
6. Backend participando realmente en la partida.
7. Pruebas E2E simples pero demostrables.
8. Documentación clara en Markdown dentro de `docs/`.

## Descripción del juego

**Power Pong Arena** es una versión de Pong con dos competidores: un jugador humano y una computadora controlada por una estrategia del backend.

El jugador humano controla la paleta izquierda. El backend controla la paleta derecha con una estrategia simple que sigue la pelota con velocidad limitada. La pelota rebota en las paredes y en las paletas. Si la pelota pasa detrás de una paleta, el rival gana un punto. Gana el primer competidor que llegue a 7 puntos.

Durante la partida aparecen cápsulas especiales en posiciones aleatorias del campo. Si una paleta toca una cápsula, el competidor obtiene un poder.

## Poderes

### Escudo

- Agranda la paleta del competidor durante 30 segundos.
- Ayuda a defender mejor.
- Debe mostrarse visualmente en la interfaz.
- Debe tener un temporizador visible o un estado claro.

### Golpe turbo

- El competidor guarda un golpe especial.
- La próxima vez que su paleta golpee la pelota, la pelota aumenta su velocidad.
- Después de usarlo, el poder desaparece.
- Debe mostrarse visualmente cuando el competidor tiene el poder disponible.

## Reglas principales

- Hay dos competidores: jugador humano y computadora.
- El jugador humano usa `W` y `S` para mover la paleta izquierda.
- La computadora mueve la paleta derecha desde la lógica del backend.
- La pelota se mueve automáticamente.
- Las paletas no pueden salir del área de juego.
- Si la pelota sale por el lado izquierdo, la computadora gana un punto.
- Si la pelota sale por el lado derecho, el jugador humano gana un punto.
- Después de cada punto, la pelota vuelve al centro.
- Gana quien llegue primero a 7 puntos.
- El empate queda definido como no aplicable en la regla normal, porque cada punto se asigna a un solo competidor y la partida termina inmediatamente al llegar a 7. El sistema debe documentar esta decision y mostrar solo ganador o partida en curso.
- Si la partida terminó, no se deben aceptar más acciones de juego.
- Debe existir al menos una acción inválida visible, por ejemplo intentar iniciar una partida ya terminada sin reiniciar, mover una paleta fuera del campo o usar un poder que no se tiene.

## Requisitos obligatorios del examen

El proyecto debe cumplir estos puntos:

- Frontend con **React y TypeScript**.
- Backend con **Express y TypeScript**.
- Comunicación real entre React y Express usando `fetch`.
- Toda la API debe usar JSON.
- Debe existir al menos un endpoint `GET` y un endpoint `POST` relacionados con la partida.
- El frontend y backend deben funcionar bajo el mismo dominio y puerto en producción.
- Express debe servir el frontend compilado o usar una configuración equivalente.
- No usar Bootstrap, Tailwind, Axios, React Router, Redux, motores de juegos ni bibliotecas de componentes.
- No usar librerías externas para resolver la lógica principal del juego.
- Usar CSS propio.
- La pantalla debe usar el área visible del navegador, no solo un formulario pequeño, e integrar cancha, marcadores, controles, estado e instrucciones visibles.
- Debe haber al menos dos competidores. En este proyecto son jugador humano y computadora controlada por el backend.
- Debe haber elementos en movimiento.
- Debe haber interacción entre jugadores.
- Debe haber al menos tres tipos de estado.
- Deben existir reglas de inicio, acciones válidas, acciones inválidas, victoria, empate definido y finalización.
- Debe haber decisiones estratégicas.
- Cada partida debe tener variabilidad, por ejemplo cápsulas aleatorias.
- La interfaz debe mostrar retroalimentación visual sin depender de la consola, incluyendo recursos, errores, resultado y cambios importantes.
- Deben usarse imagenes o recursos visuales propios del juego, por ejemplo estilo pixelado o elementos graficos simples.
- Deben existir pruebas E2E con Playwright, Cypress o herramienta equivalente.
- Las pruebas E2E deben poder ejecutarse headless en GitHub Actions y visualmente en Chrome durante la defensa.
- Una prueba E2E debe poder ejecutarse visualmente en Chrome contra la URL publica durante la defensa.
- Deben existir GitHub Actions para linting, pruebas E2E y deployment.
- La aplicación completa debe publicarse en una URL funcional.
- Debe existir README con requisitos, comandos, arquitectura, endpoints JSON, variables de entorno y enlace al despliegue.
- Debe existir carpeta `docs/` con documentación técnica.
- Debe documentarse el uso de IA, indicando solicitudes relevantes, respuestas incorporadas y verificaciones del estudiante.
- El repositorio de GitHub debe estar actualizado como maximo hasta el 15 de septiembre de 2026 a horas 16:00, segun la fecha y hora registrada por GitHub.
- Debe prepararse un video de 3 a 5 minutos mostrando una partida, una solicitud JSON, una prueba E2E visual en Chrome, GitHub Actions y la aplicacion publicada.
- La defensa dura como maximo 10 minutos e incluye ejecucion E2E en produccion y un cambio solicitado que debe pasar lint, E2E headless y deployment.
- El juego no puede ser tres en raya, buscaminas, adivinanzas basadas en tablas, Space Invaders, un juego hecho en clase, una coleccion de minijuegos ni una aplicacion que solo registre puntajes.

## Estados principales del juego

El juego debe manejar de forma clara estos estados:

- Posición de la pelota.
- Velocidad de la pelota.
- Dirección de la pelota.
- Posición de la paleta izquierda.
- Posición de la paleta derecha.
- Puntaje del jugador humano y de la computadora.
- Poder activo o disponible de cada competidor.
- Tiempo restante del escudo.
- Cápsula especial actual.
- Estado de la partida: inicio, jugando, terminado.
- Ganador.
- Mensaje visible reciente.

## Responsabilidades de React

React debe encargarse de:

- Mostrar la pantalla de inicio.
- Mostrar la cancha de juego.
- Dibujar pelota, paletas, cápsulas, marcador y mensajes.
- Capturar teclas del jugador humano.
- Enviar acciones al backend usando `fetch`.
- Consultar o recibir el estado actualizado del backend.
- Mostrar poderes disponibles y activos.
- Mostrar mensajes de error o acciones inválidas.
- Mostrar instrucciones visibles, controles, estado de la partida y recursos visuales del juego.
- Mostrar pantalla o sección de resultado final.

## Responsabilidades de Express

Express debe encargarse de al menos estas responsabilidades reales:

- Crear una nueva partida.
- Guardar el estado actual de la partida en memoria del servidor.
- Validar acciones del jugador humano.
- Mover la paleta de la computadora con una estrategia del servidor.
- Actualizar posición de pelota y colisiones.
- Calcular puntos.
- Generar cápsulas especiales de forma aleatoria.
- Asignar poderes a competidores.
- Aplicar duración del escudo.
- Aplicar golpe turbo cuando corresponda.
- Detectar ganador y finalizar partida.
- Devolver respuestas JSON claras.

## API REST propuesta

### POST `/api/game/start`

Inicia una nueva partida.

Entrada:

```json
{}
```

Salida:

```json
{
  "ok": true,
  "game": {}
}
```

### GET `/api/game/state`

Devuelve el estado actual de la partida.

Salida:

```json
{
  "ok": true,
  "game": {}
}
```

### POST `/api/game/action`

Recibe una acción del jugador humano.

Entrada:

```json
{
  "player": "player",
  "type": "move",
  "direction": "up"
}
```

También puede aceptar movimiento hacia abajo:

```json
{
  "player": "player",
  "type": "move",
  "direction": "down"
}
```

Salida válida:

```json
{
  "ok": true,
  "game": {}
}
```

Salida para acción inválida:

```json
{
  "ok": false,
  "message": "La paleta no puede salir de la cancha",
  "game": {}
}
```

### POST `/api/game/tick`

Avanza la lógica de la partida: movimiento de pelota, colisiones, puntos, cápsulas y poderes.

Entrada:

```json
{}
```

Salida:

```json
{
  "ok": true,
  "game": {}
}
```

## Componentes sugeridos en React

Mantener pocos componentes:

- `App`
- `StartScreen`
- `GameBoard`
- `ScoreBoard`
- `PlayerPanel`
- `GameMessage`
- `ResultScreen`

Evitar demasiada abstracción. El código debe ser entendible para exposición.

## Estructura sugerida del proyecto

```txt
project/
  client/
    src/
      App.tsx
      components/
      styles/
      types.ts
  server/
    src/
      index.ts
      game/
        gameState.ts
        gameLogic.ts
        routes.ts
        types.ts
  docs/
    requirements-checklist.md
    introduccion.md
    reglas.md
    api.md
    decisiones.md
    investigacion.md
    riesgos.md
    uso-ia.md
  tests/
    e2e/
  .github/
    workflows/
      lint.yml
      e2e.yml
      deploy.yml
  README.md
```

## Documentación requerida en `docs/`

Crear archivos Markdown con:

- Nombre del juego.
- Checklist verificable de requisitos del examen.
- Descripción de cómo se juega.
- Propósito del proyecto.
- Cantidad y tipo de jugadores.
- Reglas y condición de victoria.
- Definición del empate aunque sea no aplicable por la regla del juego.
- Elementos que se mueven.
- Estados principales.
- Interacción entre jugadores.
- Responsabilidades de React y Express.
- Diseño de la API HTTP REST.
- Boceto simple de pantalla.
- Decisiones técnicas y justificación.
- Riesgos técnicos y cómo reducirlos.
- Cambios importantes durante el desarrollo.
- Investigación sobre pruebas E2E.
- Investigación sobre publicación.
- Registro del uso de IA.
- Variables de entorno, puerto, estrategia de despliegue y, si se usa Docker, Dockerfile y comandos.

## Pruebas E2E mínimas

Crear pruebas que verifiquen:

1. La pantalla de inicio carga.
2. Se puede iniciar una partida.
3. La cancha, pelota, paletas y marcador aparecen.
4. Al presionar teclas, una paleta se mueve.
5. El frontend se comunica con el backend.
6. La misma prueba o una equivalente puede ejecutarse visualmente en Chrome contra la URL publicada.
7. Una cápsula especial aparece o se puede simular para la prueba.
8. Un competidor puede obtener un poder.
9. Se puede llegar a una condición de resultado o validar una acción inválida.

Las pruebas deben ser simples y estables. Si es necesario, agregar un modo de prueba controlado para evitar depender de aleatoriedad.

## GitHub Actions requeridas

Crear al menos tres workflows:

1. `lint.yml`
   - Ejecuta linters para frontend y backend.
   - Debe fallar si hay errores.

2. `e2e.yml`
   - Construye o levanta la aplicación.
   - Ejecuta pruebas E2E en modo headless.

3. `deploy.yml`
   - Publica la aplicación completa.
   - Debe producir un resultado verificable.
   - Debe permitir que un cambio realizado durante la defensa llegue a la URL publica.

## Publicación

La aplicación debe estar publicada en una URL funcional. Se puede investigar Render como opción principal.

La publicación debe incluir frontend y backend completos. En producción, el usuario debe acceder al juego desde una sola URL.

La configuracion debe documentar el puerto, variables de entorno y comando de inicio. Docker es opcional; si se usa, tambien deben documentarse Dockerfile, construccion y ejecucion local.

## Criterios de implementación

- No crear una arquitectura demasiado compleja.
- Evitar optimizaciones innecesarias.
- Evitar patrones difíciles de explicar.
- No esconder lógica crítica en funciones confusas.
- Separar la lógica del juego en archivos claros.
- Comentar solo las partes que ayuden a entender reglas importantes.
- Usar tipos TypeScript claros.
- Mantener respuestas JSON consistentes.
- Mostrar errores visibles en pantalla.
- Hacer que el juego sea jugable aunque sea simple.
- Mantener el codigo suficientemente claro para explicarlo y modificarlo durante la defensa individual.

## Resultado esperado

Al finalizar, debe existir una aplicación web completa donde:

- El usuario puede iniciar una partida.
- El jugador humano puede mover su paleta y la computadora mueve la suya desde el backend.
- La pelota se mueve y rebota.
- El marcador cambia.
- Aparecen cápsulas especiales aleatorias.
- Los competidores pueden obtener escudo o golpe turbo.
- El backend valida y actualiza la partida.
- La interfaz muestra el estado completo.
- Hay documentación, README, pruebas E2E, workflows y despliegue.
- Hay video de 3 a 5 minutos, evidencia de Actions exitosas y una URL publica funcional.
- El estudiante puede explicar y modificar el código durante la defensa.
