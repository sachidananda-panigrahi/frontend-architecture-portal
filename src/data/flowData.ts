import type { Node, Edge } from '@xyflow/react';
import { MarkerType, Position } from '@xyflow/react';
import type { RepoNodeData, PackageNodeData } from '../types';

export const COLORS = {
  violet:  { border: '#7c3aed', bg: '#1e1b4b', text: '#ddd6fe', badge: '#4c1d95', badgeTxt: '#ddd6fe', edge: '#7c3aed', glow: 'rgba(124,58,237,0.25)' },
  blue:    { border: '#2563eb', bg: '#1e3a5f', text: '#bfdbfe', badge: '#1e3a8a', badgeTxt: '#dbeafe', edge: '#3b82f6', glow: 'rgba(59,130,246,0.25)'  },
  cyan:    { border: '#0891b2', bg: '#0c2a33', text: '#a5f3fc', badge: '#0e4f5e', badgeTxt: '#cffafe', edge: '#06b6d4', glow: 'rgba(6,182,212,0.25)'   },
  emerald: { border: '#16a34a', bg: '#0c2716', text: '#bbf7d0', badge: '#14532d', badgeTxt: '#dcfce7', edge: '#22c55e', glow: 'rgba(34,197,94,0.25)'   },
  amber:   { border: '#d97706', bg: '#1c1407', text: '#fcd34d', badge: '#92400e', badgeTxt: '#fef3c7', edge: '#f59e0b', glow: 'rgba(245,158,11,0.25)'  },
};

const edgeStyle = (scheme: keyof typeof COLORS, dashed = false): Partial<Edge> => ({
  animated: !dashed,
  style: {
    stroke: COLORS[scheme].edge,
    strokeWidth: dashed ? 1.5 : 2.5,
    strokeDasharray: dashed ? '6 4' : undefined,
    opacity: dashed ? 0.6 : 1,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: COLORS[scheme].edge,
    width: 16,
    height: 16,
  },
  labelStyle: { fill: COLORS[scheme].text, fontSize: 11, fontWeight: 600 },
  labelBgStyle: { fill: COLORS[scheme].bg, fillOpacity: 0.9 },
  labelBgPadding: [5, 10] as [number, number],
  labelBgBorderRadius: 6,
});

// ─── Layout constants ─────────────────────────────────────────────────────────
// PackageNode width = 264px  |  RepoNode width = 320px
// COL  = 380  → 116 px gap between package-node columns
// ROW  = 300  → row gap within a layer
// LGAP = 380  → extra gap between distinct logical layers
//
// 3-col x positions : 0, 380, 760
// 2-col x positions : 0, 380
// 2-col centred in 3-col span : 190, 570
// single centred in 3-col span: 380  (= (1024 - 264) / 2 rounded)
// single centred in 2-col span: 190  (= (644  - 264) / 2 rounded)

// ─── Main diagram: 4-repo architecture (2 × 2 grid) ─────────────────────────
//
//  untitled-ui (0, 0)       ──→  ui-nexus (600, 0)
//                                      ↓
//  nextjs-boilerplate (0, 380)  ──→  r2r (600, 380)
//
// Horizontal gap between repo nodes: 600 − 320 = 280 px breathing room
// Vertical gap between rows:          380 − 288 ≈ 92 px (nodes are min-h 18rem)

