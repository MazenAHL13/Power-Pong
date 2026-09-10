# Checklist de requisitos del examen

Este checklist conecta los requisitos del PDF del examen con la decision de proyecto documentada en `TRD.md`, `specs.md` y `tasks.md`.

## Juego

- [ ] Nombre y descripcion del juego documentados.
- [ ] Juego distinto de tres en raya, buscaminas, adivinanzas basadas en tablas, Space Invaders, juegos hechos en clase, colecciones de minijuegos y aplicaciones solo de puntajes.
- [ ] Al menos dos competidores: jugador humano y computadora controlada por el backend.
- [ ] Uso significativo de la pantalla visible del navegador.
- [ ] Escenario, marcador, controles, instrucciones y estado visibles.
- [ ] Elementos en movimiento: pelota, paletas y capsulas.
- [ ] Interaccion entre competidores mediante rebotes, puntuacion, defensa y captura de poderes.
- [ ] Al menos tres tipos de estado: posiciones, velocidad/direccion, puntaje, poderes, capsula, estado de partida y ganador.
- [ ] Reglas de inicio, acciones validas, acciones invalidas, victoria, empate definido y finalizacion.
- [ ] Empate definido como no aplicable por regla normal: cada punto pertenece a un solo competidor y gana quien llega primero a 7.
- [ ] Decisiones estrategicas: defender, buscar capsulas, conservar turbo y posicionarse para forzar puntos.
- [ ] Variabilidad por capsulas aleatorias y comportamiento variable de la computadora.
- [ ] Retroalimentacion visual sin depender de la consola.
- [ ] Recursos graficos o imagenes visibles del juego.

## Tecnica

- [ ] Frontend con React y TypeScript.
- [ ] Backend con Express y TypeScript.
- [ ] Comunicacion real entre React y Express usando `fetch`.
- [ ] Entrada y salida JSON en toda la API.
- [ ] Al menos un endpoint `GET` y un endpoint `POST` relacionados con la partida.
- [ ] Express sirve frontend compilado y API bajo el mismo dominio y puerto en produccion.
- [ ] CSS propio.
- [ ] Sin Bootstrap, Tailwind, Axios, React Router, Redux, motores de juegos ni bibliotecas de componentes.
- [ ] Sin librerias externas para resolver la logica principal del juego.
- [ ] Backend participa en decisiones relevantes: crear partida, guardar estado, validar acciones, mover computadora, calcular colisiones, puntaje, poderes y ganador.

## Documentacion

- [ ] README con requisitos, comandos, arquitectura, endpoints JSON, variables de entorno y enlace al despliegue.
- [ ] `docs/introduccion.md` con proposito y experiencia.
- [ ] `docs/reglas.md` con jugadores, reglas, victoria, empate, movimientos, estados e interaccion.
- [ ] `docs/api.md` con endpoints, metodo, entrada, salida y ejemplos JSON.
- [ ] `docs/decisiones.md` con decisiones tecnicas, justificacion y cambios importantes.
- [ ] `docs/riesgos.md` con riesgos y mitigaciones.
- [ ] `docs/investigacion.md` con pruebas E2E, publicacion, fuentes, puerto, variables y limitaciones.
- [ ] `docs/uso-ia.md` con solicitudes relevantes, respuestas incorporadas y verificaciones del estudiante.
- [ ] Si se usa Docker, documentar Dockerfile, puerto, variables, build y ejecucion local.

## Pruebas, CI y despliegue

- [ ] Pruebas E2E con Playwright, Cypress o herramienta equivalente.
- [ ] E2E cubre inicio, interaccion principal, comunicacion backend y finalizacion o validacion.
- [ ] E2E corre headless en GitHub Actions.
- [ ] E2E corre visualmente en Chrome durante la defensa.
- [ ] E2E puede demostrar comportamiento contra la URL publicada.
- [ ] GitHub Actions de linting para frontend y backend.
- [ ] GitHub Actions de E2E.
- [ ] GitHub Actions de deployment.
- [ ] Aplicacion completa publicada en URL funcional.
- [ ] Deployment permite reflejar un cambio solicitado durante la defensa.

## Entrega y defensa

- [ ] Repositorio GitHub accesible para evaluacion.
- [ ] Historial de commits comprensible.
- [ ] Repositorio actualizado como maximo hasta el 15 de septiembre de 2026 a horas 16:00 segun GitHub.
- [ ] Aplicacion publicada corresponde al mismo trabajo del repositorio.
- [ ] Evidencia de ejecuciones exitosas de GitHub Actions.
- [ ] Video de 3 a 5 minutos con partida, solicitud JSON, E2E visual en Chrome, Actions y aplicacion publicada.
- [ ] Defensa individual preparada para 10 minutos.
- [ ] Preparado para explicar reglas, arquitectura, pruebas, publicacion, uso de IA y funcionamiento.
- [ ] Preparado para modificar el codigo durante la defensa y demostrar lint, E2E headless, deployment y cambio publicado.
