// Court dimensions use pixels so the backend and frontend can render the same space.
export const COURT_WIDTH = 900;
export const COURT_HEIGHT = 520;

// Score needed to finish the game.
export const WINNING_SCORE = 7;

// Paddle rules.
export const PADDLE_WIDTH = 18;
export const PADDLE_HEIGHT = 96;
export const PADDLE_SHIELD_HEIGHT = 140;
export const PADDLE_SPEED = 28;
export const PLAYER_PADDLE_X = 36;
export const COMPUTER_PADDLE_X = COURT_WIDTH - PLAYER_PADDLE_X - PADDLE_WIDTH;

// Ball rules.
export const BALL_RADIUS = 10;
export const BALL_START_SPEED_X = 7;
export const BALL_START_SPEED_Y = 4;
export const TURBO_MULTIPLIER = 1.6;

// Computer movement is intentionally slower than perfect tracking.
export const COMPUTER_PADDLE_SPEED = 20;

// Power and capsule rules.
export const SHIELD_DURATION_MS = 30_000;
export const CAPSULE_RADIUS = 14;
export const CAPSULE_SPAWN_CHANCE = 0.015;
