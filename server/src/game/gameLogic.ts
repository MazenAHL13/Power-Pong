import {
  BALL_START_SPEED_X,
  BALL_START_SPEED_Y,
  COURT_HEIGHT,
  COURT_WIDTH,
  WINNING_SCORE
} from "./constants.js";
import type { GameState, MoveAction, PaddleState } from "./types.js";

// ===== TYPES USED ONLY IN THIS FILE =====

interface MoveResult {
  ok: boolean;
  game: GameState;
  message?: string;
}

// ===== SHARED SMALL HELPERS =====

function keepInsideCourt(y: number, paddleHeight: number): number {
  // This is used by the computer.
  // It keeps the paddle inside the top and bottom walls.
  return Math.min(Math.max(y, 0), COURT_HEIGHT - paddleHeight);
}

// ===== PLAYER MOVEMENT =====

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

// ===== COMPUTER MOVEMENT =====

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

// ===== BALL MOVEMENT AND BOUNCES =====

function ballTouchesPaddle(
  ballX: number,
  ballY: number,
  ballRadius: number,
  paddle: PaddleState
): boolean {
  // This checks whether the ball's small square area overlaps the paddle rectangle.
  const ballLeft = ballX - ballRadius;
  const ballRight = ballX + ballRadius;
  const ballTop = ballY - ballRadius;
  const ballBottom = ballY + ballRadius;

  const paddleLeft = paddle.position.x;
  const paddleRight = paddle.position.x + paddle.width;
  const paddleTop = paddle.position.y;
  const paddleBottom = paddle.position.y + paddle.height;

  return (
    ballRight >= paddleLeft &&
    ballLeft <= paddleRight &&
    ballBottom >= paddleTop &&
    ballTop <= paddleBottom
  );
}

export function moveBall(game: GameState): GameState {
  const ball = game.ball;
  let nextX = ball.position.x + ball.velocity.x;
  let nextY = ball.position.y + ball.velocity.y;
  let nextVelocityX = ball.velocity.x;
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

  const hitsPlayerPaddle =
    ball.velocity.x < 0 &&
    ballTouchesPaddle(nextX, nextY, ball.radius, game.player.paddle);

  const hitsComputerPaddle =
    ball.velocity.x > 0 &&
    ballTouchesPaddle(nextX, nextY, ball.radius, game.computer.paddle);

  if (hitsPlayerPaddle) {
    // Player paddle sends the ball back to the right.
    nextX = game.player.paddle.position.x + game.player.paddle.width + ball.radius;
    nextVelocityX = Math.abs(ball.velocity.x);
  }

  if (hitsComputerPaddle) {
    // Computer paddle sends the ball back to the left.
    nextX = game.computer.paddle.position.x - ball.radius;
    nextVelocityX = -Math.abs(ball.velocity.x);
  }

  return {
    ...game,
    ball: {
      ...ball,
      position: {
        x: nextX,
        y: nextY
      },
      velocity: {
        x: nextVelocityX,
        y: nextVelocityY
      }
    },
    updatedAt: new Date().toISOString()
  };
}

// ===== SCORING =====

function resetBallAfterPoint(game: GameState, directionX: number): GameState {
  const ball = game.ball;

  return {
    ...game,
    ball: {
      ...ball,
      position: {
        x: COURT_WIDTH / 2,
        y: COURT_HEIGHT / 2
      },
      velocity: {
        x: directionX * BALL_START_SPEED_X,
        y: BALL_START_SPEED_Y
      }
    }
  };
}

function scorePointIfNeeded(game: GameState): GameState {
  const ball = game.ball;
  const ballExitedLeft = ball.position.x + ball.radius < 0;
  const ballExitedRight = ball.position.x - ball.radius > COURT_WIDTH;

  if (!ballExitedLeft && !ballExitedRight) {
    return game;
  }

  // If the ball leaves the left side, the computer scores.
  if (ballExitedLeft) {
    const gameWithPoint = {
      ...game,
      computer: {
        ...game.computer,
        score: game.computer.score + 1
      },
      message: "Punto para la computadora.",
      updatedAt: new Date().toISOString()
    };

    return resetBallAfterPoint(gameWithPoint, -1);
  }

  // If the ball leaves the right side, the player scores.
  const gameWithPoint = {
    ...game,
    player: {
      ...game.player,
      score: game.player.score + 1
    },
    message: "Punto para el jugador.",
    updatedAt: new Date().toISOString()
  };

  return resetBallAfterPoint(gameWithPoint, 1);
}

// ===== VICTORY AND FINISH =====

function finishGameIfNeeded(game: GameState): GameState {
  if (game.player.score >= WINNING_SCORE) {
    return {
      ...game,
      status: "finished",
      winner: "player",
      message: "Gano el jugador.",
      updatedAt: new Date().toISOString()
    };
  }

  if (game.computer.score >= WINNING_SCORE) {
    return {
      ...game,
      status: "finished",
      winner: "computer",
      message: "Gano la computadora.",
      updatedAt: new Date().toISOString()
    };
  }

  return game;
}

// ===== TICK / ONE GAME UPDATE =====

export function tickGame(game: GameState): GameState {
  // If the game already ended, a tick should not move anything.
  if (game.status === "finished") {
    return game;
  }

  // One tick is one small update of the game.
  // First the computer reacts to the current ball position.
  const gameAfterComputerMove = moveComputerPaddle(game);

  // Then the ball moves and handles wall/paddle bounces.
  const gameAfterBallMove = moveBall(gameAfterComputerMove);

  // Finally, if the ball left a side of the court, add one point.
  const gameAfterScoring = scorePointIfNeeded(gameAfterBallMove);

  // If a score reached the winning number, finish the game and store the winner.
  return finishGameIfNeeded(gameAfterScoring);
}
