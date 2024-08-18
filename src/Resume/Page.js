import './Page.css';
import ResumeNodeList from './ResumeNodeList';

import PrintableOverlay from './PrintableOverlay';

const Page = ({data}) => {
    return(
        <div className='pagecontainer'>
            <PrintableOverlay/>
            <ResumeNodeList data={data} materialised_path={[]} depth={0}/>
        </div>
    );
}

export default Page