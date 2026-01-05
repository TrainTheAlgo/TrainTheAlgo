# Repository Guidelines

## Project Structure & Module Organization
- `manager.js` orchestrates workflows (news discovery, writing, illustration, build, deploy).
- Core modules live at repo root: `news.js`, `writer.js`, `illustrator.js`, `models.js`, `build.js`, `deploy.js`.
- Source content and metadata live in `content/` (articles, images, `index.json`, `videos.json`).
- Site templates are in `template/` (HTML partials and assets). These are the inputs to the build.
- Built site output is written to `docs/` and is safe to regenerate.

## Build, Test, and Development Commands
- `npm install` installs runtime dependencies.
- `node manager.js dev` builds the site into `docs/` and serves it via `npx http-server`.
- `node manager.js news` generates a news article + illustration into `content/`.
- `node manager.js questions` generates a long-form Q&A article into `content/`.
- `node manager.js deploy` rebuilds and pushes via `deploy.js` (requires `GIT_OAUTH`).
- `node manager.js automate` runs the long-loop automation pipeline (intended for unattended runs).
- `node manager.js ask <model> "<prompt>"` calls a model via `models.js` (example: `node manager.js ask grok "Hello"`).

## Coding Style & Naming Conventions
- JavaScript uses CommonJS (`require`, `module.exports`) with 2-space indentation and semicolons.
- Use descriptive, lowerCamelCase function names (`buildSite`, `createSections`).
- Keep new modules at repo root unless they clearly belong under `content/`, `template/`, or `docs/`.

## Testing Guidelines
- No automated tests are present. Validate changes by running `node manager.js dev` and checking `docs/index.html` plus a few article pages in `docs/`.
- If you add scripts or automation, include a quick manual check path in your PR description.

## Commit & Pull Request Guidelines
- Commit history could not be inspected in this checkout (git pack index error), so use concise, imperative messages (e.g., "Fix build pipeline").
- PRs should explain what changed, why it changed, and include screenshots if templates or UI output in `docs/` changed.
- Link related issues when applicable and note any required environment variables.

## Security & Configuration Tips
- Store API keys and tokens in `.env` (e.g., `GIT_OAUTH` for deploy). Do not commit secrets.
- Puppeteer uses a local Chrome install; on Linux it expects `/usr/bin/google-chrome-stable`.
- Auth cookies may be stored in `.cookies.json` or `content/cookies.json`; treat them as local-only artifacts.
