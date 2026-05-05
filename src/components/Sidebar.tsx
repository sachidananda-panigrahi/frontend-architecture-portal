import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Home, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sidebarSections } from '../data/documents';

interface SidebarProps {
  open: boolean;
}

export function Sidebar({ open }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const activeDocId = location.pathname.startsWith('/docs/')
    ? location.pathname.replace('/docs/', '')
    : null;

  const toggleSection = (label: string) =>
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }));

  const filtered = useMemo(() => {
    if (!query.trim()) return sidebarSections;
    const q = query.toLowerCase();
    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((section) => section.items.length > 0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="sidebar"
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-14 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-700/60 flex flex-col overflow-hidden"
        >
          {/* home link */}
          <div className="p-3 border-b border-slate-700/60">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${location.pathname === '/'
                  ? 'bg-hira-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Home size={15} />
              Architecture Diagram
            </button>
          </div>

          {/* search */}
          <div className="p-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
              <Search size={13} className="text-slate-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search docs..."
                className="flex-1 bg-transparent text-sm text-slate-300 placeholder:text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* nav sections */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {filtered.map((section) => {
              const isCollapsed = collapsed[section.label];
              return (
                <div key={section.label}>
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                  >
                    <span>{section.icon}</span>
                    <span className="flex-1 text-left">{section.label}</span>
                    {isCollapsed
                      ? <ChevronRight size={12} />
                      : <ChevronDown size={12} />}
                  </button>

                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-0.5 space-y-0.5 ml-2">
                          {section.items.map((item) => {
                            const isActive = activeDocId === item.docId;
                            return (
                              <button
                                key={item.id}
                                onClick={() => item.docId && navigate(`/docs/${item.docId}`)}
                                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                                  ${isActive
                                    ? 'bg-hira-700/40 text-hira-300 border-l-2 border-hira-500'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-2 border-transparent'
                                  }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* footer */}
          <div className="p-4 border-t border-slate-700/60">
            <div className="text-xs text-slate-600 text-center leading-5">
              HighRadius Platform Team<br />
              Frontend Architecture v1.0
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
