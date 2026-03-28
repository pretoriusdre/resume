import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

import { useResumeUI } from '../ResumeUIContext/ResumeUIContext';
import DragAndDropItems from '../DragAndDropItems/DragAndDropItems';
import Separator from '../Separator/Separator';
import Image from '../Image/Image';
import { NodeData, ResumeTree } from '../../types/resume';

import './ResumeNodeList.css';


// http/https/mailto and relative paths (./  or  /) are permitted as link/iframe targets.
// Blocks javascript: and other dangerous schemes.
const isSafeUrl = (url: string | undefined): boolean =>
    typeof url === 'string' && /^(https?:|mailto:|\.\/|\/[^/])/i.test(url);


interface ResumeNodeListProps {
    nodeList: ResumeTree | undefined;
    depth: number;
    materialised_path: string[];
}

const ResumeNodeList: React.FC<ResumeNodeListProps> = ({ nodeList, depth, materialised_path }) => {
    return (
        <div>
            {(nodeList || []).map((child) => (
                <ResumeNode
                    key={child.id}
                    nodeData={child}
                    depth={depth + 1}
                    materialised_path={[...materialised_path, child.id]}
                />
            ))}
        </div>
    );
};


interface ResumeNodeProps {
    nodeData: NodeData;
    depth: number;
    materialised_path: string[];
}

function ResumeNode({ nodeData, depth, materialised_path }: ResumeNodeProps) {

    const { isEditing, activeNode, setActiveNode } = useResumeUI();

    const [collapsed, setCollapsed] = useState(nodeData?.start_collapsed || false);

    const id = nodeData.id;
    const type = nodeData.type;
    const value = nodeData.value;
    const secondary_value = nodeData.secondary_value;
    const hidden = nodeData.hidden || false;
    const prevent_toggle = nodeData.prevent_toggle || false;
    const always_print = nodeData.always_print || false;

    const hasChildren = (nodeData?.children?.length ?? 0) > 0;
    const isActive = id === activeNode?.id;

    const NodeIcon = hasChildren ? (collapsed ? '+' : '-') : '>';
    const bulletClass = `bulletspan${hasChildren ? '' : ' leaf'}`;

    const toggleCollapse = () => setCollapsed(c => !c);

    const collapsableElement = prevent_toggle ? (
        <span>{value}</span>
    ) : (
        <span>
            <button
                type="button"
                className={bulletClass}
                onClick={hasChildren ? toggleCollapse : undefined}
                aria-label={hasChildren ? (collapsed ? 'Expand section' : 'Collapse section') : undefined}
                aria-expanded={hasChildren ? !collapsed : undefined}
                tabIndex={hasChildren ? 0 : -1}
            >
                {NodeIcon}
            </button>
            {value}
        </span>
    );

    const getElement = () => {
        switch (type) {
            case 'title':
                return <h1>{collapsableElement}</h1>;
            case 'subtitle':
                return <span className="subtitle">{collapsableElement}</span>;
            case 'section':
                return <h2>{collapsableElement}</h2>;
            case 'subsection':
                return <h3>{collapsableElement}</h3>;
            case 'paragraph':
                return <p>{collapsableElement}</p>;
            case 'line':
                return <span>{collapsableElement}</span>;
            case 'image':
                return <Image title={value} src={isSafeUrl(secondary_value) ? (secondary_value ?? '') : ''} collapsed={collapsed} toggleCollapse={toggleCollapse} />;
            case 'link':
                return (
                    <a href={isSafeUrl(secondary_value) ? secondary_value : '#'} target="_blank" rel="noopener noreferrer">
                        {value}
                    </a>
                );
            case 'role':
                return (
                    <h3 className="role-header">
                        {collapsableElement}
                        {secondary_value && <span className="role-dates">{secondary_value}</span>}
                    </h3>
                );
            case 'iframe':
                return (
                    <iframe
                        src={isSafeUrl(secondary_value) ? secondary_value : undefined}
                        title={id}
                        width="640"
                        height="385"
                        allowFullScreen
                        allow="autoplay"
                    />
                );
            case 'promptinjection':
                return <div className="injection-text">{value}</div>;
            default: {
                const _exhaustive: never = type;
                return _exhaustive;
            }
        }
    };

    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragAndDropItems.RESUME_NODE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    if (hidden && !isEditing) {
        return <React.Fragment />;
    }

    return (
        <div>
            <div
                ref={isEditing ? (el: HTMLDivElement | null) => { drag(el); } : null}
                className={`${isEditing ? 'draggable' : ''}${isDragging ? ' dragging' : ''}${isActive ? ' active' : ''}${hidden ? ' hidden' : ''}`}
            >
                <div
                    onClick={() => setActiveNode(nodeData)}
                    className={`element${isEditing && isActive ? ' active' : ''}`}
                >
                    {getElement()}
                </div>

                <div className={`childrencontainer${collapsed ? ' collapsed' : ''}${always_print ? ' always-print' : ''}`}>
                    <div className="childreninner">
                        <div className={depth > 0 ? 'hangingIndent' : ''}>
                            {isEditing && <Separator id={id} materialised_path={materialised_path} relative_position='first_child' />}
                            <ResumeNodeList nodeList={nodeData.children} materialised_path={materialised_path} depth={depth} />
                        </div>
                    </div>
                </div>

                {isEditing && <Separator id={id} materialised_path={materialised_path} relative_position='next_sibling' />}
            </div>
        </div>
    );
}

export default ResumeNodeList;
