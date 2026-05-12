import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  GitBranch,
  Workflow,
  Keyboard,
  X,
} from 'lucide-react';
import { FlowDiagram } from '../components/FlowDiagram';
import { E2ERequestFlowDiagram } from '../components/E2ERequestFlowDiagram';

type Tab = 'architecture' | 'e2e';

// ─── Keyboard hint toast ─────────────────────────────────────────────────────

function KeyHint({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 rounded-xl border border-slate-700/70 bg-slate-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-sm text-xs text-slate-300"
        >
          <Keyboard size={13} className="text-slate-400 shrink-0" />
          <span>
            Press <kbd className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-slate-200">F</kbd>
            to toggle fullscreen ·
            <kbd className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-slate-200">Esc</kbd>
            to exit
          </span>
          <button onClick={onClose} className="ml-1 text-slate-500 hover:text-slate-300 transition-colors">
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Tab button ──────────────────────────────────────────────────────────────

interface TabBtnProps {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
}

function TabBtn({ active, icon, label, sublabel, onClick }: TabBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg
        ${active
          ? 'bg-hira-700/30 text-hira-300 border border-hira-600/40 shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
        }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="leading-none">{label}</span>
      <span className={`hidden sm:inline text-xs ${active ? 'text-hira-500' : 'text-slate-600'}`}>
        {sublabel}
      </span>
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-hira-500"
        />
      )}
    </button>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function FlowsPage() {
  const [searchParams] = useSearchParams();
  const initialTab: Tab = searchParams.get('tab') === 'e2e' ? 'e2e' : 'architecture';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [fullscreen, setFullscreen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const hintShownRef = useRef(false);

  // Keyboard shortcuts: F = toggle fullscreen, Esc = exit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in an input
      if ((e.target as HTMLElement).matches('input, textarea, [contenteditable]')) return;
      if (e.key === 'Escape') {
        setFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        setFullscreen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleFullscreen = () => {
    setFullscreen((v) => {
      const next = !v;
      if (next && !hintShownRef.current) {
        hintShownRef.current = true;
        setHintVisible(true);
      }
      return next;
    });
  };

  // ── Tab content ─────────────────────────────────────────────────────────────
  const tabContent = (
    <AnimatePresence mode="wait">
      {tab === 'architecture' ? (
        <motion.div
          key="architecture"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          <FlowDiagram />
        </motion.div>
      ) : (
        <motion.div
          key="e2e"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="h-full"
        >
          <E2ERequestFlowDiagram fluid />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Shared chrome ───────────────────────────────────────────────────────────
  const chrome = (isFs: boolean) => (
    <div className={`flex flex-col ${isFs ? 'h-screen' : 'h-full'} bg-slate-950`}>

      {/* ── Top bar ── */}
      <div className={`shrink-0 flex items-center gap-3 px-4 py-2 border-b border-slate-800/60 bg-slate-900/70 backdrop-blur-sm ${isFs ? 'pt-safe' : ''}`}>

        {/* tabs */}
        <div className="flex items-center gap-1.5">
          <TabBtn
            active={tab === 'architecture'}
            icon={<GitBranch size={14} />}
            label="Architecture Diagram"
            sublabel="Monorepo · Package flows"
            onClick={() => setTab('architecture')}
          />
          <TabBtn
            active={tab === 'e2e'}
            icon={<Workflow size={14} />}
            label="E2E Request Flow"
            sublabel="Browser → Gateway → Services"
            onClick={() => setTab('e2e')}
          />
        </div>

        {/* spacer */}
        <div className="flex-1" />

        {/* meta */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-600">
          {tab === 'architecture' ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                ui-nexus
              </span>
              <span className="text-slate-700">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                record-to-report
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                Wattpm Gateway :3000
              </span>
              <span className="text-slate-700">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Next.js Standalone :3001
              </span>
              <span className="text-slate-700">→</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Microservices
              </span>
            </>
          )}
        </div>

        <div className="w-px h-4 bg-slate-700/60 shrink-0" />

        {/* fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFs ? 'Exit fullscreen (Esc)' : 'Enter fullscreen (F)'}
          className={`p-1.5 rounded-lg transition-colors border
            ${isFs
              ? 'text-hira-400 bg-hira-900/30 border-hira-700/40 hover:bg-hira-800/40'
              : 'text-slate-400 bg-slate-800/60 border-slate-700/60 hover:text-white hover:bg-slate-700'
            }`}
        >
          {isFs ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* ── diagram area ── */}
      <div className="flex-1 min-h-0">
        {tabContent}
      </div>
    </div>
  );

  return (
    <>
      {/* Normal layout */}
      {!fullscreen && chrome(false)}

      {/* Fullscreen portal overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            key="fullscreen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9990]"
          >
            {chrome(true)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint */}
      <KeyHint visible={hintVisible} onClose={() => setHintVisible(false)} />
    </>
  );
}
