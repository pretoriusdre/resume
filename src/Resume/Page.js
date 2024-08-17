import './Page.css';
import ResumeNodeList from './ResumeNodeList';

const Page = ({data}) => {
    return(
        <div className='pagecontainer'>
            <ResumeNodeList data={data} depth={0}/>
        </div>
    );
}

export default Page