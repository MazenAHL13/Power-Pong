import { COURT_HEIGHT } from "./constants.js";
import type { GameState, MoveAction } from "./types.js";

interface MoveResult {
  ok: boolean;
  game: GameState;
  message?: string;
}

function keepInsideCourt(y: number, paddleHeight: number): number {
  // This is used by the computer.
  // It keeps the paddle inside the top and bottom walls.
  return Math.min(Math.max(y, 0), COURT_HEIGHT - paddleHeight);
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

export function moveComputerPaddle(game: GameState): GameState {
  // The computer looks at the middle of its paddle and the middle of the ball.
  const paddle = game.computer.paddle;
  const paddleCenterY = paddle.position.y + paddle.height / 2;
  const ballY = game.ball.position.y;

  // If the ball is above the paddle, the computer moves up.
  // If the ball is below the paddle, the computer moves down.
  const distanceToBall = ballY - paddleCenterY;

  // The computer is not allowed to jump straight to the ball.
  // It can only move by its speed each update.
  const movement =
    Math.sign(distanceToBall) * Math.min(Math.abs(distanceToBall), paddle.speed);

  const nextY = keepInsideCourt(paddle.position.y + movement, paddle.height);

  return {
    ...game,
    computer: {
      ...game.computer,
      paddle: {
        ...paddle,
        position: {
          ...paddle.position,
          y: nextY
        }
      }
    },
    updatedAt: new Date().toISOString()
  };
}

export function moveBall(game: GameState): GameState {
  const ball = game.ball;
  let nextY = ball.position.y + ball.velocity.y;
  let nextVelocityY = ball.velocity.y;

  // If the ball touches the top wall, place it on the wall
  // and flip the vertical direction so it moves downward next.
  if (nextY - ball.radius < 0) {
    nextY = ball.radius;
    nextVelocityY = Math.abs(ball.velocity.y);
  }

  // If the ball touches the bottom wall, place it on the wall
  // and flip the vertical direction so it moves upward next.
  if (nextY + ball.radius > COURT_HEIGHT) {
    nextY = COURT_HEIGHT - ball.radius;
    nextVelocityY = -Math.abs(ball.velocity.y);
  }

  return {
    ...game,
    ball: {
      ...ball,
      position: {
        x: ball.position.x + ball.velocity.x,
        y: nextY
      },
      velocity: {
        ...ball.velocity,
        y: nextVelocityY
      }
    },
    updatedAt: new Date().toISOString()
  };
}
