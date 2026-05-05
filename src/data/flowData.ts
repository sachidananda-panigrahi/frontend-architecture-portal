import type { Node, Edge } from '@xyflow/react';
import { MarkerType, Position } from '@xyflow/react';
import type { RepoNodeData, PackageNodeData } from '../types';

// ─── colour palettes per repo ───────────────────────────────────────────────
export const COLORS = {
  violet:  { border: '#7c3aed', bg: '#1e1b4b', text: '#ddd6fe', badge: '#4c1d95', badgeTxt: '#ddd6fe', edge: '#7c3aed', glow: 'rgba(124,58,237,0.25)' },
  blue:    { border: '#2563eb', bg: '#1e3a5f', text: '#bfdbfe', badge: '#1e3a8a', badgeTxt: '#dbeafe', edge: '#3b82f6', glow: 'rgba(59,130,246,0.25)'  },
  cyan:    { border: '#0891b2', bg: '#0c2a33', text: '#a5f3fc', badge: '#0e4f5e', badgeTxt: '#cffafe', edge: '#06b6d4', glow: 'rgba(6,182,212,0.25)'   },
  emerald: { border: '#16a34a', bg: '#0c2716', text: '#bbf7d0', badge: '#14532d', badgeTxt: '#dcfce7', edge: '#22c55e', glow: 'rgba(34,197,94,0.25)'   },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const edgeStyle = (scheme: keyof typeof COLORS, dashed = false): Partial<Edge> => ({
  animated: !dashed,
  style: {
    stroke: COLORS[scheme].edge,
    strokeWidth: dashed ? 1.5 : 2.5,
    strokeDasharray: dashed ? '6 4' : undefined,
    opacity: dashed ? 0.55 : 1,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: COLORS[scheme].edge,
    width: 16,
    height: 16,
  },
  labelStyle:   { fill: COLORS[scheme].text, fontSize: 11, fontWeight: 600 },
  labelBgStyle: { fill: COLORS[scheme].bg, fillOpacity: 0.9 },
  labelBgPadding: [5, 10] as [number, number],
  labelBgBorderRadius: 6,
});

// ════════════════════════════════════════════════════════════════════════════
// MAIN DIAGRAM
// ════════════════════════════════════════════════════════════════════════════

export const mainNodes: Node<RepoNodeData>[] = [
  {
    id: 'ui-config',
    type: 'repoNode',
    position: { x: 0, y: 140 },
    data: {
      label: 'highradius_ui_config',
      subtitle: 'Governance Hub',
      colorScheme: 'violet',
      icon: '⚙️',
      repo: 'GitHub Repo #1',
      description: 'Publishes shareable config packages. Zero runtime code. Enforces code quality & consistency across all engineering teams.',
      packages: ['@hr/tsconfig', '@hr/tailwind-config', '@hr/oxlint-config', '@hr/commitlint-config', '@hr/lefthook-config'],
      tools: ['Oxlint', 'Oxfmt', 'Lefthook', 'Commitlint', 'Commitizen', 'Knip', 'Semantic Release'],
      docId: 'ui-config',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'core-ui',
    type: 'repoNode',
    position: { x: 430, y: 0 },
    data: {
      label: 'highradius_core_ui',
      subtitle: 'Atom Design System',
      colorScheme: 'blue',
      icon: '💎',
      repo: 'GitHub Repo #2',
      description: 'Pure, stateless React components built on Untitled UI with HiRa theme. No business logic. No API calls.',
      packages: ['@hr/core-ui', '@hr/tokens'],
      tools: ['Vitest (Browser)', 'Visual Regression', 'Storybook', 'Semantic Release', 'Codecov'],
      docId: 'core-ui',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'aps-ui',
    type: 'repoNode',
    position: { x: 430, y: 330 },
    data: {
      label: 'highradius_aps_ui',
      subtitle: 'Platform Shell',
      colorScheme: 'cyan',
      icon: '🛡️',
      repo: 'GitHub Repo #3',
      description: 'Platform-team-owned shell enforcing RBAC, Sentry, PostHog, Arcjet, i18n. Smart composite components.',
      packages: ['@hr/shell', '@hr/data-table', '@hr/forms', '@hr/state', '@hr/api-client'],
      tools: ['Zustand', 'RHF + Zod', 'next-intl', 'Sentry', 'PostHog', 'Arcjet', 'LogTape'],
      docId: 'aps-ui',
      hasSubDiagram: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: 'r2r',
    type: 'repoNode',
    position: { x: 870, y: 140 },
    data: {
      label: 'record-to-report',
      subtitle: 'Next.js Product App',
      colorScheme: 'emerald',
      icon: '🚀',
      repo: 'GitHub Repo #4',
      description: 'Standalone Next.js App Router product. Platform team co-owns BFF layer. R2R team builds inside the shell.',
      packages: ['Next.js App Router', 'Wattpm BFF', 'GraphQL Codegen', 'Playwright E2E'],
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
    id: 'e-uc-cu',
    source: 'ui-config',
    target: 'core-ui',
    label: 'Config Packages',
    ...edgeStyle('violet'),
  },
  {
    id: 'e-uc-au',
    source: 'ui-config',
    target: 'aps-ui',
    label: 'Config Packages',
    ...edgeStyle('violet', true),
  },
  {
    id: 'e-cu-au',
    source: 'core-ui',
    target: 'aps-ui',
    label: '@hr/core-ui · @hr/tokens',
    ...edgeStyle('blue'),
  },
  {
    id: 'e-au-r2r',
    source: 'aps-ui',
    target: 'r2r',
    label: '@hr/shell · @hr/data-table · more',
    ...edgeStyle('cyan'),
  },
  {
    id: 'e-uc-r2r',
    source: 'ui-config',
    target: 'r2r',
    label: 'Config Packages',
    ...edgeStyle('violet', true),
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SUB-DIAGRAMS (drill-down per repo)
// ════════════════════════════════════════════════════════════════════════════

// ── ui-config sub ────────────────────────────────────────────────────────────
const uiConfigPkgs: Node<PackageNodeData>[] = [
  { id: 'uc-tsc',   type: 'packageNode', position: { x: 0,   y: 0   }, data: { scope: '@highradius', name: 'tsconfig',          description: 'base · nextjs · library presets', colorScheme: 'violet', tags: ['config'] } },
  { id: 'uc-tw',    type: 'packageNode', position: { x: 280, y: 0   }, data: { scope: '@highradius', name: 'tailwind-config',    description: 'Design tokens, HiRa theme base', colorScheme: 'violet', tags: ['config'] } },
  { id: 'uc-ox',    type: 'packageNode', position: { x: 0,   y: 180 }, data: { scope: '@highradius', name: 'oxlint-config',      description: 'Ultracite preset + HiRa rules', colorScheme: 'violet', tags: ['linting'] } },
  { id: 'uc-cl',    type: 'packageNode', position: { x: 280, y: 180 }, data: { scope: '@highradius', name: 'commitlint-config',  description: 'Conventional commit enforcement', colorScheme: 'violet', tags: ['git'] } },
  { id: 'uc-lh',    type: 'packageNode', position: { x: 140, y: 360 }, data: { scope: '@highradius', name: 'lefthook-config',    description: 'Shareable git hook definitions', colorScheme: 'violet', tags: ['git'] } },
];
const uiConfigEdges: Edge[] = [];

// ── core-ui sub ────────────────────────────────────────────────────────────
const coreUiPkgs: Node<PackageNodeData>[] = [
  { id: 'cu-core',  type: 'packageNode', position: { x: 0,   y: 80  }, data: { scope: '@highradius', name: 'core-ui',  description: 'Button · Chip · TextField · Dropdown · Avatar · Grid · Tree', colorScheme: 'blue', tags: ['components', 'ui'] } },
  { id: 'cu-tok',   type: 'packageNode', position: { x: 340, y: 80  }, data: { scope: '@highradius', name: 'tokens',   description: 'CSS custom properties + JS token exports', colorScheme: 'blue', tags: ['design'] } },
  { id: 'cu-sb',    type: 'packageNode', position: { x: 170, y: 280 }, data: { scope: 'internal',    name: 'storybook', description: 'Component documentation & visual testing (not published)', colorScheme: 'blue', tags: ['internal'] } },
];
const coreUiEdges: Edge[] = [
  { id: 'cu-e1', source: 'cu-core', target: 'cu-sb', ...edgeStyle('blue', true), label: 'stories' },
  { id: 'cu-e2', source: 'cu-tok',  target: 'cu-core', ...edgeStyle('blue'), label: 'design tokens' },
];

// ── aps-ui sub ────────────────────────────────────────────────────────────
const apsUiPkgs: Node<PackageNodeData>[] = [
  { id: 'au-shell', type: 'packageNode', position: { x: 220, y: 0   }, data: { scope: '@highradius', name: 'shell',      description: 'HighradiusPlatformShell — RBAC · Sentry · PostHog · Arcjet · i18n', colorScheme: 'cyan', tags: ['platform', 'core'] } },
  { id: 'au-dt',    type: 'packageNode', position: { x: 0,   y: 220 }, data: { scope: '@highradius', name: 'data-table', description: 'Grid + CRUD + Renderer System + server-side state', colorScheme: 'cyan', tags: ['components'] } },
  { id: 'au-fm',    type: 'packageNode', position: { x: 220, y: 220 }, data: { scope: '@highradius', name: 'forms',      description: 'React Hook Form + Zod — standardised HiRa form patterns', colorScheme: 'cyan', tags: ['components'] } },
  { id: 'au-st',    type: 'packageNode', position: { x: 440, y: 220 }, data: { scope: '@highradius', name: 'state',      description: 'Zustand store factories for complex UI state', colorScheme: 'cyan', tags: ['state'] } },
  { id: 'au-api',   type: 'packageNode', position: { x: 110, y: 420 }, data: { scope: '@highradius', name: 'api-client', description: 'Typed fetcher + TanStack Query config + cache management', colorScheme: 'cyan', tags: ['data'] } },
];
const apsUiEdges: Edge[] = [
  { id: 'au-e1', source: 'au-shell', target: 'au-dt',  ...edgeStyle('cyan', true) },
  { id: 'au-e2', source: 'au-shell', target: 'au-fm',  ...edgeStyle('cyan', true) },
  { id: 'au-e3', source: 'au-shell', target: 'au-st',  ...edgeStyle('cyan', true) },
  { id: 'au-e4', source: 'au-dt',    target: 'au-api', ...edgeStyle('cyan'), label: 'data fetching' },
  { id: 'au-e5', source: 'au-fm',    target: 'au-api', ...edgeStyle('cyan'), label: 'data fetching' },
];

// ── r2r sub ───────────────────────────────────────────────────────────────
const r2rPkgs: Node<PackageNodeData>[] = [
  { id: 'r2r-app',  type: 'packageNode', position: { x: 0,   y: 100 }, data: { scope: 'r2r',          name: 'app/',      description: 'Next.js App Router pages · R2R team owns this', colorScheme: 'emerald', tags: ['product'] } },
  { id: 'r2r-bff',  type: 'packageNode', position: { x: 340, y: 0   }, data: { scope: 'platform-owned', name: 'bff/',    description: 'Wattpm BFF · RBAC token validation · Redis cache · GraphQL proxy', colorScheme: 'emerald', tags: ['platform', 'bff'] } },
  { id: 'r2r-test', type: 'packageNode', position: { x: 0,   y: 300 }, data: { scope: 'r2r',          name: 'tests/e2e', description: 'Playwright — full financial workflow journeys', colorScheme: 'emerald', tags: ['testing'] } },
  { id: 'r2r-mon',  type: 'packageNode', position: { x: 340, y: 300 }, data: { scope: 'r2r',          name: 'monitoring/', description: 'Checkly monitoring-as-code · Synthetic checks', colorScheme: 'emerald', tags: ['ops'] } },
];
const r2rEdges: Edge[] = [
  { id: 'r2r-e1', source: 'r2r-app', target: 'r2r-bff',  ...edgeStyle('emerald'), label: 'RSC → BFF API' },
  { id: 'r2r-e2', source: 'r2r-app', target: 'r2r-test', ...edgeStyle('emerald', true), label: 'E2E coverage' },
  { id: 'r2r-e3', source: 'r2r-bff', target: 'r2r-mon',  ...edgeStyle('emerald', true), label: 'health checks' },
];

export const subDiagrams: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  'ui-config': { nodes: uiConfigPkgs, edges: uiConfigEdges },
  'core-ui':   { nodes: coreUiPkgs,  edges: coreUiEdges   },
  'aps-ui':    { nodes: apsUiPkgs,   edges: apsUiEdges    },
  'r2r':       { nodes: r2rPkgs,     edges: r2rEdges      },
};
