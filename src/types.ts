export type ColorScheme = 'violet' | 'blue' | 'cyan' | 'emerald';

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
    | 'divider';
  level?: number;
  content?: string;
  language?: string;
  headers?: string[];
  rows?: string[][];
  items?: string[];
  variant?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
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
