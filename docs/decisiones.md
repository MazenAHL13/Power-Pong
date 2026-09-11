# Decisiones tecnicas

## React + TypeScript

Se uso React con TypeScript para representar la interfaz, manejar estado local con `useState`, ejecutar efectos con `useEffect` y renderizar la cancha a partir del estado recibido desde Express.

## Express + TypeScript

Se uso Express con TypeScript para construir la API REST y mantener la logica principal de la partida en el servidor.

El backend no es decorativo: crea partidas, conserva estado, valida acciones, mueve la computadora, calcula colisiones, puntaje, poderes y ganador.

## Estado en memoria

La partida se guarda en una variable del servidor. No se uso base de datos porque el alcance del examen pide una partida sencilla, explicable y facil de modificar durante la defensa.

## API JSON con fetch

React se comunica con Express usando `fetch`. Todas las entradas y salidas de la API usan JSON.

Esta decision evita Axios u otras librerias externas, cumpliendo el requisito tecnico.

## Una sola URL en produccion

Express sirve el frontend compilado desde `client/dist` y tambien expone la API. Asi la aplicacion publicada funciona bajo el mismo dominio y puerto.

## CSS propio

La interfaz usa CSS propio. No se uso Bootstrap, Tailwind ni bibliotecas de componentes.

## Sin motor de juegos

La logica principal del juego se implemento en TypeScript propio. No se uso motor de videojuegos ni libreria externa para resolver reglas, fisica o colisiones.

## Dificultad desde el backend

La dificultad vive en `GameState` y afecta valores del servidor:

- probabilidad de reaccion de la computadora;
- velocidad de la pelota;
- tamano de las paletas;
- velocidad de la computadora.

React solo envia la dificultad elegida. Express decide como aplicarla.

## Pruebas E2E con modo determinista

Se agrego un endpoint de pruebas, disponible solo con `TEST_MODE=true`, para crear escenarios controlados. Esto permite probar capsulas y poderes sin depender de la aleatoriedad normal.

## Despliegue en Render

Render se eligio porque puede ejecutar un servicio Node con Express. GitHub Pages solo sirve archivos estaticos y no ejecuta el backend Express por si solo.

## Cambios importantes durante el desarrollo

- Se agrego selector de dificultad para fortalecer la participacion del backend.
- Se agrego tarjeta de instrucciones visible antes de iniciar.
- Se agrego indicador de estado de la partida.
- Se extendieron las pruebas E2E para cubrir movimiento y poderes.
- Se agregaron workflows de lint, E2E y despliegue.
- Se ajusto la ruta estatica del frontend para que Render pueda servir `client/dist`.
