import type { Document, SidebarSection } from '../types';

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export const documents: Document[] = [
  // ── Overview ──────────────────────────────────────────────────────────────
  {
    id: 'overview',
    title: 'Architecture Overview',
    category: 'Architecture',
    icon: '🏛️',
    description: 'Four repositories — untitled-ui (unmodified Untitled UI React vendor), ui-nexus (platform monorepo with HiRa base-components layer), nextjs-boilerplate (app starter), and record-to-report — powering the HighRadius frontend.',
    sections: [
      { type: 'paragraph', content: 'The HighRadius frontend platform is four Git repositories. Three are standard single repositories. One — ui-nexus — is the only monorepo. untitled-ui stores the unmodified Untitled UI React source and publishes it as @highradius/untitledui. ui-nexus (the monorepo) wraps that in a base-components layer with HiRa brand tokens, then publishes @highradius/ui and 12 other packages. next-js-boilerplate is a single-repo starter template that pulls config packages from ui-nexus — clone it to start any new product app. record-to-report is the live product app bootstrapped from the boilerplate.' },

      { type: 'callout', variant: 'info', title: 'Repo Types at a Glance', content: 'untitled-ui = Single Repo. ui-nexus = Monorepo (the only one). next-js-boilerplate = Single Repo. record-to-report = Single Repo. Only ui-nexus uses Turborepo and publishes multiple packages.' },

      { type: 'heading', content: 'The Dependency Chain' },
      { type: 'list', items: [
        '1. untitled-ui  →  single repo, unmodified Untitled UI React source → published as @highradius/untitledui',
        '2. ui-nexus (monorepo)  →  base-components imports @highradius/untitledui + @hr/tokens → applies HiRa design → publishes 13 packages',
        '3. next-js-boilerplate  →  single repo, pulls @hr/tsconfig · @hr/tailwind-config · @hr/oxlint-config · @hr/commitlint-config · @hr/lefthook-config from ui-nexus → published as GitHub template',
        '4. record-to-report  →  single repo, bootstrapped from the boilerplate, installs all ui-nexus packages, ships to users',
      ]},
      { type: 'callout', variant: 'info', title: 'One-way dependency rule', content: 'untitled-ui → base-components → @hr/ui → platform packages → product apps. No reverse deps. Only base-components imports @highradius/untitledui. Product teams only import @highradius/ui. Enforced by Turborepo boundary rules, Knip, and CI.' },
      { type: 'heading', content: 'Design Principles' },
      { type: 'list', items: [
        'Untitled UI source is vendored unmodified — easy upstream migration, zero drift risk',
        'All HiRa customisation lives in base-components — one place, one PR, isolated impact',
        'Product teams import @highradius/ui only — never @highradius/untitledui or @highradius/base-components directly',
        'Platform team owns the shell and gateway — product teams own pages and feature code',
        'Boilerplate as the canonical template — every new product app clones next-js-boilerplate',
        'Rust-based tooling (Oxlint, Oxfmt) for millisecond CI feedback',
        'Wattpm Gateway owns RBAC complexity — Next.js Standalone stays stateless and never handles auth',
        'Visual regression at the base-components layer — a broken HiRa variant is caught before propagation',
      ]},
      { type: 'heading', content: 'Repository Overview' },
      { type: 'table', headers: ['Repo', 'Repo Type', 'Role', 'Team'], rows: [
        ['untitled-ui',          'Single Repo',   'Unmodified Untitled UI React source. Published as @highradius/untitledui. No changes allowed.', 'Platform'],
        ['ui-nexus',             'Monorepo (only)', 'base-components wraps @highradius/untitledui with HiRa design. Publishes @hr/ui, @hr/shell, @hr/data-table, +10 more. Also publishes config packages used by the boilerplate.', 'Platform'],
        ['next-js-boilerplate',  'Single Repo',   'GitHub template repo: Wattpm Gateway + Next.js Standalone + CI/CD + Docker + ui-nexus config packages pre-wired. Clone to start a new product.', 'Platform'],
        ['record-to-report',     'Single Repo',   'Ships to users. Bootstrapped from the boilerplate. Wattpm Gateway (:3000) + Next.js Standalone (:3001). Consumes all ui-nexus packages.', 'R2R + Platform'],
      ]},
    ],
  },

  // ── ui-nexus ──────────────────────────────────────────────────────────────
  {
    id: 'ui-nexus',
    title: 'ui-nexus',
    category: 'Monorepos',
    icon: '🏗️',
    description: 'Platform monorepo with a base-components layer that wraps @highradius/untitledui with HiRa design tokens. Publishes 13 packages. Build order: config → base-components → ui → platform.',
    sections: [
      { type: 'paragraph', content: 'ui-nexus consolidates config, the HiRa design system, and the platform shell into one Turborepo monorepo. The key architectural layer is base-components: it imports the unmodified @highradius/untitledui source, applies HiRa brand tokens via CVA extension, and re-exports them as @highradius/ui. Product teams only ever import @highradius/ui — they never touch @highradius/untitledui directly.' },
      { type: 'callout', variant: 'tip', title: 'Why a base-components layer?', content: 'Keeping the Untitled UI source unmodified means upstream updates are a clean pull + republish. All HighRadius-specific customisation is isolated in base-components. When Untitled UI ships a new version, only one file might need an override update in base-components — not scattered across the entire codebase.' },

      { type: 'heading', content: 'Workspace Structure' },
      { type: 'filetree', items: [
        'ui-nexus/',
        '├── packages/',
        '│   ├── config/                      ← Config workspace',
        '│   │   ├── tsconfig/                → @highradius/tsconfig',
        '│   │   ├── tailwind-config/         → @highradius/tailwind-config',
        '│   │   ├── oxlint-config/           → @highradius/oxlint-config',
        '│   │   ├── commitlint-config/       → @highradius/commitlint-config',
        '│   │   └── lefthook-config/         → @highradius/lefthook-config',
        '│   ├── base-components/             ← HiRa wrapping layer (NEW)',
        '│   │   ├── src/',
        '│   │   │   ├── button.tsx           ← wraps @highradius/untitledui Button',
        '│   │   │   ├── input.tsx            ← wraps @highradius/untitledui Input',
        '│   │   │   └── ...                  ← one file per component',
        '│   │   └── package.json             ← internal only, not published directly',
        '│   ├── ui/                          ← UI workspace',
        '│   │   ├── core/                    → @highradius/ui (re-exports base-components)',
        '│   │   ├── icons/                   → @highradius/icons',
        '│   │   └── tokens/                  → @highradius/tokens',
        '│   └── platform/                    ← Platform workspace',
        '│       ├── shell/                   → @highradius/shell',
        '│       ├── data-table/              → @highradius/data-table',
        '│       ├── forms/                   → @highradius/forms',
        '│       ├── state/                   → @highradius/state',
        '│       └── api-client/              → @highradius/api-client',
        '├── apps/',
        '│   └── storybook/                  ← Internal — not published',
        '├── turbo.json                       ← Build: config → base-components → ui → platform',
        '├── pnpm-workspace.yaml',
        '└── .github/workflows/release.yml',
      ]},

      { type: 'heading', content: 'Base Components Layer — HiRa Design System' },
      { type: 'paragraph', content: 'base-components is where every HiRa brand decision lives. It imports the unmodified Untitled UI React source via @highradius/untitledui, then wraps each component with CVA-based HiRa variants. The result is re-exported as @highradius/ui. This is the only place in the codebase where @highradius/untitledui is imported.' },
      { type: 'code', language: 'typescript', content: `// packages/base-components/src/button.tsx
import { Button as UntitledButton } from '@highradius/untitledui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

// HiRa brand variants — extends Untitled UI's default variant surface
const buttonVariants = cva('', {
  variants: {
    hiraVariant: {
      brand:       'bg-hira-600 hover:bg-hira-700 text-white border-transparent focus-visible:ring-hira-500',
      brandOutline:'border-hira-600 text-hira-600 hover:bg-hira-50 bg-transparent',
      brandGhost:  'text-hira-600 hover:bg-hira-50 border-transparent',
    },
    hiраSize: {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-base',
    },
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof UntitledButton>,
    VariantProps<typeof buttonVariants> {}

export function Button({ hiraVariant, hiраSize, className, ...props }: ButtonProps) {
  return (
    <UntitledButton
      className={cn(buttonVariants({ hiraVariant, hiраSize }), className)}
      {...props}
    />
  );
}` },
      { type: 'code', language: 'typescript', content: `// packages/ui/core/src/index.ts
// @highradius/ui simply re-exports everything from base-components
// Product teams import from here — this is the stable public API
export * from '@highradius/base-components';` },
      { type: 'callout', variant: 'danger', title: 'Import rule', content: 'Only base-components may import @highradius/untitledui. Everything else in ui-nexus and all downstream repos must import from @highradius/ui. Enforced by Turborepo boundary rules and Knip.' },

      { type: 'heading', content: 'Turborepo Pipeline' },
      { type: 'code', language: 'json', content: `// turbo.json — strict build order
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
// Resolution order:
// config packages → @highradius/tokens → base-components → @highradius/ui → platform packages
// base-components cannot build until @highradius/untitledui and @hr/tokens are built` },

      { type: 'heading', content: 'Published Packages — Config Layer' },
      { type: 'table', headers: ['Package', 'Purpose', 'Consumers'], rows: [
        ['@highradius/tsconfig',          'Strict TS config — base · nextjs · library variants', 'All ui-nexus packages, R2R'],
        ['@highradius/tailwind-config',   'Tailwind v4 preset extending Untitled UI theme with HiRa brand tokens', 'base-components, ui packages, platform packages, R2R'],
        ['@highradius/oxlint-config',     'Ultracite preset + HiRa lint rules (Rust-speed)',      'All ui-nexus packages, R2R'],
        ['@highradius/commitlint-config', 'Conventional commit enforcement',                      'All ui-nexus packages, R2R'],
        ['@highradius/lefthook-config',   'Shareable git hook definitions',                       'All ui-nexus packages, R2R'],
      ]},

      { type: 'heading', content: 'Published Packages — UI Layer' },
      { type: 'badges', items: ['Button', 'Chip', 'TextField', 'Dropdown', 'Avatar', 'Grid', 'Tree', 'Badge', 'Modal', 'Toast', 'Tooltip', 'Spinner', 'Tabs', 'Accordion', 'Card'] },
      { type: 'table', headers: ['Package', 'Contents'], rows: [
        ['@highradius/ui',     'HiRa-branded React components — re-exports from base-components. Stateless, tree-shakeable. The only component package product teams import.'],
        ['@highradius/tokens', 'CSS custom properties + JS token exports driving the HiRa design layer across all surfaces'],
        ['@highradius/icons',  'SVG-in-React icon set — re-exports @highradius/untitledui icons, tree-shakeable per icon'],
      ]},
      { type: 'callout', variant: 'danger', title: 'Strict UI boundary', content: 'No Zustand, no API calls, no business logic in the ui workspace. Start from an Untitled UI base component whenever one exists, then apply HiRa tokens and HighRadius-specific variants. Violations block the PR.' },

      { type: 'heading', content: 'Published Packages — Platform Layer' },
      { type: 'table', headers: ['Package', 'Contents', 'Key Technologies'], rows: [
        ['@highradius/shell',      'HighradiusPlatformShell + layout + providers', 'Sentry · PostHog · Arcjet · next-intl · RBAC'],
        ['@highradius/data-table', 'Grid + CRUD + Renderer System',                'Zustand · TanStack Query · @hr/ui'],
        ['@highradius/forms',      'Standardised HiRa form patterns',              'React Hook Form · Zod · @hr/ui'],
        ['@highradius/state',      'Zustand store factories',                      'Zustand'],
        ['@highradius/api-client', 'Typed fetcher + cache management',             'TanStack Query · axios'],
      ]},

      { type: 'heading', content: 'Turborepo Pipeline' },
      { type: 'code', language: 'json', content: `// turbo.json — build order enforced automatically
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
// Build order: config/* → ui/* → platform/*
// Turborepo only rebuilds what changed (content-hash caching)` },

      { type: 'heading', content: 'The Platform Shell Contract' },
      { type: 'code', language: 'tsx', content: `// packages/platform/shell/src/HighradiusPlatformShell.tsx
import { NextIntlClientProvider } from 'next-intl';
import { ArcjetProvider } from '@arcjet/next';
import { SentryBoundary } from './telemetry/SentryBoundary';
import { PostHogProvider } from './analytics/PostHogProvider';
import { RBACBoundary } from './rbac/RBACBoundary';
import { PlatformSidebar } from './layout/PlatformSidebar';
import { PlatformTopbar } from './layout/PlatformTopbar';
import type { ShellProps } from './types';

export function HighradiusPlatformShell({
  children,
  rbacRequiredRole,
  localeMessages,
  headerSlot,
  sidebarSlot,
}: ShellProps) {
  return (
    <ArcjetProvider>
      <SentryBoundary>
        <PostHogProvider>
          <NextIntlClientProvider messages={localeMessages}>
            <RBACBoundary requiredRole={rbacRequiredRole}>
              <div className="hira-shell-layout">
                <PlatformSidebar extensionSlot={sidebarSlot} />
                <div className="hira-content-wrapper">
                  <PlatformTopbar actionSlot={headerSlot} />
                  <main className="hira-content-area">{children}</main>
                </div>
              </div>
            </RBACBoundary>
          </NextIntlClientProvider>
        </PostHogProvider>
      </SentryBoundary>
    </ArcjetProvider>
  );
}` },
      { type: 'callout', variant: 'info', title: 'Slots, not flags', content: 'headerSlot and sidebarSlot let product teams extend layout without forking it. No prop explosion. Platform owns the outer frame; product owns what goes inside.' },

      { type: 'heading', content: 'Adding a New Component (UI Layer)' },
      { type: 'code', language: 'tsx', content: `// packages/ui/core/src/button/Button.tsx
import { Button as UntitledButton } from '@/untitled-ui/base/button';
import type { ButtonProps as UntitledButtonProps } from '@/untitled-ui/base/button';
import { cx } from '../utils/cx';

export interface ButtonProps extends UntitledButtonProps {
  emphasis?: 'primary' | 'secondary' | 'ghost';
}

const emphasisClassNames: Record<NonNullable<ButtonProps['emphasis']>, string> = {
  primary:   'bg-hira-600 text-white hover:bg-hira-700',
  secondary: 'bg-hira-surface-strong text-hira-foreground hover:bg-hira-surface-stronger',
  ghost:     'text-hira-foreground-subtle hover:bg-hira-surface-subtle',
};

export function Button({ emphasis = 'primary', className, ...props }: ButtonProps) {
  return (
    <UntitledButton
      className={cx(
        'rounded-md font-medium shadow-xs transition-colors',
        emphasisClassNames[emphasis],
        className,
      )}
      {...props}
    />
  );
}` },

      { type: 'heading', content: 'Consuming in R2R' },
      { type: 'code', language: 'json', content: `// record-to-report/package.json
{
  "dependencies": {
    "@highradius/shell":      "^3.1.0",
    "@highradius/data-table": "^2.4.0",
    "@highradius/forms":      "^1.9.0",
    "@highradius/ui":         "^4.2.0",
    "@highradius/tokens":     "^2.0.0",
    "@highradius/api-client": "^1.5.0"
  },
  "devDependencies": {
    "@highradius/tsconfig":         "^2.1.0",
    "@highradius/tailwind-config":  "^1.3.0",
    "@highradius/oxlint-config":    "^1.2.0",
    "@highradius/commitlint-config":"^1.1.0",
    "@highradius/lefthook-config":  "^1.0.0"
  }
}` },

      { type: 'heading', content: 'CI Pipeline' },
      { type: 'list', items: [
        'push → Turborepo determines affected packages (content-hash)',
        'Oxlint (Rust, <1s) → tsc --noEmit (affected only)',
        'Vitest browser tests → Playwright visual regression (ui workspace)',
        'Bundle size gate → blocks publish if primitive budget exceeded',
        'i18n-check → blocks publish if translation key missing (platform workspace)',
        'Semantic Release → auto-version and publish affected packages to private registry',
        'Dependabot in record-to-report opens update PRs for any @highradius/* bump',
      ]},
      { type: 'callout', variant: 'tip', title: 'AI Agent Guide (CLAUDE.md)', content: 'ui workspace: stateless and pure, no side effects, Tailwind only, Untitled UI base first. platform workspace: @hr/ui only, Zustand for state, TanStack Query for data. config workspace: zero runtime code, validated by consumers.' },
    ],
  },

  // ── R2R ───────────────────────────────────────────────────────────────────
  {
    id: 'r2r',
    title: 'Record to Report (R2R)',
    category: 'Products',
    icon: '🚀',
    description: 'Next.js Standalone (output: standalone) product app. Wattpm Gateway (port 3000) proxies to Next.js standalone server (port 3001). Gateway co-owned by Platform team.',
    sections: [
      { type: 'paragraph', content: 'Independent product repository. R2R team owns the finance pages. Platform team co-owns the Wattpm Gateway directory and app/layout.tsx via CODEOWNERS. Next.js exports in standalone mode — producing a self-contained server.js. Wattpm is the public entry point and reverse-proxies to the standalone server.' },
      { type: 'heading', content: 'Repository Structure' },
      { type: 'filetree', items: [
        'record-to-report/',
        '├── app/',
        '│   ├── layout.tsx             ← @highradius/platform-team via CODEOWNERS',
        '│   ├── (finance)/',
        '│   │   ├── reconciliation/page.tsx',
        '│   │   ├── journal-entry/page.tsx',
        '│   │   └── close-management/page.tsx',
        '│   └── api/                   ← RSC data routes → Wattpm Gateway /api/*',
        '├── wattpm/                    ← Platform team owns (was bff/)',
        '│   ├── server.ts              ← Wattpm entry point (port 3000)',
        '│   ├── plugins/auth.ts        ← OIDC + RBAC + Redis cache',
        '│   ├── plugins/proxy.ts       ← Reverse proxy to Next.js standalone (:3001)',
        '│   ├── plugins/graphql.ts     ← GraphQL proxy to microservices',
        '│   └── generated/types.ts     ← GraphQL Code Generator output',
        '├── tests/e2e/                 ← Playwright financial workflow journeys',
        '├── monitoring/checkly/        ← Monitoring as Code',
        '├── env.ts                     ← T3 Env (R2R-specific vars)',
        '└── .github/CODEOWNERS',
      ]},
      { type: 'heading', content: 'Page Pattern' },
      { type: 'code', language: 'tsx', content: `// app/(finance)/reconciliation/page.tsx
import { HighradiusPlatformShell, DataTable } from '@highradius/shell';
import { getMessages } from 'next-intl/server';
import { ReconciliationToolbar } from './components/ReconciliationToolbar';
import { fetchReconciliationData } from './data/reconciliation';

export default async function ReconciliationPage() {
  const [messages, data] = await Promise.all([
    getMessages(),
    fetchReconciliationData(), // RSC: fetch at server, no waterfall
  ]);

  return (
    <HighradiusPlatformShell
      rbacRequiredRole="finance_admin"
      localeMessages={messages}
      headerSlot={<ReconciliationToolbar />}
    >
      <DataTable data={data} />
    </HighradiusPlatformShell>
  );
}` },
      { type: 'heading', content: 'CODEOWNERS' },
      { type: 'code', language: 'bash', content: `# .github/CODEOWNERS
/wattpm/           @highradius/platform-team
/app/layout.tsx    @highradius/platform-team
/env.ts            @highradius/platform-team
/next.config.ts    @highradius/platform-team
/app/(finance)/    @highradius/r2r-team` },
      { type: 'heading', content: 'CI Pipeline' },
      { type: 'list', items: [
        'Oxlint → tsc → Vitest → Playwright E2E (full financial flows)',
        'Lighthouse CI: LCP < 2.5s gate',
        'Dependabot watches all @highradius/* package releases (single ui-nexus source)',
        'CodeRabbit reviews Dependabot PRs automatically',
        'Checkly synthetic monitors post-deploy',
      ]},
    ],
  },

  // ── Tool Allocation ───────────────────────────────────────────────────────
  {
    id: 'tool-allocation',
    title: 'Tool Allocation Matrix',
    category: 'Reference',
    icon: '🔧',
    description: 'Every tool from the stack mapped to the correct layer — ui-nexus workspaces vs R2R.',
    sections: [
      { type: 'paragraph', content: 'Every tool in the HighRadius stack has a single authoritative home. With ui-nexus consolidating config, UI, and platform packages, most tooling is now defined once in the monorepo and consumed identically across all workspaces before flowing to R2R.' },
      { type: 'heading', content: 'Tooling & Quality' },
      { type: 'table', headers: ['Tool', 'ui-nexus (config workspace)', 'ui-nexus (ui workspace)', 'ui-nexus (platform workspace)', 'R2R'], rows: [
        ['TypeScript / tsconfig',      '✅ publishes',            'consumes',              'consumes',              'consumes'],
        ['Oxlint + Ultracite',         '✅ publishes',            'consumes',              'consumes',              'consumes'],
        ['Oxfmt',                      '✅ publishes',            'consumes',              'consumes',              'consumes'],
        ['Tailwind CSS',               '✅ publishes HiRa base',  'extends over Untitled UI', 'extends',           'extends'],
        ['Untitled UI React source',   '—',                       '✅ owns base layer',    'consumes @hr/ui',       'consumes via @hr/shell'],
        ['Lefthook',                   '✅ publishes',            'consumes',              'consumes',              'consumes'],
        ['Commitlint + Commitizen',    '✅ publishes',            'consumes',              'consumes',              'consumes'],
        ['Knip',                       'runs self',               'runs self',             'runs self',             'runs self'],
        ['Turborepo',                  '✅ pipeline root',        'task graph',            'task graph',            '—'],
        ['Semantic Release',           '✅ per pkg',              '✅ per pkg',            '✅ per pkg',            '✅ app'],
      ]},
      { type: 'heading', content: 'Testing & Quality Gates' },
      { type: 'table', headers: ['Tool', 'ui-nexus (config)', 'ui-nexus (ui)', 'ui-nexus (platform)', 'R2R'], rows: [
        ['Vitest (Browser mode)',       '—',               '✅ components', 'integration',    'unit utils'],
        ['Visual Regression',          '—',               '✅ atom level', '—',              '—'],
        ['Playwright',                 '—',               'visual only',  'smoke tests',    '✅ full E2E'],
        ['Codecov',                    '—',               '✅',           '✅',             '✅'],
        ['Bundler Analyzer',           '—',               '✅ size gate', '✅ size gate',   '✅'],
        ['Lighthouse CI',              '—',               '—',            '—',              '✅ LCP gate'],
        ['Dependabot',                 '—',               '—',            '—',              'watches all @hr/* pkgs'],
        ['CodeRabbit',                 '—',               'dep PRs',      'dep PRs',        '✅ all PRs'],
      ]},
      { type: 'heading', content: 'Observability & Security' },
      { type: 'table', headers: ['Tool', 'ui-nexus (config)', 'ui-nexus (ui)', 'ui-nexus (platform)', 'R2R'], rows: [
        ['Sentry',                     '—', '—', '✅ init in shell', 'source maps upload'],
        ['Sentry Spotlight',           '—', '—', '—',               '✅ dev only'],
        ['PostHog',                    '—', '—', '✅ provider in shell', 'custom events'],
        ['Arcjet',                     '—', '—', '✅ in shell',     '—'],
        ['LogTape + Better Stack',     '—', '—', '✅ context in shell', 'log shipping'],
        ['Checkly',                    '—', '—', '—',               '✅ synthetic monitors'],
      ]},
      { type: 'heading', content: 'Data & i18n' },
      { type: 'table', headers: ['Tool', 'ui-nexus (config)', 'ui-nexus (ui)', 'ui-nexus (platform)', 'R2R'], rows: [
        ['next-intl',                  '—', '—', '✅ provider in shell', 'locale messages'],
        ['i18n-check',                 '—', '—', '✅ CI gate',      '—'],
        ['React Hook Form + Zod',      '—', '—', '✅ in forms pkg', 'consumes'],
        ['Zustand',                    '—', '—', '✅ store factories', 'consumes'],
        ['TanStack Query',             '—', '—', '✅ in api-client', 'consumes'],
        ['T3 Env',                     'base schema', '—', 'base schema', '✅ R2R vars'],
        ['Wattpm Gateway',              '—', '—', '—',               '✅ platform-owned (wattpm/)'],
        ['GraphQL Code Generator',     '—', '—', '—',               '✅ R2R schema'],
        ['Redis',                      '—', '—', '—',               '✅ via Gateway'],
      ]},
    ],
  },

  // ── Versioning ────────────────────────────────────────────────────────────
  {
    id: 'versioning',
    title: 'Versioning Strategy',
    category: 'Reference',
    icon: '🏷️',
    description: 'Turborepo internal pipeline + Semantic Release per package + Dependabot on R2R = safe automated promotion.',
    sections: [
      { type: 'paragraph', content: 'Within ui-nexus, Turborepo handles the build graph — config → ui → platform — so internal changes never need cross-repo Dependabot PRs. Each package still has its own Semantic Release and publishes independently to the private registry. R2R has Dependabot watching every @highradius/* package. CodeRabbit reviews every dependency update PR automatically.' },
      { type: 'heading', content: 'The Promotion Pipeline' },
      { type: 'list', items: [
        '1. Platform commits to ui-nexus/packages/ui/core/ (e.g. "fix: reduce button padding")',
        '2. Turborepo rebuilds only affected packages (content-hash cache)',
        '3. Semantic Release: @highradius/ui 4.2.1 → 4.2.2 published',
        '4. Turborepo rebuilds downstream @highradius/shell (depends on @hr/ui)',
        '5. Semantic Release: @highradius/shell 3.0.8 → 3.0.9 published',
        '6. Dependabot opens PRs in record-to-report: bump @hr/ui + @hr/shell',
        '7. CodeRabbit reviews: "Button padding changed, check data-table cell alignment"',
        '8. CI: Playwright E2E full financial flows + Lighthouse LCP gate → PASS',
        '9. Auto-merged (patch = auto-merge policy) → CDN deploy',
        '10. Checkly verifies live /reconciliation and /journal-entry flows post-deploy',
      ]},
      { type: 'heading', content: 'Version Policy Per Bump Type' },
      { type: 'table', headers: ['Bump', 'Within ui-nexus', 'ui-nexus → R2R'], rows: [
        ['patch (1.0.x)', 'Turborepo cascade + auto-publish', 'Auto-merge in R2R'],
        ['minor (1.x.0)', 'Turborepo cascade + CI gate',      'CI gate in R2R'],
        ['major (x.0.0)', 'Manual + migration guide',         'Manual + R2R team sign-off'],
      ]},
      { type: 'callout', variant: 'tip', title: 'Conventional commits drive everything', content: 'fix: → patch, feat: → minor, feat!: or BREAKING CHANGE: → major. Commitlint enforces format. Commitizen provides the interactive prompt. Semantic Release reads the git log. This works identically within ui-nexus and at R2R.' },
      { type: 'heading', content: 'Semantic Release Config' },
      { type: 'code', language: 'json', content: `// packages/ui/core/.releaserc.json  (same pattern for every package)
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    ["@semantic-release/npm", { "npmPublish": true }],
    ["@semantic-release/github", { "assets": ["CHANGELOG.md"] }]
  ]
}` },
    ],
  },

  // ── Platform Control ──────────────────────────────────────────────────────
  {
    id: 'platform-control',
    title: 'Platform Control Model',
    category: 'Reference',
    icon: '🏗️',
    description: 'What platform owns vs. what product teams own — enforced by code.',
    sections: [
      { type: 'paragraph', content: 'Platform team authority is enforced at the code level — not by convention, not by documentation, not by trust. The shell is the enforcement mechanism. ui-nexus is entirely platform-owned. record-to-report is product-owned with platform co-ownership of specific directories.' },
      { type: 'heading', content: 'Ownership Matrix' },
      { type: 'table', headers: ['Concern', 'Owned By', 'Enforcement Mechanism'], rows: [
        ['Security (Arcjet)',           'Platform', 'Injected in @hr/shell, no opt-out'],
        ['Error Monitoring (Sentry)',   'Platform', 'Shell boundary, product gets source maps only'],
        ['Analytics schema (PostHog)',  'Platform', 'Event registry in @hr/shell, products call typed wrappers'],
        ['RBAC enforcement',            'Platform', 'RBACBoundary in shell, role passed as required prop'],
        ['i18n provider',              'Platform', 'Shell wraps NextIntlClientProvider'],
        ['Base component foundation',  'Platform', 'Untitled UI source adopted in ui-nexus/packages/ui/'],
        ['Design tokens',              'Platform', 'HiRa theme tokens in @hr/tokens, enforced through tailwind-config'],
        ['Logging context',            'Platform', 'LogTape context injected at shell level'],
        ['Page layout',                'Platform', 'Sidebar + Topbar owned by @hr/shell'],
        ['Page content',               'Product',  'children slot — full freedom'],
        ['Business data fetching',     'Product',  'RSC data fetching inside page components'],
        ['Product-specific events',    'Product',  'Via typed PostHog wrappers from @hr/shell'],
        ['Product GraphQL schema',     'Product',  'Defined in R2R wattpm/, generated types local'],
        ['Product env vars',           'Product',  'T3 Env at R2R level'],
      ]},
      { type: 'heading', content: 'Non-Negotiable Invariants' },
      { type: 'list', items: [
        'No circular dependencies — enforced by Turborepo task graph + Knip + CI',
        'Shell is mandatory — CODEOWNERS prevents removal from R2R app/layout.tsx',
        'Gateway owns auth — tokens never reach Next.js Standalone or RSC layer',
        'Config packages pinned with caret — minors auto-merge, majors require humans',
        'Visual regression at the ui primitive layer — breaking a button caught before propagation to platform or R2R',
      ]},
    ],
  },

  // ── Gateway Architecture ──────────────────────────────────────────────────
  {
    id: 'bff-architecture',
    title: 'Wattpm Gateway Architecture',
    category: 'Reference',
    icon: '⚡',
    description: 'Wattpm Gateway: public entry point, OIDC auth, RBAC validation, Redis caching, reverse proxy to Next.js Standalone.',
    sections: [
      { type: 'paragraph', content: 'In the new architecture, Next.js exports in standalone mode (output: "standalone"), producing a self-contained server.js process on port 3001. Wattpm (Node.js / Fastify) runs as the public gateway on port 3000 — it is the only process exposed to the internet. Wattpm handles OIDC authentication, RBAC validation, Redis caching, and then reverse-proxies authenticated requests to the Next.js standalone server. The standalone server only receives requests that Wattpm has already validated.' },
      { type: 'heading', content: 'Architecture Overview' },
      { type: 'callout', variant: 'info', title: 'Key shift from BFF to Gateway', content: 'Previously Wattpm was a sub-directory BFF inside Next.js. Now Wattpm is the entry point in front of Next.js. Browser → Wattpm Gateway (:3000) → Next.js Standalone (:3001 internal). Next.js RSC calls back to Wattpm /api/* routes for all data fetching.' },
      { type: 'heading', content: 'Request Flow' },
      { type: 'list', items: [
        '1. Browser sends GET /reconciliation to Wattpm Gateway (port 3000 — only public port)',
        '2. Wattpm checks hr_session HttpOnly cookie → no session found',
        '3. Gateway issues 302 redirect to Identity Service OIDC /authorize endpoint',
        '4. User authenticates (SSO / SAML / credentials)',
        '5. Identity Service returns id_token + access_token to Wattpm callback',
        '6. Wattpm validates JWT against JWKS, caches RBAC roles in Redis (5 min TTL)',
        '7. Wattpm writes HttpOnly hr_session cookie and reverse-proxies request to Next.js Standalone (:3001)',
        '8. Next.js Standalone renders layout.tsx + PlatformShell',
        '9. Server Components call fetch("/api/*") — routes back to Wattpm API handlers',
        '10. Wattpm executes GraphQL queries / REST calls to microservices, returns typed data',
        '11. RSC renders with data, streams HTML through Wattpm Gateway back to browser',
      ]},
      { type: 'heading', content: 'Gateway Directory Structure' },
      { type: 'filetree', items: [
        'wattpm/                        ← platform team owns via CODEOWNERS',
        '├── server.ts                  ← Wattpm entry point (port 3000)',
        '├── plugins/',
        '│   ├── auth.ts                ← OIDC callback + JWT validation + RBAC cache',
        '│   ├── redis.ts               ← Redis client + cache helpers',
        '│   ├── proxy.ts               ← Reverse proxy to Next.js standalone (:3001)',
        '│   └── graphql.ts             ← GraphQL proxy to microservices',
        '├── routes/',
        '│   ├── reconciliation.ts      ← R2R domain API routes',
        '│   └── journal-entry.ts',
        '└── generated/',
        '    └── types.ts               ← GraphQL Code Generator output',
      ]},
      { type: 'heading', content: 'Auth + Proxy Plugin' },
      { type: 'code', language: 'typescript', content: `// wattpm/plugins/auth.ts
import type { FastifyPluginAsync } from 'wattpm';
import { redis } from './redis';

const RBAC_CACHE_TTL = 300; // 5 minutes

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request, reply) => {
    const raw = request.cookies['hr_session'];
    if (!raw) {
      // Redirect unauthenticated requests to OIDC provider
      return reply.redirect(\`\${process.env.OIDC_ISSUER}/authorize?...\`);
    }
    const { userId, accessToken } = decrypt(raw);
    const cacheKey = \`rbac:\${accessToken.slice(-16)}\`;
    const cached = await redis.get(cacheKey);
    request.user = cached ? JSON.parse(cached) : await resolveRoles(userId, accessToken);
    if (!cached) await redis.setex(cacheKey, RBAC_CACHE_TTL, JSON.stringify(request.user));
  });
};` },
      { type: 'code', language: 'typescript', content: `// wattpm/plugins/proxy.ts
import type { FastifyPluginAsync } from 'wattpm';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const proxyPlugin: FastifyPluginAsync = async (app) => {
  // Forward all non-API requests to Next.js standalone (internal only)
  app.all('/*', { constraints: { not: '/api/*' } }, async (req, reply) => {
    // Attach RBAC context as headers before proxying
    req.headers['x-user-id']    = req.user.userId;
    req.headers['x-user-roles'] = JSON.stringify(req.user.roles);
    // Proxy to standalone server (port 3001 — never exposed publicly)
    return proxy.web(req.raw, reply.raw, { target: 'http://localhost:3001' });
  });
};` },
      { type: 'callout', variant: 'info', title: 'Why Gateway owns auth entirely', content: 'All authentication and RBAC validation happen at Wattpm before any request reaches Next.js Standalone. The standalone server only processes authenticated requests with pre-validated RBAC context. One auth boundary, one team, one audit scope.' },
      { type: 'heading', content: 'GraphQL Code Generator Config' },
      { type: 'code', language: 'yaml', content: `# codegen.yml
schema: ./wattpm/schema.graphql
documents: ./wattpm/operations/**/*.graphql
generates:
  ./wattpm/generated/types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typed-document-node
config:
  strictScalars: true
  enumsAsTypes: true` },
      { type: 'heading', content: 'Next.js Standalone Config' },
      { type: 'code', language: 'typescript', content: `// next.config.ts
const nextConfig = {
  output: 'standalone', // Produces .next/standalone/server.js
  // No server port exposed publicly — Wattpm Gateway proxies to it
};
export default nextConfig;` },
      { type: 'callout', variant: 'tip', title: 'Port configuration', content: 'Wattpm listens on PORT env var (default 3000, public). Next.js standalone listens on NEXTJS_PORT env var (default 3001, internal/loopback only). In production, only port 3000 is in the load balancer. Port 3001 is never exposed.' },
    ],
  },

  // ── E2E Request Flow ─────────────────────────────────────────────────────────
  {
    id: 'e2e-request-flow',
    title: 'End-to-End Request Flow',
    category: 'Reference',
    icon: '🔄',
    description: 'Complete user journey from browser to microservices — how ui-nexus packages power the runtime, OIDC auth, JWT session, user details API, and typed GraphQL domain data.',
    sections: [
      { type: 'paragraph', content: 'Every user interaction with Record to Report travels through five distinct layers: the browser, Wattpm Gateway (port 3000, public), the Next.js Standalone server (port 3001, internal), and one or more backend microservices. ui-nexus packages (@hr/shell, @hr/ui, @hr/tokens) shape the entire frontend surface at build time. At runtime, Wattpm handles auth, caching, and data proxying — Next.js Standalone handles only rendering. This document traces that full path.' },

      { type: 'heading', content: 'Interactive Architecture Flow' },
      { type: 'paragraph', content: 'Press ▶ to animate all 12 steps — starting from ui-nexus publishing its packages, through OIDC auth at the Wattpm Gateway, reverse-proxy to Next.js Standalone, RSC data fetching back through Wattpm API routes, parallel microservice calls, and back to a fully rendered page.' },
      { type: 'e2eFlow' },

      { type: 'heading', content: 'The Complete Stack Map' },
      { type: 'table', headers: ['Layer', 'Technology', 'Owner', 'Source'], rows: [
        ['Platform packages',          '@hr/ui, @hr/tokens, @hr/shell, @hr/data-table', 'Platform team',  'ui-nexus monorepo'],
        ['Browser / Client',           'React 19, RSC hydration',                       'R2R team',       'record-to-report'],
        ['Wattpm Gateway (public)',     'Wattpm (Node.js / Fastify) · port 3000',        'Platform team',  'record-to-report/wattpm/'],
        ['Next.js Standalone (internal)', 'server.js (output: standalone) · port 3001', 'R2R team',       'record-to-report/app/'],
        ['UI Shell',                   'HighradiusPlatformShell (@hr/shell)',            'Platform team',  'ui-nexus → @hr/shell'],
        ['Identity / Auth Service',    'OIDC Provider (OpenID Connect)',                'Infra / IAM',    'identity-service microservice'],
        ['User Profile Service',       'REST API',                                      'Platform / IAM', 'user-service microservice'],
        ['Domain Microservices',       'GraphQL APIs',                                  'Domain teams',   'reconciliation-service, journal-service, ...'],
        ['Cache Layer',                'Redis',                                          'Platform team',  'Gateway-owned, session + RBAC TTL'],
      ]},

      { type: 'heading', content: 'Step 1 — Browser → Wattpm Gateway' },
      { type: 'paragraph', content: 'The user navigates to the R2R domain. The request arrives at Wattpm Gateway (port 3000) — the only publicly exposed process. Wattpm checks the hr_session cookie. If no valid session exists, Wattpm redirects to the OIDC provider. Once authenticated, Wattpm reverse-proxies the request to Next.js Standalone (port 3001, internal). Next.js renders layout.tsx, which mounts HighradiusPlatformShell from @hr/shell — bootstrapping Sentry, PostHog, Arcjet, i18n, and the RBAC boundary.' },
      { type: 'code', language: 'tsx', content: `// app/layout.tsx  ← @highradius/platform-team (CODEOWNERS)
import { HighradiusPlatformShell } from '@highradius/shell'; // from ui-nexus
import { getMessages } from 'next-intl/server';
import { getServerSession } from './bff/session';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [messages, session] = await Promise.all([
    getMessages(),
    getServerSession(), // validates JWT from cookie via BFF
  ]);

  return (
    <html lang={session.locale}>
      <body>
        <HighradiusPlatformShell
          rbacRequiredRole={session.role}
          localeMessages={messages}
        >
          {children}
        </HighradiusPlatformShell>
      </body>
    </html>
  );
}` },
      { type: 'callout', variant: 'info', title: 'RSC runs on the server', content: 'getServerSession() executes on the server only. The JWT token never reaches the browser. The client receives already-resolved session context via the React component tree.' },

      { type: 'heading', content: 'Step 2 — Authentication: OIDC / JWT Flow at Gateway' },
      { type: 'paragraph', content: 'HighRadius uses OpenID Connect (OIDC) for authentication. The identity service is a separate microservice. When a user is unauthenticated, Wattpm Gateway redirects the browser to the OIDC provider. After login, the provider redirects back with an authorization code. The Gateway exchanges the code for an ID token + access token and writes an HttpOnly session cookie. Next.js Standalone never handles authentication.' },
      { type: 'list', items: [
        '1. User requests /reconciliation — no hr_session cookie present',
        '2. Wattpm Gateway auth plugin detects missing session → 302 redirect to identity-service OIDC /authorize endpoint',
        '3. User authenticates at identity-service (SSO, SAML, or credentials)',
        '4. Identity service redirects back to Wattpm: /api/auth/callback?code=AUTH_CODE',
        '5. Gateway exchanges AUTH_CODE → POST /token at identity-service',
        '6. Identity service returns: id_token (JWT), access_token, refresh_token',
        '7. Gateway validates id_token signature against JWKS endpoint',
        '8. Gateway writes HttpOnly hr_session cookie with encrypted session (user + access_token)',
        '9. Gateway caches RBAC roles in Redis for 5 minutes (key: rbac:{token_suffix})',
        '10. Gateway reverse-proxies the original /reconciliation request to Next.js Standalone (:3001)',
      ]},
      { type: 'code', language: 'typescript', content: `// bff/plugins/auth.ts
import type { FastifyPluginAsync } from 'wattpm';
import { redis } from './redis';
import { verifyJWT, exchangeCode, fetchJWKS } from '../lib/oidc';

const OIDC_ISSUER      = process.env.OIDC_ISSUER_URL!;
const OIDC_CLIENT_ID   = process.env.OIDC_CLIENT_ID!;
const OIDC_REDIRECT    = process.env.OIDC_REDIRECT_URI!;
const RBAC_TTL         = 300; // 5 min

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.get('/api/auth/callback', async (req, reply) => {
    const { code, state } = req.query as { code: string; state: string };
    const { id_token, access_token } = await exchangeCode({
      issuer: OIDC_ISSUER, clientId: OIDC_CLIENT_ID,
      redirectUri: OIDC_REDIRECT, code,
    });
    const jwks   = await fetchJWKS(\`\${OIDC_ISSUER}/.well-known/jwks.json\`);
    const claims = await verifyJWT(id_token, jwks);
    reply
      .setCookie('hr_session', encrypt({ userId: claims.sub, accessToken: access_token }), {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/',
      })
      .redirect(state ?? '/');
  });

  app.addHook('preHandler', async (req, reply) => {
    const raw = req.cookies['hr_session'];
    if (!raw) {
      return reply.redirect(\`\${OIDC_ISSUER}/authorize?client_id=\${OIDC_CLIENT_ID}&redirect_uri=\${OIDC_REDIRECT}&response_type=code&scope=openid+profile+email&state=\${req.url}\`);
    }
    const { userId, accessToken } = decrypt(raw);
    const cacheKey = \`rbac:\${accessToken.slice(-16)}\`;
    const cached   = await redis.get(cacheKey);
    req.user = cached ? JSON.parse(cached) : await resolveRoles(userId, accessToken);
    if (!cached) await redis.setex(cacheKey, RBAC_TTL, JSON.stringify(req.user));
  });
};` },
      { type: 'callout', variant: 'tip', title: 'OIDC decouples auth from product code', content: 'The R2R product team never writes auth code. Wattpm Gateway handles the full OIDC lifecycle. Product pages only receive pre-validated context — they never see tokens or OIDC redirects.' },

      { type: 'heading', content: 'Step 3 — User Details API via Wattpm' },
      { type: 'paragraph', content: 'After authentication, Next.js RSC server components call fetch("/api/user/me"). This routes to Wattpm\'s user API handler. Wattpm fetches user profile data (name, email, preferences, org) from user-service using the access token and returns a typed response. Redis caches the profile to avoid re-fetching on every RSC render.' },
      { type: 'code', language: 'typescript', content: `// bff/routes/user.ts
import type { FastifyPluginAsync } from 'wattpm';
import { redis } from '../plugins/redis';

const USER_PROFILE_TTL = 600; // 10 min

export const userRoutes: FastifyPluginAsync = async (app) => {
  app.get('/api/user/me', async (req, reply) => {
    const { userId, accessToken } = req.user;
    const cacheKey = \`user:profile:\${userId}\`;
    const cached   = await redis.get(cacheKey);
    if (cached) return reply.send(JSON.parse(cached));

    const profile = await fetch(\`\${process.env.USER_SERVICE_URL}/users/\${userId}\`, {
      headers: { Authorization: \`Bearer \${accessToken}\` },
    }).then(r => r.json());

    await redis.setex(cacheKey, USER_PROFILE_TTL, JSON.stringify(profile));
    return reply.send(profile);
  });
};` },

      { type: 'heading', content: 'Step 4 — Business Data via GraphQL' },
      { type: 'paragraph', content: 'Domain data (reconciliation records, journal entries, close management) flows through GraphQL. The BFF exposes a single /graphql endpoint that proxies to the appropriate domain microservice. GraphQL Code Generator produces typed operations — the RSC layer never writes raw fetch strings.' },
      { type: 'code', language: 'typescript', content: `// bff/operations/reconciliation.graphql → generates typed SDK
query GetReconciliationItems($orgId: ID!, $period: String!) {
  reconciliationItems(orgId: $orgId, period: $period) {
    id accountCode status variance lastModifiedBy lastModifiedAt
  }
}

// app/(finance)/reconciliation/data/reconciliation.ts
import { getSdk } from '../../../bff/generated/types';
import { graphqlClient } from '../../../bff/lib/client';

export async function fetchReconciliationData() {
  const sdk = getSdk(graphqlClient);
  const { reconciliationItems } = await sdk.GetReconciliationItems({
    orgId: process.env.NEXT_PUBLIC_ORG_ID!,
    period: new Date().toISOString().slice(0, 7),
  });
  return reconciliationItems;
}` },
      { type: 'callout', variant: 'info', title: 'Type safety end to end', content: 'The GraphQL schema lives in bff/schema.graphql. Code Generator produces TypeScript types in bff/generated/types.ts. RSC pages import those types — a schema change that breaks a page surfaces as a TypeScript error before it reaches CI.' },

      { type: 'heading', content: 'Microservice API Registry' },
      { type: 'table', headers: ['Microservice', 'Protocol', 'BFF Endpoint', 'Auth', 'Cache TTL'], rows: [
        ['identity-service',       'OIDC / REST', '/api/auth/*',              'OIDC Authorization Code flow', 'RBAC: 5 min Redis'],
        ['user-service',           'REST (JSON)', '/api/user/*',              'Bearer access_token',          '10 min Redis'],
        ['reconciliation-service', 'GraphQL',     '/graphql (reconciliation)','Bearer access_token',          'TanStack Query stale-while-revalidate'],
        ['journal-service',        'GraphQL',     '/graphql (journal)',        'Bearer access_token',          'TanStack Query stale-while-revalidate'],
        ['close-management-service','GraphQL',    '/graphql (close)',          'Bearer access_token',          'TanStack Query stale-while-revalidate'],
        ['notification-service',   'REST / SSE',  '/api/notifications',       'Bearer access_token',          'No cache (real-time)'],
      ]},
      { type: 'callout', variant: 'warning', title: 'BFF is the only gateway', content: 'RSC pages and client components never call microservices directly. All traffic goes through BFF routes or Next.js route handlers that proxy to BFF. This keeps tokens server-side and gives the platform team a single audit point.' },

      { type: 'heading', content: 'How ui-nexus Shapes Code Quality' },
      { type: 'paragraph', content: 'The monorepo architecture is not just an organisational choice — it directly controls what developers can write, what ships to users, and how fast defects are caught. Every layer has automated enforcement that removes the possibility of bypassing quality gates.' },
      { type: 'table', headers: ['Concern', 'Mechanism', 'Where enforced', 'What happens without it'], rows: [
        ['Type safety across all layers',    'TypeScript strict + @hr/tsconfig',               'ui-nexus config → every downstream package + R2R', 'Implicit any spreads, runtime crashes reach users'],
        ['Design consistency',              'HiRa tokens from @hr/tokens, Untitled UI in @hr/ui', 'Tailwind config gate + visual regression',      'Pixel drift across product surfaces'],
        ['No bad primitives reaching R2R',  'Playwright visual regression in ui-nexus CI',     'Blocks merge if screenshot diff > threshold',      'A padding change breaks 20 tables in R2R silently'],
        ['Auth token never in browser',     'BFF owns all token logic, HttpOnly cookie',       'CODEOWNERS on bff/ + shell enforces RSC pattern',  'Token leakable via XSS or JS bundle inspection'],
        ['RBAC cannot be skipped',          'RBACBoundary mandatory inside @hr/shell',         'CODEOWNERS on layout.tsx blocks shell removal',    'Product team accidentally ships unguarded page'],
        ['Dependency drift prevented',      'Turborepo (within ui-nexus) + Dependabot (R2R)',  'Turborepo task graph + auto-PR on every pkg bump', 'Repos diverge, integration breaks discovered late'],
        ['Bundle bloat prevented',          'Bundler Analyzer size gate in ui-nexus CI',       'Blocks publish above budget',                      'Primitive layer grows silently, LCP degrades'],
        ['Linting uniform',                 'Oxlint (<1s) + @hr/oxlint-config',               'Pre-commit via Lefthook + CI across both repos',   'Rule inconsistencies across teams'],
        ['i18n completeness',               'i18n-check in ui-nexus platform workspace CI',    'Blocks publish if translation key missing',        'English strings appear in non-English locales'],
      ]},

      { type: 'heading', content: 'Developer Journey Map' },
      { type: 'list', items: [
        'Developer edits Button.tsx in ui-nexus/packages/ui/core/',
        'Lefthook pre-commit: Oxlint (<1s) + Oxfmt + Commitlint enforce format',
        'PR opened → CodeRabbit review + Vitest browser tests run',
        'Playwright visual regression diffs screenshot against baseline — any pixel change surfaces',
        'Merge → Turborepo rebuilds @hr/ui, then @hr/shell (depends on @hr/ui)',
        'Semantic Release bumps @hr/ui and @hr/shell independently',
        'Dependabot opens PR in record-to-report: "bump @hr/ui + @hr/shell"',
        'R2R CI: full Playwright E2E financial flows + Lighthouse LCP < 2.5s gate pass',
        'Auto-merged → CDN deploy',
        'Checkly synthetic monitors verify /reconciliation and /journal-entry live flows',
        'User sees updated button — 0 manual coordination between platform and R2R teams required',
      ]},
      { type: 'callout', variant: 'tip', title: 'One monorepo, one PR, automated cascade', content: 'Consolidating config + UI + platform into ui-nexus eliminates cross-repo Dependabot noise for every primitive change. The only external auto-PR is the final R2R bump — one gate, clean history.' },

      { type: 'heading', content: 'Session & Token Lifecycle' },
      { type: 'table', headers: ['Token', 'Where stored', 'Lifetime', 'Who reads it', 'Invalidation'], rows: [
        ['OIDC id_token (JWT)',    'BFF memory only — never stored after validation', '10 min (exp claim)', 'BFF auth plugin once on callback', 'Expires, or OIDC provider revokes'],
        ['access_token',          'Encrypted in hr_session HttpOnly cookie (BFF sets)', '15 min typical', 'BFF on every request — never client JS', 'Cookie cleared on logout, or token expires'],
        ['refresh_token',         'Encrypted in hr_session cookie', '24h–30d (per OIDC config)', 'BFF auth plugin when access_token expires', 'Revoked by identity-service on logout'],
        ['RBAC roles cache',      'Redis key: rbac:{token_suffix}', '5 min TTL', 'BFF preHandler hook', 'Redis TTL expires or logout flushes key'],
        ['User profile cache',    'Redis key: user:profile:{userId}', '10 min TTL', 'BFF /api/user/me route', 'Redis TTL expires; cache-busted on profile update'],
      ]},
    ],
  },

  // ── HLP Roadmap ───────────────────────────────────────────────────────────
  {
    id: 'roadmap',
    title: 'HLP Master Roadmap',
    category: 'Roadmap',
    icon: '🗺️',
    description: 'High Level Plan — 15 architectural milestones from boilerplate setup to production deployment. Covers all four implementation tracks: Boilerplate, Untitled UI, ui-nexus monorepo, and Security.',
    sections: [
      { type: 'paragraph', content: 'The HighRadius G4 Frontend Architecture program is tracked as a single HLP (High Level Plan) with 15 master milestones. Each milestone corresponds to a delivery track. Items 1–10 cover the core architecture delivery. Items 11–15 cover security and authentication hardening. Every item links to a detailed sub-track with LLP (Low Level Plan) tasks.' },
      { type: 'callout', variant: 'info', title: 'HLP → LLP structure', content: 'Each HLP item is a deliverable milestone. The LLP for each item is tracked in its own sub-track document — Boilerplate, Component Library, and Security sections in this portal. Status "Pending" means planned but not yet started. "Blocked" means requires prerequisite or immediate attention.' },
      { type: 'heading', content: 'Master HLP — All 15 Milestones' },
      { type: 'hlpTracker', hlpItems: [
        { id: 1,  name: 'NextJS Boilerplate Setup',                   description: 'Configure foundational Next.js 16 environment with App Router, Turbopack, TypeScript, Tailwind CSS, and 38 essential dev tools.',                                             status: 'blocked',     track: 'Boilerplate'   },
        { id: 2,  name: 'Untitled UI Setup',                          description: 'Integrate and expose Untitled UI components as a consumable @highradius/ui package with full HiRa theming.',                                                                  status: 'blocked',     track: 'UI Nexus'      },
        { id: 3,  name: 'ui-nexus Monorepo Setup',                   description: 'Establish unified monorepo with config, ui, and platform workspaces. Configure Turborepo pipeline, pnpm workspaces, and CI.',                                                  status: 'blocked',     track: 'UI Nexus'      },
        { id: 4,  name: 'core_ui Package Setup inside ui-nexus',      description: 'Develop foundational UI components — 80+ base components using Untitled UI within the ui workspace.',                                                                         status: 'pending',     track: 'Component Library' },
        { id: 5,  name: 'aps_ui Package Setup inside ui-nexus',       description: 'Build advanced feature-rich business components — Enhanced Grids, Renderer System, Zustand stores, and API cache management in the platform workspace.',                      status: 'pending',     track: 'Component Library' },
        { id: 6,  name: 'Platform Shell Creation',                    description: 'Create HighradiusPlatformShell — the mandatory wrapper integrating Sentry, PostHog, Arcjet, i18n, and RBAC boundary for all product pages.',                                  status: 'pending',     track: 'UI Nexus'      },
        { id: 7,  name: 'Bootstrapping Boilerplate for Product Consumption', description: 'Provide a ready-to-use Next.js template for product teams — pre-wired with all @highradius/* packages, T3 Env, and CODEOWNERS.',                                      status: 'pending',     track: 'Boilerplate'   },
        { id: 8,  name: 'Product Use Cases Implementation',           description: 'Implement standard product views — Listing pages, Detail pages, and CRUD flows using @hr/data-table, @hr/forms, and @hr/shell.',                                               status: 'pending',                          },
        { id: 9,  name: 'Product Migration Help',                     description: 'Assist product teams migrating to the new architecture — build custom bridging components and provide migration runbooks.',                                                    status: 'pending',                          },
        { id: 10, name: 'Production Deployment of Product',           description: 'Execute final deployment to production — CDN integration, Lighthouse CI gates, Checkly synthetic monitors, and Sentry source maps.',                                          status: 'pending',                          },
        { id: 11, name: 'OIDC Session Management Implementation',     description: 'Implement OIDC session handling via domain URL-based cookies injected by the BFF. HttpOnly, encrypted, subdomain-safe.',                                                      status: 'blocked',     track: 'Security'      },
        { id: 12, name: 'RBAC Integration via DSL APIs',              description: 'Integrate Role-Based Access Control using existing DSL APIs. BFF resolves roles, injects into RBACBoundary in the shell.',                                                    status: 'blocked',     track: 'Security'      },
        { id: 13, name: 'Session Security and Validation Deep Analysis', description: 'Deep analysis on session security — token expiration, secure cookie handling across subdomains, token refresh strategy.',                                                   status: 'blocked',     track: 'Security'      },
        { id: 14, name: 'RBAC Policy Enforcement at UI Level',        description: 'Implement frontend route guards and component-level visibility toggles based on RBAC policies. No opt-out from shell enforcement.',                                           status: 'blocked',     track: 'Security'      },
        { id: 15, name: 'E2E Testing for Authentication and Authorization', description: 'Develop end-to-end Playwright tests for OIDC login flows, session persistence, token expiry, and RBAC enforcement at all route levels.',                               status: 'blocked',     track: 'Security'      },
      ] },
      { type: 'heading', content: 'Track Summary' },
      { type: 'table', headers: ['Track', 'HLP Items', 'Focus', 'Doc Link'], rows: [
        ['Boilerplate',       '#1, #7',       'Next.js 16 setup — 38 configuration items',              'Boilerplate Guide'],
        ['Untitled UI',       '#2',           'Design system package — 21 setup items',                 'Component Library'],
        ['UI Nexus Monorepo', '#3, #4, #5, #6', 'Monorepo — UI Config (35), Core UI (80+), APS UI (8)', 'Component Library'],
        ['Security & Auth',   '#11–#15',      'OIDC, RBAC, session security — 5 items',                'Auth & Security'],
        ['Product Delivery',  '#8, #9, #10',  'Migration, use cases, production',                      'R2R — Record to Report'],
      ]},
      { type: 'callout', variant: 'warning', title: 'All security items marked blocked', content: 'HLP items 11–15 are all marked Not Started / High Risk. These are prerequisite to any production deployment. Security architecture must be designed before product teams begin building pages that require OIDC login.' },
      { type: 'heading', content: 'Delivery Sequence' },
      { type: 'list', items: [
        'Phase 1 — Foundation: HLP #1 (Boilerplate) + #3 (ui-nexus setup). No product code until these land.',
        'Phase 2 — Design System: HLP #2 (Untitled UI) + #4 (core_ui 80+ components). Storybook published.',
        'Phase 3 — Platform Layer: HLP #5 (aps_ui) + #6 (Platform Shell). Shell gates all product pages.',
        'Phase 4 — Security: HLP #11–#15. OIDC, RBAC, session hardening in parallel with Phase 3.',
        'Phase 5 — Product Onboarding: HLP #7 (boilerplate template) + #8 (use cases). R2R team builds.',
        'Phase 6 — Production: HLP #9 (migration) + #10 (production deploy). Checkly + Lighthouse gates.',
      ]},
    ],
  },

  // ── Boilerplate ───────────────────────────────────────────────────────────
  {
    id: 'boilerplate',
    title: 'NextJS Boilerplate',
    category: 'Setup',
    icon: '⚙️',
    description: 'HLP Track — 38 configuration items for the foundational Next.js 16 boilerplate consumed by all product teams. Covers framework, security, DX tools, testing, monitoring, and CI/CD.',
    sections: [
      { type: 'paragraph', content: 'The NextJS Boilerplate is the shared starting point for every HighRadius product application. It is a ready-to-fork Next.js 16 repository pre-configured with 38 tools and conventions. Product teams fork the boilerplate and start building product pages immediately — they do not set up tooling from scratch. The boilerplate is also used as the foundation for record-to-report.' },
      { type: 'callout', variant: 'tip', title: 'Repository already created', content: 'HLP #1 sub-item "Creating Repository" is marked Completed. All other 37 boilerplate items remain to be configured into the repo.' },
      { type: 'heading', content: 'Core Framework' },
      { type: 'hlpTracker', hlpItems: [
        { id: 1,  name: 'Next.js 16 with App Router and Turbopack',        description: 'File-based routing, RSC-first architecture, Turbopack for fast local dev builds.',    status: 'pending' },
        { id: 2,  name: 'TypeScript 6 with strict mode',                    description: 'Strict TS config inherited from @highradius/tsconfig. No implicit any.',              status: 'pending' },
        { id: 3,  name: 'Tailwind CSS 4 utility classes',                   description: 'Extended with HiRa design tokens from @highradius/tailwind-config.',                  status: 'pending' },
        { id: 4,  name: 'React 19 with React Compiler',                     description: 'Replaces manual useMemo/useCallback. Compiler handles re-render optimisation.',       status: 'pending' },
        { id: 5,  name: 'Multi-language (i18n) with next-intl and Crowdin', description: 'next-intl for runtime i18n, Crowdin for translation management, i18n-check in CI.',   status: 'pending' },
        { id: 6,  name: 'Type-safe environment variables with T3 Env',      description: 'All env vars declared in env.ts — fails fast at startup if required vars missing.',   status: 'pending' },
        { id: 7,  name: 'Absolute imports with @/ prefix',                  description: 'Clean import paths: @/components/Button instead of ../../../components/Button.',     status: 'pending' },
      ] },
      { type: 'heading', content: 'Security & Monitoring' },
      { type: 'hlpTracker', hlpItems: [
        { id: 8,  name: 'HTTP security headers + WAF',        description: 'Strict-Transport-Security, X-Frame-Options, CSP, Permissions-Policy. Fintech hardened.',        status: 'blocked' },
        { id: 9,  name: 'Arcjet — Bot detection and rate limiting', description: 'Shield WAF, bot detection, attack protection. Injected in @hr/shell.',               status: 'blocked' },
        { id: 10, name: 'Sentry — PII-safe error monitoring',  description: 'Sampling tuned for production. Source maps uploaded. PII scrubbing rules configured.',       status: 'blocked' },
        { id: 11, name: 'Sentry Spotlight (local dev)',        description: 'Local error dashboard — see Sentry events during development without a remote project.',     status: 'pending' },
        { id: 12, name: 'PostHog analytics',                   description: 'Product analytics provider in @hr/shell. Product teams call typed event wrappers.',         status: 'pending' },
        { id: 13, name: 'LogTape + Better Stack structured logging', description: 'Structured server-side logging context injected at shell level. Shipped to Better Stack.', status: 'pending' },
      ] },
      { type: 'heading', content: 'DX Tooling' },
      { type: 'hlpTracker', hlpItems: [
        { id: 14, name: 'Oxlint via Ultracite (Rust-speed linting)',   description: 'Ultracite preset + HiRa lint rules. Replaces ESLint for 100x faster CI feedback.',   status: 'pending' },
        { id: 15, name: 'Oxfmt (Rust-speed formatting)',               description: 'Replaces Prettier. Sub-millisecond format checks on every file change.',             status: 'pending' },
        { id: 16, name: 'Lefthook git hooks',                          description: 'Replaces Husky. Shareable config from @highradius/lefthook-config. Pre-commit lint + format.', status: 'pending' },
        { id: 17, name: 'Knip — dead code detection',                  description: 'Identifies unused files, exports, and dependencies. Runs in CI, blocks merges.',     status: 'pending' },
        { id: 18, name: 'AI coding agent instructions (CLAUDE.md)',    description: 'Instructions for Claude Code, Codex, Cursor, OpenCode, Copilot embedded in repo.',   status: 'pending' },
        { id: 19, name: 'VSCode configuration (debug/tasks/extensions)', description: 'Shared .vscode/ folder — debug launch configs, recommended extensions, tasks.',   status: 'pending' },
        { id: 20, name: 'Bundle analyzer',                             description: 'webpack-bundle-analyzer + esbuild-visualizer for bundle size visibility.',           status: 'pending' },
      ] },
      { type: 'heading', content: 'Testing' },
      { type: 'hlpTracker', hlpItems: [
        { id: 21, name: 'Vitest browser mode',        description: 'Unit + integration tests running in real browser context via Playwright browser runtime.',           status: 'pending' },
        { id: 22, name: 'Playwright E2E',             description: 'Full user journey tests. Critical financial flows (reconciliation, journal entry) must pass before deploy.', status: 'pending' },
        { id: 23, name: 'Code coverage with Codecov', description: '80% minimum coverage gate enforced in CI. Coverage reports posted on every PR.',                    status: 'pending' },
        { id: 24, name: 'Google Lighthouse CI',       description: 'Performance gate: LCP < 2.5s, CLS < 0.1, TBT < 200ms. Blocks PR if regression detected.',          status: 'pending' },
        { id: 25, name: 'Monitoring as Code with Checkly', description: 'Synthetic browser checks on production. Finance page journeys verified post-deploy.',          status: 'pending' },
      ] },
      { type: 'heading', content: 'CI/CD & Release' },
      { type: 'hlpTracker', hlpItems: [
        { id: 26, name: 'CI pipeline with GitLab Actions (build, lint, unit, E2E)', description: 'Full pipeline on every PR. Affected-only runs via Turborepo content hash.', status: 'pending' },
        { id: 27, name: 'AI-powered code reviews with CodeRabbit',  description: 'Automated code review on every PR. Reviews Dependabot bumps for breaking changes.',  status: 'pending' },
        { id: 28, name: 'Automatic dependency updates with Dependabot', description: 'Watches all @highradius/* packages. Patch = auto-merge. Minor/major = human review.', status: 'pending' },
        { id: 29, name: 'SEO metadata, JSON-LD, and Open Graph tags', description: 'Structured metadata for all public-facing pages. sitemap.xml and robots.txt generated.', status: 'pending' },
        { id: 30, name: 'CDN Integration with CI/CD',               description: 'Assets served from CDN. CI/CD uploads and invalidates cache on every deploy.',        status: 'pending' },
      ] },
      { type: 'heading', content: 'Optional Features' },
      { type: 'callout', variant: 'info', title: 'Optional — enable per product', content: 'These three features are disabled in the base boilerplate. Product teams opt in by uncommenting config and adding environment variables.' },
      { type: 'hlpTracker', hlpItems: [
        { id: 31, name: 'Redis for caching metadata', description: 'Redis client wired into BFF. Used for RBAC cache (5 min TTL) and user profile cache (10 min TTL).', status: 'pending' },
        { id: 32, name: 'GraphQL API with GraphQL Code Generator', description: 'Schema-first typed GraphQL. Codegen generates typed hooks and operations from .graphql files.', status: 'pending' },
        { id: 33, name: 'Wattpm (wattpm) for Node.js BFF',         description: 'Fastify-based BFF between Next.js and microservices. Handles auth, caching, and GraphQL proxy.', status: 'pending' },
      ] },
    ],
  },

  // ── Component Library ─────────────────────────────────────────────────────
  {
    id: 'component-catalog',
    title: 'Component Library',
    category: 'Components',
    icon: '🧩',
    description: 'Full component inventory across all three ui-nexus workspaces — Untitled UI integration (21 setup items), Core UI base components (80+), Basic Grid (AG Grid wrapper), and APS UI feature components.',
    sections: [
      { type: 'paragraph', content: 'The HighRadius component library lives entirely inside the ui-nexus monorepo across two workspaces: ui (pure presentational components) and platform (feature-rich components with state and data). Every component starts from an Untitled UI base and is extended with HiRa tokens and HighRadius-specific behaviour. Zero product business logic enters the component layer.' },
      { type: 'callout', variant: 'tip', title: 'Untitled UI is the foundation — not the ceiling', content: 'Every component starts from an Untitled UI primitive. HiRa tokens override the visual layer. HighRadius-specific variants are added as extensions. If an Untitled UI component does the job, use it directly — do not rebuild from scratch.' },

      { type: 'heading', content: 'Untitled UI Package Setup (HLP #2)' },
      { type: 'paragraph', content: 'Before any component can be built, the @highradius/ui package itself must be scaffolded with full DX tooling. These 21 setup items mirror the boilerplate toolchain but are scoped to the library package.' },
      { type: 'componentGrid', componentCategories: [
        { name: 'Package Tooling (21 items)',  color: 'violet', items: ['TypeScript 6 strict', 'Tailwind CSS 4', 'React 19 Compiler', 'AI agent instructions', 'next-intl i18n', 'T3 Env', 'ESLint', 'Prettier', 'Lefthook', 'Knip', 'Vitest browser mode', 'Playwright E2E', 'GitLab CI (build/lint/unit/E2E/publish)', 'CodeRabbit', 'Codecov', 'Checkly', 'Absolute imports', 'VSCode config', 'Dependabot', 'Bundle analyzer', 'Lighthouse Score', 'Export all Untitled UI components'] },
      ] },

      { type: 'heading', content: 'UI Nexus — UI Config Workspace (35 items)' },
      { type: 'paragraph', content: 'Before component code, the UI Config workspace sets up all shared tooling that every workspace inherits. These 35 items configure the monorepo infrastructure.' },
      { type: 'componentGrid', componentCategories: [
        { name: 'Monorepo Infrastructure', color: 'violet', items: ['TypeScript 6 strict', 'Tailwind CSS 4', 'AI agent instructions', 'React 19 Compiler', 'next-intl', 'T3 Env', 'ESLint', 'Prettier', 'Lefthook', 'Knip', 'Vitest', 'Playwright', 'GitLab CI', 'CodeRabbit', 'Codecov', 'Checkly', 'Absolute imports', 'VSCode config', 'Dependabot', 'Bundle analyzer', 'Lighthouse Score', 'Storybook'] },
        { name: 'Build Tooling', color: 'blue', items: ['Turborepo + Monorepo config', '@changesets/cli', '@vercel/style-guide', 'chalk', 'concurrently', 'cross-env', 'esbuild-visualizer', 'express', 'http-proxy-middleware', 'nodemon', 'rollup-plugin-visualizer', 'source-map-explorer', 'turbo', 'webpack-bundle-analyzer'] },
      ] },

      { type: 'heading', content: 'Core UI — Base Components (80+)' },
      { type: 'paragraph', content: 'The core_ui package (HLP #4) contains all presentational base components. Components are stateless, tree-shakeable, and use only @highradius/tokens for styling. No Zustand, no API calls, no business logic.' },
      { type: 'componentGrid', componentCategories: [
        { name: 'Form & Input',  color: 'blue', items: ['Input Text Field', 'Input Slider', 'Input Stepper', 'RadioButton', 'RadioButtonGroup', 'Toggle Switch', 'Search', 'Time Picker', 'Picklist', 'DynamicDropDown'] },
        { name: 'Display & Typography', color: 'blue', items: ['Typography', 'Link', 'Tooltip', 'Badge', 'KeyValuePair', 'Progress Bar', 'Loader'] },
        { name: 'Layout & Navigation', color: 'cyan', items: ['Accordion', 'Breadcrumbs', 'Card', 'Vertical Tabs', 'Page Header', 'L2 Header', 'L2 Footer', 'Global Header', 'Global Footer', 'Panel', 'Drawer', 'Bento'] },
        { name: 'Overlays & Feedback', color: 'cyan', items: ['Modal', 'Dialog', 'Banner', 'Toast Notification', 'NotificationPanel', 'Wizard', 'WorkFlow Card', 'Workflow Progress', 'GroupActionProgressBar', 'EmptyAndError', 'ErrorBoundary'] },
        { name: 'Data & Content', color: 'emerald', items: ['Summary Grid', 'Column Organiser', 'List View', 'Tree', 'RuleBuilder', 'RuleViewer', 'Pagination', 'Sort Panel', 'TransformationGrid', 'Decision Table', 'Parameters Component', 'Schedular Component', 'Permission'] },
        { name: 'Rich Content', color: 'emerald', items: ['RichTextEditor', 'File Uploader', 'DocumentViewer', 'PDFViewer', 'TiffViewer', 'ImageViewer', 'AccordionForm'] },
        { name: 'Email & Collaboration', color: 'amber', items: ['Email List', 'Email Rule Viewer', 'Email Thread', 'EmailComposer', 'EmailMenu', 'Comments', 'Mentionsinput'] },
        { name: 'Actions', color: 'amber', items: ['Primary Button', 'Secondary Button', 'Tertiary Button'] },
      ] },

      { type: 'heading', content: 'Basic Grid — AG Grid Wrapper (HLP #4 sub-tasks)' },
      { type: 'paragraph', content: 'The Basic Grid is an AG Grid wrapper that integrates Untitled UI components as cell renderers. It provides a standard HighRadius grid experience used across all product pages.' },
      { type: 'hlpTracker', hlpItems: [
        { id: 109, name: 'Create basic grid packages',                                description: 'Set up the @highradius/data-table package scaffold with AG Grid dependency.', status: 'pending' },
        { id: 110, name: 'Enable dynamic module registration',                        description: 'Allow product teams to register custom column types and cell renderers dynamically.', status: 'pending' },
        { id: 111, name: 'License key registration',                                  description: 'AG Grid Enterprise license key management — injected at shell level, not per-product.', status: 'pending' },
        { id: 112, name: 'Prop support for module registration',                      description: 'Expose a standardised prop interface for registering AG Grid modules.',           status: 'pending' },
        { id: 113, name: 'Common grid styling layer',                                 description: 'CSS custom properties matching HiRa tokens override AG Grid default theme.',    status: 'pending' },
        { id: 114, name: 'Basic grid wrapper layer',                                  description: 'React wrapper component abstracting AG Grid lifecycle and configuration.',       status: 'pending' },
        { id: 115, name: 'Register Untitled UI components + CSS Vars',               description: 'AG Grid cell renderer + header renderer using @hr/ui components and tokens.',   status: 'pending' },
        { id: 116, name: 'Prop matching layer (AG Grid ↔ HiRa prop signature)',       description: 'Adapter layer normalising AG Grid prop names to HiRa component conventions.',   status: 'pending' },
        { id: 117, name: 'Render Basic Grid with Untitled UI + basic features',       description: 'Working grid with sort, filter, pagination, and selection using HiRa components.', status: 'pending' },
      ] },

      { type: 'heading', content: 'APS UI — Feature Components (HLP #5)' },
      { type: 'paragraph', content: 'The aps_ui layer (platform workspace in ui-nexus) adds business intelligence on top of core_ui components. These components manage server state, local UI state, and API integration. They are the building blocks for product pages.' },
      { type: 'componentGrid', componentCategories: [
        { name: 'Feature Components (APS UI)', color: 'cyan', items: ['Enhanced Grid with CRUD APIs', 'Zustand Store Integration', 'Renderer System', 'State Management (Zustand factories)', 'Server-side Fetch (Next.js RSC)', 'Client-side Data (SWR)', 'API Integration Layer', 'Cache Management (Redis + TanStack Query)'] },
      ] },
      { type: 'hlpTracker', hlpItems: [
        { id: 120, name: 'Enhanced Grids with CRUD + Zustand',           description: 'Build feature grids with create/read/update/delete APIs and Zustand store for UI state persistence.', status: 'pending' },
        { id: 121, name: 'Server-side data fetch in Next.js (RSC)',       description: 'Use Next.js fetch() in RSC pages for server-side data — enables caching, deduplication, and CDN edge.', status: 'pending' },
        { id: 122, name: 'Client-side data with SWR',                     description: 'Use SWR for client-side API calls that need real-time updates or user-triggered refetches.', status: 'pending' },
        { id: 123, name: 'Enhanced Grids (full feature set)',             description: 'Row grouping, aggregation, inline edit, bulk actions, column persistence across sessions.',   status: 'pending' },
        { id: 124, name: 'Zustand store factories',                       description: 'Pre-built Zustand store templates for grid state, form state, and UI preferences.',          status: 'pending' },
        { id: 125, name: 'Renderer System',                               description: 'Pluggable cell renderer system — product teams register custom renderers without forking the grid.', status: 'pending' },
        { id: 126, name: 'State Management patterns',                     description: 'Documented patterns for when to use RSC, SWR, Zustand, and TanStack Query respectively.', status: 'pending' },
        { id: 127, name: 'API Integration + Cache Management',            description: 'Unified API client with Redis TTL strategy, stale-while-revalidate, and optimistic update helpers.', status: 'pending' },
      ] },
    ],
  },

  // ── Auth & Security ───────────────────────────────────────────────────────
  {
    id: 'auth-security',
    title: 'Auth & Security',
    category: 'Security',
    icon: '🔐',
    description: 'HLP items 11–15 — OIDC session management, RBAC integration via DSL APIs, session security deep analysis, UI-level policy enforcement, and E2E auth testing. All marked high priority.',
    sections: [
      { type: 'paragraph', content: 'Security is a first-class architectural concern in the HighRadius G4 frontend. All five security HLP items are marked "Not Started / High Risk" and must be resolved before any product reaches production. The security architecture splits responsibility between the BFF (token handling, RBAC resolution) and the shell (UI enforcement). Product team code never touches auth tokens directly.' },
      { type: 'callout', variant: 'danger', title: 'All 5 security items are blocked — prerequisite to production', content: 'HLP items 11–15 must be completed before any product team deploys to production. OIDC and RBAC architecture must be agreed and implemented first. Do not skip or defer these items.' },

      { type: 'heading', content: 'Security HLP Items' },
      { type: 'hlpTracker', hlpItems: [
        { id: 11, name: 'OIDC Session Management Implementation',     description: 'Implement OIDC session handling using domain URL-based HttpOnly cookies injected by the BFF. Covers callback, token exchange, cookie write, and redirect.', status: 'blocked', track: 'BFF' },
        { id: 12, name: 'RBAC Integration via DSL APIs',              description: 'Integrate RBAC using existing DSL APIs. BFF resolves user roles on every request and injects them into the RBACBoundary component in @hr/shell.',           status: 'blocked', track: 'BFF + Shell' },
        { id: 13, name: 'Session Security and Validation Deep Analysis', description: 'Deep analysis covering: token expiration handling, secure cookie attributes (HttpOnly/Secure/SameSite), subdomain cookie scope, and token refresh strategy.', status: 'blocked', track: 'BFF' },
        { id: 14, name: 'RBAC Policy Enforcement at UI Level',        description: 'Frontend route guards using Next.js middleware + component-level visibility toggles via RBACBoundary in @hr/shell. No opt-out mechanism.',             status: 'blocked', track: 'Shell' },
        { id: 15, name: 'E2E Testing for Authentication and Authorization', description: 'Playwright tests covering: OIDC login flow, session cookie persistence, token expiry + refresh, RBAC route guard blocking, and logout flow.',       status: 'blocked', track: 'E2E' },
      ] },

      { type: 'heading', content: 'OIDC Authentication Architecture' },
      { type: 'paragraph', content: 'HighRadius uses OpenID Connect (OIDC) as the identity protocol. The identity service is a separate microservice. The Wattpm BFF is the sole actor that touches tokens — Next.js server components receive only a resolved session object (user ID, roles). The browser never receives raw tokens.' },
      { type: 'list', items: [
        'User hits any R2R page — BFF checks for hr_session cookie',
        'No cookie → BFF issues 302 redirect to identity-service /authorize',
        'User authenticates (SSO / SAML / credentials) at identity-service',
        'Identity-service redirects back to /api/auth/callback?code=AUTH_CODE',
        'BFF exchanges code for id_token + access_token + refresh_token',
        'BFF validates id_token signature against JWKS endpoint',
        'BFF writes encrypted HttpOnly hr_session cookie (access_token + user claims)',
        'BFF caches RBAC roles in Redis (TTL 5 min, key: rbac:{token_suffix})',
        'User redirected to original page — authenticated and RBAC-resolved',
      ]},
      { type: 'table', headers: ['Token', 'Storage', 'Lifetime', 'Who accesses it', 'Invalidation'], rows: [
        ['id_token (JWT)',   'BFF memory — never persisted',              '10 min',    'BFF auth plugin — once at callback',       'Expires naturally'],
        ['access_token',     'Encrypted in hr_session HttpOnly cookie',   '15 min',    'BFF on every request',                     'Cookie cleared on logout or expiry'],
        ['refresh_token',    'Encrypted in hr_session HttpOnly cookie',   '24h – 30d', 'BFF auth plugin on access_token expiry',   'Revoked by identity-service on logout'],
        ['RBAC roles cache', 'Redis (rbac:{token_suffix})',               '5 min TTL', 'BFF preHandler hook',                      'TTL or logout flush'],
        ['User profile',     'Redis (user:profile:{userId})',             '10 min TTL','BFF /api/user/me',                         'TTL or profile-update event'],
      ]},

      { type: 'heading', content: 'RBAC Architecture' },
      { type: 'paragraph', content: 'Role-Based Access Control uses the existing HighRadius DSL RBAC APIs. The BFF resolves the user\'s role set on every request from Redis (or from the DSL API on cache miss). The role set is injected into the RBACBoundary component in @hr/shell. Product teams pass a single rbacRequiredRole prop to the shell — no custom guard logic needed.' },
      { type: 'table', headers: ['Layer', 'Responsibility', 'Implementation'], rows: [
        ['Identity Service',  'Issues tokens, manages user roles',      'Existing HighRadius identity-service microservice'],
        ['BFF auth plugin',   'Validates tokens, resolves RBAC roles',  'Calls DSL RBAC API, caches in Redis for 5 min'],
        ['@hr/shell',         'Enforces RBAC at UI boundary',           'RBACBoundary component, route middleware, slot visibility'],
        ['Product page',      'Declares required role as a prop',       'rbacRequiredRole="finance_admin" on PlatformShell'],
        ['No opt-out',        'Shell is enforced via CODEOWNERS',       '/app/layout.tsx locked — platform team approval required'],
      ]},

      { type: 'heading', content: 'Session Security Checklist (HLP #13)' },
      { type: 'callout', variant: 'warning', title: 'Deep analysis required before implementation', content: 'These items require a dedicated security design session. Do not implement session handling without completing this checklist first — mistakes here create production security vulnerabilities.' },
      { type: 'list', items: [
        'Cookie attributes: HttpOnly=true, Secure=true, SameSite=lax, Path=/',
        'Cookie scope: confirm subdomain coverage (e.g. .highradius.com for cross-subdomain SSO)',
        'Token expiry: access_token expires every 15 min — BFF must silently refresh using refresh_token',
        'Refresh token rotation: identity-service must issue a new refresh_token on every use (prevent replay)',
        'Token storage: NEVER localStorage or sessionStorage — HttpOnly cookie is the only acceptable storage',
        'CSRF: SameSite=lax provides protection for standard flows; add CSRF token for state-changing non-GET endpoints',
        'Logout: BFF clears cookie + calls identity-service revoke endpoint + flushes Redis keys',
        'Session fixation: regenerate session ID after authentication',
        'Clock skew: allow ±30 second tolerance in JWT exp validation',
      ]},

      { type: 'heading', content: 'UI-Level RBAC Enforcement (HLP #14)' },
      { type: 'list', items: [
        'Route guard: Next.js middleware reads session cookie — redirects to /403 if role insufficient',
        'Page guard: RBACBoundary in @hr/shell shows 403 page if rbacRequiredRole not in session roles',
        'Component visibility: useRBAC() hook returns boolean — components conditionally render action buttons',
        'No client-side trust: role enforcement at BFF + shell level, UI toggle is UX only, not security',
        'Audit trail: all RBAC denials logged via LogTape to Better Stack for security monitoring',
      ]},

      { type: 'heading', content: 'E2E Security Test Coverage (HLP #15)' },
      { type: 'list', items: [
        'Test: Login flow — OIDC redirect, callback, cookie written, user redirected to original page',
        'Test: Session persistence — page reload, new tab, same session maintained via cookie',
        'Test: Unauthenticated access — redirect to login page, no data exposed',
        'Test: Token expiry — access_token TTL reached, silent refresh via refresh_token, no user interruption',
        'Test: Logout — cookie cleared, Redis flushed, redirect to login, back button does not restore session',
        'Test: RBAC block — user with insufficient role hits guarded route → 403 page rendered',
        'Test: Role-based UI — user with read-only role does not see edit/delete buttons',
        'Test: Cross-tab logout — log out in one tab, other tabs become unauthenticated on next request',
      ]},
    ],
  },

  // ── Untitled UI Setup ───────────────────────────────────────────────
  {
    id: 'untitled-ui-setup',
    title: 'Untitled UI Setup',
    category: 'untitledui',
    icon: '🎨',
    description: 'Unmodified Untitled UI React source code — vendored as-is into a private repo and published as @highradius/untitledui. Zero source changes. All HiRa customisations happen in the ui-nexus base-components layer.',
    sections: [
      { type: 'paragraph', content: 'The untitled-ui repository contains the unmodified source code of the Untitled UI React library. It is a direct vendor copy — no changes to any component, variant, token, or icon. The repo exists for one purpose: publish the Untitled UI React source as @highradius/untitledui to the private NPM registry so ui-nexus can consume it in its base-components layer.' },

      { type: 'callout', variant: 'danger', title: 'No source changes — ever', content: 'Do not modify any file in this repository. If you need a different component behaviour or an additional variant, add it in ui-nexus/packages/base-components — never here. Keeping this repo pristine ensures upstream Untitled UI updates can be pulled in as a single clean diff.' },

      { type: 'callout', variant: 'info', title: 'Role in the stack', content: 'untitled-ui → @highradius/untitledui → ui-nexus base-components (HiRa design applied here) → @highradius/ui → product teams. Product teams never import from @highradius/untitledui directly. They always consume @highradius/ui.' },

      { type: 'heading', content: 'Repository Structure' },
      { type: 'filetree', items: [
        'untitled-ui/                             ← Unmodified Untitled UI React source',
        '├── src/',
        '│   ├── components/                        ← React components as shipped by Untitled UI',
        '│   ├── icons/                             ← SVG icon set as React components',
        '│   └── variants/                          ← CVA variant configs',
        '├── package.json                           ← name: "@highradius/untitledui"',
        '├── tsconfig.json',
        '├── vite.config.ts                         ← builds for ESM + CJS',
        '└── .github/workflows/',
        '    └── publish.yml                        ← on tag push: publish to private NPM',
      ]},

      { type: 'callout', variant: 'tip', title: 'Upstream migration strategy', content: 'When Untitled UI releases a new version: (1) pull upstream changes into this repo, (2) run the publish workflow — a new @highradius/untitledui version is cut, (3) bump the @highradius/untitledui dep in ui-nexus/base-components, (4) run the ui-nexus HiRa layer tests. If anything breaks it is isolated to base-components, not spread across all repos.' },

      { type: 'heading', content: 'What is included' },
      { type: 'table', headers: ['Path', 'Contents', 'Shipped as'], rows: [
        ['src/components/', '50+ React components: Button, Input, Select, Modal, Badge, Avatar, Tabs, Accordion, and more', 'Part of @highradius/untitledui'],
        ['src/icons/',      '200+ SVG icons as tree-shakeable React components',                                           'Part of @highradius/untitledui'],
        ['src/variants/',   'CVA (Class Variance Authority) variant configs used by components',                          'Part of @highradius/untitledui'],
      ]},

      { type: 'heading', content: 'Publishing' },
      { type: 'code', language: 'json', content: `// package.json
{
  "name": "@highradius/untitledui",
  "version": "1.0.0",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./icons": {
      "import": "./dist/icons/index.js",
      "require": "./dist/icons/index.cjs",
      "types": "./dist/icons/index.d.ts"
    }
  },
  "publishConfig": {
    "registry": "https://npm.highradius.internal"
  }
}` },

      { type: 'heading', content: 'Consuming in ui-nexus base-components' },
      { type: 'paragraph', content: 'The only legitimate consumer of @highradius/untitledui inside the monorepo is the base-components package. All HiRa customisation happens there — component variants, brand tokens, HighRadius-specific props.' },
      { type: 'code', language: 'typescript', content: `// ui-nexus/packages/base-components/src/button.tsx
// Import unmodified Untitled UI Button
import { Button as UntitledButton } from '@highradius/untitledui';
import { cva } from 'class-variance-authority';

// HiRa brand extension — defined here, NOT in untitled-ui repo
const hiraVariants = cva('', {
  variants: {
    brand: {
      primary:   'bg-hira-600 hover:bg-hira-700 text-white border-transparent',
      secondary: 'bg-transparent border-hira-600 text-hira-600 hover:bg-hira-50',
      ghost:     'text-hira-600 hover:bg-hira-50 border-transparent',
    },
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof UntitledButton> {
  brand?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ brand, className, ...props }: ButtonProps) {
  return (
    <UntitledButton
      className={hiraVariants({ brand, className })}
      {...props}
    />
  );
}` },

      { type: 'callout', variant: 'warning', title: 'Import rule for product teams', content: 'Product teams (R2R, etc.) must import from @highradius/ui — not from @highradius/untitledui or @highradius/base-components. @highradius/ui is the stable public API. The lower packages are implementation details.' },
    ],
  },

  // ── NextJS Boilerplate ────────────────────────────────────────────────────
  {
    id: 'nextjs-boilerplate',
    title: 'NextJS Boilerplate',
    category: 'Setup',
    icon: '🚀',
    description: 'Production-ready Next.js starter with Wattpm Gateway, standalone output, default tool configuration, env validation, Playwright E2E, Docker, and CI/CD pipelines pre-wired.',
    sections: [
      { type: 'paragraph', content: 'next-js-boilerplate is a single repository — not a monorepo. It is the canonical starting point for any new HighRadius Next.js product application. It pulls five config packages from ui-nexus (@hr/tsconfig, @hr/tailwind-config, @hr/oxlint-config, @hr/commitlint-config, @hr/lefthook-config) as devDependencies — so all tooling rules come from one source of truth. It also ships pre-wired with Next.js App Router, a Wattpm Gateway entry point, typed environment validation, Playwright E2E, GitHub Actions CI/CD, and Docker Compose. Published as a GitHub template repo: clone → rename → ship.' },

      { type: 'heading', content: 'Config Packages from ui-nexus' },
      { type: 'paragraph', content: 'The boilerplate is a consumer of ui-nexus config packages, not a monorepo workspace itself. These devDependencies wire up all tooling automatically:' },
      { type: 'code', language: 'json', content: `// next-js-boilerplate/package.json (devDependencies — from ui-nexus)
{
  "devDependencies": {
    "@highradius/tsconfig":          "^2.1.0",  // TypeScript base config
    "@highradius/tailwind-config":   "^1.3.0",  // Tailwind preset with HiRa tokens
    "@highradius/oxlint-config":     "^1.2.0",  // Rust-speed linting rules
    "@highradius/commitlint-config": "^1.1.0",  // Conventional commit enforcement
    "@highradius/lefthook-config":   "^1.0.0"   // Pre-commit git hooks
  }
}
// When a product app (e.g. record-to-report) is bootstrapped from this template,
// it inherits all these devDependencies unchanged. Tooling updates flow from
// ui-nexus → boilerplate template → product repos via Dependabot.` },

      { type: 'callout', variant: 'tip', title: 'How record-to-report was bootstrapped', content: 'record-to-report was initialised by cloning next-js-boilerplate. All configuration (Wattpm setup, tsconfig, Tailwind, Oxlint, Playwright, Docker) was inherited unchanged. The R2R team only added product-specific pages and installed the ui-nexus runtime packages (@hr/shell, @hr/ui, @hr/data-table, etc.) on top.' },

      { type: 'heading', content: 'Repository Structure' },
      { type: 'filetree', items: [
        'nextjs-boilerplate/',
        '├── app/                         ← Next.js App Router',
        '│   ├── layout.tsx               ← Root layout + providers',
        '│   ├── page.tsx                 ← Home page',
        '│   ├── (auth)/                  ← Auth route group',
        '│   │   ├── login/page.tsx',
        '│   │   └── callback/page.tsx    ← OIDC callback handler',
        '│   └── api/                     ← Route handlers (minimal — gateway owns API)',
        '├── wattpm/                      ← Wattpm Gateway source',
        '│   ├── server.ts                ← Fastify entry (port 3000)',
        '│   ├── plugins/',
        '│   │   ├── oidc.ts              ← OIDC auth plugin',
        '│   │   ├── rbac.ts              ← Role validation plugin',
        '│   │   ├── redis.ts             ← Redis session cache plugin',
        '│   │   └── proxy.ts             ← Reverse-proxy to :3001',
        '│   └── routes/',
        '│       └── api.ts               ← Microservice proxy routes',
        '├── lib/',
        '│   ├── env.ts                   ← Zod environment validation',
        '│   └── auth.ts                  ← Session helpers',
        '├── e2e/                         ← Playwright tests',
        '│   ├── auth.spec.ts',
        '│   └── navigation.spec.ts',
        '├── .github/',
        '│   └── workflows/',
        '│       ├── ci.yml               ← Lint · typecheck · test · build',
        '│       └── deploy.yml           ← Build Docker images, push, deploy',
        '├── docker/',
        '│   ├── Dockerfile.gateway       ← Wattpm Gateway image',
        '│   ├── Dockerfile.app           ← Next.js Standalone image',
        '│   └── compose.yml             ← Local dev stack',
        '├── next.config.ts              ← output: standalone',
        '├── tailwind.config.ts',
        '└── tsconfig.json               ← Extends @highradius/tsconfig/nextjs',
      ]},

      { type: 'heading', content: 'Next.js Configuration' },
      { type: 'code', language: 'typescript', content: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',           // produces .next/standalone/server.js
  experimental: {
    ppr: true,                    // Partial Pre-rendering (App Router)
    reactCompiler: true,          // React 19 compiler
  },
  // Wattpm Gateway rewrites: external APIs proxied via Gateway
  // Direct Next.js API routes kept minimal
};

export default nextConfig;` },

      { type: 'heading', content: 'Wattpm Gateway — Entry Point' },
      { type: 'paragraph', content: 'The Wattpm Gateway is a Fastify process running on port 3000. It is the only publicly exposed process. It handles OIDC authentication, RBAC validation, Redis session caching, and reverse-proxies all remaining traffic to the Next.js Standalone server on port 3001.' },
      { type: 'code', language: 'typescript', content: `// wattpm/server.ts
import Fastify from 'fastify';
import { oidcPlugin } from './plugins/oidc';
import { rbacPlugin } from './plugins/rbac';
import { redisPlugin } from './plugins/redis';
import { proxyPlugin } from './plugins/proxy';

const app = Fastify({ logger: true });

// Plugin registration order matters
await app.register(redisPlugin);       // session store
await app.register(oidcPlugin);        // OIDC auth + cookie
await app.register(rbacPlugin);        // role validation
await app.register(proxyPlugin, {      // fallthrough to Next.js
  upstream: process.env.NEXTJS_UPSTREAM_URL ?? 'http://localhost:3001',
});

await app.listen({ port: 3000, host: '0.0.0.0' });` },

      { type: 'heading', content: 'Environment Validation' },
      { type: 'code', language: 'typescript', content: `// lib/env.ts — Zod schema validates at startup, fails fast
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV:              z.enum(['development', 'test', 'production']),
  NEXTJS_PORT:           z.coerce.number().default(3001),
  GATEWAY_PORT:          z.coerce.number().default(3000),
  REDIS_URL:             z.string().url(),
  OIDC_ISSUER_URL:       z.string().url(),
  OIDC_CLIENT_ID:        z.string().min(1),
  OIDC_CLIENT_SECRET:    z.string().min(1),
  SESSION_SECRET:        z.string().min(32),
  NEXTJS_UPSTREAM_URL:   z.string().url().default('http://localhost:3001'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;` },

      { type: 'heading', content: 'Docker — Local Dev Stack' },
      { type: 'code', language: 'yaml', content: `# docker/compose.yml
services:
  gateway:
    build:
      context: ..
      dockerfile: docker/Dockerfile.gateway
    ports:
      - "3000:3000"        # public entry point
    environment:
      NEXTJS_UPSTREAM_URL: http://app:3001
    depends_on: [app, redis]

  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile.app
    expose:
      - "3001"             # internal only — not mapped to host
    environment:
      NODE_ENV: production

  redis:
    image: redis:7-alpine
    expose:
      - "6379"` },

      { type: 'heading', content: 'CI/CD Pipeline' },
      { type: 'table', headers: ['Job', 'Trigger', 'Steps'], rows: [
        ['lint',      'push / PR',  'pnpm oxlint · tsc --noEmit'],
        ['test',      'push / PR',  'Playwright E2E against local Docker stack'],
        ['build',     'push / PR',  'next build (output: standalone) · Docker build gateway + app'],
        ['deploy',    'main merge', 'Push images to registry · rolling deploy'],
      ]},
      { type: 'code', language: 'yaml', content: `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: docker compose -f docker/compose.yml up -d --wait
      - run: pnpm playwright test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: docker build -f docker/Dockerfile.gateway -t gateway:ci .
      - run: docker build -f docker/Dockerfile.app -t app:ci .` },

      { type: 'heading', content: 'Default Tool Decisions' },
      { type: 'table', headers: ['Concern', 'Tool', 'Config Source'], rows: [
        ['TypeScript',         'tsc strict',              '@highradius/tsconfig/nextjs'],
        ['Linting',            'Oxlint + ESLint',         '@highradius/oxlint-config'],
        ['Formatting',         'Prettier',                '.prettierrc (project-local)'],
        ['Git hooks',          'Lefthook',                '@highradius/lefthook-config'],
        ['Commit lint',        'commitlint',              '@highradius/commitlint-config'],
        ['CSS framework',      'Tailwind v4',             '@highradius/tailwind-config'],
        ['E2E testing',        'Playwright',              'playwright.config.ts'],
        ['Env validation',     'Zod schema',              'lib/env.ts'],
        ['Container',          'Docker + Compose',        'docker/'],
        ['CI/CD',              'GitHub Actions',          '.github/workflows/'],
        ['Session store',      'Redis',                   'wattpm/plugins/redis.ts'],
        ['Auth',               'OIDC via Wattpm',         'wattpm/plugins/oidc.ts'],
      ]},

      { type: 'callout', variant: 'warning', title: 'Before adding any tool', content: 'Check whether the tool already exists in this boilerplate or in a ui-nexus config package. Duplicate tooling (e.g. two formatters, two lint configs) will be rejected in code review. Open a discussion in the platform Slack channel first.' },
    ],
  },
];

// ─── SIDEBAR NAVIGATION ──────────────────────────────────────────────────────

export const sidebarSections: SidebarSection[] = [
  {
    label: 'Architecture',
    icon: '🏛️',
    items: [
      { id: 'overview', label: 'Overview', docId: 'overview' },
    ],
  },
  {
    label: 'Roadmap',
    icon: '🗺️',
    items: [
      { id: 'roadmap', label: 'HLP Master Roadmap', docId: 'roadmap' },
    ],
  },
  {
    label: 'untitledui',
    icon: '🎨',
    items: [
      { id: 'untitled-ui-setup', label: 'untitled-ui — Single Repo', docId: 'untitled-ui-setup' },
    ],
  },
  {
    label: 'ui-nexus (Monorepo)',
    icon: '🏗️',
    items: [
      { id: 'ui-nexus', label: 'ui-nexus — Platform Monorepo', docId: 'ui-nexus' },
    ],
  },
  {
    label: 'Setup',
    icon: '⚙️',
    items: [
      { id: 'nextjs-boilerplate', label: 'NextJS Boilerplate Setup', docId: 'nextjs-boilerplate' },
      { id: 'boilerplate', label: 'NextJS Boilerplate HLP (38 items)', docId: 'boilerplate' },
    ],
  },
  {
    label: 'Components',
    icon: '🧩',
    items: [
      { id: 'component-catalog', label: 'Component Library (80+ components)', docId: 'component-catalog' },
    ],
  },
  {
    label: 'Security',
    icon: '🔐',
    items: [
      { id: 'auth-security', label: 'Auth & Security (HLP #11–#15)', docId: 'auth-security' },
    ],
  },
  {
    label: 'Products',
    icon: '📦',
    items: [
      { id: 'r2r', label: 'Record to Report (R2R)', docId: 'r2r' },
    ],
  },
  {
    label: 'Reference',
    icon: '🔧',
    items: [
      { id: 'tool-allocation',  label: 'Tool Allocation Matrix',  docId: 'tool-allocation'  },
      { id: 'versioning',       label: 'Versioning Strategy',     docId: 'versioning'       },
      { id: 'platform-control', label: 'Platform Control Model',  docId: 'platform-control' },
      { id: 'bff-architecture', label: 'Gateway Architecture',        docId: 'bff-architecture' },
      { id: 'e2e-request-flow', label: 'End-to-End Request Flow', docId: 'e2e-request-flow' },
    ],
  },
];
