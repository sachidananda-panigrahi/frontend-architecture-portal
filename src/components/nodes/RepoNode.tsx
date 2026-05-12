import { memo, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { RepoNodeData } from '../../types';
import { COLORS } from '../../data/flowData';

type RepoNodeType = Node<RepoNodeData, 'repoNode'>;

const repoDescriptionClamp: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 4,
  overflow: 'hidden',
};

function RepoNodeComponent({ data, selected }: NodeProps<RepoNodeType>) {
  const navigate = useNavigate();
  const c = COLORS[data.colorScheme];

  return (
    <div className="relative group overflow-visible" style={{ width: 320 }}>
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 ${selected ? 42 : 22}px ${c.glow}`,
          opacity: selected ? 1 : 0.55,
        }}
      />

      <div
        className="relative flex min-h-[18rem] flex-col overflow-hidden rounded-2xl border-2 shadow-xl cursor-pointer transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-[1.01]"
        style={{
          background: c.bg,
          borderColor: selected ? c.border : `${c.border}99`,
        }}
      >
        <div className="h-1 w-full" style={{ background: c.border }} />

        <div className="px-5 pt-4 pb-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[1.7rem] leading-none">{data.icon}</span>
            <div className="min-w-0 flex-1">
              <div
                className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: c.border }}
              >
                {data.label}
              </div>
              <div className="mt-1 text-base font-semibold text-balance" style={{ color: c.text }}>
                {data.subtitle}
              </div>
              <div className="mt-1.5 text-xs opacity-70 leading-4" style={{ color: c.text }}>
                {data.repo}
              </div>
            </div>
          </div>
          <p className="mt-3 text-sm opacity-80 leading-[1.45]" style={{ ...repoDescriptionClamp, color: c.text }}>
            {data.description}
          </p>
        </div>

        <div className="flex-1 px-5 pb-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-60" style={{ color: c.text }}>
            Publishes
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.packages.map((pkg) => (
              <span
                key={pkg}
                className="rounded-md px-2.5 py-1 text-[11px] font-mono leading-none"
                style={{ background: c.badge, color: c.badgeTxt }}
              >
                {pkg}
              </span>
            ))}
          </div>
        </div>

        <div
          className="mt-auto border-t px-5 pt-3 pb-4"
          style={{ borderColor: `${c.border}33` }}
        >
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-50" style={{ color: c.text }}>
                Tooling
              </div>
              <span className="mt-1 block text-xs opacity-70 leading-[1.45]" style={{ color: c.text }}>
                {data.tools.slice(0, 3).join(' · ')}
                {data.tools.length > 3 ? ` +${data.tools.length - 3}` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              {data.hasSubDiagram ? (
                <span className="text-xs opacity-55 whitespace-nowrap" style={{ color: c.text }}>
                  Click to expand
                </span>
              ) : (
                <span />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/docs/${data.docId}`);
                }}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-85"
                style={{ background: c.border, color: '#fff' }}
              >
                View Docs →
              </button>
            </div>
          </div>
        </div>
      </div>

      <Handle
        id="left"
        type="target"
        position={Position.Left}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
      <Handle
        id="top"
        type="target"
        position={Position.Top}
        style={{ borderColor: c.border, background: '#0f172a' }}
      />
    </div>
  );
}

export const RepoNode = memo(RepoNodeComponent);
