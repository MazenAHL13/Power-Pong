# Especificación del proyecto: Power Pong Arena

## 1. Propósito

Power Pong Arena es un juego web inspirado en Pong para el proyecto final de certificación de React. El objetivo es construir una aplicación sencilla, jugable y fácil de explicar durante la defensa.

El proyecto debe demostrar:

- React y TypeScript en el frontend.
- Express y TypeScript en el backend.
- Comunicación real mediante `fetch`.
- Manejo de estado, interacción, movimiento, validaciones y finalización.
- Pruebas E2E, documentación, integración continua y despliegue.

## 2. Alcance

La primera versión será una partida local de un jugador humano contra la computadora. El jugador controlará la paleta izquierda y la computadora controlará la paleta derecha mediante un seguimiento simple de la pelota.

El estado de la partida se conservará en memoria del servidor. No se utilizarán cuentas, base de datos, autenticación ni multijugador por red.

## 3. Experiencia principal

1. El usuario ve la pantalla de inicio.
2. El usuario presiona `Iniciar partida`.
3. El backend crea una partida nueva y devuelve su estado.
4. La pelota comienza a moverse.
5. El usuario controla su paleta con `W` y `S`.
6. La computadora mueve su paleta automáticamente.
7. La pelota rebota en las paredes y paletas.
8. Cuando la pelota sale por un lateral, se suma un punto y vuelve al centro.
9. Aparecen cápsulas que pueden otorgar poderes.
10. La partida termina cuando un competidor alcanza 7 puntos.
11. Mientras la partida está terminada no se aceptan acciones de juego.
12. El usuario puede iniciar una nueva partida.

## 4. Reglas del juego

- Hay una paleta izquierda para el jugador y una paleta derecha para la computadora.
- Las paletas solo se mueven verticalmente dentro de la cancha.
- `W` mueve la paleta del jugador hacia arriba.
- `S` mueve la paleta del jugador hacia abajo.
- La computadora sigue la posición vertical de la pelota con una velocidad limitada.
- La pelota rebota en los límites superior e inferior.
- La pelota rebota al tocar una paleta dentro de su zona válida.
- Si la pelota sale por la izquierda, la computadora gana un punto.
- Si la pelota sale por la derecha, el jugador gana un punto.
- Después de cada punto, la pelota vuelve al centro.
- Gana el primero que llegue a 7 puntos.
- Después de la victoria, el estado pasa a `finished` y se bloquean acciones de movimiento y poderes.
- Intentar realizar una acción inválida debe producir un mensaje visible.

Las dimensiones, velocidades, intervalo del tick y probabilidades de aparición se definirán como constantes fáciles de modificar, no como valores dispersos por el código.

## 5. Poderes

### Escudo

- Se obtiene al tocar una cápsula de tipo `shield`.
- Aumenta temporalmente la altura de la paleta.
- Dura 30 segundos.
- El backend controla la expiración.
- La interfaz muestra que está activo y el tiempo restante o un estado equivalente.

### Golpe turbo

- Se obtiene al tocar una cápsula de tipo `turbo`.
- Queda disponible para el jugador.
- Se consume en el siguiente impacto válido entre su paleta y la pelota.
- Aumenta la velocidad de la pelota durante ese impacto.
- La interfaz indica cuándo está disponible.
- Intentar utilizarlo sin tenerlo es una acción inválida visible.

## 6. Estados de la partida

El estado mínimo debe incluir:

- `status`: `ready`, `playing` o `finished`.
- Posición, velocidad y dirección de la pelota.
- Posición y tamaño de cada paleta.
- Puntaje del jugador y de la computadora.
- Poder disponible o activo de cada competidor.
- Tiempo restante del escudo.
- Cápsula actual, si existe.
- Ganador, si la partida terminó.
- Mensaje reciente para feedback visible.

## 7. Contrato de datos

Los tipos compartidos deben representar al menos:

- `PlayerSide`: `player` o `computer`.
- `GameStatus`: `ready`, `playing` o `finished`.
- `Point`: coordenadas `x` e `y`.
- `BallState`: posición, velocidad y dirección.
- `PaddleState`: posición, altura base y altura actual.
- `PowerState`: tipo, disponibilidad y tiempo restante.
- `CapsuleState`: posición y tipo.
- `GameState`: estado completo de la partida.

## 8. API REST

Todas las respuestas y cuerpos usan JSON.

### `POST /api/game/start`

Crea o reinicia una partida.

Entrada:

```json
{}
```

