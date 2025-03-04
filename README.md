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

[fristenkalender-generator](https://github.com/Hochfrequenz/fristenkalender_generator)<br>
[fristenkalender-functions](https://github.com/Hochfrequenz/fristenkalender-functions)<br>
[fristenkalender-frontend-legacy](https://github.com/Hochfrequenz/fristenkalender-frontend-legacy)<br>
