# Reglas del juego

## Jugadores

Power Pong Arena tiene dos competidores:

- Jugador humano: controla la paleta izquierda.
- Computadora: controla la paleta derecha mediante una estrategia del backend.

## Inicio

La partida empieza cuando el usuario presiona `Iniciar partida`. El backend crea una partida nueva con puntajes en cero, estado `playing`, pelota en el centro y dificultad seleccionada.

## Controles

- `W`: mueve la paleta del jugador hacia arriba.
- `S`: mueve la paleta del jugador hacia abajo.

La paleta no puede salir de la cancha. Si el movimiento no es valido, el backend responde con error y React muestra el mensaje.

## Movimiento

- La pelota se mueve en cada tick.
- La pelota rebota en las paredes superior e inferior.
- La pelota rebota al tocar una paleta.
- La computadora intenta seguir la pelota con velocidad y reaccion configuradas por dificultad.

## Puntuacion y victoria

- Si la pelota sale por la izquierda, la computadora gana un punto.
- Si la pelota sale por la derecha, el jugador gana un punto.
- Despues de cada punto, la pelota vuelve al centro.
- Gana quien llegue primero a 7 puntos.
- Cuando hay ganador, el estado pasa a `finished` y se bloquean las acciones de juego.

## Empate

El empate no aplica como resultado normal. Cada punto pertenece a un solo competidor y la partida termina inmediatamente cuando uno llega a 7 puntos.

## Poderes

### Escudo

La capsula azul activa escudo. El escudo agranda la paleta durante un tiempo limitado. El backend controla la duracion y la expiracion.

### Turbo

La capsula amarilla activa turbo. El turbo queda guardado hasta el siguiente impacto de esa paleta con la pelota. En ese impacto, la pelota aumenta su velocidad y el poder se consume.

## Estados principales

La partida maneja, como minimo:

- estado de la partida: `ready`, `playing`, `finished`;
- posicion de pelota;
- velocidad de pelota;
- posicion y altura de paletas;
- puntaje de jugador y computadora;
- capsula actual;
- poderes activos;
- ganador;
- mensaje visible;
- dificultad.

## Interaccion entre jugadores

Los competidores interactuan en un estado compartido:

- ambos defienden su lado;
- los rebotes cambian la direccion de la pelota;
- los puntos cambian el marcador;
- ambos pueden recoger capsulas;
- la computadora reacciona al movimiento de la pelota.

## Decisiones estrategicas

El jugador decide entre:

- defender su lado;
- moverse para buscar una capsula;
- conservar posicion para devolver la pelota;
- aprovechar turbo o escudo cuando los obtiene;
- elegir dificultad antes de iniciar.
