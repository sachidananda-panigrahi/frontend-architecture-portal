# High-Level Plan — New Frontend Architecture
**Version:** 1.0
**Date:** 2026-05-12
**Audience:** Frontend Developers, Tech Leads, Architects

---

## How to Read This Document

This document describes every planned item in the new HighRadius frontend architecture.
For each item you will find three things:

- **What** — what exactly needs to be built or set up
- **Why** — the business or technical reason it exists
- **How** — the approach the team will follow, in plain English

Items are grouped into four tracks that reflect the actual build order:
Boilerplate → Untitled UI → UI Nexus → Auth and Security.

---

---

# Master HLP — All Tracks at a Glance

| # | Item | Track | Status |
|---|---|---|---|
| 1 | NextJS Boilerplate setup | Boilerplate | Not Started |
| 2 | Untitled UI setup | Untitled UI | Not Started |
| 3 | ui-nexus monorepo setup | UI Nexus | Not Started |
| 4 | core_ui package setup inside ui-nexus | UI Nexus | Not Started |
| 5 | aps_ui package setup inside ui-nexus | UI Nexus | Not Started |
| 6 | Platform Shell creation | Platform | Not Started |
| 7 | Bootstrapping Boilerplate for product teams | Platform | Not Started |
| 8 | Product Use Cases Implementation | Product | Not Started |
| 9 | Product Migration Help | Product | Not Started |
| 10 | Production Deployment of Product | Product | Not Started |
| 11 | OIDC Session Management | Auth | Not Started |
| 12 | RBAC Integration via DSL APIs | Auth | Not Started |
| 13 | Session Security and Validation Deep Analysis | Auth | Not Started |
| 14 | RBAC Policy Enforcement at UI Level | Auth | Not Started |
| 15 | E2E Testing for Authentication and Authorization | Auth | Not Started |

---

---

# Track 1 — NextJS Boilerplate

## Purpose of This Track

The boilerplate is the starting point every product team clones when they need a new application.
It contains all the tools, settings, and guardrails that HighRadius requires — pre-wired, so product teams never have to figure out setup themselves.
Building it once correctly means every future product application starts from a consistent, secure, and well-tested foundation.

---

## Item 1 — Creating the Repository

**What:** Create the central Git repository that will hold the boilerplate project.

**Why:** All product teams will clone this repository to start new applications. It needs to exist and be accessible before any other work can begin.

**How:** Create the repository in the HighRadius GitLab organisation, apply the correct access permissions, add a basic README, and protect the main branch so no one pushes directly to it.

---

## Item 2 — Next.js 16 with App Router and Turbopack

**What:** Set up the project using the latest version of Next.js with the App Router enabled and Turbopack as the development server.

**Why:** App Router is the modern way to build Next.js applications. It supports server components, which means pages load faster because less JavaScript is sent to the browser. Turbopack replaces the old Webpack development server and makes the local dev experience significantly faster — pages reload in milliseconds instead of seconds.

**How:** Initialise the project using the official Next.js setup tool with App Router selected. Enable Turbopack for the development environment only. Keep the production build using the standard Next.js build output.

---

## Item 3 — TypeScript 6 with Strict Mode

**What:** Add TypeScript to the project with strict mode turned on.

**Why:** Strict TypeScript catches bugs before the code runs. When strict mode is on, TypeScript will flag missing types, potential null errors, and incorrect function signatures at the time of writing code rather than at runtime. This reduces production bugs significantly.

**How:** Add a TypeScript configuration file with strict mode enabled. All files in the project must be TypeScript. Developers cannot bypass type errors by using the `any` type — they must define proper types for everything.

---

## Item 4 — Tailwind CSS 4 Utility Classes

**What:** Add Tailwind CSS version 4 for styling.

**Why:** Tailwind gives developers a consistent way to apply styles without writing custom CSS files. It keeps styling predictable, prevents duplication, and makes it easy to build pages that match the HighRadius design system.

**How:** Install Tailwind CSS 4 and connect it to the Next.js build. Configure it to use the HiRa brand colours and spacing tokens so all Tailwind classes automatically match the HighRadius design language.

---

## Item 5 — AI Coding Agent Instructions

**What:** Add instruction files that tell AI coding tools — such as Claude Code, GitHub Copilot, Cursor, Codex, and OpenCode — how this codebase works and what rules to follow.

**Why:** Developers across HighRadius increasingly use AI coding assistants. Without explicit instructions, these tools make generic suggestions that may not follow HighRadius architecture rules. With proper instructions in place, AI tools give relevant, on-pattern suggestions from day one.

**How:** Create a `CLAUDE.md` file and equivalent instruction files at the root of the project. These files describe the folder structure, which packages to import from, naming conventions, and what not to do. Each AI tool reads these files automatically when a developer opens the project.

---

## Item 6 — React 19 with React Compiler

**What:** Use React 19 with the new React Compiler enabled.

**Why:** React Compiler automatically optimises components so they do not re-render unnecessarily. Previously, developers had to manually write `useMemo` and `useCallback` to prevent extra renders. React Compiler handles this automatically, which means better performance with less effort and less risk of developers making mistakes.

**How:** Install React 19. Enable the React Compiler plugin in the Next.js configuration. Remove existing manual `useMemo` and `useCallback` calls progressively as the compiler handles them.

---

## Item 7 — Security Hardening for Fintech

**What:** Configure the application with HTTP security headers, bot protection, a Web Application Firewall, and error monitoring that does not expose sensitive customer data.

**Why:** HighRadius handles financial data. A financial application without proper security headers and bot protection is exposed to common web attacks such as cross-site scripting, clickjacking, and automated abuse. Regulators and enterprise customers expect a hardened security posture.

**How:** Configure HTTP response headers to tell browsers what content they are allowed to load. Set up bot detection to block automated attacks. Configure error monitoring to automatically strip personally identifiable information before sending errors to external logging services.

---

## Item 8 — Arcjet — Bot Detection, Rate Limiting, Shield WAF, Attack Protection

**What:** Integrate Arcjet as the primary security middleware for the application.

**Why:** Arcjet provides bot detection, rate limiting, and attack protection in one library. Without rate limiting, bad actors can send thousands of requests per second to overwhelm the API. Without bot detection, scrapers and credential-stuffing attacks go undetected.

**How:** Add Arcjet to the Next.js middleware layer so every incoming request passes through it before reaching application code. Configure rate limits appropriate for each type of route — stricter limits on authentication endpoints, more generous limits on read-only data routes.

---

## Item 9 — Server-Side Structured Logging with LogTape and Better Stack

**What:** Set up structured server-side logging using LogTape and send logs to Better Stack for storage and searching.

