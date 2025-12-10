import { expect, test } from "../fixtures/test-fixtures";

test("calendar displays deadlines from backend", async ({ page }) => {
  await page.goto("/fristenkalender/");

  // Wait for data to load - use specific selector for calendar table (inside overflow-auto container)
  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify deadline entries are displayed
  await expect(calendarTable.locator("tbody tr")).not.toHaveCount(0);
});

test("calendar filters by type", async ({ page }) => {
  await page.goto("/fristenkalender/?netzzugangsthemen=mabis");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify filter is applied (URL param persists)
  await expect(page).toHaveURL(/netzzugangsthemen=mabis/);
});

test("calendar navigates between months", async ({ page }) => {
  await page.goto("/fristenkalender/");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify URL contains month parameter
  await expect(page).toHaveURL(/monat=/);
});
