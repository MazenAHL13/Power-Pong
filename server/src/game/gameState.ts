import {
  BALL_RADIUS,
  BALL_START_SPEED_X,
  BALL_START_SPEED_Y,
  COMPUTER_PADDLE_SPEED,
  COMPUTER_PADDLE_X,
  COURT_HEIGHT,
  COURT_WIDTH,
  PADDLE_HEIGHT,
  POINT_PAUSE_TICKS,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PLAYER_PADDLE_X
} from "./constants.js";
import type {
  CompetitorState,
  GameState,
  PaddleState,
  PlayerSide,
  PowerState
} from "../../../shared/types.js";

function createPaddle(side: PlayerSide): PaddleState {
  const x = side === "player" ? PLAYER_PADDLE_X : COMPUTER_PADDLE_X;
  const speed = side === "player" ? PADDLE_SPEED : COMPUTER_PADDLE_SPEED;

  return {
    position: {
      x,
      y: COURT_HEIGHT / 2 - PADDLE_HEIGHT / 2
    },
    width: PADDLE_WIDTH,
    baseHeight: PADDLE_HEIGHT,
    height: PADDLE_HEIGHT,
    speed
  };
}

function createPower(type: PowerState["type"]): PowerState {
  return {
    type,
    active: false,
    remainingMs: 0
  };
}

function createCompetitor(side: PlayerSide, label: string): CompetitorState {
  return {
    side,
    label,
    score: 0,
    paddle: createPaddle(side),
    powers: [createPower("shield"), createPower("turbo")]
  };
}

// Creates a clean ready-state game before the player presses start.
export function createInitialGameState(): GameState {
  return {
    status: "ready",
    player: createCompetitor("player", "Jugador"),
    computer: createCompetitor("computer", "Computadora"),
    ball: {
      position: {
        x: COURT_WIDTH / 2,
        y: COURT_HEIGHT / 2
      },
      velocity: {
        x: BALL_START_SPEED_X,
        y: BALL_START_SPEED_Y
      },
      radius: BALL_RADIUS
    },
    capsule: null,
    pointPauseTicks: POINT_PAUSE_TICKS,
    winner: null,
    message: "Presiona iniciar partida para jugar.",
    updatedAt: new Date(0).toISOString()
  };
}

// Creates the state used when the player starts or restarts a match.
export function createStartedGameState(): GameState {
  return {
    ...createInitialGameState(),
    status: "playing",
    message: "Partida iniciada.",
    updatedAt: new Date().toISOString()
  };
}
