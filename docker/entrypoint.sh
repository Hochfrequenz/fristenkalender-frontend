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

# Warn for every value the container cannot fall back on. The image is built without
# the build-time equivalents, so a missing value here is simply broken behaviour — and
# for the backend URL it is WORSE than broken: the app silently uses a wrong default
# rather than failing, so the container looks healthy while pointing somewhere else.
#
# Warn rather than exit: the deployment already fails closed (compose declares these
# with ${VAR:?}), so reaching this code means someone is running the image by hand and
# an abort would be unhelpful.
warn_if_empty() {
  eval "value=\${$1:-}"
  [ -n "$value" ] || echo "entrypoint: WARNING - $1 is empty; $2" >&2
}

warn_if_empty APP_AUTH0_CLIENT_ID "Auth0 login will not work"
warn_if_empty APP_AUTH0_DOMAIN "Auth0 login will not work"
warn_if_empty APP_API_URL "the app falls back to a LEGACY backend host that does not serve /version, /docs or /mcp"

exec "$@"
