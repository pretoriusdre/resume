import React from 'react';

import './EditWatermark.css';

import { useResumeContent } from '../ResumeContentContext/ResumeContentContext';
import { useResumeUI } from '../ResumeUIContext/ResumeUIContext';

interface EditWatermarkProps {
    text?: string;
}

const EditWatermark: React.FC<EditWatermarkProps> = ({ text = 'EDITED' }) => {
    const { wasChanged } = useResumeContent();
    const { watermarkEditedCopies } = useResumeUI();

    if (!watermarkEditedCopies || !wasChanged) return null;

    return (
        <div className="watermark-root" aria-hidden="true" data-watermark-text={text}>
            <div className="watermark-layer watermark-layer-a" style={{ backgroundImage: buildSvgBackground(text, 0) }} />
            <div className="watermark-layer watermark-layer-b" style={{ backgroundImage: buildSvgBackground(text, 150) }} />
        </div>
    );
};

function buildSvgBackground(text: string, offsetX: number): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
  <text transform="translate(${150 + offsetX},110) rotate(-45)" text-anchor="middle"
    fill="rgba(200,0,0,0.18)" font-size="48" font-family="Arial,sans-serif"
    font-weight="bold" letter-spacing="4">${text}</text>
</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default EditWatermark;
