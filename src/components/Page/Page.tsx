import React from 'react';

import './Page.css';

import ResumeNodeList from '../ResumeNodeList/ResumeNodeList';
import { useResumeContent } from '../ResumeContentContext/ResumeContentContext';
import PrintableOverlay from '../PrintableOverlay/PrintableOverlay';
import EditWatermark from '../EditWatermark/EditWatermark';

const Page: React.FC = () => {

    const { resumeDocument } = useResumeContent();

    return (
        <div className='pagecontainer'>
            <EditWatermark />
            <PrintableOverlay />
            <ResumeNodeList nodeList={resumeDocument.nodes} materialised_path={[]} depth={0} />
        </div>
    );
};

export default Page;
