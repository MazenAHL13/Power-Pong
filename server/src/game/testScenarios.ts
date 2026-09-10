import {
  BALL_START_SPEED_X,
  CAPSULE_RADIUS,
  COURT_HEIGHT,
  COURT_WIDTH,
  WINNING_SCORE
} from "./constants.js";
import type { GameState, PowerType } from "../../../shared/types.js";

type TestScenarioName =
  | "playerCapsule"
  | "computerCapsule"
  | "playerPoint"
  | "computerPoint"
  | "playerNearWin"
  | "computerNearWin";

interface TestScenarioRequest {
  scenario: TestScenarioName;
  power?: PowerType;
}

export function isTestScenarioRequest(value: unknown): value is TestScenarioRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  const scenarioIsValid =
    body.scenario === "playerCapsule" ||
    body.scenario === "computerCapsule" ||
    body.scenario === "playerPoint" ||
    body.scenario === "computerPoint" ||
    body.scenario === "playerNearWin" ||
    body.scenario === "computerNearWin";

  const powerIsValid =
    body.power === undefined || body.power === "shield" || body.power === "turbo";

  return scenarioIsValid && powerIsValid;
}

export function applyTestScenario(
  game: GameState,
  request: TestScenarioRequest
): GameState {
  const power = request.power ?? "shield";

  if (request.scenario === "playerCapsule") {
    return {
      ...game,
      status: "playing",
      capsule: {
        id: "test-player-capsule",
        type: power,
        position: {
          x: game.player.paddle.position.x + game.player.paddle.width / 2,
          y: game.player.paddle.position.y + game.player.paddle.height / 2
        },
        radius: CAPSULE_RADIUS
      },
      message: "Escenario de prueba: capsula del jugador.",
      updatedAt: new Date().toISOString()
    };
  }

  if (request.scenario === "computerCapsule") {
    return {
      ...game,
      status: "playing",
      capsule: {
        id: "test-computer-capsule",
        type: power,
        position: {
          x: game.computer.paddle.position.x + game.computer.paddle.width / 2,
          y: game.computer.paddle.position.y + game.computer.paddle.height / 2
        },
        radius: CAPSULE_RADIUS
      },
      message: "Escenario de prueba: capsula de la computadora.",
      updatedAt: new Date().toISOString()
    };
  }

  if (request.scenario === "playerPoint" || request.scenario === "playerNearWin") {
    const playerScore = request.scenario === "playerNearWin" ? WINNING_SCORE - 1 : game.player.score;

    return {
      ...game,
      status: "playing",
      player: {
        ...game.player,
        score: playerScore
      },
      ball: {
        ...game.ball,
        position: {
          x: COURT_WIDTH + game.ball.radius + 1,
          y: COURT_HEIGHT / 2
        },
        velocity: {
          x: BALL_START_SPEED_X,
          y: 0
        }
      },
      message: "Escenario de prueba: punto del jugador.",
      updatedAt: new Date().toISOString()
    };
  }

  const computerScore =
    request.scenario === "computerNearWin" ? WINNING_SCORE - 1 : game.computer.score;

  return {
    ...game,
    status: "playing",
    computer: {
      ...game.computer,
      score: computerScore
    },
    ball: {
      ...game.ball,
      position: {
        x: -game.ball.radius - 1,
        y: COURT_HEIGHT / 2
      },
      velocity: {
        x: -BALL_START_SPEED_X,
        y: 0
      }
    },
    message: "Escenario de prueba: punto de la computadora.",
    updatedAt: new Date().toISOString()
  };
}
