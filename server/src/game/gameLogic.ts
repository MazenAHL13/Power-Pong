import {
  BALL_START_SPEED_X,
  BALL_START_SPEED_Y,
  CAPSULE_RADIUS,
  CAPSULE_SPAWN_CHANCE,
  CAPSULE_SPEED,
  COURT_HEIGHT,
  COURT_WIDTH,
  PADDLE_SHIELD_HEIGHT,
  SHIELD_DURATION_MS,
  TURBO_MULTIPLIER,
  WINNING_SCORE
} from "./constants.js";
import type {
  CompetitorState,
  GameState,
  MoveAction,
  PaddleState,
  PowerType
} from "../../../shared/types.js";

// ===== TYPES USED ONLY IN THIS FILE =====

interface ActionResult {
  ok: boolean;
  game: GameState;
  message?: string;
}

type RandomSource = () => number;

// ===== SHARED SMALL HELPERS =====

function keepInsideCourt(y: number, paddleHeight: number): number {
  // This is used by the computer.
  // It keeps the paddle inside the top and bottom walls.
  return Math.min(Math.max(y, 0), COURT_HEIGHT - paddleHeight);
}

// ===== PLAYER MOVEMENT =====

export function movePlayerPaddle(game: GameState, action: MoveAction): ActionResult {
  // After someone wins, the player cannot keep moving the paddle.
  if (game.status === "finished") {
    const message = "La partida ya termino.";

    return {
      ok: false,
      message,
      game: {
        ...game,
        message
      }
    };
  }

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

// ===== POWERS =====

function isPowerActive(competitor: CompetitorState, powerType: PowerType): boolean {
  return competitor.powers.some((power) => power.type === powerType && power.active);
}

function updatePower(
  competitor: CompetitorState,
  powerType: PowerType,
  update: {
    active: boolean;
    remainingMs: number;
  }
): CompetitorState {
  return {
    ...competitor,
    powers: competitor.powers.map((power) => {
      if (power.type !== powerType) {
        return power;
      }

      return {
        ...power,
        ...update
      };
    })
  };
}

function consumeTurbo(competitor: CompetitorState): CompetitorState {
  return updatePower(competitor, "turbo", {
    active: false,
    remainingMs: 0
  });
}

export function updateShieldTimers(game: GameState, now = new Date()): GameState {
  const elapsedMs = Math.max(0, now.getTime() - Date.parse(game.updatedAt));

  if (elapsedMs === 0) {
    return game;
  }

  const updateCompetitorShield = (competitor: CompetitorState): CompetitorState => {
    const shield = competitor.powers.find((power) => power.type === "shield");

    if (shield === undefined || !shield.active) {
      return competitor;
    }

    const remainingMs = Math.max(0, shield.remainingMs - elapsedMs);
    const shieldExpired = remainingMs === 0;
    const height = shieldExpired ? competitor.paddle.baseHeight : competitor.paddle.height;

    return {
      ...competitor,
      paddle: {
        ...competitor.paddle,
        height,
        position: {
          ...competitor.paddle.position,
          y: keepInsideCourt(competitor.paddle.position.y, height)
        }
      },
      powers: competitor.powers.map((power) => {
        if (power.type !== "shield") {
          return power;
        }

        return {
          ...power,
          active: !shieldExpired,
          remainingMs
        };
      })
    };
  };

  return {
    ...game,
    player: updateCompetitorShield(game.player),
    computer: updateCompetitorShield(game.computer),
    updatedAt: now.toISOString()
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

    if (isPowerActive(game.player, "turbo")) {
      nextVelocityX *= TURBO_MULTIPLIER;
    }
  }

  if (hitsComputerPaddle) {
    // Computer paddle sends the ball back to the left.
    nextX = game.computer.paddle.position.x - ball.radius;
    nextVelocityX = -Math.abs(ball.velocity.x);

    if (isPowerActive(game.computer, "turbo")) {
      nextVelocityX *= TURBO_MULTIPLIER;
    }
  }

  let player = game.player;
  let computer = game.computer;

  if (hitsPlayerPaddle && isPowerActive(player, "turbo")) {
    player = consumeTurbo(player);
  }

  if (hitsComputerPaddle && isPowerActive(computer, "turbo")) {
    computer = consumeTurbo(computer);
  }

  return {
    ...game,
    player,
    computer,
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

// ===== CAPSULES =====

function randomCourtPosition(random: RandomSource) {
  // Keep the whole capsule inside the court, not half outside the wall.
  return {
    x: CAPSULE_RADIUS + random() * (COURT_WIDTH - CAPSULE_RADIUS * 2),
    y: CAPSULE_RADIUS + random() * (COURT_HEIGHT - CAPSULE_RADIUS * 2)
  };
}

function paddleTouchesCapsule(paddle: PaddleState, game: GameState): boolean {
  if (game.capsule === null) {
    return false;
  }

  return ballTouchesPaddle(
    game.capsule.position.x,
    game.capsule.position.y,
    game.capsule.radius,
    paddle
  );
}

function activatePowerForCompetitor(
  competitor: CompetitorState,
  powerType: PowerType
): CompetitorState {
  if (powerType === "shield") {
    return updatePower(
      {
        ...competitor,
        paddle: {
          ...competitor.paddle,
          height: PADDLE_SHIELD_HEIGHT,
          position: {
            ...competitor.paddle.position,
            y: keepInsideCourt(competitor.paddle.position.y, PADDLE_SHIELD_HEIGHT)
          }
        }
      },
      "shield",
      {
        active: true,
        remainingMs: SHIELD_DURATION_MS
      }
    );
  }

  return updatePower(competitor, "turbo", {
    active: true,
    remainingMs: 0
  });
}

export function collectCapsuleIfNeeded(game: GameState): GameState {
  if (game.capsule === null) {
    return game;
  }

  const capsuleType = game.capsule.type;

  if (paddleTouchesCapsule(game.player.paddle, game)) {
    return {
      ...game,
      player: activatePowerForCompetitor(game.player, capsuleType),
      capsule: null,
      message: `Jugador activo ${capsuleType}.`,
      updatedAt: new Date().toISOString()
    };
  }

  if (paddleTouchesCapsule(game.computer.paddle, game)) {
    return {
      ...game,
      computer: activatePowerForCompetitor(game.computer, capsuleType),
      capsule: null,
      message: `Computadora activo ${capsuleType}.`,
      updatedAt: new Date().toISOString()
    };
  }

  return game;
}

function moveCapsule(game: GameState): GameState {
  if (game.capsule === null) {
    return game;
  }

  let nextX = game.capsule.position.x + game.capsule.velocity.x;
  let nextVelocityX = game.capsule.velocity.x;

  // If the capsule touches a side wall, keep it inside and send it back.
  if (nextX - game.capsule.radius < 0) {
    nextX = game.capsule.radius;
    nextVelocityX = Math.abs(game.capsule.velocity.x);
  }

  if (nextX + game.capsule.radius > COURT_WIDTH) {
    nextX = COURT_WIDTH - game.capsule.radius;
    nextVelocityX = -Math.abs(game.capsule.velocity.x);
  }

  return {
    ...game,
    capsule: {
      ...game.capsule,
      position: {
        ...game.capsule.position,
        x: nextX
      },
      velocity: {
        ...game.capsule.velocity,
        x: nextVelocityX
      }
    },
    updatedAt: new Date().toISOString()
  };
}

export function spawnCapsuleIfNeeded(
  game: GameState,
  random: RandomSource = Math.random
): GameState {
  // Capsules only appear while the match is active.
  if (game.status !== "playing") {
    return game;
  }

  // If there is already a capsule, do not create a second one.
  if (game.capsule !== null) {
    return game;
  }

  // Most ticks should not spawn a capsule.
  // The chance is small so capsules feel occasional.
  if (random() > CAPSULE_SPAWN_CHANCE) {
    return game;
  }

  const type: PowerType = random() < 0.5 ? "shield" : "turbo";
  const direction = random() < 0.5 ? -1 : 1;

  return {
    ...game,
    capsule: {
      id: `capsule-${Date.now()}`,
      type,
      position: randomCourtPosition(random),
      velocity: {
        x: direction * CAPSULE_SPEED,
        y: 0
      },
      radius: CAPSULE_RADIUS
    },
    message: `Capsula ${type} aparecio.`,
    updatedAt: new Date().toISOString()
  };
}

// ===== TICK / ONE GAME UPDATE =====

export function tickGame(game: GameState): GameState {
  // If the game already ended, a tick should not move anything.
  if (game.status === "finished") {
    return game;
  }

  // First update shield timers so expired shields shrink before movement happens.
  const gameAfterTimers = updateShieldTimers(game);

  // One tick is one small update of the game.
  // The computer reacts to the current ball position.
  const gameAfterComputerMove = moveComputerPaddle(gameAfterTimers);

  // Then the ball moves and handles wall/paddle bounces.
  const gameAfterBallMove = moveBall(gameAfterComputerMove);

  // Finally, if the ball left a side of the court, add one point.
  const gameAfterScoring = scorePointIfNeeded(gameAfterBallMove);

  // If a score reached the winning number, finish the game and store the winner.
  const gameAfterVictoryCheck = finishGameIfNeeded(gameAfterScoring);

  // Capsules move horizontally, either toward the player or toward the computer.
  const gameAfterCapsuleMove = moveCapsule(gameAfterVictoryCheck);

  // If a paddle touches an active capsule, that side receives the power.
  const gameAfterCapsulePickup = collectCapsuleIfNeeded(gameAfterCapsuleMove);

  // If there is no active capsule, maybe create one for players to collect.
  return spawnCapsuleIfNeeded(gameAfterCapsulePickup);
}
