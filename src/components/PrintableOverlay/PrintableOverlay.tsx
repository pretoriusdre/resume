import React from 'react';
import './PrintableOverlay.css';

const PrintableOverlay: React.FC = () => {
    const url = window.location.href;
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

    if (isLocal) {
        return (
            <div className='printableOverlay'>
                (Print from the public url to include a link here)
            </div>
        );
    }

    return (
        <div className='printableOverlay'>
            This interactive resume is best viewed online:<br />
            <a href={url}>[Online version]</a>
        </div>
    );
};

export default PrintableOverlay;
