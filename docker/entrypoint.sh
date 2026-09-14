#!/bin/sh
#
# Render runtime configuration into /config.js before nginx starts.
#
# The Auth0 client ID differs between environments but the image must not, so it is
# injected here rather than baked in by Vite at build time. One image therefore serves
# staging and production, and what was verified on stage is promoted unchanged.
# See hf-apps-collection ADR-0008.
#
# Written to a tmpfs rather than the web root so the container can run with
# read_only: true (ADR-0012).
set -eu

CONFIG_DIR="${APP_CONFIG_DIR:-/var/cache/app-config}"
mkdir -p "$CONFIG_DIR"

# Escape backslashes and double quotes so a stray character cannot break the script.
esc() { printf '%s' "${1:-}" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

cat > "$CONFIG_DIR/config.js" <<JS
// Generated at container start — do not edit. Source: APP_* environment variables.
window.__APP_CONFIG__ = {
  auth0Domain: "$(esc "${APP_AUTH0_DOMAIN:-}")",
  auth0ClientId: "$(esc "${APP_AUTH0_CLIENT_ID:-}")"
};
JS

if [ -z "${APP_AUTH0_CLIENT_ID:-}" ]; then
  echo "entrypoint: WARNING - APP_AUTH0_CLIENT_ID is empty; the app will fall back to its build-time value" >&2
fi

exec "$@"
