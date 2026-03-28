import { findAndRemoveNode, findAndUpdateNode, findNodeByPath, findParentNode } from './nodeProcessing';

// ─── helpers ────────────────────────────────────────────────────────────────

const makeTree = () => [
    {
        id: 'root',
        value: 'Root',
        children: [
            {
                id: 'child-a',
                value: 'Child A',
                children: [
                    { id: 'grandchild-a1', value: 'Grandchild A1', children: [] },
                    { id: 'grandchild-a2', value: 'Grandchild A2', children: [] },
                ],
            },
            {
                id: 'child-b',
                value: 'Child B',
                children: [],
            },
        ],
    },
];

// ─── findAndRemoveNode ───────────────────────────────────────────────────────

describe('findAndRemoveNode', () => {
    it('removes and returns a top-level node', () => {
        const tree = makeTree();
        const removed = findAndRemoveNode(tree, 'root');
        expect(removed).not.toBeNull();
        expect(removed.id).toBe('root');
        expect(tree).toHaveLength(0);
    });

    it('removes and returns a direct child node', () => {
        const tree = makeTree();
        const removed = findAndRemoveNode(tree, 'child-a');
        expect(removed.id).toBe('child-a');
        expect(tree[0].children).toHaveLength(1);
        expect(tree[0].children[0].id).toBe('child-b');
    });

    it('removes and returns a deeply nested node', () => {
        const tree = makeTree();
        const removed = findAndRemoveNode(tree, 'grandchild-a1');
        expect(removed.id).toBe('grandchild-a1');
        expect(tree[0].children[0].children).toHaveLength(1);
        expect(tree[0].children[0].children[0].id).toBe('grandchild-a2');
    });

    it('returns null when node does not exist', () => {
        const tree = makeTree();
        const result = findAndRemoveNode(tree, 'nonexistent');
        expect(result).toBeNull();
    });

    it('does not mutate the tree when node is not found', () => {
        const tree = makeTree();
        const before = JSON.stringify(tree);
        findAndRemoveNode(tree, 'nonexistent');
        expect(JSON.stringify(tree)).toBe(before);
    });
});

// ─── findAndUpdateNode ───────────────────────────────────────────────────────

describe('findAndUpdateNode', () => {
    it('updates and returns a top-level node', () => {
        const tree = makeTree();
        const updated = findAndUpdateNode(tree, 'root', { value: 'Updated Root' });
        expect(updated.value).toBe('Updated Root');
        expect(tree[0].value).toBe('Updated Root');
    });

    it('updates a deeply nested node', () => {
        const tree = makeTree();
        findAndUpdateNode(tree, 'grandchild-a2', { value: 'New Value', hidden: true });
        const target = tree[0].children[0].children[1];
        expect(target.value).toBe('New Value');
        expect(target.hidden).toBe(true);
    });

    it('merges properties without overwriting unspecified ones', () => {
        const tree = makeTree();
        findAndUpdateNode(tree, 'child-b', { hidden: true });
        expect(tree[0].children[1].value).toBe('Child B'); // unchanged
        expect(tree[0].children[1].hidden).toBe(true);    // added
    });

    it('returns null when node does not exist', () => {
        const tree = makeTree();
        const result = findAndUpdateNode(tree, 'nonexistent', { value: 'x' });
        expect(result).toBeNull();
    });

    it('applying an empty update returns the node unchanged', () => {
        const tree = makeTree();
        const node = findAndUpdateNode(tree, 'child-a', {});
        expect(node.id).toBe('child-a');
        expect(node.value).toBe('Child A');
    });
});

// ─── findNodeByPath ──────────────────────────────────────────────────────────

describe('findNodeByPath', () => {
    it('finds a root-level node by single-element path', () => {
        const tree = makeTree();
        const node = findNodeByPath(tree, ['root']);
        expect(node.id).toBe('root');
    });

    it('finds a nested node by full path', () => {
        const tree = makeTree();
        const node = findNodeByPath(tree, ['root', 'child-a', 'grandchild-a1']);
        expect(node.id).toBe('grandchild-a1');
    });

    it('returns null for a path that does not exist', () => {
        const tree = makeTree();
        const node = findNodeByPath(tree, ['root', 'nonexistent']);
        expect(node).toBeNull();
    });

    it('returns null for an empty path', () => {
        const tree = makeTree();
        const node = findNodeByPath(tree, []);
        expect(node).toBeNull();
    });
});

// ─── findParentNode ──────────────────────────────────────────────────────────

describe('findParentNode', () => {
    it('returns null for a root-level path (no parent)', () => {
        const tree = makeTree();
        const parent = findParentNode(tree, ['root']);
        expect(parent).toBeNull();
    });

    it('returns the root node as parent of a direct child', () => {
        const tree = makeTree();
        const parent = findParentNode(tree, ['root', 'child-a']);
        expect(parent.id).toBe('root');
    });

    it('returns the correct parent for a deeply nested node', () => {
        const tree = makeTree();
        const parent = findParentNode(tree, ['root', 'child-a', 'grandchild-a1']);
        expect(parent.id).toBe('child-a');
    });

    it('returns null for an empty path', () => {
        const tree = makeTree();
        const parent = findParentNode(tree, []);
        expect(parent).toBeNull();
    });
});
