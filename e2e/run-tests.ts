import { execSync } from "child_process";
import { existsSync, renameSync, unlinkSync } from "fs";
import { join } from "path";

import { GenericContainer, Wait, type StartedTestContainer } from "testcontainers";

const IMAGE = "ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2";
const CONTAINER_STARTUP_TIMEOUT_MS = 60_000;
const ENV_FILE = join(process.cwd(), ".env");
const ENV_BACKUP = join(process.cwd(), ".env.backup");

function backupEnvFile(): boolean {
  // Clean up stale backup if it exists
  if (existsSync(ENV_BACKUP)) {
    console.log("Removing stale .env.backup file...");
    unlinkSync(ENV_BACKUP);
  }

  const hadEnvFile = existsSync(ENV_FILE);
  if (hadEnvFile) {
    renameSync(ENV_FILE, ENV_BACKUP);
  }
  return hadEnvFile;
}

function restoreEnvFile(hadEnvFile: boolean): void {
  try {
    if (hadEnvFile && existsSync(ENV_BACKUP)) {
      renameSync(ENV_BACKUP, ENV_FILE);
    }
  } catch (error) {
    console.error("Failed to restore .env file:", error);
  }
}

async function stopContainer(container: StartedTestContainer): Promise<void> {
  try {
    console.log("Stopping backend container...");
    await container.stop();
  } catch (error) {
    console.error("Failed to stop container:", error);
  }
}

async function main() {
  console.log("Starting backend container...");
  console.log(`Image: ${IMAGE}`);
  console.log(`Startup timeout: ${CONTAINER_STARTUP_TIMEOUT_MS}ms`);

  const container = await new GenericContainer(IMAGE)
    .withExposedPorts(80)
    .withWaitStrategy(Wait.forHttp("/health", 80))
    .withStartupTimeout(CONTAINER_STARTUP_TIMEOUT_MS)
    .start();

  const port = container.getMappedPort(80);
  const host = container.getHost();
  const backendUrl = `http://${host}:${port}`;

  console.log(`Backend started at ${backendUrl}`);

  // Temporarily move .env so Vite uses the environment variable
  const hadEnvFile = backupEnvFile();

  try {
    // Build the frontend with the backend URL baked in
    console.log(`Building frontend with VITE_API_URL=${backendUrl}`);
    execSync("npm run build", {
      stdio: "inherit",
      env: {
        ...process.env,
        VITE_API_URL: backendUrl,
      },
    });

    // Run playwright tests (VITE_API_URL already embedded in build)
    execSync("npx playwright test", {
      stdio: "inherit",
    });
  } finally {
    // Cleanup with individual error handling to avoid masking test failures
    restoreEnvFile(hadEnvFile);
    await stopContainer(container);
  }
}

main().catch((error) => {
  console.error("Test run failed:", error);
  process.exit(1);
});
