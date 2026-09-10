import { COURT_HEIGHT } from "./constants.js";
import type { GameState, MoveAction } from "./types.js";

interface MoveResult {
  ok: boolean;
  game: GameState;
  message?: string;
}

export function movePlayerPaddle(game: GameState, action: MoveAction): MoveResult {
  // Get the human player's paddle from the current game.
  const paddle = game.player.paddle;

  // Browser coordinates start at the top.
  // Moving up means y gets smaller. Moving down means y gets bigger.
  const movement = action.direction === "up" ? -paddle.speed : paddle.speed;

  // Calculate where the paddle wants to go.
  const nextY = paddle.position.y + movement;

  // The paddle cannot go above 0 or below the bottom of the court.
  const minY = 0;
  const maxY = COURT_HEIGHT - paddle.height;

  // If the requested move crosses a wall, keep the same game and explain why.
  if (nextY < minY || nextY > maxY) {
    const message = "La paleta no puede salir de la cancha";

    return {
      ok: false,
      message,
      game: {
        ...game,
        message
      }
    };
  }

  return {
    ok: true,
    game: {
      // Copy the old game first so we keep everything that did not change.
      ...game,
      player: {
        // Copy the old player data: score, label, powers, etc.
        ...game.player,
        paddle: {
          // Copy the old paddle data: x position, width, height, speed, etc.
          ...paddle,
          position: {
            // Copy the old position so x stays the same.
            ...paddle.position,
            // Replace only y because the paddle moves vertically.
            y: nextY
          }
        }
      },
      // Clear old messages after a successful move.
      message: null,
      // Save the time of this latest change.
      updatedAt: new Date().toISOString()
    }
  };
}
