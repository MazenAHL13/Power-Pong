import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createInitialGameState, createStartedGameState } from "./game/gameState.js";
import { movePlayerPaddle } from "./game/gameLogic.js";
import type { MoveAction } from "./game/types.js";

const app = express();
const port = Number(process.env.PORT ?? 3000);

// This variable is the server's memory.
// It remembers the latest version of the game between API calls.
let currentGame = createInitialGameState();

// This lets Express understand JSON bodies sent by React or curl.
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "power-pong-arena",
    message: "Servidor Express activo"
  });
});

app.post("/api/game/start", (_request, response) => {
  // When the player starts, we replace the old game with a fresh playing game.
  currentGame = createStartedGameState();

  response.json({
    ok: true,
    game: currentGame
  });
});

app.get("/api/game/state", (_request, response) => {
  // This does not change the game.
  // It only sends back whatever the server currently remembers.
  response.json({
    ok: true,
    game: currentGame
  });
});

function isMoveAction(value: unknown): value is MoveAction {
  // First we make sure the request body is a real object.
  // If it is missing, null, or something like a string, it is not valid.
  if (typeof value !== "object" || value === null) {
    return false;
  }

  // TypeScript still does not know what keys this object has,
  // so we treat it like a simple dictionary and check the keys ourselves.
  const body = value as Record<string, unknown>;

  // A valid move action must say:
  // 1. the human player is moving
  // 2. the action type is "move"
  // 3. the direction is either "up" or "down"
  return (
    body.player === "player" &&
    body.type === "move" &&
    (body.direction === "up" || body.direction === "down")
  );
}

app.post("/api/game/action", (request, response) => {
  // If the body is not a valid move action, we reject it and keep the game unchanged.
  if (!isMoveAction(request.body)) {
    response.status(400).json({
      ok: false,
      message: "Accion de movimiento invalida",
      game: currentGame
    });
    return;
  }

  // Ask the game logic to try the movement.
  // It will tell us if the paddle was allowed to move.
  const result = movePlayerPaddle(currentGame, request.body);

  currentGame = result.game;

  if (!result.ok) {
    response.status(400).json(result);
    return;
  }

  // Send the updated game back so the frontend can redraw the screen.
  response.json(result);
});

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const clientDist = path.resolve(currentDir, "../../client/dist");

app.use(express.static(clientDist));

app.get(/.*/, (_request, response) => {
  response.sendFile(path.join(clientDist, "index.html"));
});

app.listen(port, () => {
  console.log(`Power Pong Arena server running on port ${port}`);
});
