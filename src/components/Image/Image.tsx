import React from 'react';
import './Image.css';

interface ImageProps {
    title: string;
    src: string;
    collapsed: boolean;
    toggleCollapse: () => void;
}

const Image: React.FC<ImageProps> = ({ title, src, collapsed, toggleCollapse }) => {
    const modalClass = `imgmodal${collapsed ? ' hidden' : ''}`;
    const overlayClass = `overlay${collapsed ? ' hidden' : ''}`;

    return (
        <div>
            <img src={`${process.env.PUBLIC_URL}${src}`} className="imgtiny" onClick={toggleCollapse} title={title} alt={title} />
            <div className={overlayClass} onClick={toggleCollapse}>
                <img src={`${process.env.PUBLIC_URL}${src}`} className={modalClass} title={title} alt={title} />
            </div>
        </div>
    );
};

export default Image;
