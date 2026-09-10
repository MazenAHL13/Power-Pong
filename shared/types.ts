// Basic vocabulary shared by the backend rules and frontend rendering.
export type PlayerSide = "player" | "computer";

export type GameStatus = "ready" | "playing" | "finished";

export type GameDifficulty = "easy" | "normal" | "hard";

export type PowerType = "shield" | "turbo";

export type MoveDirection = "up" | "down";

// Every visible object uses x/y coordinates inside the game court.
export interface Point {
  x: number;
  y: number;
}

// The ball keeps both its current position and the velocity used on each tick.
export interface BallState {
  position: Point;
  velocity: Point;
  radius: number;
}

// A paddle can temporarily grow beyond its base height when shield is active.
export interface PaddleState {
  position: Point;
  width: number;
  baseHeight: number;
  height: number;
  speed: number;
}

// Powers are inactive until a capsule is collected, then active until they expire.
export interface PowerState {
  type: PowerType;
  active: boolean;
  remainingMs: number;
}

// A capsule is the collectible item on the court before a player touches it.
export interface CapsuleState {
  id: string;
  type: PowerType;
  position: Point;
  velocity: Point;
  radius: number;
}

// A competitor groups score, paddle, and powers for either human or computer.
export interface CompetitorState {
  side: PlayerSide;
  label: string;
  score: number;
  paddle: PaddleState;
  powers: PowerState[];
}

// GameState is the complete snapshot returned by the backend after each call.
export interface GameState {
  status: GameStatus;
  difficulty: GameDifficulty;
  player: CompetitorState;
  computer: CompetitorState;
  ball: BallState;
  capsule: CapsuleState | null;
  pointPauseTicks: number;
  winner: PlayerSide | null;
  message: string | null;
  updatedAt: string;
}

// Actions describe the commands a client is allowed to send to the backend.
export interface MoveAction {
  player: "player";
  type: "move";
  direction: MoveDirection;
}

export type GameAction = MoveAction;

// API responses always include the current game so the client can re-render.
export interface ApiGameResponse {
  ok: boolean;
  game: GameState;
  message?: string;
}
