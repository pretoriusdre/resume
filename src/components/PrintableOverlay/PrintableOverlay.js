import { useContext } from 'react';

import ResumeContext from "../ResumeContext/ResumeContext";

import './PrintableOverlay.css'

const PrintableOverlay = () => {

    const { versionURL } = useContext(ResumeContext);


    return (
        <div className='printableOverlay'>
            This interactive resume is best viewed online:<br/>
            <a href={versionURL}>[Online version]</a>
        </div>
    );
};

export default PrintableOverlay;