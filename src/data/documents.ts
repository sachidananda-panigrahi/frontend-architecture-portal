import type { Document, SidebarSection } from '../types';

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export const documents: Document[] = [
  // ── Overview ──────────────────────────────────────────────────────────────
  {
    id: 'overview',
    title: 'Architecture Overview',
    category: 'Architecture',
    icon: '🏛️',
    description: 'Three independent monorepos feeding one standalone product through an Untitled UI based design-system stack.',
    sections: [
      { type: 'paragraph', content: 'The HighRadius frontend platform is composed of three independent Git monorepos that publish versioned packages to a private NPM registry, plus one standalone Next.js product application (Record to Report). The UI stack is anchored on Untitled UI base components in highradius_core_ui, with the HighRadius HiRa theme and product-specific platform layers applied on top.' },
      { type: 'heading', content: 'The Dependency Chain' },
      { type: 'list', items: [
        'highradius_ui_config  →  publishes config packages, tokens, and the HiRa theme foundation',
        'highradius_core_ui   →  consumes config, adopts Untitled UI base components, publishes themed primitives',
        'highradius_aps_ui    →  consumes themed primitives + config, publishes platform shell and composites',
        'record-to-report     →  consumes all platform packages, ships to users',
      ]},
      { type: 'callout', variant: 'info', title: 'One-way dependency rule', content: 'No upstream repo ever imports from a downstream repo. The chain is strictly uni-directional. Enforced by Knip + CI.' },
      { type: 'heading', content: 'Design Principles' },
      { type: 'list', items: [
        'Platform team owns the shell — product teams own what goes inside it',
        'Untitled UI base components are the starting point — HiRa branding and behavior extensions are layered on top, not reinvented from scratch',
        'Rust-based tooling (Oxlint, Oxfmt) for millisecond CI feedback',
        'Semantic Release + Dependabot + CodeRabbit = safe, automated promotion pipeline',
        'BFF owns RBAC complexity — Next.js server components stay stateless',
        'Visual regression at the primitive layer — breaking a button is caught before propagation',
      ]},
      { type: 'heading', content: 'Repository Overview' },
      { type: 'table', headers: ['Repo', 'Type', 'Publishes', 'Team'], rows: [
        ['highradius_ui_config', 'Config Monorepo', '@hr/tsconfig, @hr/tailwind-config, @hr/oxlint-config...', 'Platform'],
        ['highradius_core_ui',   'UI Monorepo',     '@hr/core-ui, @hr/tokens (Untitled UI based, HiRa themed)', 'Platform'],
        ['highradius_aps_ui',    'Platform Monorepo', '@hr/shell, @hr/data-table, @hr/forms, @hr/state, @hr/api-client', 'Platform'],
        ['record-to-report',     'Next.js App',     'Ships to users (not a package)',                         'R2R Team + Platform (BFF)'],
      ]},
    ],
  },

  // ── ui_config ─────────────────────────────────────────────────────────────
  {
    id: 'ui-config',
    title: 'highradius_ui_config',
    category: 'Monorepos',
    icon: '⚙️',
    description: 'Governance Hub — publishes shareable config packages, design tokens, and the HiRa theme foundation. Zero runtime code.',
    sections: [
      { type: 'paragraph', content: 'This monorepo enforces code quality and consistency across all Highradius engineering teams. It publishes five shareable configuration packages consumed by every other repo, including the Tailwind and token foundations that let highradius_core_ui theme Untitled UI base components with the HiRa brand. No application code lives here.' },
      { type: 'heading', content: 'Published Packages' },
      { type: 'table', headers: ['Package', 'Purpose', 'Consumers'], rows: [
        ['@highradius/tsconfig',          'Strict TS config — base · nextjs · library', 'core_ui, aps_ui, R2R'],
        ['@highradius/tailwind-config',   'Untitled UI compatible tokens + HiRa theme base', 'core_ui, aps_ui, R2R'],
        ['@highradius/oxlint-config',     'Ultracite preset + HiRa rules',              'core_ui, aps_ui, R2R'],
        ['@highradius/commitlint-config', 'Conventional commit enforcement',             'core_ui, aps_ui, R2R'],
        ['@highradius/lefthook-config',   'Shareable git hook definitions',              'core_ui, aps_ui, R2R'],
      ]},
      { type: 'heading', content: 'Repository Structure' },
      { type: 'filetree', items: [
        'highradius_ui_config/',
        '├── packages/',
        '│   ├── tsconfig/          → @highradius/tsconfig',
        '│   ├── tailwind-config/   → @highradius/tailwind-config',
        '│   ├── oxlint-config/     → @highradius/oxlint-config',
        '│   ├── commitlint-config/ → @highradius/commitlint-config',
        '│   └── lefthook-config/   → @highradius/lefthook-config',
        '├── turbo.json',
        '├── pnpm-workspace.yaml',
        '└── .github/workflows/release.yml',
      ]},
      { type: 'heading', content: 'Consuming in downstream repos' },
      { type: 'code', language: 'json', content: `// tsconfig.json in highradius_core_ui
{
  "extends": "@highradius/tsconfig/library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}` },
      { type: 'code', language: 'js', content: `// tailwind.config.js in highradius_core_ui
import baseConfig from '@highradius/tailwind-config';
export default {
  ...baseConfig,
  content: ['./src/**/*.{tsx,ts}'],
};` },
      { type: 'heading', content: 'CI Pipeline' },
      { type: 'list', items: [
        'push → Oxlint (Rust, <1s)',
        'tsc --noEmit (type check)',
        'semantic-release → auto-version and publish to private registry',
        'Dependabot in core_ui and aps_ui opens update PRs automatically',
      ]},
      { type: 'callout', variant: 'tip', title: 'No tests needed', content: 'Config packages are validated by their consumers. If a tsconfig change breaks core_ui CI, that is the test.' },
    ],
  },

  // ── core_ui ───────────────────────────────────────────────────────────────
  {
    id: 'core-ui',
    title: 'highradius_core_ui',
    category: 'Monorepos',
    icon: '💎',
    description: 'Themed UI Foundation — Untitled UI base components adapted into stateless HighRadius primitives with the HiRa theme.',
    sections: [
      { type: 'paragraph', content: 'A monorepo of stateless, themeable React components built on top of Untitled UI base components. HighRadius owns the source-level adaptations, token mapping, and brand variants that turn those accessible bases into the HiRa design system. Zero business logic. Zero API calls. Zero Zustand.' },
      { type: 'callout', variant: 'danger', title: 'Strict boundary', content: 'No Zustand, no API calls, no business logic in this layer. Start from an Untitled UI base component whenever one exists, then apply HiRa tokens and HighRadius-specific variants without pulling product logic into the primitive layer. Violations block the PR.' },
      { type: 'heading', content: 'Component Inventory' },
      { type: 'badges', items: ['Button', 'Chip', 'TextField', 'Dropdown', 'Avatar', 'Grid', 'Tree', 'Badge', 'Modal', 'Toast', 'Tooltip', 'Spinner', 'Tabs', 'Accordion', 'Card'] },
      { type: 'heading', content: 'Published Packages' },
      { type: 'table', headers: ['Package', 'Contents'], rows: [
        ['@highradius/core-ui', 'Untitled UI based base components, wrappers, and HiRa variants — tree-shakeable barrel export'],
        ['@highradius/tokens',  'CSS custom properties + JS token exports that map HiRa design language onto the shared base components'],
      ]},
      { type: 'heading', content: 'Base Component Model' },
      { type: 'list', items: [
        'Untitled UI provides the source-owned accessible base components and interaction primitives',
        'HighRadius applies HiRa tokens, spacing, typography, and semantic variants on top of those bases',
        'Net-new primitives are the exception — add them only when Untitled UI does not provide a suitable foundation',
        'Composite workflows stay in highradius_aps_ui; highradius_core_ui stops at themed primitives and lightweight wrappers',
      ]},
      { type: 'heading', content: 'Testing Strategy' },
      { type: 'list', items: [
        'Vitest (Browser mode) — component state and interaction tests against a real DOM',
        'Playwright visual regression — screenshot diff on every PR against baseline',
        'Codecov gate — minimum 80% coverage enforced in CI',
        'Bundler Analyzer — size gate blocks publish if the primitive layer exceeds budget',
      ]},
      { type: 'heading', content: 'Adding a New Component' },
      { type: 'code', language: 'tsx', content: `// src/button/Button.tsx
    // Illustrative wrapper example — actual adopted Untitled UI source paths can differ by package layout.
import { Button as UntitledButton } from '@/untitled-ui/base/button';
import type { ButtonProps as UntitledButtonProps } from '@/untitled-ui/base/button';
import { cx } from '../utils/cx';

export interface ButtonProps extends UntitledButtonProps {
  emphasis?: 'primary' | 'secondary' | 'ghost';
}

const emphasisClassNames: Record<NonNullable<ButtonProps['emphasis']>, string> = {
  primary: 'bg-hira-600 text-white hover:bg-hira-700',
  secondary: 'bg-hira-surface-strong text-hira-foreground hover:bg-hira-surface-stronger',
  ghost: 'text-hira-foreground-subtle hover:bg-hira-surface-subtle',
};

export function Button({
  emphasis = 'primary',
  className,
  ...props
}: ButtonProps) {
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
      { type: 'heading', content: 'AI Agent Guide (CLAUDE.md)' },
      { type: 'list', items: [
        'All components STATELESS and PURE — no side effects',
        'All props typed — no any',
        'Tailwind only — no inline styles',
        'Adopt an Untitled UI base component before proposing a net-new primitive',
        'Extend HiRa theme tokens and variants instead of forking product-specific styles into the primitive layer',
        'Every new component needs a Vitest browser test + Storybook story',
      ]},
    ],
  },

  // ── aps_ui ────────────────────────────────────────────────────────────────
  {
    id: 'aps-ui',
    title: 'highradius_aps_ui',
    category: 'Monorepos',
    icon: '🛡️',
    description: 'Platform Shell — smart components, RBAC, telemetry, and the HighradiusPlatformShell.',
    sections: [
      { type: 'paragraph', content: 'This is where platform team authority is enforced. The HighradiusPlatformShell component is the master wrapper that product teams must use. It injects Sentry, PostHog, Arcjet, RBAC, and i18n — all non-negotiable, all free to the product team.' },
      { type: 'heading', content: 'Published Packages' },
      { type: 'table', headers: ['Package', 'Contents', 'Key Technologies'], rows: [
        ['@highradius/shell',      'HighradiusPlatformShell + layout + providers', 'Sentry · PostHog · Arcjet · next-intl · RBAC'],
        ['@highradius/data-table', 'Grid + CRUD + Renderer System',                'Zustand · TanStack Query · @hr/core-ui'],
        ['@highradius/forms',      'Standardised HiRa form patterns',              'React Hook Form · Zod · @hr/core-ui'],
        ['@highradius/state',      'Zustand store factories',                      'Zustand'],
        ['@highradius/api-client', 'Typed fetcher + cache management',             'TanStack Query · axios'],
      ]},
      { type: 'heading', content: 'The Platform Shell Contract' },
      { type: 'code', language: 'tsx', content: `// @highradius/shell — HighradiusPlatformShell.tsx
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
      { type: 'heading', content: 'i18n Gate' },
      { type: 'list', items: [
        'i18n-check runs in CI on every PR',
        'Missing translation keys = CI failure, PR blocked',
        'All composite component strings must be translated before publish',
      ]},
    ],
  },

  // ── R2R ───────────────────────────────────────────────────────────────────
  {
    id: 'r2r',
    title: 'Record to Report (R2R)',
    category: 'Products',
    icon: '🚀',
    description: 'Standalone Next.js App Router product. BFF layer co-owned by Platform team.',
    sections: [
      { type: 'paragraph', content: 'Independent product repository. R2R team owns the finance pages. Platform team co-owns the BFF directory and app/layout.tsx via CODEOWNERS. The shell is the only way to render a compliant HighRadius page.' },
      { type: 'heading', content: 'Repository Structure' },
      { type: 'filetree', items: [
        'record-to-report/',
        '├── app/',
        '│   ├── layout.tsx             ← @highradius/platform-team via CODEOWNERS',
        '│   ├── (finance)/',
        '│   │   ├── reconciliation/page.tsx',
        '│   │   ├── journal-entry/page.tsx',
        '│   │   └── close-management/page.tsx',
        '│   └── api/                   ← route handlers → BFF proxy',
        '├── bff/                       ← Platform team owns this directory',
        '│   ├── server.ts              ← Wattpm entry',
        '│   ├── plugins/auth.ts        ← RBAC token validation + Redis',
        '│   ├── plugins/graphql.ts     ← GraphQL proxy to microservices',
        '│   └── generated/types.ts     ← GraphQL Code Generator output',
        '├── tests/e2e/                 ← Playwright financial workflow journeys',
        '├── monitoring/checkly/        ← Monitoring as Code',
        '├── env.ts                     ← T3 Env (R2R-specific vars)',
        '└── .github/CODEOWNERS',
      ]},
      { type: 'heading', content: 'Page Pattern' },
      { type: 'code', language: 'tsx', content: `// app/(finance)/reconciliation/page.tsx
import { HighradiusPlatformShell, DataTable } from '@highradius/aps-ui';
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
/bff/              @highradius/platform-team
/app/layout.tsx    @highradius/platform-team
/env.ts            @highradius/platform-team
/app/(finance)/    @highradius/r2r-team` },
      { type: 'heading', content: 'CI Pipeline' },
      { type: 'list', items: [
        'Oxlint → tsc → Vitest → Playwright E2E (full financial flows)',
        'Lighthouse CI: LCP < 2.5s gate',
        'Dependabot watches @highradius/* package releases',
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
    description: 'Every tool from the stack mapped to the correct monorepo layer.',
    sections: [
      { type: 'paragraph', content: 'Every tool in the HighRadius stack has a single authoritative home. Duplication is waste; misplacement causes drift. This matrix defines where each tool lives and who consumes it.' },
      { type: 'heading', content: 'Tooling & Quality' },
      { type: 'table', headers: ['Tool', 'ui_config', 'core_ui', 'aps_ui', 'R2R'], rows: [
        ['TypeScript / tsconfig',      '✅ publishes', 'consumes', 'consumes', 'consumes'],
        ['Oxlint + Ultracite',         '✅ publishes', 'consumes', 'consumes', 'consumes'],
        ['Oxfmt',                      '✅ publishes', 'consumes', 'consumes', 'consumes'],
        ['Tailwind CSS',               '✅ publishes Untitled UI compatible theme base', 'extends HiRa theme over base components', 'extends', 'extends'],
        ['Untitled UI React source',   '—', '✅ owns adopted base component layer', 'consumes themed primitives', 'consumes via platform packages'],
        ['Lefthook',                   '✅ publishes', 'consumes', 'consumes', 'consumes'],
        ['Commitlint + Commitizen',    '✅ publishes', 'consumes', 'consumes', 'consumes'],
        ['Knip',                       'runs self', 'runs self', 'runs self', 'runs self'],
        ['Semantic Release',           '✅ per pkg', '✅ per pkg', '✅ per pkg', '✅ app'],
      ]},
      { type: 'heading', content: 'Testing & Quality Gates' },
      { type: 'table', headers: ['Tool', 'ui_config', 'core_ui', 'aps_ui', 'R2R'], rows: [
        ['Vitest (Browser mode)',       '—', '✅ components', 'integration', 'unit utils'],
        ['Visual Regression',          '—', '✅ atom level', '—', '—'],
        ['Playwright',                 '—', 'visual only', 'smoke tests', '✅ full E2E'],
        ['Codecov',                    '—', '✅', '✅', '✅'],
        ['Bundler Analyzer',           '—', '✅ size gate', '✅ size gate', '✅'],
        ['Lighthouse CI',              '—', '—', '—', '✅ LCP gate'],
        ['Dependabot',                 '—', 'watches ui_config', 'watches core_ui', 'watches aps_ui'],
        ['CodeRabbit',                 '—', 'dep PRs', 'dep PRs', '✅ all PRs'],
      ]},
      { type: 'heading', content: 'Observability & Security' },
      { type: 'table', headers: ['Tool', 'ui_config', 'core_ui', 'aps_ui', 'R2R'], rows: [
        ['Sentry',                     '—', '—', '✅ init in shell', 'source maps upload'],
        ['Sentry Spotlight',           '—', '—', '—', '✅ dev only'],
        ['PostHog',                    '—', '—', '✅ provider in shell', 'custom events'],
        ['Arcjet',                     '—', '—', '✅ in shell', '—'],
        ['LogTape + Better Stack',     '—', '—', '✅ context in shell', 'log shipping'],
        ['Checkly',                    '—', '—', '—', '✅ synthetic monitors'],
      ]},
      { type: 'heading', content: 'Data & i18n' },
      { type: 'table', headers: ['Tool', 'ui_config', 'core_ui', 'aps_ui', 'R2R'], rows: [
        ['next-intl',                  '—', '—', '✅ provider in shell', 'locale messages'],
        ['i18n-check',                 '—', '—', '✅ CI gate', '—'],
        ['React Hook Form + Zod',      '—', '—', '✅ in forms pkg', 'consumes'],
        ['Zustand',                    '—', '—', '✅ store factories', 'consumes'],
        ['TanStack Query',             '—', '—', '✅ in api-client', 'consumes'],
        ['T3 Env',                     'base schema', '—', 'base schema', '✅ R2R vars'],
        ['Wattpm BFF',                 '—', '—', '—', '✅ platform-owned dir'],
        ['GraphQL Code Generator',     '—', '—', '—', '✅ R2R schema'],
        ['Redis',                      '—', '—', '—', '✅ via BFF'],
      ]},
    ],
  },

  // ── Versioning ────────────────────────────────────────────────────────────
  {
    id: 'versioning',
    title: 'Versioning Strategy',
    category: 'Reference',
    icon: '🏷️',
    description: 'Semantic Release + Dependabot + CodeRabbit = safe automated promotion.',
    sections: [
      { type: 'paragraph', content: 'Each repo has its own Semantic Release. Version bumps propagate through Dependabot PRs. CodeRabbit reviews every dependency update PR automatically. The CI gate is the final safety net.' },
      { type: 'heading', content: 'The Promotion Pipeline' },
      { type: 'list', items: [
        '1. Platform commits to highradius_core_ui (e.g. "fix: reduce button padding")',
        '2. Semantic Release: @highradius/core-ui 2.1.3 → 2.1.4 published',
        '3. Dependabot opens PR in highradius_aps_ui: bump @hr/core-ui from 2.1.3 to 2.1.4',
        '4. CodeRabbit reviews: "Button padding changed, check data-table cell alignment"',
        '5. CI: vitest + playwright visual regression → PASS',
        '6. Auto-merged (patch = auto-merge policy)',
        '7. Semantic Release: @highradius/shell 3.0.7 → 3.0.8 published',
        '8. Dependabot opens PR in record-to-report: bump @hr/shell from 3.0.7 to 3.0.8',
        '9. CI: playwright E2E full financial flows → PASS + Lighthouse LCP gate',
        '10. Auto-merged → CDN deploy → Checkly verifies live flows',
      ]},
      { type: 'heading', content: 'Version Policy Per Bump Type' },
      { type: 'table', headers: ['Bump', 'ui_config→core_ui', 'core_ui→aps_ui', 'aps_ui→R2R'], rows: [
        ['patch (1.0.x)', 'Auto-merge', 'Auto-merge', 'Auto-merge'],
        ['minor (1.x.0)', 'Auto-merge', 'CI gate',    'CI gate + platform review'],
        ['major (x.0.0)', 'Manual',     'Manual + migration guide', 'Manual + R2R team sign-off'],
      ]},
      { type: 'callout', variant: 'tip', title: 'Conventional commits drive everything', content: 'fix: → patch, feat: → minor, feat!: or BREAKING CHANGE: → major. Commitlint enforces format. Commitizen provides the interactive prompt. Semantic Release reads the git log.' },
      { type: 'heading', content: 'Semantic Release Config' },
      { type: 'code', language: 'json', content: `// .releaserc.json
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
      { type: 'paragraph', content: 'Platform team authority is enforced at the code level — not by convention, not by documentation, not by trust. The shell is the enforcement mechanism.' },
      { type: 'heading', content: 'Ownership Matrix' },
      { type: 'table', headers: ['Concern', 'Owned By', 'Enforcement Mechanism'], rows: [
        ['Security (Arcjet)',           'Platform', 'Injected in shell, no opt-out'],
        ['Error Monitoring (Sentry)',   'Platform', 'Shell boundary, product gets source maps only'],
        ['Analytics schema (PostHog)',  'Platform', 'Event registry in aps_ui, products call typed wrappers'],
        ['RBAC enforcement',            'Platform', 'RBACBoundary in shell, role passed as required prop'],
        ['i18n provider',              'Platform', 'Shell wraps NextIntlClientProvider'],
        ['Base component foundation',  'Platform', 'Untitled UI source adopted and curated in highradius_core_ui'],
        ['Design tokens',              'Platform', 'HiRa theme tokens published from ui_config and enforced through highradius_core_ui'],
        ['Logging context',            'Platform', 'LogTape context injected at shell level'],
        ['Page layout',                'Platform', 'Sidebar + Topbar owned by shell'],
        ['Page content',               'Product',  'children slot — full freedom'],
        ['Business data fetching',     'Product',  'RSC data fetching inside page components'],
        ['Product-specific events',    'Product',  'Via typed PostHog wrappers from aps_ui'],
        ['Product GraphQL schema',     'Product',  'Defined in R2R BFF, generated types local'],
        ['Product env vars',           'Product',  'T3 Env at R2R level'],
      ]},
      { type: 'heading', content: 'Non-Negotiable Invariants' },
      { type: 'list', items: [
        'No circular dependencies — enforced by Knip + CI',
        'Shell is mandatory — CODEOWNERS prevents removal from app/layout.tsx',
        'BFF owns auth — tokens never reach RSC layer',
        'Config packages pinned with caret — minors auto-merge, majors require humans',
        'Visual regression at the primitive layer — breaking a button caught before propagation',
      ]},
    ],
  },

  // ── BFF Architecture ──────────────────────────────────────────────────────
  {
    id: 'bff-architecture',
    title: 'BFF Architecture',
    category: 'Reference',
    icon: '⚡',
    description: 'Wattpm BFF: RBAC validation, Redis caching, GraphQL proxy.',
    sections: [
      { type: 'paragraph', content: 'The Wattpm (wattpm) Node.js BFF is co-owned by the Platform team and lives in the record-to-report repository under bff/. It sits between Next.js server components and the microservices layer.' },
      { type: 'heading', content: 'Request Flow' },
      { type: 'list', items: [
        '1. RSC page component calls typed internal fetch → Next.js route handler',
        '2. Route handler proxies to Wattpm BFF',
        '3. BFF validates JWT token (auth plugin)',
        '4. Redis cache check → cache hit returns early (TTL: 5 min)',
        '5. Cache miss → BFF executes GraphQL query to microservice',
        '6. Response typed, cached, returned to RSC',
        '7. RSC renders with plain typed data — never sees raw tokens',
      ]},
      { type: 'heading', content: 'BFF Directory Structure' },
      { type: 'filetree', items: [
        'bff/                           ← platform team owns via CODEOWNERS',
        '├── server.ts                  ← Wattpm entry point',
        '├── plugins/',
        '│   ├── auth.ts                ← JWT validation + RBAC resolution',
        '│   ├── redis.ts               ← Redis client + cache helpers',
        '│   └── graphql.ts             ← GraphQL proxy to microservices',
        '├── routes/',
        '│   ├── reconciliation.ts      ← R2R-specific routes',
        '│   └── journal-entry.ts',
        '└── generated/',
        '    └── types.ts               ← GraphQL Code Generator output',
      ]},
      { type: 'heading', content: 'Auth Plugin' },
      { type: 'code', language: 'typescript', content: `// bff/plugins/auth.ts
import type { FastifyPluginAsync } from 'wattpm';
import { redis } from './redis';

const RBAC_CACHE_TTL = 300; // 5 minutes

export const authPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) { reply.code(401).send({ error: 'Unauthorized' }); return; }

    const cacheKey = \`rbac:\${token.slice(-16)}\`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      request.user = JSON.parse(cached);
      return;
    }

    const user = await validateJWT(token); // calls identity service
    await redis.setex(cacheKey, RBAC_CACHE_TTL, JSON.stringify(user));
    request.user = user;
  });
};` },
      { type: 'callout', variant: 'info', title: 'Why BFF owns auth entirely', content: 'RBAC token validation at BFF keeps Next.js server components stateless and portable. If the framework ever changes, auth logic does not scatter across 40 page files. One place, one team, one audit.' },
      { type: 'heading', content: 'GraphQL Code Generator Config' },
      { type: 'code', language: 'yaml', content: `# codegen.yml
schema: ./bff/schema.graphql
documents: ./bff/operations/**/*.graphql
generates:
  ./bff/generated/types.ts:
    plugins:
      - typescript
      - typescript-operations
      - typed-document-node
config:
  strictScalars: true
  enumsAsTypes: true` },
    ],
  },
];

// ─── SIDEBAR NAVIGATION ──────────────────────────────────────────────────────

export const sidebarSections: SidebarSection[] = [
  {
    label: 'Architecture',
    icon: '🏛️',
    items: [
      { id: 'overview',  label: 'Overview',  docId: 'overview' },
    ],
  },
  {
    label: 'Monorepos',
    icon: '🏗️',
    items: [
      { id: 'ui-config', label: 'ui_config — Governance Hub',  docId: 'ui-config' },
      { id: 'core-ui',   label: 'core_ui — Design System',     docId: 'core-ui'   },
      { id: 'aps-ui',    label: 'aps_ui — Platform Shell',     docId: 'aps-ui'    },
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
      { id: 'tool-allocation',  label: 'Tool Allocation Matrix', docId: 'tool-allocation'  },
      { id: 'versioning',       label: 'Versioning Strategy',    docId: 'versioning'       },
      { id: 'platform-control', label: 'Platform Control Model', docId: 'platform-control' },
      { id: 'bff-architecture', label: 'BFF Architecture',       docId: 'bff-architecture' },
    ],
  },
];