**Why:** When something goes wrong in production, developers need to quickly find what happened and why. Plain text logs are hard to search. Structured logs — where every log line is a consistent JSON object — can be filtered, searched, and alerted on efficiently. Better Stack provides a dashboard for this.

**How:** Configure LogTape to write JSON-formatted log entries for every server action, API route, and background task. Include a request ID on every log line so all logs from a single user request can be found together. Send logs to Better Stack in real time.

---

## Item 10 — Multi-Language Support with next-intl and Crowdin

**What:** Add internationalisation so the application can display text in multiple languages.

**Why:** HighRadius serves customers in many countries. Applications need to show text in the user's language. Hardcoding English text directly in components makes translation impossible later.

**How:** Use the `next-intl` library to manage translation strings. All visible text in components must come from a translation file, never hardcoded. Translation files are managed in Crowdin, where professional translators add new languages. Developers add the English key, and Crowdin handles the rest.

---

## Item 11 — Type-Safe Environment Variables with T3 Env

**What:** Set up a system that validates all environment variables at application startup.

**Why:** Missing or incorrectly named environment variables cause silent failures that are hard to debug in production. If the application starts without a required variable, it should fail immediately with a clear error message rather than crashing unexpectedly later.

**How:** Define all required environment variables and their expected types in a central schema file. When the application starts, T3 Env checks that every required variable is present and matches its expected type. If any variable is missing or wrong, the application refuses to start and prints exactly which variable is the problem.

---

## Item 12 — Form Handling with React Hook Form

**What:** Add React Hook Form as the standard way to build and manage forms across the application.

**Why:** Forms in financial applications are complex — they have many fields, conditional logic, and strict validation rules. Without a consistent approach, different developers write forms differently, making the codebase hard to maintain. React Hook Form provides a proven, performant pattern for all of this.

**How:** Install React Hook Form with its resolver adapter. All forms in the application must use this library. Form fields connect to the library using a standard registration pattern. Validation rules are defined alongside the form schema rather than scattered through the component.

---

## Item 13 — Validation with Zod 4

**What:** Use Zod as the standard validation library for all data — form inputs, API responses, and environment variables.

**Why:** Validation rules should be defined once and reused. Writing custom validation logic in every form and API handler is repetitive and error-prone. Zod lets developers define a schema once and use it both to validate data and to generate TypeScript types automatically.

**How:** Define Zod schemas for all form inputs and API payloads. Use these schemas both for runtime validation and for TypeScript type inference. When React Hook Form validates a form, it uses the Zod schema as the source of truth for rules.

---

## Item 14 — Linting with Oxlint via Ultracite

**What:** Use Oxlint, configured with the Ultracite preset, as the code linter.

**Why:** A linter catches code problems — inconsistent patterns, potential bugs, unused variables — before they reach code review. Oxlint is written in Rust, which makes it dramatically faster than the traditional ESLint linter. On a large codebase, Oxlint finishes in under a second while ESLint might take minutes.

**How:** Install Oxlint with the Ultracite preset, which includes sensible defaults for React and TypeScript projects. Add a lint step to the CI pipeline that blocks merges if any lint errors are found. Configure it to run automatically in editors so developers see issues as they type.

---

## Item 15 — Formatting with Oxfmt

**What:** Use Oxfmt as the code formatter.

**Why:** Consistent code formatting removes pointless debates about style. When every file looks the same, developers can focus on logic rather than whitespace. Like Oxlint, Oxfmt is Rust-based and extremely fast.

**How:** Install Oxfmt and add a formatting check to the CI pipeline. Developers run the formatter locally before committing. Any file that is not formatted correctly causes the CI pipeline to fail.

---

## Item 16 — Git Hooks with Lefthook

**What:** Use Lefthook to run automated checks every time a developer commits or pushes code.

**Why:** Catching problems locally before they reach the shared repository is faster and cheaper than fixing them in CI. Git hooks that run linting, formatting checks, and commit message validation give developers immediate feedback.

**How:** Install Lefthook and configure hooks that run the linter and formatter on changed files before each commit. Add a commit message check that enforces the HighRadius commit message format. Lefthook is faster than the older Husky tool it replaces because it runs checks in parallel.

---

## Item 17 — Unused File and Dependency Detection with Knip

**What:** Add Knip to scan the project for files, exports, and dependencies that are no longer used.

**Why:** Over time, projects accumulate unused code — old components, removed features, abandoned utilities. This dead code increases bundle size, confuses new developers, and creates security risk if unused dependencies have vulnerabilities.

**How:** Configure Knip to scan the entire project and report anything unused. Run it as part of the CI pipeline. Address reported items by either removing them or explicitly marking them as intentionally kept.

---

## Item 18 — Translation Validation with i18n-check

**What:** Add a tool that automatically checks translation files for missing or outdated keys.

**Why:** When developers add a new text string and forget to add it to the translation file, or when a string is removed from code but left in the translation file, the application can crash or show empty text in production. Automated checking prevents this.

**How:** Run i18n-check as part of the CI pipeline. It compares the keys used in application code with the keys defined in every translation file and reports any mismatches. A PR cannot be merged if translation keys are missing.

---

## Item 19 — Unit Testing with Vitest Browser Mode

**What:** Use Vitest in browser mode as the unit testing framework.

**Why:** Unit tests verify that individual components and functions work correctly. Browser mode means tests run in a real browser environment rather than a simulation, which catches browser-specific bugs that simulated environments miss.

**How:** Write unit tests alongside each component and utility function. Tests must cover the main behaviour, edge cases, and error states. A minimum of 80% code coverage is required. Vitest runs fast enough to be used in watch mode during development.

---

## Item 20 — E2E Testing with Playwright

**What:** Use Playwright to write end-to-end tests that simulate real user journeys.

**Why:** Unit tests verify individual pieces in isolation. End-to-end tests verify that the entire application works together from the user's perspective — clicking buttons, filling forms, navigating pages. Financial workflows especially need E2E tests because a failure in the middle of a process can cause data integrity problems.

**How:** Write E2E tests for every critical user journey — login, key financial workflows, and permission-gated pages. Tests run against a real browser. The CI pipeline runs E2E tests on every pull request targeting the main branch.

---

## Item 21 — CI Pipeline with GitLab Actions

**What:** Set up a Continuous Integration pipeline using GitLab Actions that runs automatically on every pull request.

**Why:** CI ensures that no broken code merges into the main branch. Without it, developers merge changes that break other parts of the application without knowing.

**How:** Configure a pipeline that runs in order: build the application, lint the code, run unit tests, run E2E tests. Each step must pass before the next one runs. A failed step blocks the merge. Results are visible on the pull request itself so developers know exactly what failed and why.

---

