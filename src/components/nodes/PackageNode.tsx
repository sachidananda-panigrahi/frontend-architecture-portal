import { memo, type CSSProperties } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { PackageNodeData } from '../../types';
import { COLORS } from '../../data/flowData';

type PackageNodeType = Node<PackageNodeData, 'packageNode'>;

const packageDescriptionClamp: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
};

function PackageNodeComponent({ data }: NodeProps<PackageNodeType>) {
  const c = COLORS[data.colorScheme];
  const isInternal = data.scope === 'internal' || data.scope === 'platform-owned';

  return (
    <div className="relative group overflow-visible" style={{ width: 264 }}>
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ boxShadow: `0 0 24px ${c.glow}` }}
      />

      <div
        className="relative flex min-h-[11rem] flex-col overflow-hidden rounded-xl border shadow-lg cursor-default"
        style={{
          background: c.bg,
          borderColor: isInternal ? `${c.border}55` : c.border,
          borderStyle: isInternal ? 'dashed' : 'solid',
        }}
      >
        <div className="h-1 w-full" style={{ background: isInternal ? `${c.border}55` : c.border }} />

        <div className="flex flex-1 flex-col px-4 py-3.5">
          <div className="mb-1 text-[11px] font-mono uppercase tracking-[0.16em] opacity-60" style={{ color: c.text }}>
            {data.scope}
          </div>
          <div className="text-sm font-semibold leading-5" style={{ color: c.text }}>
            {data.name}
          </div>
          <p className="mt-2 text-xs opacity-75 leading-[1.45]" style={{ ...packageDescriptionClamp, color: c.text }}>
            {data.description}
          </p>

          {data.tags && data.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md px-2 py-1 text-[11px] leading-none"
                  style={{ background: c.badge, color: c.badgeTxt }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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

export const PackageNode = memo(PackageNodeComponent);
