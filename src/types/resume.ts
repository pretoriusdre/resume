export type NodeType =
  | 'title'
  | 'subtitle'
  | 'section'
  | 'subsection'
  | 'line'
  | 'paragraph'
  | 'image'
  | 'link'
  | 'iframe'
  | 'promptinjection';

export interface NodeData {
  id: string;
  value: string;
  type: NodeType;
  ref?: string;
  hidden?: boolean;
  start_collapsed?: boolean;
  prevent_toggle?: boolean;
  always_print?: boolean;
  children?: NodeData[];
}

export type ResumeTree = NodeData[];

export interface ResumeDocument {
  title: string;
  page_size: string;
  nodes: NodeData[];
}

export type RelativePosition = 'first_child' | 'next_sibling';
