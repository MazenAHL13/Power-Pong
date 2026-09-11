import { expect, test } from "@playwright/test";
import type { ApiGameResponse } from "../../shared/types";

const defensePauseMs = Number(process.env.E2E_PAUSE_MS ?? 1200);
const usesPublishedUrl = process.env.PLAYWRIGHT_BASE_URL !== undefined;

async function pauseForDefense() {
  await new Promise((resolve) => {
    setTimeout(resolve, defensePauseMs);
  });
}

test("loads the court, starts the game, and shows movement", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".court")).toBeVisible();
  await expect(page.getByText("0 - 0")).toBeVisible();
  await expect(page.getByText("Estado: Listo")).toBeVisible();
  await expect(page.getByText("Usa W y S para mover tu paleta.")).toBeVisible();

  await pauseForDefense();

  await page.getByRole("button", { name: "Iniciar partida" }).click();

  await expect(page.getByRole("button", { name: "Iniciar partida" })).toBeHidden();
  await expect(page.getByText("Estado: Jugando")).toBeVisible();
  await expect(page.locator(".player-paddle")).toBeVisible();
  await expect(page.locator(".computer-paddle")).toBeVisible();
  await expect(page.locator(".ball")).toBeVisible();

  await pauseForDefense();

  const playerPaddle = page.locator(".player-paddle");
  const firstPaddleBox = await playerPaddle.boundingBox();
  const firstBallBox = await page.locator(".ball").boundingBox();

  await page.keyboard.press("S");
  await pauseForDefense();

  const movedPaddleBox = await playerPaddle.boundingBox();
  const movedBallBox = await page.locator(".ball").boundingBox();

  expect(firstPaddleBox).not.toBeNull();
  expect(movedPaddleBox).not.toBeNull();
  expect(firstBallBox).not.toBeNull();
  expect(movedBallBox).not.toBeNull();

  expect(movedPaddleBox?.y).not.toBe(firstPaddleBox?.y);
  expect(movedBallBox?.x).not.toBe(firstBallBox?.x);

  await page.keyboard.press("W");
  await pauseForDefense();

  await pauseForDefense();
});

test.skip(usesPublishedUrl, "Power-up scenarios use the local test-mode endpoint.");

test("collects the shield power-up and grows the player paddle", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar partida" }).click();
  await expect(page.getByText("Estado: Jugando")).toBeVisible();

  const playerPaddle = page.locator(".player-paddle");
  const normalPaddleBox = await playerPaddle.boundingBox();
  expect(normalPaddleBox).not.toBeNull();

  await page.request.post("/api/test/scenario", {
    data: {
      scenario: "playerCapsule",
      power: "shield"
    }
  });

  await pauseForDefense();

  await expect.poll(async () => {
    const stateResponse = await page.request.get("/api/game/state");
    const body = (await stateResponse.json()) as ApiGameResponse;
    return body.game.player.powers.find((power) => power.type === "shield")?.active;
  }).toBe(true);

  const shieldPaddleBox = await playerPaddle.boundingBox();
  expect(shieldPaddleBox).not.toBeNull();
  expect(shieldPaddleBox?.height).toBeGreaterThan(normalPaddleBox?.height ?? 0);

  await pauseForDefense();
});

test("collects the turbo power-up and stores it for the player", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Iniciar partida" }).click();
  await expect(page.getByText("Estado: Jugando")).toBeVisible();

  await page.request.post("/api/test/scenario", {
    data: {
      scenario: "playerCapsule",
      power: "turbo"
    }
  });

  await pauseForDefense();

  await expect.poll(async () => {
    const stateResponse = await page.request.get("/api/game/state");
    const body = (await stateResponse.json()) as ApiGameResponse;
    return body.game.player.powers.find((power) => power.type === "turbo")?.active;
  }).toBe(true);

  await pauseForDefense();
});
