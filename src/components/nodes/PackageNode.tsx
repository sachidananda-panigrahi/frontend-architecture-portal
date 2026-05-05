import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { PackageNodeData } from '../../types';
import { COLORS } from '../../data/flowData';

type PackageNodeType = Node<PackageNodeData, 'packageNode'>;

function PackageNodeComponent({ data }: NodeProps<PackageNodeType>) {
  const c = COLORS[data.colorScheme];
  const isInternal = data.scope === 'internal' || data.scope === 'platform-owned';

  return (
    <div className="relative group" style={{ width: 230 }}>
      {/* glow */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ boxShadow: `0 0 20px ${c.glow}` }}
      />

      <div
        className="relative rounded-lg border overflow-hidden cursor-default"
        style={{
          background: c.bg,
          borderColor: isInternal ? `${c.border}55` : c.border,
          borderStyle: isInternal ? 'dashed' : 'solid',
        }}
      >
        <div className="h-0.5 w-full" style={{ background: isInternal ? `${c.border}55` : c.border }} />

        <div className="px-3 py-2.5">
          <div className="text-xs font-mono opacity-60 mb-0.5" style={{ color: c.text }}>
            {data.scope}
          </div>
          <div className="font-semibold text-sm" style={{ color: c.text }}>
            {data.name}
          </div>
          <p className="text-xs mt-1.5 leading-4 opacity-70" style={{ color: c.text }}>
            {data.description}
          </p>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 rounded text-xs"
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
