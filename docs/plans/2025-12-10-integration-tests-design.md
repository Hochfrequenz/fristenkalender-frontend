# Integration Tests with Playwright and Testcontainers

## Overview

Add integration tests to the fristenkalender-frontend using Playwright for browser automation and Testcontainers for running the backend API in Docker during tests.

## Goals

- Verify the frontend correctly loads and displays data from the backend
- Test core user flows: calendar loading, type filtering, ICS downloads
- Run tests against a real backend instance (not mocks)
- Enable CI/CD integration

## Technical Decisions

| Decision              | Choice                                                 | Rationale                                                |
| --------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| Test framework        | Playwright                                             | Built-in Docker support, excellent SvelteKit integration |
| Backend orchestration | Testcontainers                                         | Programmatic control, better test isolation              |
| API URL config        | `VITE_API_URL` env var                                 | Required in all environments, no defaults                |
| Backend image         | `ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2` | Public registry, pinned version, CORS enabled           |

## Project Structure

```
├── playwright.config.ts
├── e2e/
│   ├── setup/
│   │   └── backend-container.ts
│   ├── fixtures/
│   │   └── test-fixtures.ts
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
export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL environment variable is required");
}
```

**Environment setup:**

- Production (GitHub Action): `VITE_API_URL=https://fristenkalender.azurewebsites.net`
- Local dev: `VITE_API_URL=https://fristenkalender.azurewebsites.net` in `.env`
- Tests: `VITE_API_URL=http://localhost:<dynamic-port>` set by Testcontainers

**Files to update:**

- `src/lib/components/features/calendar-table.svelte` - use `API_BASE_URL`
- `src/lib/services/download-ics.ts` - use `API_BASE_URL`

### 2. Testcontainers Setup

**`e2e/setup/backend-container.ts`**

```typescript
import { GenericContainer, StartedTestContainer } from "testcontainers";

const IMAGE = "ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2";

let container: StartedTestContainer | null = null;

export async function startBackend(): Promise<string> {
  container = await new GenericContainer(IMAGE).withExposedPorts(80).start();

  const port = container.getMappedPort(80);
  return `http://localhost:${port}`;
}

export async function stopBackend(): Promise<void> {
  if (container) {
    await container.stop();
    container = null;
  }
}
```

### 3. Test Fixtures

**`e2e/fixtures/test-fixtures.ts`**

```typescript
import { test as base } from "@playwright/test";
import { startBackend, stopBackend } from "../setup/backend-container";

export const test = base.extend<{}, { backendUrl: string }>({
  backendUrl: [
    async ({}, use) => {
      const url = await startBackend();
      await use(url);
      await stopBackend();
    },
    { scope: "worker" },
  ],
});

export { expect } from "@playwright/test";
```

### 4. Playwright Configuration

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
    command: "npm run build && npm run preview",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_URL: process.env.VITE_API_URL || "http://localhost:7071",
    },
  },
});
```

### 5. Test Scenarios

**`e2e/tests/calendar-load.spec.ts`**

```typescript
import { test, expect } from "../fixtures/test-fixtures";

test("calendar displays deadlines from backend", async ({
  page,
  backendUrl,
}) => {
  await page.goto("/fristenkalender/");

  await expect(page.locator("table")).toBeVisible();
  await expect(page.locator("tbody tr")).not.toHaveCount(0);
});

test("calendar filters by type", async ({ page, backendUrl }) => {
  await page.goto("/fristenkalender/?netzzugangsthemen=mabis");

  await expect(page.locator("table")).toBeVisible();
  await expect(page).toHaveURL(/netzzugangsthemen=mabis/);
});
```

**`e2e/tests/calendar-download.spec.ts`**

```typescript
import { test, expect } from "../fixtures/test-fixtures";

test("downloads ICS file", async ({ page, backendUrl }) => {
  await page.goto("/fristenkalender/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /download/i }).click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/Fristenkalender.*\.ics$/);
});
```

### 6. Dependencies & Scripts

**New devDependencies:**

```json
{
  "@playwright/test": "^1.49.0",
  "testcontainers": "^10.16.0"
}
```

**New scripts:**

```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## Files Changed

| File                                                | Action             |
| --------------------------------------------------- | ------------------ |
| `src/lib/config/api.ts`                             | Create             |
| `src/lib/components/features/calendar-table.svelte` | Modify             |
| `src/lib/services/download-ics.ts`                  | Modify             |
| `playwright.config.ts`                              | Create             |
| `e2e/setup/backend-container.ts`                    | Create             |
| `e2e/fixtures/test-fixtures.ts`                     | Create             |
| `e2e/tests/calendar-load.spec.ts`                   | Create             |
| `e2e/tests/calendar-download.spec.ts`               | Create             |
| `package.json`                                      | Modify             |
| `.env.example`                                      | Create             |
| `.gitignore`                                        | Modify (if needed) |
