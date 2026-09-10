import { expect, test } from "@playwright/test";

test("loads the court and starts the game", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".court")).toBeVisible();
  await expect(page.getByText("0 - 0")).toBeVisible();

  await page.getByRole("button", { name: "Iniciar partida" }).click();

  await expect(page.getByRole("button", { name: "Iniciar partida" })).toBeHidden();
  await expect(page.locator(".player-paddle")).toBeVisible();
  await expect(page.locator(".computer-paddle")).toBeVisible();
  await expect(page.locator(".ball")).toBeVisible();
});
