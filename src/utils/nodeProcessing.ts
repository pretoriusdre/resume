import { NodeData, ResumeTree } from '../types/resume';


const findAndRemoveNode = (nodeList: NodeData[], nodeId: string): NodeData | null => {
  for (let i = 0; i < nodeList.length; i++) {
    const child = nodeList[i];
    if (child.id === nodeId) {
      nodeList.splice(i, 1);
      return child;
    }
    if (child.children && child.children.length > 0) {
      const removedNode = findAndRemoveNode(child.children, nodeId);
      if (removedNode) {
        return removedNode;
      }
    }
  }
  return null;
};


const findAndUpdateNode = (nodeList: NodeData[], nodeId: string, updatedProperties: Partial<NodeData>): NodeData | null => {
  for (let i = 0; i < nodeList.length; i++) {
    const child = nodeList[i];
    if (child.id === nodeId) {
      Object.assign(child, updatedProperties);
      return child;
    }
    if (child.children && child.children.length > 0) {
      const updatedNode = findAndUpdateNode(child.children, nodeId, updatedProperties);
      if (updatedNode) {
        return updatedNode;
      }
    }
  }
  return null;
};


const findNodeByPath = (nodeList: NodeData[], path: string[]): NodeData | null => {
  const [currentId, ...restPath] = path;
  for (const node of nodeList) {
    if (node.id === currentId) {
      if (restPath.length === 0) {
        return node;
      }
      if (node.children) {
        return findNodeByPath(node.children, restPath);
      }
    }
  }
  return null;
};

const findParentNode = (nodeList: ResumeTree, path: string[]): NodeData | null => {
  if (path.length <= 1) {
    return null;
  }
  const parentPath = path.slice(0, -1);
  return findNodeByPath(nodeList, parentPath);
};


export { findAndRemoveNode, findAndUpdateNode, findNodeByPath, findParentNode };
