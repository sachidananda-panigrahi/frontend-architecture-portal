import { useCallback, useEffect, useRef, useState } from 'react';
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
import { mainNodes, mainEdges, subDiagrams, COLORS } from '../data/flowData';
import type { RepoNodeData } from '../types';

const nodeTypes = { repoNode: RepoNode, packageNode: PackageNode };

function nodeColor(node: Node): string {
  const data = node.data as Partial<RepoNodeData>;
  if (!data.colorScheme) return '#334155';
  return COLORS[data.colorScheme as keyof typeof COLORS]?.border ?? '#334155';
}

// ─── Inner controller (must be a child of ReactFlow) ──────────────────────
interface ControllerProps {
  view: string;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

function DiagramController({ view, setNodes, setEdges }: ControllerProps) {
  const { fitView } = useReactFlow();
  const prevView = useRef<string>('');

  useEffect(() => {
    if (prevView.current === view) return;
    prevView.current = view;

    const data =
      view === 'main'
        ? { nodes: mainNodes, edges: mainEdges }
        : (subDiagrams[view] ?? { nodes: mainNodes, edges: mainEdges });

    setNodes(data.nodes as Node[]);
    setEdges(data.edges as Edge[]);

    const t = setTimeout(() => {
      fitView({ padding: 0.18, duration: 700 });
    }, 60);
    return () => clearTimeout(t);
  }, [view, setNodes, setEdges, fitView]);

  return null;
}

// ─── Main component ────────────────────────────────────────────────────────
export function FlowDiagram(_props: Record<string, never> = {}) {
  const [view, setView] = useState<string>('main');
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(mainNodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(mainEdges as Edge[]);

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
    'ui-config': 'highradius_ui_config',
    'core-ui':   'highradius_core_ui',
    'aps-ui':    'highradius_aps_ui',
    'r2r':       'record-to-report',
  };

  return (
    <div className="relative w-full h-full">
      {/* breadcrumb / back */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        {view !== 'main' ? (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={14} />
            Overview
            <span className="mx-1 text-slate-500">/</span>
            <span className="text-violet-400">{repoNames[view] ?? view}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-slate-400 text-xs">
            <ZoomIn size={12} />
            Click any repo node to drill down into its packages
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
        fitView
        fitViewOptions={{ padding: 0.18 }}
        colorMode="dark"
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <DiagramController view={view} setNodes={setNodes} setEdges={setEdges} />

        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#1e293b"
        />

        <Controls
          className="!bg-slate-800 !border-slate-600 !rounded-lg"
          showInteractive={false}
        />

        <MiniMap
          nodeColor={nodeColor}
          maskColor="rgba(15,23,42,0.8)"
          style={{ background: '#1e293b', borderRadius: 8, border: '1px solid #334155' }}
        />
      </ReactFlow>
    </div>
  );
}