## Item 22 — AI-Powered Code Reviews with CodeRabbit

**What:** Add CodeRabbit to automatically review every pull request before a human reviewer looks at it.

**Why:** Code reviews are valuable but take time. CodeRabbit reviews code for common problems — security issues, missing tests, performance concerns, pattern violations — within minutes of a PR being opened. This gives developers fast feedback and lets human reviewers focus on higher-level concerns.

**How:** Connect CodeRabbit to the GitLab repository. It will automatically post review comments on each pull request. Developers address the comments before requesting human review.

---

## Item 23 — Error Monitoring with Sentry

**What:** Integrate Sentry to capture and report application errors in production.

**Why:** Bugs in production happen. The team needs to know when errors occur, what caused them, and how many users were affected — without waiting for customers to report problems.

**How:** Configure Sentry with sampling rates tuned for production traffic so it does not log every trivial event. Configure PII scrubbing rules so customer data is never sent to Sentry. Set up alerts that notify the team immediately when error rates spike above normal thresholds.

---

## Item 24 — Local Development Error Monitoring with Sentry Spotlight

**What:** Add Sentry Spotlight so developers can see errors in Sentry's format while running the application locally.

**Why:** Sentry Spotlight gives developers the same error detail that production Sentry provides, but without sending any data to external servers. This helps catch monitoring integration problems during development rather than discovering them in production.

**How:** Enable Sentry Spotlight in the development environment configuration only. It creates a local dashboard that shows errors and performance traces as developers use the application on their machine.

---

## Item 25 — Code Coverage with Codecov

**What:** Connect Codecov to track and report test coverage on every pull request.

**Why:** Coverage reports show which parts of the code are not tested. Without visibility into coverage, teams unknowingly let critical code paths go untested. Codecov posts a coverage summary directly on each pull request so reviewers can see whether new code is tested.

**How:** Configure the CI pipeline to generate a coverage report after running unit tests and upload it to Codecov. Set a minimum coverage threshold that blocks merges if coverage drops below it. Display the coverage badge in the repository README.

---

## Item 26 — Monitoring as Code with Checkly

**What:** Use Checkly to define production monitoring checks as code alongside the application.

**Why:** Monitoring checks should live in the repository alongside the code they monitor. When a feature changes, its monitoring check should change in the same pull request. Checkly makes this possible — monitoring is version controlled, reviewed, and deployed just like application code.

**How:** Write Checkly checks that verify the most critical pages and APIs are responding correctly. These checks run on a schedule against the production environment and alert the team if anything fails.

---

## Item 27 — Analytics with PostHog

**What:** Integrate PostHog to track how users interact with the application.

**Why:** Understanding user behaviour helps product teams prioritise improvements. Without analytics, decisions about what to build or fix are based on guesswork. PostHog captures events like page views, feature usage, and user flows.

**How:** Configure PostHog to send anonymous usage events. No personally identifiable information is sent. Events are defined alongside the features they track. Product teams use the PostHog dashboard to analyse user behaviour.

---

## Item 28 — Absolute Imports with @/ Prefix

**What:** Configure the project so files can be imported using `@/` as a shortcut for the `src/` directory.

**Why:** Relative imports like `../../../components/Button` are hard to read and break when files are moved. Absolute imports using `@/components/Button` are clear, readable, and do not break when folder structures change.

**How:** Update the TypeScript and build configuration to resolve `@/` to the `src/` directory. All new imports in the project must use absolute paths with the `@/` prefix.

---

## Item 29 — VSCode Configuration

**What:** Add shared VSCode settings, recommended extensions, debug configurations, and task definitions to the repository.

**Why:** Every developer should have the same editor experience — the same extensions, the same formatting-on-save behaviour, the same debug setup. Without shared configuration, new developers spend hours configuring their editor, and experienced developers all work differently.

**How:** Add a `.vscode/` folder containing settings, extensions, debug launch configurations, and task definitions. When a developer opens the project in VSCode, it prompts them to install the recommended extensions and automatically applies the shared settings.

---

## Item 30 — SEO Metadata, JSON-LD, and Open Graph Tags

**What:** Implement proper metadata on every page — including title tags, description, JSON-LD structured data, and Open Graph tags for link sharing.

**Why:** Even internal financial applications benefit from proper metadata. It improves how pages appear when shared in Slack or email, helps search engines index public-facing documentation correctly, and signals to browsers and tools how to handle the page.

**How:** Use the Next.js metadata API to define page metadata in a consistent way. Create shared helpers that generate correct metadata from page-specific inputs. Validate JSON-LD structured data with a schema validator.

---

## Item 31 — sitemap.xml and robots.txt

**What:** Generate a sitemap and add a robots.txt file.

**Why:** The sitemap tells search engines which pages exist. The robots.txt file tells search engines and bots which pages they are and are not allowed to crawl. Both are standard requirements for any web application.

**How:** Configure Next.js to auto-generate the sitemap from the application's page routes. Write a robots.txt that restricts crawling of internal pages and allows crawling of any public documentation pages.

---

## Item 32 — Automatic Dependency Updates with Dependabot

**What:** Configure Dependabot to automatically open pull requests when any dependency has a new version available.

**Why:** Outdated dependencies accumulate security vulnerabilities. Manual dependency updates are time-consuming and rarely happen consistently. Dependabot automates this so the team always stays up to date without additional effort.

**How:** Add a Dependabot configuration file that checks for updates on a weekly schedule. Configure it to group minor and patch updates together so the team receives one PR per week rather than dozens. Security updates are opened immediately regardless of schedule.

---

## Item 33 — Bundle Analyser

**What:** Add a bundle analyser tool that shows what is inside the application's JavaScript bundles.

**Why:** Large bundles make applications slow to load. Without visibility into bundle contents, teams unknowingly ship large dependencies or duplicate code. The bundle analyser makes it easy to spot and fix these problems.

**How:** Add a script that builds the application and generates a visual report showing the size and composition of every bundle. Run this report as part of the release process and whenever a new large dependency is added.

---

## Item 34 — CDN Integration with CI/CD

**What:** Connect the deployment pipeline to a Content Delivery Network so static assets are served from locations close to users.

**Why:** A CDN serves images, fonts, and JavaScript files from servers physically near the user. This reduces load times dramatically for global users. Without a CDN, all asset requests go to a single origin server regardless of where the user is.

**How:** Configure the CI/CD pipeline to upload static assets to the CDN after every successful build. Set long cache expiry times on assets since they are content-addressed — when an asset changes, its URL changes, so old URLs remain valid forever.

---

## Item 35 — Redis for Caching Metadata (Optional)

**What:** Optionally add Redis as a caching layer for metadata and frequently read configuration data.

