import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, GitBranch, Workflow } from 'lucide-react';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const onFlows = location.pathname === '/flows';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-hira-900 border-b border-slate-700/60 flex items-center px-4 gap-3">
      {/* sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-hira-600 flex items-center justify-center">
          <GitBranch size={15} className="text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-white text-sm">HighRadius</span>
          <span className="text-slate-400 text-sm hidden sm:block">Frontend Architecture Portal</span>
        </div>
      </div>

      {/* flow viewer quick link */}
      <button
        onClick={() => navigate(onFlows ? '/' : '/flows')}
        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
          ${onFlows
            ? 'bg-hira-700/40 text-hira-300 border-hira-600/50'
            : 'text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800 hover:border-slate-600'
          }`}
      >
        <Workflow size={13} />
        {onFlows ? 'Back to Diagram' : 'Flow Viewer'}
      </button>

      {/* right */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          4 Repos · 13 Packages · 1 Product
        </div>
        <a
          href="https://github.com/highradius"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:block">GitHub</span>
        </a>
      </div>
    </header>
  );
}
