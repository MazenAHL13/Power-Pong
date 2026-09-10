# Contrato de API

La API usa JSON en todas las solicitudes y respuestas. El backend mantiene la
partida en memoria y siempre devuelve el estado actual para que React pueda
volver a dibujar la pantalla.

Base local prevista:

```text
http://localhost:3000
```

## Forma de respuesta

Respuesta exitosa:

```json
{
  "ok": true,
  "game": {}
}
```

Respuesta con error:

```json
{
  "ok": false,
  "message": "La accion no es valida",
  "game": {}
}
```

`game` representa el `GameState` definido en `shared/types.ts`.

## GameState resumido

```json
{
  "status": "ready",
  "player": {
    "side": "player",
    "label": "Jugador",
    "score": 0,
    "paddle": {
      "position": { "x": 36, "y": 212 },
      "width": 18,
      "baseHeight": 96,
      "height": 96,
      "speed": 28
    },
    "powers": []
  },
  "computer": {
    "side": "computer",
    "label": "Computadora",
    "score": 0,
    "paddle": {
      "position": { "x": 846, "y": 212 },
      "width": 18,
      "baseHeight": 96,
      "height": 96,
      "speed": 20
    },
    "powers": []
  },
  "ball": {
    "position": { "x": 450, "y": 260 },
    "velocity": { "x": 7, "y": 4 },
    "radius": 10
  },
  "capsule": null,
  "winner": null,
  "message": "Presiona iniciar partida para jugar.",
  "updatedAt": "1970-01-01T00:00:00.000Z"
}
```

## `GET /api/health`

Comprueba que el servidor Express esta activo.

Solicitud:

```http
GET /api/health
```

Respuesta:

```json
{
  "ok": true,
  "service": "power-pong-arena",
  "message": "Servidor Express activo"
}
```

## `POST /api/game/start`

Crea o reinicia una partida. El estado pasa a `playing`, los puntajes vuelven a
cero y la pelota inicia desde el centro.

Solicitud:

```http
POST /api/game/start
Content-Type: application/json
```

Cuerpo:

```json
{}
```

Respuesta:

```json
{
  "ok": true,
  "game": {
    "status": "playing"
  }
}
```

## `GET /api/game/state`

Devuelve la partida actual sin modificarla.

Solicitud:

```http
GET /api/game/state
```

Respuesta:

```json
{
  "ok": true,
  "game": {
    "status": "playing"
  }
}
```

## `POST /api/game/action`

Recibe una accion del jugador. Por ahora el contrato permite mover la paleta.
Los poderes se activan automaticamente cuando una paleta recoge una capsula.

Solicitud:

```http
POST /api/game/action
Content-Type: application/json
```

Movimiento:

```json
{
  "player": "player",
  "type": "move",
  "direction": "up"
}
```

Respuesta exitosa:

```json
{
  "ok": true,
  "game": {}
}
```

Respuesta invalida:

```json
{
  "ok": false,
  "message": "La paleta no puede salir de la cancha",
  "game": {}
}
```

## `POST /api/game/tick`

Avanza un paso de la simulacion. El backend actualiza pelota, computadora,
colisiones, puntos, capsulas, poderes y ganador.

Solicitud:

```http
POST /api/game/tick
Content-Type: application/json
```

Cuerpo:

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

## Valores permitidos

- `status`: `ready`, `playing`, `finished`.
- `player`: `player`, `computer`.
- `direction`: `up`, `down`.
- `power`: `shield`, `turbo`.
- `winner`: `player`, `computer` o `null`.

## Endpoint solo para pruebas

`POST /api/test/scenario` solo responde cuando el servidor se ejecuta con
`TEST_MODE=true`. En modo normal devuelve `404`.

Sirve para preparar escenarios E2E sin depender de esperar eventos aleatorios.

Ejemplos de cuerpo:

```json
{ "scenario": "playerCapsule", "power": "shield" }
```

```json
{ "scenario": "playerNearWin" }
```

Escenarios permitidos:

- `playerCapsule`
- `computerCapsule`
- `playerPoint`
- `computerPoint`
- `playerNearWin`
- `computerNearWin`