**Why:** Some data — user permissions, configuration tables, reference data — is read on almost every page but rarely changes. Fetching it from the database on every request wastes time and database capacity. Redis caches this data in memory so it is retrieved in microseconds.

**How:** Connect Redis to the server-side data fetching layer. Define which data should be cached and for how long. When cached data changes, the relevant cache keys are invalidated immediately rather than waiting for expiry.

---

## Item 36 — GraphQL API with GraphQL Code Generator (Optional)

**What:** Optionally add GraphQL for API communication, with automatic TypeScript type generation from the GraphQL schema.

**Why:** GraphQL lets clients request exactly the data they need, nothing more and nothing less. This reduces over-fetching, which improves performance on slow connections. GraphQL Code Generator generates TypeScript types from the schema automatically, eliminating a whole class of type mismatch bugs.

**How:** Define a GraphQL schema for the APIs the application consumes. Run GraphQL Code Generator as part of the build process. Developers write queries, and the generator produces typed React hooks that can be used directly in components.

---

## Item 37 — Wattpm for Node Service BFF (Optional)

**What:** Optionally add a Wattpm-powered Backend for Frontend layer between Next.js and the microservices.

**Why:** A Backend for Frontend handles concerns that should not live in the browser — authentication token management, request aggregation, and session handling. Without a BFF, sensitive logic ends up in browser JavaScript where it can be inspected or tampered with.

**How:** Deploy a Wattpm Node.js service that sits between the Next.js application and the backend microservices. This service handles OIDC token validation, session management, and proxying requests. Next.js communicates only with the BFF, never directly with microservices.

---

## Item 38 — Google Lighthouse Score

**What:** Integrate Google Lighthouse into the CI pipeline to measure performance, accessibility, and best-practice scores automatically.

**Why:** Lighthouse scores give a quick, standardised measure of application quality. A page that scores below 90 on performance is noticeably slow. Running Lighthouse in CI ensures that performance does not degrade silently as new features are added.

**How:** Configure Lighthouse CI to run against the built application after every pull request. Set minimum thresholds for performance, accessibility, and best-practice scores. A PR that causes scores to drop below the thresholds is flagged for review.

---

---

# Track 2 — Untitled UI Components

## Purpose of This Track

Untitled UI is the third-party component library that HighRadius has chosen as its base. This track sets up Untitled UI as a standalone, publishable package inside the HighRadius ecosystem. Once complete, this package becomes the raw material that the UI Nexus layer picks up and wraps with HiRa branding.

The goal of this track is to take the Untitled UI source code, connect the HighRadius toolchain to it, and make every component available as a properly versioned package that other HighRadius packages can depend on.

---

## Item 1 — Tailwind CSS 4 Utility Classes

**What:** Ensure Untitled UI is fully connected to Tailwind CSS 4.

**Why:** Untitled UI components are styled using Tailwind classes. If the Tailwind version or configuration is misaligned between the Untitled UI package and the consuming application, styles break in unpredictable ways.

**How:** Configure the Tailwind setup in the Untitled UI package to match the version and settings used in the rest of the HighRadius ecosystem so styles are consistent everywhere.

---

## Item 2 — AI Coding Agent Instructions

**What:** Add instruction files that describe how the Untitled UI package works and how other developers should consume components from it.

**Why:** Developers using AI tools need accurate guidance specific to this package. Without it, AI suggestions may tell developers to import components incorrectly or bypass the intended patterns.

**How:** Write a clear instruction file at the root of the package explaining the package structure, what components are available, and the correct way to import and use them.

---

## Item 3 — React 19 with React Compiler

**What:** Ensure all Untitled UI components are compatible with React 19 and work correctly with the React Compiler enabled.

**Why:** React 19 introduces changes to how some patterns work. Components built for older React versions may behave differently. Compatibility must be verified and any breaking changes resolved before this package is used downstream.

**How:** Audit all components for compatibility with React 19. Fix any issues found. Confirm the React Compiler does not change the rendering behaviour of any component.

---

## Item 4 — Multi-Language Support

**What:** Ensure all Untitled UI components that display text support internationalisation.

**Why:** Any hardcoded English text inside a component cannot be translated. Since HighRadius serves customers in multiple countries, all user-visible text must be translatable.

**How:** Identify any text strings inside Untitled UI components and convert them to accept translated strings as props so the consuming application can pass in the correct text for the user's language.

---

## Item 5 — Type-Safe Environment Variables

**What:** Ensure the Untitled UI package does not depend on any environment variables, and if it does, that they are validated properly.

**Why:** A package that silently breaks because an environment variable is missing is hard to debug. All dependencies on environment must be explicit and validated.

**How:** Audit the package for any environment variable usage. Remove any that are unnecessary. For any that are required, validate them at startup using the same T3 Env pattern used in the rest of the platform.

---

## Item 6 — Linting with ESLint

**What:** Apply consistent linting rules to all source code in the Untitled UI package.

**Why:** Consistent linting ensures the code is written to a predictable standard, catches common mistakes, and makes code review faster.

**How:** Apply the standard HighRadius ESLint configuration to the package. Fix any existing linting violations. Ensure linting runs in CI so new violations are caught before merging.

---

## Item 7 — Formatting with Prettier

**What:** Apply consistent code formatting across all files in the Untitled UI package.

**Why:** Consistent formatting makes the code easier to read and removes formatting-related noise from pull request diffs.

**How:** Apply the standard HighRadius Prettier configuration. Format all existing files. Ensure formatting is checked in CI.

---

## Item 8 — Git Hooks with Lefthook

**What:** Add Lefthook git hooks to the Untitled UI package.

**Why:** Git hooks catch problems at commit time rather than in CI, giving developers faster feedback.

**How:** Add the standard HighRadius Lefthook configuration. Hooks run linting and formatting checks on changed files before each commit.

---

## Item 9 — Unused File and Dependency Detection with Knip

**What:** Run Knip to identify any unused files, exports, or dependencies in the Untitled UI package.

**Why:** Unnecessary files and dependencies increase the size of the published package and add maintenance burden.

**How:** Run Knip and address each reported item. Remove anything genuinely unused. Add any intentionally kept items to the Knip ignore list with a comment explaining why.

---

## Item 10 — Unit Testing with Vitest Browser Mode

**What:** Add unit tests for all components in the Untitled UI package.

**Why:** Tests verify that components work correctly and provide a safety net when making changes or upgrading dependencies.

**How:** Write tests that cover the key interactions and visual states of each component. Tests run in browser mode to catch browser-specific behaviour. Maintain a minimum 80% coverage threshold.

---

## Item 11 — E2E Testing with Playwright

**What:** Add end-to-end tests that exercise components in a real browser environment.

