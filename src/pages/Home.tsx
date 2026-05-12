import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, GitBranch, Package, ArrowRight, Maximize2 } from 'lucide-react';
import { FlowDiagram } from '../components/FlowDiagram';
// FlowDiagram handles its own doc navigation via the "View Docs" button on each node

const stats = [
  { icon: GitBranch, label: 'GitHub Repositories',  value: '4' },
  { icon: Package,   label: 'Published Packages',   value: '13' },
  { icon: BookOpen,  label: 'Architecture Docs',    value: '11' },
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
                — 4 repos · 1 product
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
        {/* Legend: 4 repos with flow arrows */}
        {[
          { label: 'untitled-ui',        color: '#d97706', dot: true  },
          { label: '→',                  color: '#475569', dot: false },
          { label: 'ui-nexus',           color: '#7c3aed', dot: true  },
          { label: '13 pkgs',            color: '#4c1d95', dot: false, badge: true },
          { label: '→',                  color: '#475569', dot: false },
          { label: 'record-to-report',   color: '#22c55e', dot: true  },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 shrink-0">
            {item.dot && (
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            )}
            {'badge' in item && item.badge ? (
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: item.color, color: '#ddd6fe' }}
              >
                {item.label}
              </span>
            ) : (
              <span
                className={`text-xs ${item.dot ? 'font-mono font-medium' : ''}`}
                style={{ color: item.color }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
        <div className="h-4 w-px bg-slate-700/60 shrink-0" />
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-xs font-mono font-medium text-blue-400">nextjs-boilerplate</span>
          <span className="text-xs text-slate-600 ml-1">template →</span>
          <span className="text-xs font-mono font-medium text-emerald-400">record-to-report</span>
        </div>

        <div className="ml-auto shrink-0 flex items-center gap-3">
          <button
            onClick={() => navigate('/flows')}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-hira-900/40 text-hira-400 border border-hira-800/50 hover:bg-hira-800/40 hover:text-hira-300 transition-all"
          >
            <Maximize2 size={11} />
            Full Page View
          </button>
          <button
            onClick={() => navigate('/docs/overview')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Read overview
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
