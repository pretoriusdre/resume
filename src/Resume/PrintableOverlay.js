import  './PrintableOverlay.css'

import resume_metadata from './data/resume_metadata.json';


const PrintableOverlay = () => {
    return (
        <div className='printableOverlay'>
            This interactive resume is best viewed online: <br/>
            <a href={resume_metadata.url}>{resume_metadata.url}</a>
        </div>
    );
};

export default PrintableOverlay;