**Why:** Some component behaviours — keyboard navigation, focus management, dropdown positioning — only appear in real browser conditions and cannot be caught by unit tests alone.

**How:** Write Playwright tests for components that have interactive or complex browser-dependent behaviours. These tests run in CI as part of the publishing pipeline.

---

## Item 12 — CI Pipeline with GitLab Actions (including Version Publish)

**What:** Set up a CI pipeline specifically for the Untitled UI package that builds, tests, and publishes a new version when changes are merged.

**Why:** The Untitled UI package is consumed by other packages. Every change must go through a verified, automated process before the new version is made available. Manual publishing is error-prone.

**How:** Configure a pipeline that runs the build, lint, unit tests, and E2E tests. When all checks pass on the main branch, Semantic Release automatically determines the new version number based on commit messages and publishes the package to the HighRadius private npm registry.

---

## Item 13 — AI-Powered Code Reviews with CodeRabbit

**What:** Add CodeRabbit to review pull requests in the Untitled UI repository.

**Why:** Consistent automated review catches issues before human reviewers spend time on them.

**How:** Connect CodeRabbit to the repository. It reviews every pull request and posts feedback. Developers address feedback before requesting human review.

---

## Item 14 — Code Coverage with Codecov

**What:** Track and report test coverage for the Untitled UI package.

**Why:** Visibility into coverage keeps the team accountable for testing new components and ensures coverage does not silently decrease over time.

**How:** Upload coverage reports to Codecov from the CI pipeline. Post coverage summaries on each pull request. Block merges that cause coverage to drop below the minimum threshold.

---

## Item 15 — Monitoring as Code with Checkly

**What:** Add Checkly monitoring checks for the Untitled UI package.

**Why:** If a published version of the package breaks the consuming application in production, the team needs to know immediately.

**How:** Write Checkly checks that verify key components render correctly in a reference application. Checkly runs these checks on a schedule and alerts the team if anything fails.

---

## Item 16 — Absolute Imports with @/ Prefix

**What:** Configure the package to use absolute imports throughout its source code.

**Why:** Absolute imports are easier to read and do not break when files are moved within the package.

**How:** Configure the TypeScript and build settings to resolve `@/` to the package source directory. Update all existing imports to use the absolute path convention.

---

## Item 17 — VSCode Configuration

**What:** Add shared VSCode configuration to the Untitled UI package repository.

**Why:** Developers working on this package should have the same editor experience — same extensions, same formatting-on-save, same debug setup.

**How:** Add a `.vscode/` folder with settings, recommended extensions, and debug configurations. When developers open the project, VSCode prompts them to apply the shared configuration.

---

## Item 18 — Automatic Dependency Updates with Dependabot

**What:** Configure Dependabot to watch the Untitled UI package and open pull requests when dependencies have updates.

**Why:** Keeping dependencies current is a security requirement. Manual updates are neglected. Dependabot automates the process.

**How:** Add a Dependabot configuration file set to check for updates weekly. Group minor and patch updates into a single weekly PR. Process security updates immediately.

---

## Item 19 — Bundle Analyser

**What:** Add a bundle analyser to the Untitled UI package build.

**Why:** The Untitled UI package is imported by consuming applications. A large or inefficient package increases the bundle size of those applications. Regular analysis keeps it lean.

**How:** Run the bundle analyser as part of the release process. Set a maximum allowed package size. Investigate and resolve any unexpected growth in size.

---

## Item 20 — Google Lighthouse Score

**What:** Run Google Lighthouse against a reference application that uses the Untitled UI components.

**Why:** Component libraries can inadvertently hurt the performance or accessibility of the applications that use them. Regular Lighthouse scoring catches these issues at the library level before they affect product applications.

**How:** Maintain a simple reference application that renders all components. Run Lighthouse against it in CI. Any score below the agreed threshold triggers a review before the new version is published.

---

## Item 21 — Export All Available Components from Untitled UI

**What:** Ensure every component in the Untitled UI library is properly exported so it can be imported by consuming packages.

**Why:** If a component exists in the library but is not exported, developers cannot use it and may write a duplicate from scratch. A complete and correct export list is the contract between this package and its consumers.

**How:** Audit all components in the Untitled UI source. Create a single export file that exports every component and its TypeScript types. Verify the exports work correctly by importing them in a test consuming package.

---

---

# Track 3 — UI Nexus (Monorepo)

## Purpose of This Track

UI Nexus is the monorepo at the centre of the HighRadius frontend platform. It is the only monorepo in the architecture. Everything else is a single repository.

UI Nexus contains three layers that build on each other:
- **UI Config** — shared tooling and configuration for all packages
- **Core UI** — base components with HiRa branding applied on top of Untitled UI
- **APS UI** — advanced business components that add state, data fetching, and feature logic

---

## 3a — UI Config

### Purpose

UI Config is not an application and it contains no runtime code. It is purely a collection of shared configuration files that every other package in the monorepo inherits. Any time a tooling rule changes — a new TypeScript setting, a new lint rule — it changes here once and all packages pick it up automatically.

### UI Config Items

The following items are configured once in UI Config and shared across all packages in the monorepo:

| # | Item | Purpose |
|---|---|---|
| 1 | TypeScript 6 with strict mode | Shared TypeScript configuration base file that all packages extend |
| 2 | Tailwind CSS 4 utility classes | Shared Tailwind configuration including HiRa brand tokens |
| 3 | AI coding agent instructions | Shared instruction files for AI coding tools |
| 4 | React 19 with React Compiler | Shared React configuration to ensure all packages use the same version |
| 5 | Multi-language with next-intl and Crowdin | Shared i18n setup that all packages inherit |
| 6 | Type-safe environment variables | Shared environment variable validation schema |
| 7 | Linting with ESLint | Shared ESLint rules that all packages use |
| 8 | Formatting with Prettier | Shared Prettier configuration |
| 9 | Git hooks with Lefthook | Shared git hook definitions applied across the monorepo |
| 10 | Unused dependency detection with Knip | Shared Knip configuration to scan all packages |
| 11 | Unit testing with Vitest browser mode | Shared Vitest configuration |
| 12 | E2E testing with Playwright | Shared Playwright configuration |
| 13 | CI pipeline with GitLab Actions | Shared pipeline configuration for building and testing |
| 14 | AI-powered code reviews with CodeRabbit | CodeRabbit configuration shared across the monorepo |
| 15 | Code coverage with Codecov | Shared Codecov settings |
| 16 | Monitoring as Code with Checkly | Shared Checkly configuration |
| 17 | Absolute imports with @/ prefix | Shared path alias configuration |
| 18 | VSCode configuration | Shared editor configuration |
| 19 | Automatic dependency updates with Dependabot | Monorepo-wide Dependabot configuration |
| 20 | Bundle analyser | Shared bundle analysis tooling |
| 21 | Google Lighthouse Score | Shared Lighthouse CI configuration |
| 22 | Storybook for UI development | Shared Storybook setup for component documentation |
| 23 | Turborepo with Monorepo configurations | Turborepo setup to manage build order and caching across all packages |
| 24 | @changesets/cli | Tool for managing version bumps and changelogs across packages |
| 25 | @vercel/style-guide | Shared code style rules from Vercel's style guide |
| 26 | chalk | Utility for coloured terminal output in build scripts |
| 27 | concurrently | Tool for running multiple commands at the same time during development |
| 28 | cross-env | Utility for setting environment variables in a way that works on all operating systems |
| 29 | esbuild-visualizer | Tool to visualise what esbuild includes in each bundle |
| 30 | express | Lightweight server used in local development tooling |
| 31 | http-proxy-middleware | Proxy tool used to forward requests during local development |
| 32 | nodemon | Watches for file changes and restarts the local server automatically |
| 33 | rollup-plugin-visualiser | Tool to visualise Rollup bundle composition |
| 34 | source-map-explorer | Tool that maps minified production bundles back to their original source |
| 35 | turbo | The Turborepo CLI for orchestrating builds across all packages |
| 36 | webpack-bundle-analyser | Visualises the contents and sizes of webpack bundles |

