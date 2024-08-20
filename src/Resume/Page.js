import { useContext } from 'react';


import './Page.css';
import ResumeNodeList from './ResumeNodeList';
import ResumeContext from "./ResumeContext";

import PrintableOverlay from './PrintableOverlay';

const Page = () => {
    
    const { data } = useContext(ResumeContext);

    return(
        <div className='pagecontainer'>
            <PrintableOverlay/>
            <ResumeNodeList data={data} materialised_path={[]} depth={0}/>
        </div>
    );
}

export default Page