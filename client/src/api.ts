import type { ApiGameResponse, GameDifficulty, MoveDirection } from "../../shared/types";

async function readGameResponse(response: Response): Promise<ApiGameResponse> {
  const data = (await response.json()) as ApiGameResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.message ?? "No se pudo completar la accion.");
  }

  return data;
}

export async function startGame(): Promise<ApiGameResponse> {
  const response = await fetch("/api/game/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  return readGameResponse(response);
}

export async function getGameState(): Promise<ApiGameResponse> {
  const response = await fetch("/api/game/state");

  return readGameResponse(response);
}

export async function movePlayer(direction: MoveDirection): Promise<ApiGameResponse> {
  const response = await fetch("/api/game/action", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      player: "player",
      type: "move",
      direction
    })
  });

  return readGameResponse(response);
}

export async function tickGame(): Promise<ApiGameResponse> {
  const response = await fetch("/api/game/tick", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  });

  return readGameResponse(response);
}

export async function setGameDifficulty(
  difficulty: GameDifficulty
): Promise<ApiGameResponse> {
  const response = await fetch("/api/game/difficulty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      difficulty
    })
  });

  return readGameResponse(response);
}
