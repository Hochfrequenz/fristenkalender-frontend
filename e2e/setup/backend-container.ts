import { GenericContainer, type StartedTestContainer } from "testcontainers";

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