---

## 3b — Core UI (Base Components)

### Purpose

Core UI is the component library that product teams actually use. It takes every component from Untitled UI, applies the HiRa brand design on top, and re-exports everything as `@highradius/ui`.

This is the only layer in the entire architecture that is allowed to import from the raw Untitled UI package. All other packages and all product applications import from `@highradius/ui` only.

The HiRa brand is applied by adding colour overrides, size adjustments, and variant options that match the HighRadius design system. The original Untitled UI component underneath is never modified — only wrapped.

### Why This Matters

When Untitled UI releases a new version, the update can be pulled in cleanly because the source is never changed. Only the thin wrapper in Core UI may need a small adjustment if the component's interface changed. This means upgrades are predictable and contained.

### Core UI Component List

All components below must be wrapped with HiRa branding and exported from `@highradius/ui`.

#### Input and Form Controls

| # | Component | What It Does |
|---|---|---|
| 39 | Inline Editor | Lets users edit text directly in place without opening a separate form |
| 40 | Input Slider | A draggable slider for selecting a value within a range |
| 41 | Input Stepper | A number input with increment and decrement buttons |
| 42 | Input Text Field | The standard single-line text input used across all forms |
| 43 | Link | A styled anchor element that follows HiRa link colours and hover states |
| 44 | RadioButton | A single radio button for choosing one option from a group |
| 45 | RadioButtonGroup | A group of radio buttons managed as a single selection control |
| 46 | Search | A text input with a search icon and optional clear button |
| 47 | Time Picker | A control for selecting a time value |
| 48 | Toggle Switch | A binary on/off toggle control |

#### Display and Feedback

| # | Component | What It Does |
|---|---|---|
| 49 | Tooltip | A small overlay that appears on hover to explain an element |
| 50 | Typography | A set of standardised text styles — headings, body, labels, captions |

#### Layout and Navigation

| # | Component | What It Does |
|---|---|---|
| 51 | Accordion | A vertically stacked list of sections that can be expanded or collapsed |
| 52 | Banner | A full-width notice that communicates important information at the top of a page |
| 53 | Breadcrumbs | A navigation trail showing the user's current location in the page hierarchy |
| 54 | Card | A contained surface for grouping related information |
| 55 | Column Organiser | A control that lets users show, hide, and reorder columns in a grid |
| 56 | Dialog | A box that appears on top of the page to ask a question or confirm an action |
| 57 | EmptyAndError | A standardised view shown when a list has no items or when data fails to load |
| 58 | ErrorBoundary | A wrapper that catches unexpected errors in components and shows a fallback |
| 59 | File Uploader | A control for selecting and uploading files |
| 60 | KeyValuePair | A read-only display of a label next to its value, used in detail views |
| 61 | L2 Footer | The footer used on second-level pages within a product |
| 62 | L2 Header | The header used on second-level pages within a product |
| 63 | Loader | A spinner or progress indicator shown while content is loading |
| 64 | Modal | A full overlay that blocks the background and requires user interaction before proceeding |
| 65 | Pagination | Controls for navigating through multiple pages of data |
| 66 | Picklist | A control for selecting items from a list, supporting search and multi-select |
| 67 | Progress Bar | A visual bar that communicates how far along a process is |
| 68 | RichTextEditor | A text editor that supports formatting such as bold, italic, lists, and links |
| 69 | RuleBuilder | A visual interface for building conditional logic rules |
| 70 | RuleViewer | A read-only display of the rules defined in the RuleBuilder |
| 71 | Summary Grid | A compact table for displaying summary statistics or key metrics |
| 72 | Toast Notification | A temporary message that appears briefly at the edge of the screen |
| 73 | Vertical Tabs | A tab group where tabs are stacked vertically on the left side |
| 74 | Wizard | A multi-step form that guides users through a process one step at a time |
| 75 | WorkFlow Card | A card that represents a single step or task in a workflow |
| 76 | Workflow Progress | A visual indicator of where the user is within a multi-step workflow |

#### Composite and Feature Components

| # | Component | What It Does |
|---|---|---|
| 77 | AccordionForm | An accordion where each panel contains a form section |
| 78 | Bento | A grid-based layout component for arranging content in varied-size boxes |
| 79 | Comments | A thread of comments attached to a record, with the ability to add new ones |
| 80 | DocumentViewer | A component for displaying document files within the application |
| 81 | Drawer | A panel that slides in from the side of the screen to show additional content |
| 82 | Email List | A list view of emails, typically showing sender, subject, and date |
| 83 | Email Rule Viewer | A read-only view of the rules governing how emails are processed |
| 84 | Email Thread | A full conversation thread showing the chain of related emails |
| 85 | EmailComposer | A rich editor for composing and sending emails from within the application |
| 86 | EmailMenu | A dropdown or panel providing email-related actions |
| 87 | Global Footer | The footer displayed at the bottom of every page across all products |
| 88 | Global Header | The top navigation bar displayed across all products |
| 89 | GroupActionProgressBar | A progress indicator that tracks the status of an action applied to a group of records |
| 90 | ImageViewer | A component for displaying and zooming into images |
| 91 | List View | A standard list layout for displaying records in a scrollable list |
| 92 | MentionsInput | A text input that allows users to mention other users by typing `@` |
| 93 | Primary | The primary action button, using the main HiRa brand colour |
| 94 | Secondary | A secondary action button with a less prominent visual weight |
| 95 | Tertiary | A low-emphasis action button for optional or destructive actions |
| 96 | NotificationPanel | A slide-in panel showing the user's recent notifications |
| 97 | Page Header | The heading area at the top of a page, including title, breadcrumbs, and actions |
| 98 | Panel | A side or floating panel used for supplementary content or filters |
| 99 | PDFViewer | A component for rendering and navigating PDF files within the application |
| 100 | Sort Panel | A panel that allows users to define and apply sort rules to a list or grid |
| 101 | TiffViewer | A component for displaying TIFF image files |
| 102 | TransformationGrid | A grid that displays data transformations and their mapping rules |
| 103 | Tree | A hierarchical tree view for navigating nested data structures |
| 104 | Decision Table | A table for configuring rule-based decision logic |
| 105 | Parameters Component | A component for defining and editing configurable parameters |
| 106 | Scheduler Component | A component for setting up scheduled tasks or events |
| 107 | DynamicDropDown | A dropdown whose options are loaded dynamically from an API |
| 108 | Permission | A component that shows or hides content based on the user's permissions |

