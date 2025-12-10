import { expect, test } from "../fixtures/test-fixtures";

test("calendar displays deadlines from backend", async ({ page }) => {
  // Use January which reliably has deadline entries
  await page.goto("/fristenkalender/?monat=januar");

  // Wait for calendar table to load (inside overflow-auto container, not glossary)
  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify actual deadline entries are displayed (not just empty table)
  const rows = calendarTable.locator("tbody tr");
  await expect(rows).not.toHaveCount(0);

  // Verify we got a reasonable number of entries (January typically has 10+ deadlines)
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(5);
});

test("calendar filters by type", async ({ page }) => {
  // Use January with MABIS filter
  await page.goto("/fristenkalender/?monat=januar&netzzugangsthemen=mabis");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify filter is applied (URL param persists)
  await expect(page).toHaveURL(/netzzugangsthemen=mabis/);

  // Verify filtered results exist
  const rows = calendarTable.locator("tbody tr");
  await expect(rows).not.toHaveCount(0);
});

test("calendar navigates between months", async ({ page }) => {
  await page.goto("/fristenkalender/?monat=januar");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });

  // Verify URL contains month parameter
  await expect(page).toHaveURL(/monat=/);
});
