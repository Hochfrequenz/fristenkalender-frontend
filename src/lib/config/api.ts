// Backend base URL.
//
// Resolution order:
//   1. window.__APP_CONFIG__.apiUrl — written per environment by the container
//      entrypoint (hf-apps-collection ADR-0008).
//   2. import.meta.env.VITE_API_URL — the build-time value, used by `vite dev` and the
//      Azure Static Web Apps builds, which have no entrypoint.
//   3. DEFAULT_API_URL — last resort.
//
// Without step 1 the container would silently use DEFAULT_API_URL, which is a DIFFERENT
// host from the one the Azure builds target: the version, docs and MCP endpoints do not
// exist there, so the footer version, the API link and the whole MCP page would break
// while calendar generation kept working — a failure that is easy to miss.
const DEFAULT_API_URL = "https://fristenkalender.azurewebsites.net";

const runtimeApiUrl =
  typeof window !== "undefined" ? window.__APP_CONFIG__?.apiUrl : undefined;

export const API_BASE_URL =
  runtimeApiUrl || import.meta.env.VITE_API_URL || DEFAULT_API_URL;
