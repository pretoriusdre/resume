import { useContext } from 'react';


import './Page.css';

import ResumeNodeList from '../ResumeNodeList/ResumeNodeList';
import ResumeContext from "../ResumeContext/ResumeContext";
import PrintableOverlay from '../PrintableOverlay/PrintableOverlay';

const Page = () => {

    const { resumeContent } = useContext(ResumeContext);

    return (
        <div className='pagecontainer'>
            <PrintableOverlay />
            <ResumeNodeList nodeList={resumeContent} materialised_path={[]} depth={0} />
        </div>
    );
}

export default Page