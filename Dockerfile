# Two-stage build: node produces the static bundle, nginx serves it.
# See hf-apps-collection ADR-0009.

# Node 20 matches what this repo's CI builds with (.github/workflows/building.yml).
FROM node:20-alpine AS build

WORKDIR /app

# Copy manifests first so the dependency layer is cached across source-only changes.
# .npmrc must come along: it sets engine-strict=true, so without it this build
# silently ignores the engines range the repo pins Node to.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# NOTE: static/companystylesheet is a git submodule. The build context must have it
# checked out or the site builds without its company styles — CI handles this with
# `submodules: recursive`; locally run `git submodule update --init`.
COPY . .

# VITE_AUTH0_CLIENT_ID is intentionally NOT passed here. The client ID is injected at
# runtime by docker/entrypoint.sh so one image can serve both environments (ADR-0008);
# the build-time variable remains only as the fallback used by `vite dev` and Cloudflare
# Pages previews, which have no entrypoint.
RUN npm run build


FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

# Already non-root (uid 101) and listening on 8080 — no USER or port juggling needed,
# which is what lets the stack run read_only with all capabilities dropped (ADR-0012).

COPY --chown=nginx:nginx docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx docker/security-headers.conf /etc/nginx/security-headers.conf
COPY --chown=nginx:nginx --from=build /app/build /usr/share/nginx/html
COPY --chmod=755 docker/entrypoint.sh /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
