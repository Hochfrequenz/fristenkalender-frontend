// Auth0 configuration.
//
// Resolution order:
//   1. window.__APP_CONFIG__ — written per environment by the container entrypoint, so
//      one image can serve staging and production (hf-apps-collection ADR-0008).
//   2. import.meta.env.VITE_AUTH0_CLIENT_ID — the build-time value, still used by
//      `vite dev` and Cloudflare Pages previews, which have no entrypoint.

declare global {
  interface Window {
    __APP_CONFIG__?: {
      auth0Domain?: string;
      auth0ClientId?: string;
      apiUrl?: string;
    };
  }
}

const runtime =
  typeof window !== "undefined" ? window.__APP_CONFIG__ : undefined;

const isDev =
  import.meta.env.DEV ||
  (typeof window !== "undefined" && window.location.hostname === "localhost");

const config = {
  domain: runtime?.auth0Domain || "auth.hochfrequenz.de",
  clientId: isDev
    ? ""
    : runtime?.auth0ClientId || import.meta.env.VITE_AUTH0_CLIENT_ID || "", // shared "HF-apps-stage/prod" tenant auth0 client IDs
};

export default config as {
  domain: string;
  clientId: string;
};