export const mainNodes: Node<RepoNodeData>[] = [
  {
    id: 'untitled-ui',
    type: 'repoNode',
    position: { x: 0, y: 0 },
    data: {
      label: 'untitled-ui',
      subtitle: 'Unmodified UI Source',
      colorScheme: 'amber',
      icon: '🎨',
      repo: 'GitHub Repo #1',
      description: 'Unmodified Untitled UI React source code — all components exported as @highradius/untitledui. Zero source changes. All HiRa customisations happen in the ui-nexus base-components layer, never here.',
      packages: ['@highradius/untitledui', 'React components', 'Icon set', 'CVA variants'],
      tools: ['TypeScript', 'Vite', 'Storybook', 'pnpm'],
      docId: 'untitled-ui-setup',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'ui-nexus',
    type: 'repoNode',
    position: { x: 600, y: 0 },
    data: {
      label: 'ui-nexus',
      subtitle: 'Platform Monorepo',
      colorScheme: 'violet',
      icon: '🏗️',
      repo: 'GitHub Repo #2',
      description: 'Platform monorepo with a base-components layer that wraps @highradius/untitledui with HiRa design tokens and variants — then publishes @hr/ui and 12 other versioned packages. Build order: config → base-components → UI → Platform.',
      packages: ['@hr/tsconfig', '@hr/tailwind-config', '@hr/oxlint-config', '@hr/ui', '@hr/tokens', '@hr/icons', '@hr/shell', '@hr/data-table', '@hr/forms', '@hr/state', '@hr/api-client', '@hr/commitlint-config', '@hr/lefthook-config'],
      tools: ['Turborepo', 'Oxlint', 'Oxfmt', 'React 19 Compiler', 'Vitest', 'Storybook', 'Visual Regression', 'Semantic Release', 'Knip'],
      docId: 'ui-nexus',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'nextjs-boilerplate',
    type: 'repoNode',
    position: { x: 0, y: 400 },
    data: {
      label: 'nextjs-boilerplate',
      subtitle: 'App Starter Template',
      colorScheme: 'blue',
      icon: '📐',
      repo: 'GitHub Repo #3',
      description: 'Production-ready Next.js 15 starter template. Pre-configured with Wattpm Gateway, standalone output, all HighRadius tooling and CI/CD. New product apps are bootstrapped from this template — record-to-report was created from here.',
      packages: ['Next.js 15', 'Wattpm Gateway', 'App Router', 'T3 Env', 'Playwright'],
      tools: ['standalone output', 'Oxlint', 'Vitest', 'Lefthook', 'GitHub Actions', 'Docker'],
      docId: 'nextjs-boilerplate',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'r2r',
    type: 'repoNode',
    position: { x: 600, y: 400 },
    data: {
      label: 'record-to-report',
      subtitle: 'Next.js Product App',
      colorScheme: 'emerald',
      icon: '🚀',
      repo: 'GitHub Repo #4',
      description: 'Standalone Next.js App Router product bootstrapped from nextjs-boilerplate. Wattpm Gateway (port 3000) reverse-proxies to Next.js standalone (port 3001). Platform team co-owns the Gateway directory and layout.tsx.',
      packages: ['Next.js Standalone', 'Wattpm Gateway', 'GraphQL Codegen', 'Playwright E2E'],
      tools: ['T3 Env', 'Wattpm', 'Redis', 'Playwright', 'Checkly', 'Lighthouse CI', 'CodeRabbit'],
      docId: 'r2r',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

export const mainEdges: Edge[] = [
  {
    id: 'e-uu-nexus',
    source: 'untitled-ui',
    target: 'ui-nexus',
    label: '@highradius/untitledui',
    ...edgeStyle('amber'),
  },
  {
    id: 'e-nexus-r2r',
    source: 'ui-nexus',
    target: 'r2r',
    label: '@hr/shell · @hr/ui · @hr/data-table · +10 pkgs',
    ...edgeStyle('violet'),
  },
  {
    id: 'e-bp-r2r',
    source: 'nextjs-boilerplate',
    target: 'r2r',
    label: 'bootstrapped template',
    ...edgeStyle('blue', true),
  },
];

// ─── untitled-ui sub-diagram ──────────────────────────────────────────────────
// All Untitled UI React source → all components exported → @highradius/untitledui
//
// Layout  (COL=380, ROW=320):
//              [Untitled UI React]       ← row 0, x=380 (centred in 3-col span)
//               ↙       ↓       ↘
//   [components/] [icons/] [variants/]  ← row 1, x=0/380/760
//          ↘         ↓        ↙
//      [@highradius/untitledui]          ← row 2, x=380 (centred)

const untitledUIPkgs: Node<PackageNodeData>[] = [
  { id: 'uu-upstream',   type: 'packageNode', position: { x: 380, y: 0   }, data: { scope: 'upstream',     name: 'Untitled UI React',   description: 'Official Untitled UI React source — synced from upstream. No modifications. All components, icons, and variant configs present exactly as released.', colorScheme: 'amber', tags: ['source', 'upstream']  } },
  { id: 'uu-components', type: 'packageNode', position: { x: 0,   y: 320 }, data: { scope: 'src',          name: 'components/',         description: 'All Untitled UI React components: Button, Input, Select, Modal, Badge, Avatar, Tabs, Accordion, and 50+ more. Every component is exported from the package root.', colorScheme: 'amber', tags: ['components', 'ui']   } },
  { id: 'uu-icons-src',  type: 'packageNode', position: { x: 380, y: 320 }, data: { scope: 'src',          name: 'icons/',              description: '200+ SVG icons shipped as tree-shakeable React components. Exported under the /icons sub-path so consumers can import individual icons without pulling the full set.', colorScheme: 'amber', tags: ['icons', 'ui']        } },
  { id: 'uu-variants',   type: 'packageNode', position: { x: 760, y: 320 }, data: { scope: 'src',          name: 'variants/',           description: 'CVA (Class Variance Authority) variant configs as shipped by Untitled UI. Exported for extension in ui-nexus base-components. Never modified here.', colorScheme: 'amber', tags: ['variants', 'config'] } },
  { id: 'uu-pkg',        type: 'packageNode', position: { x: 380, y: 640 }, data: { scope: '@highradius',  name: 'untitledui',          description: 'Single published package: @highradius/untitledui. Exports all components, icons (via /icons sub-path), variants, and TypeScript types. Consumed only by ui-nexus base-components.', colorScheme: 'amber', tags: ['published', 'npm']   } },
];

const untitledUIEdges: Edge[] = [
  { id: 'uu-e-up-cmp', source: 'uu-upstream',   target: 'uu-components', ...edgeStyle('amber', true), label: 'source' },
  { id: 'uu-e-up-ico', source: 'uu-upstream',   target: 'uu-icons-src',  ...edgeStyle('amber', true), label: 'source' },
  { id: 'uu-e-up-var', source: 'uu-upstream',   target: 'uu-variants',   ...edgeStyle('amber', true), label: 'source' },
  { id: 'uu-e-cmp-pk', source: 'uu-components', target: 'uu-pkg',        ...edgeStyle('amber'),       label: 'all exported' },
  { id: 'uu-e-ico-pk', source: 'uu-icons-src',  target: 'uu-pkg',        ...edgeStyle('amber'),       label: 'all exported' },
  { id: 'uu-e-var-pk', source: 'uu-variants',   target: 'uu-pkg',        ...edgeStyle('amber'),       label: 'all exported' },
];

// ─── nextjs-boilerplate sub-diagram ──────────────────────────────────────────
// Layout  (COL=380, ROW=320):
//   row 0: app/  wattpm/
//   row 1: config/  env.ts
//   row 2: tests/e2e/  .github/  docker/

const boilerplatePkgs: Node<PackageNodeData>[] = [
  { id: 'bp-app',    type: 'packageNode', position: { x: 0,   y: 0   }, data: { scope: 'template', name: 'app/',       description: 'Next.js App Router skeleton: root layout with PlatformShell, (product)/ route group template, loading.tsx, error.tsx, and not-found.tsx stubs.', colorScheme: 'blue', tags: ['next.js', 'template']  } },
  { id: 'bp-wattpm', type: 'packageNode', position: { x: 380, y: 0   }, data: { scope: 'template', name: 'wattpm/',    description: 'Wattpm Gateway template: server.ts (port 3000), OIDC auth plugin, proxy plugin to :3001, Redis session plugin, and /api/health route stub.', colorScheme: 'blue', tags: ['gateway', 'template']  } },
  { id: 'bp-config', type: 'packageNode', position: { x: 0,   y: 320 }, data: { scope: 'config',   name: 'config/',    description: 'next.config.ts (output: standalone), tsconfig.json, tailwind.config.ts, oxlint.config.json — all wired to @hr/* packages from ui-nexus.', colorScheme: 'blue', tags: ['config']               } },
  { id: 'bp-env',    type: 'packageNode', position: { x: 380, y: 320 }, data: { scope: 'config',   name: 'env.ts',     description: 'T3 Env schema — type-safe environment variables with Zod. Ships base vars (REDIS_URL, OIDC_ISSUER, NEXTJS_UPSTREAM_URL) + placeholder product vars.', colorScheme: 'blue', tags: ['config', 'env']        } },
  { id: 'bp-tests',  type: 'packageNode', position: { x: 0,   y: 640 }, data: { scope: 'testing',  name: 'tests/e2e/', description: 'Playwright config pre-wired with HighRadius base URL, auth fixtures, and a smoke test template. Ready to run against local Wattpm Gateway on port 3000.', colorScheme: 'blue', tags: ['testing', 'playwright'] } },
  { id: 'bp-ci',     type: 'packageNode', position: { x: 380, y: 640 }, data: { scope: 'devops',   name: '.github/',   description: 'GitHub Actions workflows: lint → typecheck → test → build → deploy. Includes CodeRabbit config, Dependabot watching @hr/* packages, and PR templates.', colorScheme: 'blue', tags: ['ci/cd', 'github']      } },
  { id: 'bp-docker', type: 'packageNode', position: { x: 760, y: 640 }, data: { scope: 'devops',   name: 'docker/',    description: 'Multi-stage Dockerfile (standalone copy), docker-compose.yml (app + gateway + redis + mock OIDC), and healthcheck scripts for local dev parity.', colorScheme: 'blue', tags: ['docker', 'devops']     } },
];

const boilerplateEdges: Edge[] = [
  { id: 'bp-e-wt-app', source: 'bp-wattpm', target: 'bp-app',   ...edgeStyle('blue'),       label: 'proxy → :3001'  },
  { id: 'bp-e-cf-app', source: 'bp-config', target: 'bp-app',   ...edgeStyle('blue', true), label: 'next.config.ts' },
  { id: 'bp-e-cf-wt',  source: 'bp-config', target: 'bp-wattpm',...edgeStyle('blue', true), label: 'env + tsconfig' },
  { id: 'bp-e-en-wt',  source: 'bp-env',    target: 'bp-wattpm',...edgeStyle('blue', true), label: 'T3 Env vars'    },
  { id: 'bp-e-ci-tst', source: 'bp-ci',     target: 'bp-tests', ...edgeStyle('blue', true), label: 'CI runs tests'  },
  { id: 'bp-e-dk-ci',  source: 'bp-docker', target: 'bp-ci',    ...edgeStyle('blue', true), label: 'local parity'   },
];

// ─── ui-nexus sub-diagram ─────────────────────────────────────────────────────
// 4 logical layers  (COL=380, ROW=300, LGAP=380 between layers)
//
// Config layer  (violet)      y = 0 … 300
// Base-comp layer (amber+violet) y = 680 … 980   ← +380 gap from config
// UI layer       (blue)       y = 1360 … 1660   ← +380 gap from base-comp
// Platform layer (cyan)       y = 2040 … 2640   ← +380 gap from UI
//
// 3-col positions: x = 0, 380, 760
// Centred in 3-col span (1024 px total): x = 380
// Centred 2-col in 3-col span: x = 190, 570

const uiNexusPkgs: Node<PackageNodeData>[] = [
  // ── Config workspace ────────────────────────────────────────────────────────
  { id: 'nx-tsc',    type: 'packageNode', position: { x: 0,   y: 0    }, data: { scope: '@highradius', name: 'tsconfig',         description: 'Strict TS base · nextjs · library presets. Extended by every workspace in ui-nexus and by all downstream repos.',                                                                                          colorScheme: 'violet', tags: ['config']            } },
  { id: 'nx-tw',     type: 'packageNode', position: { x: 380, y: 0    }, data: { scope: '@highradius', name: 'tailwind-config',   description: 'Tailwind v4 preset — extends Untitled UI default theme with HiRa brand tokens: hira-* color palette, custom spacing scale, typography.',                                                                   colorScheme: 'violet', tags: ['config']            } },
  { id: 'nx-ox',     type: 'packageNode', position: { x: 760, y: 0    }, data: { scope: '@highradius', name: 'oxlint-config',     description: 'Ultracite preset + HiRa lint rules via Oxlint (Rust-speed). Applied across all ui-nexus packages and downstream repos.',                                                                                    colorScheme: 'violet', tags: ['linting']           } },
  { id: 'nx-cl',     type: 'packageNode', position: { x: 190, y: 300  }, data: { scope: '@highradius', name: 'commitlint-config', description: 'Conventional commit enforcement — gates Semantic Release publish on every package.',                                                                                                                          colorScheme: 'violet', tags: ['git']               } },
  { id: 'nx-lh',     type: 'packageNode', position: { x: 570, y: 300  }, data: { scope: '@highradius', name: 'lefthook-config',   description: 'Shareable git hook definitions — pre-commit lint + typecheck + format. Installed by all repos via @highradius/lefthook-config.',                                                                          colorScheme: 'violet', tags: ['git']               } },

  // ── Base Components workspace  (+380 gap from config) ───────────────────────
  { id: 'nx-uu-src', type: 'packageNode', position: { x: 190, y: 680  }, data: { scope: '@highradius', name: 'untitledui',        description: 'External dep: @highradius/untitledui — the complete, unmodified Untitled UI React source. Only base-components may import this. No other package in ui-nexus touches it.',                                  colorScheme: 'amber', tags: ['external', 'source'] } },
  { id: 'nx-tok',    type: 'packageNode', position: { x: 570, y: 680  }, data: { scope: '@highradius', name: 'tokens',            description: 'CSS custom properties + JS token exports — HiRa brand colors, spacing, typography, shadow scales. The shared design contract between config, base-components, and consumers.',                              colorScheme: 'blue',  tags: ['design']            } },
  { id: 'nx-base',   type: 'packageNode', position: { x: 380, y: 980  }, data: { scope: '@highradius', name: 'base-components/',  description: 'HiRa wrapping layer. Imports @highradius/untitledui + @hr/tokens. Extends CVA variants with HiRa brand colours, sizes, and state variants. Re-exports as branded React components — the source of @hr/ui.', colorScheme: 'violet', tags: ['components', 'hira'] } },

  // ── UI workspace  (+380 gap from base-comp) ─────────────────────────────────
  { id: 'nx-ui',     type: 'packageNode', position: { x: 190, y: 1360 }, data: { scope: '@highradius', name: 'ui',               description: 'Public component package — re-exports everything from base-components. Stateless, tree-shakeable. The only component package product teams and platform packages should import.', colorScheme: 'blue', tags: ['components', 'ui'] } },
  { id: 'nx-ico',    type: 'packageNode', position: { x: 570, y: 1360 }, data: { scope: '@highradius', name: 'icons',            description: 'Icon set — re-exports the full @highradius/untitledui icon set plus any HiRa-specific additions. Tree-shakeable per icon via /icons sub-path.', colorScheme: 'blue', tags: ['ui']               } },
  { id: 'nx-sb',     type: 'packageNode', position: { x: 380, y: 1660 }, data: { scope: 'internal',    name: 'storybook',        description: 'Component docs + visual regression (Chromatic). Stories show raw @highradius/untitledui components alongside their HiRa-branded equivalents for side-by-side comparison. Not published.', colorScheme: 'blue', tags: ['internal']         } },

  // ── Platform workspace  (+380 gap from UI) ──────────────────────────────────
  { id: 'nx-shell',  type: 'packageNode', position: { x: 380, y: 2040 }, data: { scope: '@highradius', name: 'shell',      description: 'HighradiusPlatformShell — layout + providers: Sentry, PostHog, Arcjet, RBAC boundary, next-intl, and Wattpm session bridge.',                  colorScheme: 'cyan', tags: ['platform', 'core'] } },
  { id: 'nx-dt',     type: 'packageNode', position: { x: 0,   y: 2340 }, data: { scope: '@highradius', name: 'data-table', description: 'Enterprise grid — CRUD, Renderer System, server-side state via TanStack Query. Built on @hr/ui components.',                                     colorScheme: 'cyan', tags: ['components']       } },
  { id: 'nx-fm',     type: 'packageNode', position: { x: 380, y: 2340 }, data: { scope: '@highradius', name: 'forms',      description: 'React Hook Form + Zod — standardised HiRa form patterns, validation messages, and field layout built on @hr/ui base components.',              colorScheme: 'cyan', tags: ['components']       } },
  { id: 'nx-st',     type: 'packageNode', position: { x: 760, y: 2340 }, data: { scope: '@highradius', name: 'state',      description: 'Zustand store factories — typed slice pattern for complex product UI state. Consumed by data-table and product pages.',                          colorScheme: 'cyan', tags: ['state']            } },
  { id: 'nx-api',    type: 'packageNode', position: { x: 380, y: 2640 }, data: { scope: '@highradius', name: 'api-client', description: 'Typed fetcher + TanStack Query config + Redis-aware cache management. Shared request/cache patterns across all platform packages.',              colorScheme: 'cyan', tags: ['data']             } },
];

const uiNexusEdges: Edge[] = [
  // Config layer internal
  { id: 'nx-e-tw-tok',   source: 'nx-tw',     target: 'nx-tok',    ...edgeStyle('violet', true), label: 'HiRa token values'  },
  // Base-comp inputs
  { id: 'nx-e-uu-base',  source: 'nx-uu-src', target: 'nx-base',   ...edgeStyle('amber'),         label: 'source components'  },
  { id: 'nx-e-tok-base', source: 'nx-tok',    target: 'nx-base',   ...edgeStyle('violet'),        label: 'HiRa tokens'        },
  // base-components → public UI package
  { id: 'nx-e-base-ui',  source: 'nx-base',   target: 'nx-ui',     ...edgeStyle('violet'),        label: 'branded components' },
  // UI workspace
  { id: 'nx-e-ui-sb',    source: 'nx-ui',     target: 'nx-sb',     ...edgeStyle('blue', true),    label: 'stories'            },
  { id: 'nx-e-ico-sb',   source: 'nx-ico',    target: 'nx-sb',     ...edgeStyle('blue', true),    label: 'stories'            },
  // UI → Platform
  { id: 'nx-e-ui-shell', source: 'nx-ui',     target: 'nx-shell',  ...edgeStyle('blue'),          label: '@hr/ui components'  },
  { id: 'nx-e-ui-dt',    source: 'nx-ui',     target: 'nx-dt',     ...edgeStyle('blue', true)                                 },
  { id: 'nx-e-ui-fm',    source: 'nx-ui',     target: 'nx-fm',     ...edgeStyle('blue', true)                                 },
  // Platform internal
  { id: 'nx-e-sh-dt',    source: 'nx-shell',  target: 'nx-dt',     ...edgeStyle('cyan', true)                                 },
  { id: 'nx-e-sh-fm',    source: 'nx-shell',  target: 'nx-fm',     ...edgeStyle('cyan', true)                                 },
  { id: 'nx-e-sh-st',    source: 'nx-shell',  target: 'nx-st',     ...edgeStyle('cyan', true)                                 },
  { id: 'nx-e-dt-api',   source: 'nx-dt',     target: 'nx-api',    ...edgeStyle('cyan'),          label: 'data fetching'      },
  { id: 'nx-e-fm-api',   source: 'nx-fm',     target: 'nx-api',    ...edgeStyle('cyan'),          label: 'data fetching'      },
];

// ─── r2r sub-diagram ──────────────────────────────────────────────────────────
// Layout  (COL=380, ROW=300):
//   row 0: app/ (r2r team)   wattpm/ (platform-owned)
//   row 1: tests/e2e/        monitoring/

const r2rPkgs: Node<PackageNodeData>[] = [
  { id: 'r2r-app',  type: 'packageNode', position: { x: 0,   y: 0   }, data: { scope: 'r2r',            name: 'app/',        description: 'Next.js Standalone — output: standalone — server.js on port 3001 (internal only). R2R team owns all pages, routes, and components here.', colorScheme: 'emerald', tags: ['product']             } },
  { id: 'r2r-bff',  type: 'packageNode', position: { x: 380, y: 0   }, data: { scope: 'platform-owned', name: 'wattpm/',     description: 'Wattpm Gateway — port 3000 — public entry point. OIDC auth, RBAC validation, Redis session cache, reverse proxy to Next.js Standalone on :3001. Platform team owns this directory.', colorScheme: 'emerald', tags: ['platform', 'gateway'] } },
  { id: 'r2r-test', type: 'packageNode', position: { x: 0,   y: 300 }, data: { scope: 'r2r',            name: 'tests/e2e',   description: 'Playwright E2E — full financial workflow journeys. Auth fixtures, Wattpm-aware base URL, and financial domain helpers. Runs in CI against the Docker stack.', colorScheme: 'emerald', tags: ['testing']             } },
  { id: 'r2r-mon',  type: 'packageNode', position: { x: 380, y: 300 }, data: { scope: 'r2r',            name: 'monitoring/', description: 'Checkly monitoring-as-code — synthetic API and browser checks running in production. Alerts to PagerDuty on SLA breach.', colorScheme: 'emerald', tags: ['ops']                 } },
];

const r2rEdges: Edge[] = [
  { id: 'r2r-e1', source: 'r2r-bff',  target: 'r2r-app',  ...edgeStyle('emerald'),       label: 'proxy → :3001' },
  { id: 'r2r-e2', source: 'r2r-app',  target: 'r2r-test', ...edgeStyle('emerald', true), label: 'E2E coverage'  },
  { id: 'r2r-e3', source: 'r2r-bff',  target: 'r2r-mon',  ...edgeStyle('emerald', true), label: 'health checks' },
];

export const subDiagrams: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  'untitled-ui':        { nodes: untitledUIPkgs,  edges: untitledUIEdges   },
  'ui-nexus':           { nodes: uiNexusPkgs,     edges: uiNexusEdges      },
  'nextjs-boilerplate': { nodes: boilerplatePkgs, edges: boilerplateEdges  },
  'r2r':                { nodes: r2rPkgs,         edges: r2rEdges          },
};
