import type { ReactNode } from 'react';
import type { DocSection } from '../types';

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
    default:
      return null;
  }
}
