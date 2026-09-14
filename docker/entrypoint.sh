#!/bin/sh
#
# Render runtime configuration into /config.js before nginx starts.
#
# The environment-specific values differ between staging and production, but the image
# must not, so they are injected here rather than baked in at build time. One image
# therefore serves both, and what was verified on stage is promoted unchanged.
# See hf-apps-collection ADR-0008.
#
# Written to a tmpfs rather than the web root so the container can run with
# read_only: true (ADR-0012).
set -eu

# Hardcoded, NOT configurable: docker/nginx.conf serves /config.js from this exact path
# via `alias`. Making it an environment variable would let the two drift, and the
# failure is silent — nginx would serve the HTML 404 page for a <script src>, leaving
# window.__APP_CONFIG__ undefined with nothing logged.
#
# Under /tmp on purpose. /tmp is already a required tmpfs for nginx and is world-writable
# (1777), so uid 101 can always create this directory. A dedicated tmpfs elsewhere is
# mounted root-owned and is NOT writable by the runtime user unless every caller
# remembers uid= mount options — a trap that makes the container exit 1 at startup.
CONFIG_DIR=/tmp/app-config
mkdir -p "$CONFIG_DIR"

# Escape backslashes and double quotes, and strip newlines/carriage returns. An embedded
# newline would produce an unterminated JS string literal, so config.js would fail to
# parse and window.__APP_CONFIG__ would never be defined — the worst kind of
# misconfiguration, because nothing errors.
esc() { printf '%s' "${1:-}" | tr -d '\n\r' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

cat > "$CONFIG_DIR/config.js" <<JS
// Generated at container start — do not edit. Source: APP_* environment variables.
window.__APP_CONFIG__ = {
  auth0Domain: "$(esc "${APP_AUTH0_DOMAIN:-}")",
  auth0ClientId: "$(esc "${APP_AUTH0_CLIENT_ID:-}")",
  apiUrl: "$(esc "${APP_API_URL:-}")"
};
JS

if [ -z "${APP_AUTH0_CLIENT_ID:-}" ]; then
  # NOT "falls back to the build-time value": this image is built without
  # VITE_AUTH0_CLIENT_ID, so there is no fallback inside the container — login is
  # simply broken. The deployment fails closed before this point (compose declares the
  # variable with ${VAR:?}), so reaching here means someone ran the image by hand.
  echo "entrypoint: WARNING - APP_AUTH0_CLIENT_ID is empty; Auth0 login will not work" >&2
fi

exec "$@"