Respuesta exitosa:

```json
{
  "ok": true,
  "game": {}
}
```

Debe devolver un error visible o respuesta consistente si la aplicación decide no permitir iniciar sin reinicio explícito.

### `GET /api/game/state`

Devuelve el estado actual de la partida.

Respuesta:

```json
{
  "ok": true,
  "game": {}
}
```

### `POST /api/game/action`

Valida una acción del jugador.

Ejemplo de movimiento:

```json
{
  "player": "player",
  "type": "move",
  "direction": "up"
}
```

Respuesta válida:

```json
{
  "ok": true,
  "game": {}
}
```

Respuesta inválida:

```json
{
  "ok": false,
  "message": "La paleta no puede salir de la cancha",
  "game": {}
}
```

### `POST /api/game/tick`

Avanza un paso de la simulación. El backend actualiza pelota, computadora, colisiones, puntuación, cápsulas, poderes y estado final.

Entrada:

```json
{}
```

Respuesta:

```json
{
  "ok": true,
  "game": {}
}
```

## 9. Responsabilidades

### React

- Mostrar inicio, cancha, marcador, poderes, mensajes y resultado.
- Capturar las teclas del usuario.
- Enviar acciones con `fetch`.
- Solicitar ticks periódicos al backend.
- Renderizar exclusivamente el estado recibido.
- Bloquear controles visualmente cuando la partida termina.

### Express

- Crear y conservar la partida en memoria.
- Validar todas las acciones.
- Ejecutar la simulación y las reglas.
- Controlar puntuación, ganador, cápsulas y poderes.
- Devolver respuestas JSON consistentes.
- Servir el frontend compilado en producción.

## 10. Actualización de la partida

React coordinará el ciclo de juego mediante llamadas periódicas a `POST /api/game/tick`. Cada respuesta reemplaza el estado mostrado por React.

El servidor será la autoridad: el cliente no calculará colisiones, puntos, poderes ni ganador.

## 11. Estructura prevista

```text
client/
  src/
    App.tsx
    api.ts
    types.ts
    components/
    styles/
server/
  src/
    index.ts
    game/
      types.ts
      gameState.ts
      gameLogic.ts
      routes.ts
tests/
  e2e/
docs/
.github/
  workflows/
```

Se mantendrá una cantidad pequeña de componentes: `App`, `StartScreen`, `GameBoard`, `ScoreBoard`, `PlayerPanel`, `GameMessage` y `ResultScreen`.

## 12. Pruebas E2E

Las pruebas deben cubrir:

1. Carga de la pantalla inicial.
2. Inicio de una partida.
3. Render de cancha, pelota, paletas y marcador.
4. Movimiento de la paleta con teclado.
5. Comunicación real con Express.
6. Acción inválida con mensaje visible.
7. Aparición y recogida de una cápsula.
8. Obtención y visualización de un poder.
9. Condición de victoria o pantalla final.

Se usará un modo determinista exclusivo para pruebas, capaz de fijar cápsulas o provocar condiciones específicas sin depender de la aleatoriedad normal del juego.

## 13. Despliegue y calidad

- `npm` administrará scripts de desarrollo, lint, build y pruebas.
- Express servirá el frontend compilado y la API desde el mismo dominio y puerto.
- Render será la plataforma inicial de publicación.
- GitHub Actions tendrá workflows separados para lint, E2E y deployment.
- La URL pública debe permitir acceder al juego completo.

## 14. Criterios de aceptación

- Se puede iniciar y reiniciar una partida.
- El jugador puede mover su paleta sin salir de la cancha.
- La computadora mueve su paleta.
- La pelota se mueve, rebota y produce puntos.
- El marcador se actualiza sin depender de la consola.
- La pelota vuelve al centro después de cada punto.
- Los poderes aparecen, se muestran y se aplican correctamente.
- El escudo expira después de 30 segundos.
- El turbo se consume después del siguiente impacto.
- La partida termina al llegar a 7 puntos.
- No se aceptan acciones después de terminar.
- Las acciones inválidas muestran feedback visible.
- React y Express se comunican con JSON mediante `fetch`.
- Existen pruebas E2E, documentación, workflows y una URL publicada.

## 15. Fuera de alcance

- Multijugador por internet.
- Login, perfiles o ranking.
- Base de datos.
- Persistencia después de reiniciar el servidor.
- React Router, Redux, Axios, Bootstrap, Tailwind o bibliotecas de componentes.
- Motores de videojuegos.
- Física avanzada o matchmaking.
