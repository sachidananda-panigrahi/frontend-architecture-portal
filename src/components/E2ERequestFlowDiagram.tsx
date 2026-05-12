import { useState, useEffect, useMemo, memo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface E2ENodeData extends Record<string, unknown> {
  label: string;
  sublabel: string;
  icon: string;
  layer: string;
  tech: string[];
  borderColor: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  active: boolean;
  dim: boolean;
  muted: boolean;
  kind: 'monorepo' | 'project' | 'runtime';
}

type E2ENodeType = Node<E2ENodeData, 'e2eNode'>;

interface FlowStep {
  label: string;
  description: string;
  activeNodes: string[];
  activeEdges: string[];
}

interface BaseNodeData {
  label: string;
  sublabel: string;
  icon: string;
  layer: string;
  tech: string[];
}

interface BaseNodeDef {
  id: string;
  position: { x: number; y: number };
  palette: keyof typeof C;
  kind: 'monorepo' | 'project' | 'runtime';
  data: BaseNodeData;
}

interface BaseEdgeDef {
  id: string;
  source: string;
  target: string;
  label: string;
  palette: keyof typeof C;
  dashed: boolean;
  edgeKind: 'build' | 'runtime' | 'bridge';
  sourceHandle?: string;
  targetHandle?: string;
}

// ─── Color palettes ───────────────────────────────────────────────────────────

const C = {
  emerald: { border: '#10b981', bg: '#022c22', text: '#6ee7b7', glow: 'rgba(16,185,129,0.45)', edge: '#10b981' },
  blue:    { border: '#3b82f6', bg: '#1e3a5f', text: '#93c5fd', glow: 'rgba(59,130,246,0.45)', edge: '#3b82f6' },
  cyan:    { border: '#06b6d4', bg: '#0c2a33', text: '#67e8f9', glow: 'rgba(6,182,212,0.45)',  edge: '#06b6d4' },
  rose:    { border: '#f43f5e', bg: '#1f0a10', text: '#fda4af', glow: 'rgba(244,63,94,0.45)',  edge: '#f43f5e' },
  violet:  { border: '#8b5cf6', bg: '#1e1535', text: '#c4b5fd', glow: 'rgba(139,92,246,0.45)', edge: '#8b5cf6' },
  indigo:  { border: '#6366f1', bg: '#1a1a40', text: '#a5b4fc', glow: 'rgba(99,102,241,0.45)', edge: '#6366f1' },
} as const;

const HANDLE_STYLE = { background: 'transparent', border: 'none', width: 8, height: 8 };

// ─── Custom node component ────────────────────────────────────────────────────

function E2ENodeComponent({ data }: NodeProps<E2ENodeType>) {
  const isBuildNode = data.kind !== 'runtime';
  const isMonorepo  = data.kind === 'monorepo';
  const buildBadge  = data.kind === 'project'
    ? '▲ NEXT.JS PROJECT · BUILD TIME'
    : '◆ MONOREPO · BUILD TIME';

  return (
    <>
      <Handle id="t-left"   type="target" position={Position.Left}   style={HANDLE_STYLE} />
      <Handle id="t-top"    type="target" position={Position.Top}    style={HANDLE_STYLE} />
      <Handle id="s-right"  type="source" position={Position.Right}  style={HANDLE_STYLE} />
      <Handle id="s-bottom" type="source" position={Position.Bottom} style={HANDLE_STYLE} />

      <div style={{
        border: `${isMonorepo ? 2 : 1.5}px solid ${
          data.active ? data.borderColor :
          data.dim    ? 'rgba(71,85,105,0.25)' :
          data.muted  ? 'rgba(71,85,105,0.15)' :
                        'rgba(71,85,105,0.45)'
        }`,
        background: data.active ? data.bgColor : 'rgba(15,23,42,0.88)',
        boxShadow: data.active ? `0 0 22px ${data.glowColor}, 0 0 7px ${data.glowColor}` : 'none',
        opacity: data.muted ? 0.22 : data.dim ? 0.3 : 1,
        transition: 'all 0.4s ease',
        borderRadius: isMonorepo ? 12 : 10,
        padding: '10px 13px',
        minWidth: 172,
        maxWidth: 196,
      }}>
        {isBuildNode && (
          <div style={{
            fontSize: 7,
            fontWeight: 700,
            color: data.active ? data.textColor : '#475569',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 4,
            paddingBottom: 3,
            borderBottom: `1px solid ${data.active ? `${data.borderColor}40` : 'rgba(71,85,105,0.2)'}`,
            transition: 'color 0.4s',
          }}>
            {buildBadge}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{data.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: data.active ? data.textColor : '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', transition: 'color 0.4s' }}>
              {data.layer}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: data.active ? '#f1f5f9' : data.dim ? '#334155' : data.muted ? '#1e293b' : '#64748b', lineHeight: 1.25, transition: 'color 0.4s' }}>
              {data.label}
            </div>
          </div>
        </div>

        {data.sublabel && (
          <div style={{ fontSize: 9.5, color: data.active ? data.textColor : '#334155', marginBottom: 5, lineHeight: 1.3, transition: 'color 0.4s' }}>
            {data.sublabel}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
          {data.tech.map((t) => (
            <span key={t} style={{
              fontSize: 8.5,
              padding: '1.5px 5px',
              borderRadius: 3,
              background: data.active ? `${data.borderColor}25` : 'rgba(30,41,59,0.8)',
              color: data.active ? data.textColor : '#334155',
              border: `1px solid ${data.active ? `${data.borderColor}40` : 'rgba(51,65,85,0.35)'}`,
              transition: 'all 0.4s',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

const E2ENode = memo(E2ENodeComponent);

// Module-level constant — NEVER define inside component
const nodeTypes = { e2eNode: E2ENode };

// ─── Constants ────────────────────────────────────────────────────────────────

const BUILD_STEP_COUNT = 2;

// ─── Static node definitions ──────────────────────────────────────────────────

const BASE_NODES: BaseNodeDef[] = [
  // ── Build-time layer (top row, y = 0) ─────────────────────────────────────
  {
    id: 'ui-nexus', position: { x: 0, y: 0 }, palette: 'violet', kind: 'monorepo',
    data: {
      label: 'ui-nexus', sublabel: 'Platform Monorepo', icon: '🏗️', layer: 'Platform Monorepo',
      tech: ['@hr/ui', '@hr/tokens', '@hr/shell', '@hr/data-table', '@hr/tsconfig', '+8 pkgs'],
    },
  },
  {
    id: 'r2r-repo', position: { x: 560, y: 0 }, palette: 'emerald', kind: 'project',
    data: {
      label: 'record-to-report', sublabel: 'R2R Application', icon: '🚀', layer: 'Application',
      tech: ['Next.js 15', 'standalone output', 'Wattpm Gateway', 'Finance Pages'],
    },
  },

  // ── Runtime layer ─────────────────────────────────────────────────────────
  {
    id: 'browser', position: { x: 0, y: 555 }, palette: 'emerald', kind: 'runtime',
    data: { label: 'Browser', sublabel: 'User entry point', icon: '🌐', layer: 'Client', tech: ['RSC hydration', 'HttpOnly cookie', 'React 19'] },
  },
  {
    id: 'bff', position: { x: 220, y: 430 }, palette: 'cyan', kind: 'runtime',
    data: { label: 'Wattpm Gateway', sublabel: 'Entry point · port 3000', icon: '⚙️', layer: 'Gateway', tech: ['OIDC auth', 'RBAC validate', 'Redis cache', 'Reverse proxy'] },
  },
  {
    id: 'rsc', position: { x: 490, y: 280 }, palette: 'blue', kind: 'runtime',
    data: { label: 'Next.js Standalone', sublabel: 'server.js · port 3001 internal', icon: '⚡', layer: 'Frontend', tech: ['standalone output', 'App Router', 'RSC', 'Streaming SSR'] },
  },
  {
    id: 'shell', position: { x: 490, y: 620 }, palette: 'blue', kind: 'runtime',
    data: { label: 'Platform Shell', sublabel: 'HighradiusPlatformShell', icon: '🛡️', layer: 'Frontend', tech: ['Sentry', 'PostHog', 'Arcjet', 'RBAC', 'i18n'] },
  },
  {
    id: 'identity', position: { x: 810, y: 275 }, palette: 'rose', kind: 'runtime',
    data: { label: 'Identity Service', sublabel: 'OIDC Provider', icon: '🔐', layer: 'Auth Microservice', tech: ['OpenID Connect', 'JWKS', 'JWT', 'SSO / SAML'] },
  },
  {
    id: 'user-svc', position: { x: 810, y: 450 }, palette: 'violet', kind: 'runtime',
    data: { label: 'User Service', sublabel: 'Profile & Preferences', icon: '👤', layer: 'User Microservice', tech: ['REST API', 'Bearer token', 'Redis 10m'] },
  },
  {
    id: 'recon', position: { x: 810, y: 630 }, palette: 'indigo', kind: 'runtime',
    data: { label: 'Reconciliation Svc', sublabel: 'Finance domain', icon: '📊', layer: 'Domain Microservice', tech: ['GraphQL', 'Typed schema', 'Bearer token'] },
  },
  {
    id: 'journal', position: { x: 810, y: 800 }, palette: 'indigo', kind: 'runtime',
    data: { label: 'Journal Entry Svc', sublabel: 'Finance domain', icon: '📒', layer: 'Domain Microservice', tech: ['GraphQL', 'Typed schema', 'Bearer token'] },
  },
];

// ─── Static edge definitions ──────────────────────────────────────────────────

const BASE_EDGES: BaseEdgeDef[] = [
  // ── Build-time chain ──────────────────────────────────────────────────────
  { id: 'e-nexus-r2r',   source: 'ui-nexus', target: 'r2r-repo', label: 'all platform pkgs', palette: 'violet',  dashed: false, edgeKind: 'build' },

  // ── Bridge edges: build → runtime ────────────────────────────────────────
  { id: 'e-r2r-rsc',     source: 'r2r-repo', target: 'rsc',   label: 'ships Standalone', palette: 'emerald', dashed: true, edgeKind: 'bridge', sourceHandle: 's-bottom', targetHandle: 't-top' },
  { id: 'e-r2r-bff',     source: 'r2r-repo', target: 'bff',   label: 'ships Gateway',    palette: 'emerald', dashed: true, edgeKind: 'bridge', sourceHandle: 's-bottom', targetHandle: 't-top' },
  { id: 'e-nexus-shell', source: 'ui-nexus', target: 'shell', label: 'publishes Shell',  palette: 'violet',  dashed: true, edgeKind: 'bridge', sourceHandle: 's-bottom', targetHandle: 't-top' },

  // ── Runtime request flow ──────────────────────────────────────────────────
  { id: 'e-browser-bff',  source: 'browser', target: 'bff',      label: 'GET /reconciliation', palette: 'emerald', dashed: false, edgeKind: 'runtime' },
  { id: 'e-bff-rsc',      source: 'bff',     target: 'rsc',      label: 'proxy → :3001',       palette: 'cyan',    dashed: false, edgeKind: 'runtime' },
  { id: 'e-rsc-shell',    source: 'rsc',     target: 'shell',    label: 'renders shell',       palette: 'blue',    dashed: true,  edgeKind: 'runtime', sourceHandle: 's-bottom', targetHandle: 't-top' },
  { id: 'e-rsc-bff',      source: 'rsc',     target: 'bff',      label: 'fetch /api/* data',   palette: 'cyan',    dashed: false, edgeKind: 'runtime' },
  { id: 'e-bff-identity', source: 'bff',     target: 'identity', label: 'OIDC / JWT',          palette: 'rose',    dashed: false, edgeKind: 'runtime' },
  { id: 'e-bff-user',     source: 'bff',     target: 'user-svc', label: 'User profile',        palette: 'violet',  dashed: false, edgeKind: 'runtime' },
  { id: 'e-bff-recon',    source: 'bff',     target: 'recon',    label: 'GraphQL query',       palette: 'indigo',  dashed: false, edgeKind: 'runtime' },
  { id: 'e-bff-journal',  source: 'bff',     target: 'journal',  label: 'GraphQL query',       palette: 'indigo',  dashed: false, edgeKind: 'runtime' },
];

// ─── Animation steps ──────────────────────────────────────────────────────────

const STEPS: FlowStep[] = [
  // ── Build-time phase (steps 0-1) ─────────────────────────────────────────
  {
    label: '① ui-nexus Published',
    description: 'ui-nexus is the single platform monorepo. Turborepo builds packages in dependency order: config → ui → platform. Semantic Release publishes 13 versioned packages to the private registry — @hr/tsconfig, @hr/ui, @hr/shell, @hr/data-table, and more.',
    activeNodes: ['ui-nexus'],
    activeEdges: [],
  },
  {
    label: '② R2R App Assembled',
    description: 'record-to-report builds two runtime processes: Wattpm Gateway (port 3000, public entry) and Next.js Standalone server (port 3001, internal only). PlatformShell from @hr/shell is mounted in layout.tsx. Wattpm reverse-proxies all traffic to the standalone server.',
    activeNodes: ['ui-nexus', 'r2r-repo', 'rsc', 'bff', 'shell'],
    activeEdges: ['e-nexus-r2r', 'e-r2r-rsc', 'e-r2r-bff', 'e-nexus-shell'],
  },
  // ── Runtime request phase (steps 2-11) ───────────────────────────────────
  {
    label: '③ Browser → Wattpm Gateway',
    description: 'User navigates to the R2R URL. Browser sends GET /reconciliation to Wattpm Gateway on port 3000 — the only public-facing entry point. Next.js Standalone (port 3001) is never exposed directly to the internet.',
    activeNodes: ['browser', 'bff'],
    activeEdges: ['e-browser-bff'],
  },
  {
    label: '④ Auth Check at Gateway',
    description: 'Wattpm inspects the hr_session HttpOnly cookie. No valid session is found. Gateway issues a 302 redirect to the Identity Service /authorize endpoint. All authentication is handled by Wattpm — Next.js Standalone never receives unauthenticated requests.',
    activeNodes: ['bff', 'identity'],
    activeEdges: ['e-bff-identity'],
  },
  {
    label: '⑤ OIDC Auth + JWT Cached',
    description: 'Identity Service returns id_token + access_token after SSO/SAML login. Wattpm verifies JWT signature against the JWKS endpoint. RBAC roles are extracted and cached in Redis (5 min TTL). HttpOnly hr_session cookie is written to the browser.',
    activeNodes: ['bff', 'identity'],
    activeEdges: ['e-bff-identity'],
  },
  {
    label: '⑥ Gateway Proxies to Standalone',
    description: 'Wattpm reverse-proxies the authenticated request to Next.js Standalone on port 3001 (internal). The validated JWT and RBAC context are forwarded as request headers. Next.js Standalone handles rendering only — it never performs authentication.',
    activeNodes: ['bff', 'rsc'],
    activeEdges: ['e-bff-rsc'],
  },
  {
    label: '⑦ Shell Mounts',
    description: 'Next.js Standalone receives the proxied request. layout.tsx runs on the Node.js server.js process. HighradiusPlatformShell boots: Sentry, PostHog, Arcjet, RBAC boundary, and i18n provider all initialise using the RBAC context forwarded by the gateway.',
    activeNodes: ['rsc', 'shell'],
    activeEdges: ['e-rsc-shell'],
  },
  {
    label: '⑧ RSC → Wattpm API Routes',
    description: 'Server Components call fetch("/api/*"). These requests route back to Wattpm\'s own API route handlers — Wattpm is both the gateway and the data API layer. The standalone server delegates all upstream service calls to Wattpm, never calling microservices directly.',
    activeNodes: ['rsc', 'bff'],
    activeEdges: ['e-rsc-bff'],
  },
  {
    label: '⑨ User Profile Fetch',
    description: 'Wattpm calls User Service REST API with the Bearer access_token (retrieved from the cached session). Returns name, email, org, and preferences. Result cached in Redis for 10 min, keyed by userId.',
    activeNodes: ['bff', 'user-svc'],
    activeEdges: ['e-bff-user'],
  },
  {
    label: '⑩ Domain Data — Parallel',
    description: 'RSC fires Promise.all(). Wattpm simultaneously executes typed GraphQL queries to Reconciliation Service and Journal Entry Service using the GraphQL Codegen SDK — schema types enforced at compile time.',
    activeNodes: ['bff', 'recon', 'journal'],
    activeEdges: ['e-bff-recon', 'e-bff-journal'],
  },
  {
    label: '⑪ Data Assembled',
    description: 'Wattpm returns typed, validated responses to Next.js RSC. GraphQL Codegen TypeScript types ensure correct shape at compile time — a schema break surfaces as a TS error, not a runtime crash. Response flows: Wattpm → Standalone → HTML stream.',
    activeNodes: ['rsc', 'bff'],
    activeEdges: ['e-rsc-bff'],
  },
  {
    label: '⑫ Application Live',
    description: 'Wattpm Gateway streams the final HTML response to the browser. React hydrates client components inside PlatformShell. Full stack live: Browser → Wattpm Gateway (auth + proxy, :3000) → Next.js Standalone (render, :3001) → Wattpm API (data) → Microservices.',
    activeNodes: ['browser', 'rsc', 'shell', 'bff'],
    activeEdges: ['e-browser-bff', 'e-bff-rsc', 'e-rsc-shell'],
  },
];

// ─── Builder helpers ──────────────────────────────────────────────────────────

function buildNode(base: BaseNodeDef, active: boolean, dim: boolean, muted: boolean): Node<E2ENodeData> {
  const col = C[base.palette];
  return {
    id: base.id,
    type: 'e2eNode',
    position: base.position,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      ...base.data,
      borderColor: col.border,
      bgColor: col.bg,
      textColor: col.text,
      glowColor: col.glow,
      active,
      dim,
      muted,
      kind: base.kind,
    },
  };
}

function buildEdge(base: BaseEdgeDef, active: boolean, dim: boolean, muted: boolean): Edge {
  const col = C[base.palette];
  const stroke = active ? col.edge
    : dim    ? 'rgba(71,85,105,0.2)'
    : muted  ? 'rgba(71,85,105,0.12)'
    :           'rgba(71,85,105,0.4)';
  const opacity = muted ? 0.18 : dim ? 0.25 : 1;
  return {
    id: base.id,
    source: base.source,
    target: base.target,
    label: base.label,
    type: 'smoothstep',
    animated: active && !base.dashed,
    sourceHandle: base.sourceHandle,
    targetHandle: base.targetHandle,
    style: { stroke, strokeWidth: active ? 2.5 : 1.5, strokeDasharray: base.dashed ? '6 4' : undefined, opacity, transition: 'all 0.4s ease' },
    markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 14, height: 14 },
    labelStyle: { fontSize: 9, fontWeight: 600, fill: active ? col.text : '#475569' },
    labelBgStyle: { fill: '#0f172a', fillOpacity: muted ? 0 : 0.9 },
    labelBgPadding: [4, 8] as [number, number],
    labelBgBorderRadius: 4,
  };
}

// ─── Diagram component ────────────────────────────────────────────────────────

interface E2ERequestFlowDiagramProps {
  fluid?: boolean;
}

export function E2ERequestFlowDiagram({ fluid = false }: E2ERequestFlowDiagramProps) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const current      = step >= 0 ? STEPS[step] : null;
  const isBuildStep  = step >= 0 && step < BUILD_STEP_COUNT;
  const isRuntimeStep = step >= BUILD_STEP_COUNT;

  const computedNodes = useMemo((): Node<E2ENodeData>[] => {
    const cur     = step >= 0 ? STEPS[step] : null;
    const isBuild   = step >= 0 && step < BUILD_STEP_COUNT;
    const isRuntime = step >= BUILD_STEP_COUNT;
    return BASE_NODES.map((b) => {
      const isBuildNode = b.kind !== 'runtime';
      const muted  = (isBuild && !isBuildNode) || (isRuntime && isBuildNode);
      const active = !!cur && cur.activeNodes.includes(b.id);
      const dim    = cur !== null && !active && !muted;
      return buildNode(b, active, dim, muted);
    });
  }, [step]);

  const computedEdges = useMemo((): Edge[] => {
    const cur     = step >= 0 ? STEPS[step] : null;
    const isBuild   = step >= 0 && step < BUILD_STEP_COUNT;
    const isRuntime = step >= BUILD_STEP_COUNT;
    return BASE_EDGES.map((b) => {
      const muted  = (isBuild && b.edgeKind === 'runtime')
        || (isRuntime && (b.edgeKind === 'build' || b.edgeKind === 'bridge'));
      const active = !!cur && cur.activeEdges.includes(b.id);
      const dim    = cur !== null && !active && !muted;
      return buildEdge(b, active, dim, muted);
    });
  }, [step]);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<E2ENodeData>>(computedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(computedEdges);

  useEffect(() => { setNodes(computedNodes); }, [computedNodes, setNodes]);
  useEffect(() => { setEdges(computedEdges); }, [computedEdges, setEdges]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setStep((p) => (p < STEPS.length - 1 ? p + 1 : p)), 2600);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    if (playing && step >= STEPS.length - 1) setPlaying(false);
  }, [playing, step]);

  const handlePlay  = () => { if (step < 0 || step >= STEPS.length - 1) setStep(0); setPlaying(true); };
  const handlePause = () => setPlaying(false);
  const handleReset = () => { setStep(-1); setPlaying(false); };
  const handlePrev  = () => { setPlaying(false); setStep((p) => Math.max(-1, p - 1)); };
  const handleNext  = () => { setPlaying(false); setStep((p) => Math.min(STEPS.length - 1, p + 1)); };

  const phaseLabel = isBuildStep ? '◆ Build Phase' : isRuntimeStep ? '⚡ Runtime Phase' : null;

  const outerCls = fluid
    ? 'flex flex-col h-full overflow-hidden bg-slate-950'
    : 'my-6 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950';

  return (
    <div className={outerCls}>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-700/60 bg-slate-900/70 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-0.5">
          <button onClick={handlePrev} disabled={step < 0} title="Previous" className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors">
            <ChevronLeft size={14} />
          </button>
          {playing
            ? <button onClick={handlePause} title="Pause" className="p-1.5 rounded-md text-amber-400 hover:bg-slate-800 transition-colors"><Pause size={14} /></button>
            : <button onClick={handlePlay}  title="Play"  className="p-1.5 rounded-md text-emerald-400 hover:bg-slate-800 transition-colors"><Play size={14} /></button>
          }
          <button onClick={handleNext} disabled={step >= STEPS.length - 1} title="Next" className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-colors">
            <ChevronRight size={14} />
          </button>
          <button onClick={handleReset} title="Reset" className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
            <RotateCcw size={11} />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700/60 shrink-0" />

        {phaseLabel && (
          <>
            <span className={`text-xs font-bold shrink-0 ${isBuildStep ? 'text-violet-400' : 'text-emerald-400'}`}>
              {phaseLabel}
            </span>
            <div className="h-4 w-px bg-slate-700/60 shrink-0" />
          </>
        )}

        <div className="flex-1 min-w-0">
          {current
            ? <span className="text-xs font-semibold text-hira-400">{current.label}</span>
            : <span className="text-xs text-slate-600">Press ▶ to animate — 2 build steps + 10 runtime steps · Wattpm Gateway → Next.js Standalone</span>
          }
        </div>

        <span className="text-xs text-slate-600 shrink-0 tabular-nums font-mono">
          {step >= 0 ? step + 1 : 0} / {STEPS.length}
        </span>
      </div>

      {/* ── Step description ── */}
      <div className={`overflow-hidden transition-all duration-300 shrink-0 ${current ? 'max-h-24' : 'max-h-0'}`}>
        <p className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 text-xs text-slate-300 leading-5">
          {current?.description ?? ''}
        </p>
      </div>

      {/* ── Legend row ── */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-800/60 bg-slate-950/80 overflow-x-auto shrink-0">
        <span className="text-xs font-bold text-violet-500 shrink-0 uppercase tracking-wider">Build</span>
        {([
          ['🏗️', '#8b5cf6', 'ui-nexus'],
          ['🚀', '#10b981', 'record-to-report'],
        ] as const).map(([icon, color, label]) => (
          <div key={label} className="flex items-center gap-1.5 shrink-0">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: 'inline-block', flexShrink: 0 }} />
            <span className="text-xs text-slate-500 whitespace-nowrap">{icon} {label}</span>
          </div>
        ))}
        <div className="h-4 w-px bg-slate-700/60 shrink-0 mx-1" />
        <span className="text-xs font-bold text-emerald-600 shrink-0 uppercase tracking-wider">Runtime</span>
        {([
          ['🌐', '#10b981', 'Client'],
          ['⚡', '#3b82f6', 'Frontend'],
          ['⚙️', '#06b6d4', 'Gateway'],
          ['🔐', '#f43f5e', 'Auth'],
          ['👤', '#8b5cf6', 'User Svc'],
          ['📊', '#6366f1', 'Domain Svcs'],
        ] as const).map(([icon, color, label]) => (
          <div key={label} className="flex items-center gap-1.5 shrink-0">
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
            <span className="text-xs text-slate-500 whitespace-nowrap">{icon} {label}</span>
          </div>
        ))}
      </div>

      {/* ── React Flow canvas ── */}
      <div className={fluid ? 'flex-1 min-h-0' : ''} style={fluid ? undefined : { height: 940 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          colorMode="dark"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          panOnScroll
          minZoom={0.2}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e293b" />
          <Controls
            position="bottom-left"
            className="!bottom-4 !left-4 !rounded-xl !border !border-slate-700/70 !bg-slate-900/90"
            showInteractive={false}
          />
        </ReactFlow>
      </div>

      {/* ── Step progress bar: build | runtime ── */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-slate-800/60 bg-slate-950 shrink-0">
        {STEPS.slice(0, BUILD_STEP_COUNT).map((s, i) => (
          <button
            key={i}
            onClick={() => { setPlaying(false); setStep(i); }}
            title={s.label}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              i < step   ? 'bg-violet-600' :
              i === step ? 'bg-violet-400 scale-y-150' :
                           'bg-violet-900/50 hover:bg-violet-800/50'
            }`}
          />
        ))}
        <div className="w-px h-3 bg-slate-600/70 shrink-0 mx-0.5" />
        {STEPS.slice(BUILD_STEP_COUNT).map((s, i) => {
          const g = i + BUILD_STEP_COUNT;
          return (
            <button
              key={g}
              onClick={() => { setPlaying(false); setStep(g); }}
              title={s.label}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                g < step   ? 'bg-hira-600' :
                g === step ? 'bg-hira-400 scale-y-150' :
                              'bg-slate-700 hover:bg-slate-600'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
