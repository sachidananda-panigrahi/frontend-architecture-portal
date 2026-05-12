export type ColorScheme = 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber';

export interface RepoNodeData {
  label: string;
  subtitle: string;
  colorScheme: ColorScheme;
  icon: string;
  packages: string[];
  tools: string[];
  docId: string;
  description: string;
  repo: string;
  hasSubDiagram: boolean;
  [key: string]: unknown;
}

export interface PackageNodeData {
  name: string;
  scope: string;
  description: string;
  colorScheme: ColorScheme;
  tags?: string[];
  [key: string]: unknown;
}

// ─── HLP Tracker types ────────────────────────────────────────────────────────

/** Overall delivery status of one HLP item. */
export type HLPStatus = 'completed' | 'in-progress' | 'pending' | 'blocked';

/**
 * One row in an HLP tracker table.
 * `status`   — delivery state (drives badge colour).
 * `track`    — optional label linking to a sub-track (e.g. 'Boilerplate').
 */
export interface HLPItem {
  id: number;
  name: string;
  description: string;
  track?: string;
  status: HLPStatus;
}

// ─── Component Catalog types ──────────────────────────────────────────────────

export interface ComponentCategory {
  name: string;
  color: 'violet' | 'blue' | 'cyan' | 'emerald' | 'amber';
  items: string[];
}

// ─── Doc Section ──────────────────────────────────────────────────────────────

export interface DocSection {
  type:
    | 'heading'
    | 'subheading'
    | 'paragraph'
    | 'code'
    | 'table'
    | 'list'
    | 'callout'
    | 'filetree'
    | 'badges'
    | 'divider'
    | 'e2eFlow'
    | 'hlpTracker'
    | 'componentGrid';
  level?: number;
  content?: string;
  language?: string;
  headers?: string[];
  rows?: string[][];
  items?: string[];
  variant?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  /** Used by `hlpTracker` sections. */
  hlpItems?: HLPItem[];
  /** Used by `componentGrid` sections. */
  componentCategories?: ComponentCategory[];
}

export interface Document {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  sections: DocSection[];
}

export interface SidebarSection {
  label: string;
  icon: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  docId?: string;
  isHome?: boolean;
}
