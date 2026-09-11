# Introduccion

## Nombre del juego

Power Pong Arena.

## Proposito

El proyecto demuestra una aplicacion web completa con React, TypeScript, Express, API REST JSON, pruebas E2E, GitHub Actions y despliegue publico.

El objetivo principal es que el flujo completo sea claro:

```text
accion del usuario -> solicitud fetch -> Express actualiza estado -> React renderiza el resultado
```

## Experiencia de juego

El usuario abre la aplicacion y ve una cancha de Pong que ocupa el area visible del navegador. Antes de iniciar, se muestran instrucciones, selector de dificultad, boton de inicio, marcador y estado de la partida.

Cuando empieza la partida:

- el jugador controla la paleta izquierda con `W` y `S`;
- la computadora controla la paleta derecha desde el backend;
- la pelota se mueve automaticamente;
- aparecen capsulas de poder;
- el marcador se actualiza cuando alguien anota;
- el primer competidor en llegar a 7 puntos gana.

## Boceto de pantalla

```text
+-------------------------------------------------------------+
|                 Jugador        0 - 0        Computadora      |
|                         Estado: Jugando                      |
|                                                             |
|   |                                                     |    |
|   |                         o                           |    |
|   |                                                     |    |
|                                                             |
|                 capsula azul / amarilla                     |
+-------------------------------------------------------------+
```

En estado inicial o terminado aparece al centro:

```text
Usa W y S para mover tu paleta.
Recoge capsulas azules/amarillas.
Azul = escudo, amarillo = turbo.
Primero en llegar a 7 gana.

[dificultad] [Iniciar partida / Reiniciar partida]
```

## URL publica

```text
https://power-pong.onrender.com
```
