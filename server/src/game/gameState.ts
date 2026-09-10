import {
  BALL_RADIUS,
  COMPUTER_PADDLE_X,
  COURT_HEIGHT,
  COURT_WIDTH,
  DEFAULT_DIFFICULTY,
  DIFFICULTY_SETTINGS,
  POINT_PAUSE_TICKS,
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PLAYER_PADDLE_X
} from "./constants.js";
import type {
  CompetitorState,
  GameDifficulty,
  GameState,
  PaddleState,
  PlayerSide,
  PowerState
} from "../../../shared/types.js";

function createPaddle(side: PlayerSide, difficulty: GameDifficulty): PaddleState {
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
  const x = side === "player" ? PLAYER_PADDLE_X : COMPUTER_PADDLE_X;
  const baseHeight =
    side === "player"
      ? difficultySettings.playerPaddleHeight
      : difficultySettings.computerPaddleHeight;
  const speed = side === "player" ? PADDLE_SPEED : difficultySettings.computerPaddleSpeed;

  return {
    position: {
      x,
      y: COURT_HEIGHT / 2 - baseHeight / 2
    },
    width: PADDLE_WIDTH,
    baseHeight,
    height: baseHeight,
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

function createCompetitor(
  side: PlayerSide,
  label: string,
  difficulty: GameDifficulty
): CompetitorState {
  return {
    side,
    label,
    score: 0,
    paddle: createPaddle(side, difficulty),
    powers: [createPower("shield"), createPower("turbo")]
  };
}

// Creates a clean ready-state game before the player presses start.
export function createInitialGameState(
  difficulty: GameDifficulty = DEFAULT_DIFFICULTY
): GameState {
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];

  return {
    status: "ready",
    difficulty,
    player: createCompetitor("player", "Jugador", difficulty),
    computer: createCompetitor("computer", "Computadora", difficulty),
    ball: {
      position: {
        x: COURT_WIDTH / 2,
        y: COURT_HEIGHT / 2
      },
      velocity: {
        x: difficultySettings.ballSpeedX,
        y: difficultySettings.ballSpeedY
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
export function createStartedGameState(
  difficulty: GameDifficulty = DEFAULT_DIFFICULTY
): GameState {
  return {
    ...createInitialGameState(difficulty),
    status: "playing",
    message: "Partida iniciada.",
    updatedAt: new Date().toISOString()
  };
}