#### Basic Grid (AG Grid Integration)

The Basic Grid is a significant sub-track within Core UI. It wraps AG Grid — a powerful enterprise data grid library — with the HiRa theme and Untitled UI components, so the grid looks and behaves consistently with the rest of the HighRadius design system.

| # | Task | What It Means |
|---|---|---|
| 109 | Basic Grid | The overall AG Grid wrapper component with HiRa theming applied |
| 110 | Create a basic grid package | Set up the dedicated package within the monorepo that contains the grid wrapper |
| 111 | Enable dynamic module registration | Allow the grid to load AG Grid feature modules on demand so only the features a page needs are loaded |
| 112 | License key registration | Register the AG Grid Enterprise license key so enterprise features are available |
| 113 | Prop support for module registration | Expose props that let consuming code declare which AG Grid modules to activate |
| 114 | Create a common grid styling layer | Define the CSS variables that bridge HiRa design tokens into AG Grid's theming system |
| 115 | Create a basic grid wrapper layer | Build the outer component that sets up AG Grid with HighRadius defaults |
| 116 | Register Untitled UI components as cell renderers + CSS Vars | Replace AG Grid's default cell components with Untitled UI components so all cells use HiRa-styled UI |
| 117 | Create a prop matching layer | Because AG Grid and Untitled UI use different prop naming conventions, build an adapter that translates between them |
| 118 | Render Basic Grid with Untitled UI components and basic features | Verify the complete integration — a working grid with HiRa styling and Untitled UI cell renderers displaying real data |

---

## 3c — APS UI (Advanced Platform and Smart Features)

### Purpose

APS UI builds on Core UI by adding the capabilities that real financial product pages require — data fetching, state management, caching, and feature-level components like full CRUD grids.

Where Core UI is stateless and pure, APS UI is where complexity lives. It contains the patterns and building blocks that product teams use to build complete feature pages without reinventing common solutions.

### APS UI Items

---

### Item 120 — Feature Components — Grid with CRUD and Zustand

**What:** Build a feature-level Grid component that connects to APIs, supports create, read, update, and delete operations, and persists its state using Zustand.

**Why:** Most HighRadius pages are built around a data grid with CRUD operations. If every product team builds this independently, the result is inconsistent behaviour, duplicated logic, and maintenance across many codebases. A shared feature grid that handles the common cases means product teams focus only on their business-specific logic.

**How:** Build on top of the Basic Grid from Core UI. Add a data layer that connects the grid to an API. Use Zustand to store grid state — selected rows, filter settings, pagination position — so state is not lost when the user navigates away and returns. Expose clear props so product teams customise the columns, actions, and data source.

---

### Item 121 — Server-Side Data Fetching with Next.js Fetch

**What:** Define when and how to use Next.js server-side data fetching for API calls.

**Why:** Fetching data on the server means the page arrives at the browser with content already filled in, which is faster and better for initial load performance. Next.js also caches server-fetched data automatically, reducing repeated API calls for the same data.

**How:** Use Next.js server components and the built-in `fetch` function for all API calls where the data can be fetched before the page renders. Configure cache settings explicitly on each fetch call — deciding whether to cache the response, for how long, and when to revalidate it.

---

### Item 122 — Client-Side Data Fetching with SWR

**What:** Define when and how to use SWR for client-side data fetching.

**Why:** Not all data can be fetched on the server. Data that depends on user interaction — filtering a list, loading more rows, refreshing after an action — must be fetched on the client. SWR provides a consistent pattern for this with built-in loading states, error handling, and revalidation on focus.

**How:** Use SWR hooks for all client-side data fetching. Define a central fetcher function that handles authentication headers and error normalisation. Use SWR's cache to avoid redundant API calls when the same data is needed in multiple components on the same page.

---

### Item 123 — Enhanced Grids

**What:** Build grid configurations that go beyond the basic grid — including inline editing, master-detail views, tree data, and pivot capabilities.

**Why:** Financial data is complex. Some tables need expandable rows to show related detail. Some need tree structures for hierarchical data. Some need pivot views for aggregated reporting. These advanced modes need to be built once in APS UI so product teams can enable them with configuration rather than custom code.

**How:** Build on top of the Basic Grid. Each enhanced mode is a separate configurable option. Product teams declare which mode they need and pass in the relevant data and configuration. The grid handles the rendering.

---

### Item 124 — Zustand State Management

**What:** Define and implement the standard Zustand state management patterns for use across APS UI feature components.

**Why:** React component state is local. When state needs to be shared between components on the same page — such as a filter panel that controls a grid, or a detail panel that shows the selected grid row — it needs to live outside any single component. Zustand provides a simple, predictable way to do this.

**How:** Create Zustand store factories that generate stores for common patterns — grid state, form state, selection state. Feature components use these factories rather than creating custom stores from scratch. This ensures consistent behaviour and makes testing straightforward.

---

### Item 125 — Renderer System

**What:** Build a renderer system that displays and edits data in two distinct modes — a read-only display mode and an interactive edit mode.

**Why:** Financial data is often displayed in read-only form but occasionally needs to be edited inline. These two modes look and behave differently. Without a renderer system, developers write separate components for display and editing, leading to inconsistency and duplication.

**How:** Define a clear interface that every renderer must follow. For each data type — text, number, date, currency, status badge — provide both a display renderer and an edit renderer. The grid uses the display renderer by default. When a cell is put into edit mode, it switches to the edit renderer. Both renderers apply HiRa styling.

---

### Item 126 — State Management Architecture

