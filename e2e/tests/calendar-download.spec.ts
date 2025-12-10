import { expect, test } from "../fixtures/test-fixtures";

test("downloads ICS file", async ({ page }) => {
  // Use January which reliably has deadline entries
  await page.goto("/fristenkalender/?monat=januar");

  // Wait for the calendar table specifically (not the glossary table)
  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 30000 });

  // Verify data loaded before attempting download
  await expect(calendarTable.locator("tbody tr")).not.toHaveCount(0);

  // Set up download listener before clicking
  const downloadPromise = page.waitForEvent("download", { timeout: 60000 });

  // Click the download button
  const downloadButton = page.getByRole("button", {
    name: /download jahreskalender ics/i,
  });
  await expect(downloadButton).toBeVisible();
  await downloadButton.click();

  // Wait for download to complete
  const download = await downloadPromise;

  // Verify the filename matches expected pattern
  expect(download.suggestedFilename()).toMatch(
    /Hochfrequenz_Fristenkalender_\d{4}\.ics$/,
  );
});
