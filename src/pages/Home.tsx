import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GitBranch, Package, ArrowRight } from 'lucide-react';
import { FlowDiagram } from '../components/FlowDiagram';
// FlowDiagram handles its own doc navigation via the "View Docs" button on each node

const stats = [
  { icon: GitBranch, label: 'Independent Monorepos', value: '3' },
  { icon: Package,   label: 'Published Packages',    value: '10+' },
  { icon: BookOpen,  label: 'Architecture Docs',     value: '9' },
];

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* top strip */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="shrink-0 px-6 py-4 border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">
              Frontend Architecture
              <span className="ml-2 text-sm font-normal text-slate-400">
                — 3 monorepos · 1 product
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any node to drill down into packages. Click "View Docs" on a node to open its documentation.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-hira-400 mb-0.5">
                  <Icon size={14} />
                  <span className="text-xl font-bold text-white">{value}</span>
                </div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* dependency chain legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="shrink-0 px-6 py-2 border-b border-slate-800/40 bg-slate-900/20 flex items-center gap-4 overflow-x-auto"
      >
        {[
          { label: 'ui_config', color: '#7c3aed', dot: true },
          { label: '→', color: '#475569', dot: false },
          { label: 'core_ui', color: '#3b82f6', dot: true },
          { label: '→', color: '#475569', dot: false },
          { label: 'aps_ui', color: '#06b6d4', dot: true },
          { label: '→', color: '#475569', dot: false },
          { label: 'R2R', color: '#22c55e', dot: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            {item.dot && (
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            )}
            <span
              className={`text-xs font-${item.dot ? 'mono font-medium' : 'normal'}`}
              style={{ color: item.color }}
            >
              {item.label}
            </span>
          </div>
        ))}

        <div className="ml-auto shrink-0">
          <button
            onClick={() => navigate('/docs/overview')}
            className="flex items-center gap-1.5 text-xs text-hira-400 hover:text-hira-300 transition-colors"
          >
            Read architecture overview
            <ArrowRight size={12} />
          </button>
        </div>
      </motion.div>

      {/* React Flow canvas — takes all remaining height */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex-1 min-h-0"
      >
        <FlowDiagram />
      </motion.div>
    </div>
  );
}
