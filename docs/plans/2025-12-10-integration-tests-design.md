# Integration Tests with Playwright and Testcontainers

## Overview

Add integration tests to the fristenkalender-frontend using Playwright for browser automation and Testcontainers for running the backend API in Docker during tests.

## Goals

- Verify the frontend correctly loads and displays data from the backend
- Test core user flows: calendar loading, type filtering, ICS downloads
- Run tests against a real backend instance (not mocks)
- Enable CI/CD integration

## Technical Decisions

| Decision              | Choice                                                  | Rationale                                                |
| --------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| Test framework        | Playwright                                              | Built-in Docker support, excellent SvelteKit integration |
| Backend orchestration | Testcontainers via wrapper script                       | Programmatic control, better test isolation              |
| API URL config        | `VITE_API_URL` env var with default                     | Optional override, defaults to production URL            |
| Backend image         | `ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2` | Public registry, pinned version, CORS enabled            |

## Project Structure

```
├── playwright.config.ts
├── e2e/
│   ├── run-tests.ts          # Test orchestrator (container + build + test)
│   ├── fixtures/
│   │   └── test-fixtures.ts  # Re-exports Playwright test/expect
│   └── tests/
│       ├── calendar-load.spec.ts
│       └── calendar-download.spec.ts
├── src/lib/config/
│   └── api.ts
├── .env.example
```

## Implementation Details

### 1. API URL Configuration

**`src/lib/config/api.ts`**

```typescript
const DEFAULT_API_URL = "https://fristenkalender.azurewebsites.net";

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
```

**Environment setup:**

- Production/Local dev: Uses default URL (can override with `VITE_API_URL`)
- Tests: `VITE_API_URL=http://localhost:<dynamic-port>` set by test runner

**Files updated:**

- `src/lib/components/features/calendar-table.svelte` - uses `API_BASE_URL`
- `src/lib/services/download-ics.ts` - uses `API_BASE_URL`

### 2. Test Runner Script

**`e2e/run-tests.ts`**

The test runner orchestrates the entire test flow:

1. Starts backend container with health check
2. Backs up `.env` file (if exists)
3. Builds frontend with `VITE_API_URL` pointing to container
4. Runs Playwright tests
5. Restores `.env` file
6. Stops container

```typescript
import { execSync } from "child_process";
import { existsSync, renameSync, unlinkSync } from "fs";
import { GenericContainer, Wait } from "testcontainers";

const IMAGE = "ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2";

async function main() {
  const container = await new GenericContainer(IMAGE)
    .withExposedPorts(80)
    .withWaitStrategy(Wait.forHttp("/health", 80))
    .start();

  const backendUrl = `http://${container.getHost()}:${container.getMappedPort(80)}`;

  // Backup .env, build with container URL, run tests, restore .env
  // ...
}
```

### 3. Playwright Configuration

**`playwright.config.ts`**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4. Test Scenarios

**`e2e/tests/calendar-load.spec.ts`**

```typescript
import { expect, test } from "../fixtures/test-fixtures";

test("calendar displays deadlines from backend", async ({ page }) => {
  await page.goto("/fristenkalender/");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });
  await expect(calendarTable.locator("tbody tr")).not.toHaveCount(0);
});

test("calendar filters by type", async ({ page }) => {
  await page.goto("/fristenkalender/?netzzugangsthemen=mabis");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL(/netzzugangsthemen=mabis/);
});

test("calendar navigates between months", async ({ page }) => {
  await page.goto("/fristenkalender/");

  const calendarTable = page.locator(".overflow-auto table");
  await expect(calendarTable).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL(/monat=/);
});
```

**`e2e/tests/calendar-download.spec.ts`**

```typescript
import { expect, test } from "../fixtures/test-fixtures";

test("downloads ICS file", async ({ page }) => {
  await page.goto("/fristenkalender/");

  await expect(page.locator(".overflow-auto table")).toBeVisible({
    timeout: 30000,
  });

  const downloadPromise = page.waitForEvent("download", { timeout: 60000 });
  await page.getByRole("button", { name: /download jahreskalender ics/i }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/Hochfrequenz_Fristenkalender_\d{4}\.ics$/);
});
```

### 5. Dependencies & Scripts

**New devDependencies:**

```json
{
  "@playwright/test": "^1.57.0",
  "testcontainers": "^11.10.0",
  "tsx": "^4.21.0"
}
```

**New scripts:**

```json
{
  "test:e2e": "npx tsx e2e/run-tests.ts"
}
```

## Files Changed

| File                                                | Action |
| --------------------------------------------------- | ------ |
| `src/lib/config/api.ts`                             | Create |
| `src/lib/components/features/calendar-table.svelte` | Modify |
| `src/lib/services/download-ics.ts`                  | Modify |
| `playwright.config.ts`                              | Create |
| `e2e/run-tests.ts`                                  | Create |
| `e2e/fixtures/test-fixtures.ts`                     | Create |
| `e2e/tests/calendar-load.spec.ts`                   | Create |
| `e2e/tests/calendar-download.spec.ts`               | Create |
| `package.json`                                      | Modify |
| `.env.example`                                      | Create |
| `.gitignore`                                        | Modify |
| `.github/workflows/integration-tests.yml`           | Create |
