import { COURT_HEIGHT } from "./constants.js";
import type { GameState, MoveAction } from "./types.js";

function clamp(value: number, min: number, max: number): number {
  // clamp keeps a number inside a safe range.
  // Example: if the paddle tries to go above 0, it stays at 0.
  // Example: if the paddle tries to go below the court, it stops at the bottom.
  return Math.min(Math.max(value, min), max);
}

export function movePlayerPaddle(game: GameState, action: MoveAction): GameState {
  // Get the human player's paddle from the current game.
  const paddle = game.player.paddle;

  // Browser coordinates start at the top.
  // Moving up means y gets smaller. Moving down means y gets bigger.
  const movement = action.direction === "up" ? -paddle.speed : paddle.speed;

  // Calculate the next y position, but do not let the paddle leave the court.
  const nextY = clamp(paddle.position.y + movement, 0, COURT_HEIGHT - paddle.height);

  return {
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
  };
}
