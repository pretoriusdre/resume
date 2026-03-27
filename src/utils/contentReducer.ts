import { NodeData, ResumeTree } from '../types/resume';
import { findAndUpdateNode, findAndRemoveNode } from './nodeProcessing';

export type ContentAction =
  | { type: 'LOAD'; payload: ResumeTree }
  | { type: 'UPDATE_NODE'; id: string; updates: Partial<NodeData> }
  | { type: 'DELETE_NODE'; id: string }
  | { type: 'ADD_CHILD'; parentId: string; newNode: NodeData }
  | { type: 'MOVE_NODE'; updater: (content: ResumeTree) => ResumeTree }
  | { type: 'START_NEW' };


export function contentReducer(state: ResumeTree, action: ContentAction): ResumeTree {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'UPDATE_NODE': {
      const data = structuredClone(state);
      findAndUpdateNode(data, action.id, action.updates);
      return data;
    }
    case 'DELETE_NODE': {
      const data = structuredClone(state);
      findAndRemoveNode(data, action.id);
      return data;
    }
    case 'ADD_CHILD': {
      const data = structuredClone(state);
      const target = findAndUpdateNode(data, action.parentId, {});
      if (target) {
        target.children = target.children || [];
        target.children.push(action.newNode);
      }
      return data;
    }
    case 'MOVE_NODE':
      return action.updater(state);
    case 'START_NEW':
      return [];
  }
}
