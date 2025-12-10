import { execSync } from "child_process";
import { existsSync, renameSync } from "fs";
import { join } from "path";

import { GenericContainer, Wait } from "testcontainers";

const IMAGE = "ghcr.io/hochfrequenz/fristenkalender-functions:v2.1.2";
const ENV_FILE = join(process.cwd(), ".env");
const ENV_BACKUP = join(process.cwd(), ".env.backup");

async function main() {
  console.log("Starting backend container...");

  const container = await new GenericContainer(IMAGE)
    .withExposedPorts(80)
    .withWaitStrategy(Wait.forHttp("/health", 80))
    .start();

  const port = container.getMappedPort(80);
  const host = container.getHost();
  const backendUrl = `http://${host}:${port}`;

  console.log(`Backend started at ${backendUrl}`);

  // Temporarily move .env so Vite uses the environment variable
  const hadEnvFile = existsSync(ENV_FILE);
  if (hadEnvFile) {
    renameSync(ENV_FILE, ENV_BACKUP);
  }

  try {
    console.log(`Setting VITE_API_URL=${backendUrl}`);

    // Build the frontend with the backend URL
    console.log("Building frontend...");
    execSync("npm run build", {
      stdio: "inherit",
      env: {
        ...process.env,
        VITE_API_URL: backendUrl,
      },
    });

    // Run playwright tests
    execSync("npx playwright test", {
      stdio: "inherit",
      env: {
        ...process.env,
        VITE_API_URL: backendUrl,
      },
    });
  } finally {
    // Restore .env file
    if (hadEnvFile) {
      renameSync(ENV_BACKUP, ENV_FILE);
    }
    console.log("Stopping backend container...");
    await container.stop();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
