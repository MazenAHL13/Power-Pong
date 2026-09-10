import type { GameDifficulty } from "../../../shared/types.js";

// Court dimensions use pixels so the backend and frontend can render the same space.
export const COURT_WIDTH = 900;
export const COURT_HEIGHT = 520;

// Score needed to finish the game.
export const WINNING_SCORE = 7;

// Paddle rules.
export const PADDLE_WIDTH = 18;
export const PADDLE_HEIGHT = 96;
export const PADDLE_SHIELD_HEIGHT = 190;
export const PADDLE_SPEED = 28;
export const PLAYER_PADDLE_X = 36;
export const COMPUTER_PADDLE_X = COURT_WIDTH - PLAYER_PADDLE_X - PADDLE_WIDTH;

// Ball rules.
export const BALL_RADIUS = 10;
export const BALL_START_SPEED_X = 20;
export const BALL_START_SPEED_Y = 4;
export const POINT_PAUSE_TICKS = 40;
export const TURBO_MULTIPLIER = 1.6;

// Computer movement is intentionally slower than perfect tracking.
export const COMPUTER_PADDLE_SPEED = 8;
export const COMPUTER_REACTION_CHANCE = 0.65;

export interface DifficultySettings {
  playerPaddleHeight: number;
  computerPaddleHeight: number;
  computerPaddleSpeed: number;
  computerReactionChance: number;
  ballSpeedX: number;
  ballSpeedY: number;
}

export const DEFAULT_DIFFICULTY: GameDifficulty = "normal";

export const DIFFICULTY_SETTINGS: Record<GameDifficulty, DifficultySettings> = {
  easy: {
    playerPaddleHeight: 120,
    computerPaddleHeight: 78,
    computerPaddleSpeed: 6,
    computerReactionChance: 0.35,
    ballSpeedX: 16,
    ballSpeedY: 3
  },
  normal: {
    playerPaddleHeight: PADDLE_HEIGHT,
    computerPaddleHeight: PADDLE_HEIGHT,
    computerPaddleSpeed: COMPUTER_PADDLE_SPEED,
    computerReactionChance: COMPUTER_REACTION_CHANCE,
    ballSpeedX: BALL_START_SPEED_X,
    ballSpeedY: BALL_START_SPEED_Y
  },
  hard: {
    playerPaddleHeight: 84,
    computerPaddleHeight: 116,
    computerPaddleSpeed: 12,
    computerReactionChance: 0.85,
    ballSpeedX: 24,
    ballSpeedY: 5
  }
};

// Power and capsule rules.
export const SHIELD_DURATION_MS = 30_000;
export const CAPSULE_RADIUS = 14;
export const CAPSULE_SPEED = 6;
export const CAPSULE_SPAWN_CHANCE = 0.015;
