As a Senior UI Architect, please deeply analyse and suggest the appropriate tools and tech stack for each monorepo and product. You need to cover all the tools mentioned in the list above and suggest how to integrate them into the architecture. You also need to suggest how to maintain the control over the core product while allowing product teams to build features on top of it. Additionally, you need to suggest a mechanism to release new versions directly to product teams without affecting the core product. Attached a sample context for your reference.

For your context, you are planning to build a frontend architecture for Highradius using Next.js and TypeScript. You have outlined a monorepo structure with three main monorepos: highradius_ui_config, highradius_core_ui, and highradius_aps_ui. Additionally, you have a standalone Next.js project for Record To Report.

We have below monorepos for Highradius Frontend Architecture.

1. highradius_ui_config (Configuration Hub Monorepo)
Can contain TypeScript Config, ESLint/Prettier Config, Tailwind CSS Config, etc

2. highradius_core_ui (Base or Atom Component Library Monorepo)
Can contain Button, Chip, Textfield, Dropdown, Avatar, Grid, Tree and other Components which will be taken from
untitled ui React Components and overwriten with HiRa Theme to maintain the Highradius branding.

3. highradius_aps_ui (Business/Featured/Composit Components)
Can contain the highradius_core_ui components and build end to end features components like Grid Data Table and other required components with all CRUD, RBAC, User Configurations with
• Zustand
• Renderer System
• State Management
• API Integration
• Cache Management

We need to build a standalone Next.js project for
Record To Report (Next JS Project, non monorepo based standalone single project)

Based on the expected features for a Next.js tech stack, please analyse and suggest the optimal frontend architecture for Highradius that leverages Next.js and TypeScript. This architecture should incorporate a monorepo structure with three main monorepos: highradius_ui_config, highradius_core_ui, and highradius_aps_ui. Additionally, we will maintain a standalone Next.js project for Record To Report. The goal is to retain the Next.js stack and create a product shell where individual product teams can build their pages and features. As the platform team, I require control over core elements, while product teams develop features on top of this structure. I also need a mechanism to release new versions directly to product teams without affecting the core product. Please suggest the best architecture that supports this monorepo structure, allows product teams to build pages and features, and ensures we maintain control over the core product.

⚡ Next.js with App Router support
🔥 Type checking TypeScript
💎 Integrate with Tailwind CSS
🤖 AI coding agent instructions for Claude Code, Codex, Cursor, OpenCode, Copilot, and more
✅ Strict Mode for TypeScript and React 19
🌐 Multi-language (i18n) with next-intl and Crowdin
♻️ Type-safe environment variables with T3 Env
⌨️ Form handling with React Hook Form
🔴 Validation library with Zod
📏 Linter with Oxlint with Ultracite preset (replacing ESLint)
💖 Code Formatter with Oxfmt (replacing Prettier)
🦊 Husky for Git Hooks (replaced by Lefthook)
🚫 Lint-staged for running linters on Git staged files
🚓 Lint git commit with Commitlint
📓 Write standard compliant commit messages with Commitizen
🔍 Unused files and dependencies detection with Knip
🌍 I18n validation and missing translation detection with i18n-check
🦺 Unit Testing with Vitest and Browser mode (replacing React Testing Library)
🧪 Integration and E2E Testing with Playwright
👷 Run tests on pull request with GitHub Actions
🐰 AI-powered code reviews with CodeRabbit
🚨 Error Monitoring with Sentry
🔍 Local development error monitoring with Sentry Spotlight
☂️ Code coverage with Codecov
📝 Logging with LogTape and Log Management with Better Stack (EFK)
🔐 Security and bot protection (Arcjet)
🎁 Automatic changelog generation with Semantic Release
🔍 Visual regression testing
💡 Absolute Imports using @ prefix
🗂 VSCode configuration: Debug, Settings, Tasks and Extensions
🤖 SEO metadata, JSON-LD and Open Graph tags
🗺️ Sitemap.xml and robots.txt
⚙️ Bundler Analyzer
🌈 Include a FREE minimalist theme
💯 Maximize lighthouse score and CI integration with Google Lighthouse (Optional)
👷 Automatic dependency updates with Dependabot (Optional)
📊 Analytics with PostHog
🖥️ Monitoring as Code with Checkly (Optional)
🚀 CDN Integration with CI/CD for optimal performance
⚙️ Redis for caching metadata (Optional)
⚙️ GraphQL API with GraphQL Code Generator (Optional)
⚙️ Watt (wattpm) for Node Service BFF (Optional)

Built-in features from Next.js:
☕ Minify HTML & CSS
💨 Live reload
✅ Cache busting

Optional features (easy to add):
🔑 Multi-tenancy, Role-based access control (RBAC)
🔐 OAuth for Single Sign-On (SSO), Enterprise SSO, SAML, OpenID Connect (OIDC), EASIE

Philosophy
Easy to customize
Minimal code
Unstyled template
SEO-friendly
🚀 Production-ready