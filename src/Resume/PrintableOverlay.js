import { useContext } from 'react';

import ResumeContext from "./ResumeContext";

import './PrintableOverlay.css'

const PrintableOverlay = () => {

    const { resumeMetadata } = useContext(ResumeContext);


    return (
        <div className='printableOverlay'>
            This interactive resume is best viewed online: <br />
            <a href={resumeMetadata.url}>{resumeMetadata.url}</a>
        </div>
    );
};

export default PrintableOverlay;