**What:** Define the overall state management architecture — which state lives where, how it flows through the application, and which tools handle which concerns.

**Why:** Without a clear architecture, different teams make different decisions. Some use React local state where Zustand should be used. Some use Zustand where URL state is better. The result is inconsistent applications that are hard to debug and maintain.

**How:** Document and enforce a clear decision framework:
- **URL state** — filters, search terms, pagination, active tabs. Survives page refresh and can be shared as a link.
- **Zustand** — shared client state within a feature — selected rows, open panels, in-progress form data.
- **Server state** — API data managed by SWR or Next.js fetch — not duplicated in Zustand.
- **Local component state** — UI-only state like whether a tooltip is open — stays in the component.

---

### Item 127 — API Integration Cache Management

**What:** Define and implement a consistent caching strategy for all API responses in APS UI.

**Why:** Without caching, the same API is called repeatedly for data that has not changed. This wastes bandwidth, slows the application, and puts unnecessary load on backend services. With a well-designed caching strategy, repeated navigation feels instant and API calls are minimised.

**How:** Define cache policies for each type of data:
- Reference data that rarely changes — long cache with manual invalidation when changes occur.
- User-specific data — short cache, invalidated on any update action.
- Real-time data — no cache, fetched fresh on every load.

Use SWR's cache for client-side requests and Next.js's fetch cache for server-side requests. Implement cache invalidation so that after a user performs a create, update, or delete action, the affected data is refetched immediately rather than showing stale results.

---

---

# Track 4 — Authentication and Security

## Purpose of This Track

Authentication and authorisation in a financial SaaS platform must be robust, centrally managed, and product-team-proof. This track defines how users are authenticated, how their session is maintained securely, and how their permissions are enforced across the UI.

The key principle is that product teams never implement authentication themselves. The platform team owns auth entirely. Product teams only declare what role a page requires — the platform enforces it.

---

## Item 11 — OIDC Session Management Implementation

**What:** Implement OIDC-based authentication using domain URL-based cookies that are set by the server.

**Why:** OIDC (OpenID Connect) is the industry standard protocol for authentication in enterprise software. Storing session tokens in cookies that are set by the server — rather than in browser JavaScript — is significantly more secure. A cookie set with the right flags cannot be read or stolen by JavaScript running in the browser.

**How:** The Wattpm BFF layer handles the OIDC authentication flow. When a user logs in, the BFF receives the identity token from the identity provider, validates it, and sets a secure, HTTP-only cookie on the user's browser. The Next.js application reads the session from this cookie via the BFF — it never touches the raw identity token. The BFF validates the session cookie on every request before forwarding it to backend services.

---

## Item 12 — RBAC Integration via DSL APIs

**What:** Integrate Role-Based Access Control using the existing HighRadius DSL APIs to determine what each user is allowed to see and do.

**Why:** Different users have different permissions. A read-only analyst should not see the same controls as a finance manager. Without RBAC, either everything is visible to everyone — which is a security problem — or each product team implements their own permission checks — which is inconsistent and error-prone.

**How:** At session initialisation, the BFF fetches the user's role and permission set from the RBAC DSL API. This permission set is included in the session and made available to the platform shell. The platform shell provides a permissions context that all components can read. Components use this context to decide whether to render an action, show a field, or allow navigation to a route.

---

## Item 13 — Session Security and Validation Deep Analysis

**What:** Conduct a thorough analysis of session security — covering token expiry, cookie security settings, cross-subdomain behaviour, and what happens when a session expires mid-use.

**Why:** Session security flaws are among the most common and damaging vulnerabilities in web applications. Before the authentication system goes to production, the team needs to verify that every scenario is handled correctly — including edge cases like expired tokens, concurrent sessions, and subdomain cookie behaviour.

**How:** A dedicated security review covers each of the following areas:
- Cookie flags — ensuring `HttpOnly`, `Secure`, and `SameSite` are set correctly on all session cookies.
- Token expiry — verifying the application detects expired tokens and redirects to login gracefully, without leaving users on a broken page.
- Cross-subdomain session sharing — analysing how session cookies behave across different HighRadius subdomains and whether they should be shared or isolated.
- Session fixation — verifying that session identifiers are rotated after login.
- Concurrent session behaviour — defining the policy for users logged in from multiple devices.

Findings are documented and all high-severity issues resolved before production deployment.

---

## Item 14 — RBAC Policy Enforcement at UI Level

**What:** Implement route guards and component-level visibility controls that enforce RBAC policies throughout the user interface.

**Why:** Backend APIs must always enforce permissions. But enforcing them at the UI level as well improves the user experience — users who do not have permission to perform an action should not see the button that triggers it. Hiding inaccessible actions reduces confusion and makes the interface cleaner.

**How:** The platform shell wraps every page. It checks the user's permissions before rendering a page. If the user does not have the required role, they are redirected to an access-denied page rather than seeing a broken or empty view.

For individual components — such as an action button that only administrators should see — the platform provides a permission-checking utility. Components use this utility to conditionally render based on whether the current user has the required permission. The permission check always uses the authoritative permissions loaded at session time, never a client-side guess.

---

## Item 15 — E2E Testing for Authentication and Authorization

**What:** Write end-to-end tests that verify the OIDC login flow, session persistence, and RBAC enforcement work correctly in a real browser environment.

**Why:** Authentication and authorisation bugs have serious consequences — users accessing data they should not see, or being locked out of features they need. Unit tests cannot fully verify these flows because they involve real browser behaviour, cookies, redirects, and server interactions. E2E tests in a real browser catch the full range of auth-related failures.

**How:** Write Playwright test scenarios that cover:
- A user completing the full OIDC login flow from the login page to an authenticated page.
- A user with a low-privilege role attempting to navigate to a route that requires a higher role — verifying they are redirected correctly.
- A user with a high-privilege role verifying that all expected controls and pages are accessible.
- Session expiry — simulating an expired token and verifying the application handles it gracefully by redirecting to login.
- Logging out — verifying the session cookie is cleared and the user cannot access authenticated pages after logout.

These tests run in CI on every pull request that touches authentication or permission-related code.

---

---

## Summary

This document covers 15 master HLP items across four delivery tracks:

| Track | Items | Purpose |
|---|---|---|
| Boilerplate | 38 items | The foundation every product app clones to get started |
| Untitled UI | 21 items | The raw component library set up as a publishable HighRadius package |
| UI Nexus | 80+ items across UI Config, Core UI, and APS UI | The monorepo that wraps, brands, and extends components for product use |
| Auth and Security | 5 items | OIDC session management, RBAC enforcement, and security validation |

The principle running through every track is the same: build once in the right layer, enforce by convention and tooling, and let product teams focus on business logic rather than infrastructure.
