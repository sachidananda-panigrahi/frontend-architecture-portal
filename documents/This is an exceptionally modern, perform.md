This is an exceptionally modern, performance-obsessed technology stack. Leveraging Rust-based tooling (Oxlint, Oxfmt) over traditional JS ecosystem tools, combined with strict type safety (T3 Env, Zod) and a dedicated BFF layer (Wattpm), positions the Highradius frontend architecture for extreme scalability.

To achieve your goal of maintaining a **Platform Shell** where the core team retains control over security, telemetry, and layout, while the **Record to Report (R2R)** product team iterates freely on business features, we need to map your tech stack explicitly across the defined boundaries.

Here is the architectural blueprint for your Next.js and Turborepo/pnpm environment.

---

### 1. The Monorepo Ecosystem: Tooling & Responsibility Segregation

To prevent dependency hell and ensure fast builds, your extensive toolchain must be strictly allocated to the appropriate layer in the monorepo.

#### A. `highradius_ui_config` (The Governance Hub)
This layer enforces code quality and consistency across all Highradius engineering teams. No application code lives here.

*   **Linter & Formatter:** **Oxlint** (with Ultracite preset) and **Oxfmt**. Because these are Rust-based, they will execute in milliseconds across the monorepo.
*   **Git Hooks & Commits:** **Lefthook** (replacing Husky) orchestrates the pre-commit checks, running **Commitlint** and **Commitizen** to enforce standard compliant commit messages.
*   **Dependency Management:** **Knip** lives here to scan the entire workspace for unused files and dependencies, keeping the monorepos lean.
*   **TypeScript & Styling:** Central `tsconfig.base.json` (Strict Mode for React 19) and the core `tailwind.config.ts`.

#### B. `highradius_core_ui` (The Atom/Design System Layer)
This is a pure UI layer. It should be entirely stateless and agnostic to Highradius business logic.

*   **Foundation:** Untitled UI components merged with the Highradius theme via Tailwind CSS.
*   **Testing:** **Vitest** (Browser mode) is perfect here. You are testing UI states, not complex user journeys.
*   **Visual Regression:** Integrate your visual regression testing here to ensure a button change doesn't break the layout.
*   **Documentation:** Utilize AI coding agent instructions (for Claude/Cursor) stored as `.md` guidelines within this package so agents know exactly how to consume these pure components.

#### C. `highradius_aps_ui` (The Platform Shell & Smart Features Layer)
This is where the "Platform Team" exercises its control. It contains business-heavy components and, crucially, the **Runtime Shell**.

*   **State & Forms:** **Zustand** for complex UI state (like data table selections) and **React Hook Form + Zod** for standardized Highradius form patterns.
*   **Telemetry & Security:** The **Sentry** initialization, **PostHog** analytics wrappers, and **Arcjet** bot protection logic are encapsulated in platform components here.
*   **Internationalization (i18n):** **next-intl** configurations and **i18n-check** scripts ensure that any composite component is fully translated before it reaches a product.
*   **The Shell Export:** This package exports a `<HighradiusPlatformShell>` component. This is the master wrapper that enforces the RBAC, telemetry, and unified layout.

---

### 2. The Standalone Product: `Record To Report` (Next.js)

Because R2R is a standalone Next.js App Router project, it acts as a **Consumer** of the platform monorepo. It focuses purely on financial workflows.

*   **The Architecture:** The R2R `app/layout.tsx` imports the `<HighradiusPlatformShell>` from `highradius_aps_ui`. The R2R team only builds what goes *inside* the shell.
*   **Type Safety:** **T3 Env** lives at this application level to validate environment variables required specifically for the R2R backend.
*   **BFF & Data Fetching:** The **Wattpm** Node BFF and **GraphQL Code Generator** are implemented here. The R2R team defines their own GraphQL mutations for their specific microservices.
*   **E2E Testing:** **Playwright** lives in this repository to test the full E2E user journeys (e.g., completing a financial close process).

---

### 3. The "Inverted Control" Architecture (Platform vs. Product)

To give the Platform team control while allowing the Product team to move fast, use the **Slot-Based Architecture** within Next.js.

#### The Platform Contract (`highradius_aps_ui`)
The platform team creates a strict layout that requires specific configuration props.

```tsx
// Inside highradius_aps_ui package
import { NextIntlClientProvider } from 'next-intl';
import { ArcjetProvider } from '@arcjet/next';
import { SentryProvider } from './telemetry';

export function HighradiusPlatformShell({
  children,
  rbacRequiredRole,
  localeMessages
}: ShellProps) {
  return (
    <ArcjetProvider>
      <SentryProvider>
        <NextIntlClientProvider messages={localeMessages}>
          <RBACBoundary role={rbacRequiredRole}>
             <PlatformSidebar />
             <main className="hira-content-area">{children}</main>
          </RBACBoundary>
        </NextIntlClientProvider>
      </SentryProvider>
    </ArcjetProvider>
  );
}
```

#### The Product Implementation (`Record To Report`)
The R2R team cannot bypass security, error monitoring, or branding because they *must* use the shell to render their Next.js pages.

```tsx
// Inside Record To Report: app/(finance)/reconciliation/page.tsx
import { HighradiusPlatformShell, DataTable } from 'highradius_aps_ui';
import { ReconciliationGrid } from './components';

export default function ReconciliationPage() {
  return (
    <HighradiusPlatformShell rbacRequiredRole="finance_admin">
      {/* Product Team is free to build their specific logic here */}
      <ReconciliationGrid />
    </HighradiusPlatformShell>
  );
}
```

---

### 4. Versioning Strategy: Semantic Release without Breakage

To release updates directly to product teams without breaking the R2R core application, you must implement a rigorous deployment pipeline for your packages.

1.  **Semantic Release Orchestration:** Use **Semantic Release** in combination with your **Commitlint** setup. When the Platform team pushes a `fix: update button padding` to `highradius_core_ui`, Semantic Release automatically bumps the package version to `v1.1.2` and publishes it to your private NPM registry (or GitHub Packages).
2.  **Automated Dependency Updates:** Configure **Dependabot** (from your wishlist) within the `Record To Report` repository to automatically open a PR when a new `highradius_aps_ui` or `highradius_core_ui` version is published.
3.  **AI Code Reviews:** When Dependabot opens that PR, **CodeRabbit** automatically reviews the diff to ensure the platform changes do not conflict with the R2R implementation.
4.  **The CI Gate:** The PR triggers **Vitest** and **Playwright**. If the visual regression and E2E tests pass, the platform update can be automatically merged and deployed via your CDN CI/CD pipeline.

This mechanism ensures the Platform Team can release multiple times a day, but the Product Team is shielded by automated tests and semantic versioning, preventing their workflows from breaking unexpectedly.

With **Wattpm** designated as an optional Node Service BFF in your stack, are you planning to handle the RBAC token validation and Redis caching entirely at that BFF layer, or will some of that logic need to be processed within the Next.js server components of the R2R app?</HighradiusPlatformShell></HighradiusPlatformShell>