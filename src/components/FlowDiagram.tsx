import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import { RepoNode } from './nodes/RepoNode';
import { PackageNode } from './nodes/PackageNode';
import { useBreakpoint } from '../hooks/use-breakpoint';
import { mainNodes, mainEdges, subDiagrams, COLORS } from '../data/flowData';
import type { RepoNodeData } from '../types';

const nodeTypes = { repoNode: RepoNode, packageNode: PackageNode };

function nodeColor(node: Node): string {
  const data = node.data as Partial<RepoNodeData>;
  if (!data.colorScheme) return '#334155';
  return COLORS[data.colorScheme as keyof typeof COLORS]?.border ?? '#334155';
}

interface ControllerProps {
  view: string;
  fitPadding: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

function DiagramController({ view, fitPadding, setNodes, setEdges }: ControllerProps) {
  const { fitView } = useReactFlow();
  const prevView = useRef<string>('');
  const fitPaddingRef = useRef(fitPadding);

  useEffect(() => {
    fitPaddingRef.current = fitPadding;
  }, [fitPadding]);

  useEffect(() => {
    if (prevView.current === view) return;

    const isInitialMount = prevView.current === '';
    prevView.current = view;

    const data =
      view === 'main'
        ? { nodes: mainNodes, edges: mainEdges }
        : (subDiagrams[view] ?? { nodes: mainNodes, edges: mainEdges });

    setNodes(data.nodes as Node[]);
    setEdges(data.edges as Edge[]);

    // Keep resize behavior stable; only re-fit when the diagram view changes.
    const timer = setTimeout(() => {
      fitView({
        padding: fitPaddingRef.current,
        duration: isInitialMount ? 0 : 700,
      });
    }, isInitialMount ? 0 : 60);

    return () => clearTimeout(timer);
  }, [view, setNodes, setEdges, fitView]);

  return null;
}

export function FlowDiagram(_props: Record<string, never> = {}) {
  const [view, setView] = useState<string>('main');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(mainNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(mainEdges as Edge[]);
  const isMediumUp = useBreakpoint('md');
  const isLargeUp = useBreakpoint('lg');

  const fitPadding = view === 'main'
    ? (isLargeUp ? 0.18 : isMediumUp ? 0.24 : 0.32)
    : (isLargeUp ? 0.22 : isMediumUp ? 0.28 : 0.36);

  const minimapStyle = useMemo(
    () => (isLargeUp
      ? { background: '#0f172a', borderRadius: 16, border: '1px solid #334155', top: 'auto', left: 'auto', right: 16, bottom: 16 }
      : { background: '#0f172a', borderRadius: 14, border: '1px solid #334155', top: 'auto', left: 'auto', right: 12, bottom: 12, width: 140, height: 92 }),
    [isLargeUp],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (view === 'main') {
        const data = node.data as RepoNodeData;
        if (data.hasSubDiagram) {
          setView(node.id);
        }
      }
    },
    [view],
  );

  const goBack = () => {
    setView('main');
  };

  const repoNames: Record<string, string> = {
    'untitled-ui':        'untitled-ui',
    'ui-nexus':           'ui-nexus',
    'nextjs-boilerplate': 'nextjs-boilerplate',
    'r2r':                'record-to-report',
  };

  // Color hint badge per repo for breadcrumb
  const repoColors: Record<string, string> = {
    'untitled-ui':        'text-amber-400',
    'ui-nexus':           'text-violet-400',
    'nextjs-boilerplate': 'text-blue-400',
    'r2r':                'text-emerald-400',
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_28%)]">
      <div className="pointer-events-none absolute inset-0 bg-slate-950/45" />

      <div className="absolute left-3 top-3 z-10 max-w-[calc(100vw_-_2rem)]">
        {view !== 'main' ? (
          <button
            onClick={goBack}
            className="flex max-w-[calc(100vw_-_2rem)] items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-700/70 bg-slate-900/88 px-3 py-2 text-sm font-medium text-slate-100 shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Overview
            <span className="mx-1 text-slate-500">/</span>
            <span className={repoColors[view] ?? 'text-slate-300'}>{repoNames[view] ?? view}</span>
          </button>
        ) : (
          <div className="flex max-w-[min(30rem,calc(100vw_-_2rem))] items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/82 px-3 py-2 text-xs text-slate-300 shadow-lg backdrop-blur-sm">
            <ZoomIn size={12} />
            <span className="truncate">
              {isMediumUp
                ? 'Click any repo node to drill down into its packages'
                : 'Tap a repo node to open its packages'}
            </span>
          </div>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        colorMode="dark"
        minZoom={0.2}
        maxZoom={2}
        panOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        selectionOnDrag={false}
        elementsSelectable
      >
        <DiagramController view={view} fitPadding={fitPadding} setNodes={setNodes} setEdges={setEdges} />

        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.2}
          color="#1e293b"
        />

        <Controls
          position="bottom-left"
          className="!bottom-4 !left-4 !rounded-xl !border !border-slate-700/70 !bg-slate-900/88 !shadow-lg"
          showInteractive={false}
        />

        {isMediumUp ? (
          <MiniMap
            nodeColor={nodeColor}
            maskColor="rgba(2,6,23,0.8)"
            pannable={false}
            zoomable={false}
            style={minimapStyle}
          />
        ) : null}
      </ReactFlow>
    </div>
  );
}
