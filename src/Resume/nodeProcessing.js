

const findAndRemoveNode = (nodeList, nodeId) => {
    for (let i = 0; i < nodeList.length; i++) {
      const child = nodeList[i];
      if (child.id === nodeId) {
        nodeList.splice(i, 1); 
        return child;
      }
      if (child?.children?.length > 0) {
        const removedNode = findAndRemoveNode(child.children, nodeId);
        if (removedNode) {
          return removedNode;
        }
      }
    }
    return null;
  };
  

  const findAndUpdateNode = (nodeList, nodeId, updatedProperties) => {
    for (let i = 0; i < nodeList.length; i++) {
      const child = nodeList[i];
      if (child.id === nodeId) {
        Object.assign(child, updatedProperties);
        return child;
      }
      if (child?.children?.length > 0) {
        const updatedNode = findAndUpdateNode(child.children, nodeId, updatedProperties);
        if (updatedNode) {
          return updatedNode;
        }
      }
    }
    return null;
};


  const findNodeByPath = (nodeList, path) => {
    const [currentId, ...restPath] = path;
    for (let node of nodeList) {
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
  
  const findParentNode = (nodeList, path) => {
    if (path.length <= 1) {
      return null; // No parent exists if the path has only one or no elements
    }
    const parentPath = path.slice(0, -1); // Remove the last element to get the parent path
    return findNodeByPath(nodeList, parentPath);
  };
  


  export {findAndRemoveNode, findAndUpdateNode, findNodeByPath, findParentNode};