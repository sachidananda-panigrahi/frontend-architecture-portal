import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { RepoNodeData } from '../../types';
import { COLORS } from '../../data/flowData';

type RepoNodeType = Node<RepoNodeData, 'repoNode'>;

function RepoNodeComponent({ data, selected }: NodeProps<RepoNodeType>) {
  const navigate = useNavigate();
  const c = COLORS[data.colorScheme];

  return (
    <div
      className="relative group"
      style={{ width: 280 }}
    >
      {/* glow halo */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 ${selected ? 32 : 16}px ${c.glow}`,
          opacity: selected ? 1 : 0.5,
        }}
      />

      {/* card */}
      <div
        className="relative rounded-xl border-2 overflow-hidden cursor-pointer transition-transform duration-200 group-hover:scale-[1.02]"
        style={{
          background: c.bg,
          borderColor: selected ? c.border : `${c.border}99`,
        }}
      >
        {/* top accent bar */}
        <div className="h-1 w-full" style={{ background: c.border }} />

        {/* header */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-start gap-2">
            <span className="text-2xl leading-none mt-0.5">{data.icon}</span>
            <div className="min-w-0 flex-1">
              <div
                className="font-mono text-xs font-semibold truncate"
                style={{ color: c.border }}
              >
                {data.label}
              </div>
              <div className="text-sm font-semibold mt-0.5" style={{ color: c.text }}>
                {data.subtitle}
              </div>
              <div className="text-xs mt-1 opacity-70 leading-4" style={{ color: c.text }}>
                {data.repo}
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 leading-4 opacity-80" style={{ color: c.text }}>
            {data.description}
          </p>
        </div>

        {/* packages */}
        <div className="px-4 pb-2">
          <div className="text-xs font-semibold mb-1.5 opacity-60" style={{ color: c.text }}>
            Publishes
          </div>
          <div className="flex flex-wrap gap-1">
            {data.packages.map((pkg) => (
              <span
                key={pkg}
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{ background: c.badge, color: c.badgeTxt }}
              >
                {pkg}
              </span>
            ))}
          </div>
        </div>

        {/* footer */}
        <div
          className="px-4 py-2 flex items-center justify-between border-t"
          style={{ borderColor: `${c.border}33` }}
        >
          <span className="text-xs opacity-60" style={{ color: c.text }}>
            {data.tools.slice(0, 3).join(' · ')}
            {data.tools.length > 3 ? ` +${data.tools.length - 3}` : ''}
          </span>
          <div className="flex items-center gap-2">
            {data.hasSubDiagram && (
              <span className="text-xs opacity-50" style={{ color: c.text }}>
                Click to expand
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/docs/${data.docId}`);
              }}
              className="text-xs font-semibold px-2 py-0.5 rounded transition-opacity hover:opacity-80"
              style={{ background: c.border, color: '#fff' }}
            >
              View Docs →
            </button>
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
    </div>
  );
}

export const RepoNode = memo(RepoNodeComponent);
