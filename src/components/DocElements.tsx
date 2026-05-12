import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize2 } from 'lucide-react';
import type { DocSection, HLPItem, ComponentCategory } from '../types';
import { E2ERequestFlowDiagram } from './E2ERequestFlowDiagram';

// ─── E2E Flow wrapper with Full-Page CTA ──────────────────────────────────────

function E2EFlowSection() {
  const navigate = useNavigate();
  return (
    <div className="my-4">
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => navigate('/flows?tab=e2e')}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-hira-900/40 text-hira-400 border border-hira-800/50 hover:bg-hira-800/40 hover:text-hira-300 transition-all"
        >
          <Maximize2 size={11} />
          Open in Full-Page Flow Viewer
        </button>
      </div>
      <E2ERequestFlowDiagram />
    </div>
  );
}

// ─── Primitive building blocks ────────────────────────────────────────────────

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700/60">
      {language && (
        <div className="bg-slate-800 px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">{language}</span>
        </div>
      )}
      <pre className="bg-slate-950 text-slate-200 px-5 py-4 overflow-x-auto text-xs font-mono leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-700/60">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-800">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-700"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-slate-800 ${i % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'} hover:bg-slate-800/40 transition-colors`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-slate-300 text-sm align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Callout({
  variant = 'info',
  title,
  children,
}: {
  variant?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    info:    { border: 'border-blue-500/40',   bg: 'bg-blue-950/40',   icon: 'ℹ️',  text: 'text-blue-300'   },
    tip:     { border: 'border-emerald-500/40', bg: 'bg-emerald-950/40', icon: '💡', text: 'text-emerald-300' },
    warning: { border: 'border-amber-500/40',  bg: 'bg-amber-950/40',  icon: '⚠️',  text: 'text-amber-300'  },
    danger:  { border: 'border-red-500/40',    bg: 'bg-red-950/40',    icon: '🚫',  text: 'text-red-300'    },
  };
  const s = styles[variant];

  return (
    <div className={`my-4 rounded-xl border ${s.border} ${s.bg} px-4 py-3`}>
      {title && (
        <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${s.text}`}>
          <span>{s.icon}</span>
          {title}
        </div>
      )}
      <p className="text-sm text-slate-300 leading-6">{children}</p>
    </div>
  );
}

export function FileTree({ items }: { items: string[] }) {
  return (
    <div className="my-4 rounded-xl border border-slate-700/60 bg-slate-950 px-5 py-4 overflow-x-auto">
      <pre className="text-xs font-mono text-slate-400 leading-6">
        {items.join('\n')}
      </pre>
    </div>
  );
}

export function Badges({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {items.map((item) => (
        <span
          key={item}
          className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// ─── HLP Tracker ─────────────────────────────────────────────────────────────

const HLP_STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  completed:   { label: 'Completed',   bg: 'bg-emerald-900/50', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  'in-progress': { label: 'In Progress', bg: 'bg-amber-900/40',   text: 'text-amber-300',   border: 'border-amber-500/40',   dot: 'bg-amber-400'   },
  pending:     { label: 'Pending',     bg: 'bg-slate-800/60',   text: 'text-slate-400',   border: 'border-slate-600/50',   dot: 'bg-slate-500'   },
  blocked:     { label: 'Not Started', bg: 'bg-red-950/50',     text: 'text-red-300',     border: 'border-red-500/40',     dot: 'bg-red-500'     },
};

function HLPTracker({ items }: { items: HLPItem[] }) {
  return (
    <div className="my-4 rounded-xl border border-slate-700/60 overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-800/80">
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 w-8 border-b border-slate-700">#</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-300 border-b border-slate-700">HLP Item</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 border-b border-slate-700 hidden md:table-cell">Description</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-400 border-b border-slate-700 w-28">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const s = HLP_STATUS_CONFIG[item.status] ?? HLP_STATUS_CONFIG['pending'];
            return (
              <tr
                key={item.id}
                className={`border-b border-slate-800/60 transition-colors hover:bg-slate-800/30 ${i % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/50'}`}
              >
                <td className="px-3 py-2.5 text-slate-600 text-xs font-mono">{item.id}</td>
                <td className="px-3 py-2.5">
                  <span className="text-slate-200 text-xs font-medium leading-5">{item.name}</span>
                  {item.track && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-hira-900/40 text-hira-400 border border-hira-700/30 font-mono">
                      {item.track}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-slate-500 text-xs leading-5 hidden md:table-cell">{item.description}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                    {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Component Grid ───────────────────────────────────────────────────────────

const GRID_COLOR_MAP: Record<string, { bg: string; border: string; heading: string; badge: string }> = {
  violet:  { bg: 'bg-violet-950/30',  border: 'border-violet-600/30',  heading: 'text-violet-300',  badge: 'bg-violet-900/50 border-violet-600/40 text-violet-200'  },
  blue:    { bg: 'bg-blue-950/30',    border: 'border-blue-600/30',    heading: 'text-blue-300',    badge: 'bg-blue-900/50 border-blue-600/40 text-blue-200'        },
  cyan:    { bg: 'bg-cyan-950/30',    border: 'border-cyan-600/30',    heading: 'text-cyan-300',    badge: 'bg-cyan-900/50 border-cyan-600/40 text-cyan-200'        },
  emerald: { bg: 'bg-emerald-950/30', border: 'border-emerald-600/30', heading: 'text-emerald-300', badge: 'bg-emerald-900/50 border-emerald-600/40 text-emerald-200' },
  amber:   { bg: 'bg-amber-950/30',   border: 'border-amber-600/30',   heading: 'text-amber-300',   badge: 'bg-amber-900/50 border-amber-600/40 text-amber-200'     },
};

function ComponentGrid({ categories }: { categories: ComponentCategory[] }) {
  return (
    <div className="my-4 space-y-3">
      {categories.map((cat) => {
        const c = GRID_COLOR_MAP[cat.color] ?? GRID_COLOR_MAP['blue'];
        return (
          <div key={cat.name} className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
            <div className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${c.heading}`}>
              {cat.name}
              <span className="font-normal normal-case opacity-60 text-xs">({cat.items.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((item) => (
                <span
                  key={item}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border ${c.badge}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

export function renderSection(section: DocSection, idx: number) {
  switch (section.type) {
    case 'heading':
      return (
        <h2 key={idx} className="text-xl font-semibold text-slate-100 mt-8 mb-3 pb-2 border-b border-slate-700/60">
          {section.content}
        </h2>
      );
    case 'subheading':
      return (
        <h3 key={idx} className="text-base font-semibold text-slate-200 mt-5 mb-2">
          {section.content}
        </h3>
      );
    case 'paragraph':
      return (
        <p key={idx} className="text-slate-300 leading-7 mb-4 text-sm">
          {section.content}
        </p>
      );
    case 'code':
      return <CodeBlock key={idx} code={section.content ?? ''} language={section.language} />;
    case 'table':
      return (
        <DocTable
          key={idx}
          headers={section.headers ?? []}
          rows={section.rows ?? []}
        />
      );
    case 'list':
      return (
        <ul key={idx} className="my-4 space-y-1.5 pl-0">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hira-500 shrink-0" />
              <span className="leading-6">{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <Callout key={idx} variant={section.variant} title={section.title}>
          {section.content}
        </Callout>
      );
    case 'filetree':
      return <FileTree key={idx} items={section.items ?? []} />;
    case 'badges':
      return <Badges key={idx} items={section.items ?? []} />;
    case 'divider':
      return <hr key={idx} className="my-8 border-slate-800" />;
    case 'e2eFlow':
      return <E2EFlowSection key={idx} />;
    case 'hlpTracker':
      return <HLPTracker key={idx} items={section.hlpItems ?? []} />;
    case 'componentGrid':
      return <ComponentGrid key={idx} categories={section.componentCategories ?? []} />;
    default:
      return null;
  }
}
