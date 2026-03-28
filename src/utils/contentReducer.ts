import { NodeData, ResumeDocument } from '../types/resume';
import { findAndUpdateNode, findAndRemoveNode } from './nodeProcessing';

export type ContentAction =
  | { type: 'LOAD'; payload: ResumeDocument }
  | { type: 'UPDATE_NODE'; id: string; updates: Omit<Partial<NodeData>, 'id' | 'children'> }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'ADD_CHILD'; parentId: string; newNode: NodeData }
  | { type: 'MOVE_NODE'; updater: (nodes: NodeData[]) => NodeData[] }
  | { type: 'START_NEW' }
  | { type: 'SET_PAGE_SIZE'; page_size: string }
  | { type: 'SET_TITLE'; title: string };


export function contentReducer(state: ResumeDocument, action: ContentAction): ResumeDocument {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'UPDATE_NODE': {
      const nodes = structuredClone(state.nodes);
      const updated = findAndUpdateNode(nodes, action.id, action.updates);
      if (!updated) console.warn(`UPDATE_NODE: node "${action.id}" not found`);
      return { ...state, nodes };
    }
    case 'DELETE_NODE': {
      const nodes = structuredClone(state.nodes);
      const removed = findAndRemoveNode(nodes, action.id);
      if (!removed) console.warn(`DELETE_NODE: node "${action.id}" not found`);
      return { ...state, nodes };
    }
    case 'ADD_CHILD': {
      const nodes = structuredClone(state.nodes);
      const target = findAndUpdateNode(nodes, action.parentId, {});
      if (target) {
        target.children = target.children || [];
        target.children.push(action.newNode);
      }
      return { ...state, nodes };
    }
    case 'MOVE_NODE':
      return { ...state, nodes: action.updater(state.nodes) };
    case 'START_NEW':
      return { title: '', page_size: 'A4', nodes: [] };
    case 'SET_PAGE_SIZE':
      return { ...state, page_size: action.page_size };
    case 'SET_TITLE':
      return { ...state, title: action.title };
  }
}
