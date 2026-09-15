# FRISTENKALENDER SPA

![Build status badge](https://github.com/Hochfrequenz/fristenkalender-spa/workflows/Building/badge.svg)
![Eslint status badge](https://github.com/Hochfrequenz/fristenkalender-spa/workflows/Linting/badge.svg)
![Prettier status badge](https://github.com/Hochfrequenz/fristenkalender-spa/workflows/Formatting/badge.svg)

### ⚙️ Setting up development environment

Make sure you have the latest version of [node](https://nodejs.org/en) installed (recommended via node version manager [nvm](https://github.com/nvm-sh/nvm)).

```sh
$ npm install
```

```sh
$ npm run start # starts local dev server (including hot reload)
$ npm run lint # lints the whole project (eslint)
$ npm run format # formats the whole project (prettier)
```

### 🏷️ Semantic commit messages

To meet the pull request title convention [requirements](https://github.com/Hochfrequenz/entscheidungsbaumdiagramm/blob/main/.github/workflows/conventional-commit-validation.yml) enforced by Github Actions, here is a brief guide to help choosing the appropriate tag for each purpose:

- `build:` - changes that affect the build system or external dependencies
- `chore:` - miscellaneous commits and routine tasks
- `ci:` - changes to the CI/CD configuration
- `docs:` - updating the documentation
- `feat:` - adding or removing a feature feature
- `fix:` - bug fixes
- `perf:` - performance improvement
- `refactor:` - improve code structure, readability, or maintainability
- `revert:` - reverts a previous commit
- `style:` - code formatting and styling that do not affect functionality
- `test:` - adding or updating tests

### 🔐 Auth0 authentication

> [!NOTE]
> During local development, authentication is currently not required. Instead, a dummy account `local@development.com` will be already logged in at both local dev server startup as well as build preview.

To get past the landing page when navigating through the staging environment `https://fristenkalender.stage.hochfrequenz.de` and production environment `https://fristenkalender.hochfrequenz.de`, users need to authenticate using their Hochfrequenz login credentials.

### 🔗 Links

[Marktgut](https://hochfrequenz-marktplatz.atlassian.net/browse/HFMP-33)<br>
[Fristenkalender (legacy)](https://www.hochfrequenz.de/fristenkalender/)<br>
Mockup: TBD<br>
Azure: TBD

[fristenkalender-generator](https://github.com/Hochfrequenz/fristenkalender_generator) (backend business logic)<br>
[fristenkalender-functions](https://github.com/Hochfrequenz/fristenkalender-functions) (backend API)<br>
[fristenkalender-frontend-legacy](https://github.com/Hochfrequenz/fristenkalender-frontend-legacy)<br>

### 🐳 Container image

This app is deployed as a container on the self-hosted
[hf-apps-collection](https://github.com/Hochfrequenz/hf-apps-collection) platform, alongside its
Azure Static Web App deployment.

**Releases are cut by publishing a GitHub release**, not by pushing a bare tag. The release's
_pre-release_ checkbox decides the channel: ticked means a staging image, unticked means production
and moves `latest`. The formatting, linting and build/e2e workflows must pass first — a release cut
from an unprotected branch cannot skip them. The workflow prints the image digest to pin in the
deployment repo.

Image: `ghcr.io/hochfrequenz/fristenkalender-frontend`.

```sh
$ git tag v1.2.3 && git push origin v1.2.3       # release
$ git submodule update --init --recursive        # needed before building locally
$ docker build -t fristenkalender .
$ docker run --rm -p 8080:8080 \
    -e APP_AUTH0_CLIENT_ID=<client-id> \
    -e APP_API_URL=<backend-url> fristenkalender
```

**Configuration is injected at runtime**, not baked into the bundle: the entrypoint writes
`/config.js` from `APP_*` environment variables and the app reads `window.__APP_CONFIG__`, falling
back to the build-time `VITE_AUTH0_CLIENT_ID` value. That is why one image serves both staging and
production, and why `npm run dev` and Cloudflare Pages previews keep working unchanged.

> Note: the image is built **without** `VITE_AUTH0_CLIENT_ID`, so inside the container there is no
> build-time fallback — if `APP_AUTH0_CLIENT_ID` is missing, login is simply broken. The compose
> stack declares it as required, so a real deployment fails before starting.
>
> `APP_API_URL` matters just as much: without it the bundle falls back to a legacy backend host
> that does not serve the version, docs or MCP endpoints.

| File                           | Purpose                                                |
| ------------------------------ | ------------------------------------------------------ |
| `Dockerfile`                   | two-stage build: node 20 → nginx                       |
| `docker/nginx.conf`            | serving rules                                          |
| `docker/entrypoint.sh`         | renders `/config.js` from the environment              |
| `docker/security-headers.conf` | headers included into every location that sets its own |

> **Before serving this from a new hostname**: the fristenkalender-api backend in Azure allow-lists the
> origins it accepts. A new host (`APP_API_URL` stays the same, but the _browser's_ origin changes) must be
> added to that allow-list, or every API call fails CORS while the page itself loads fine.
