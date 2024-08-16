import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './style.css';

import Navbar from './Navbar';
import ResumeNode from './ResumeNode';
import resume from './resume.json';


function Resume(props) {

    useEffect(() => {
        document.title = 'Résumé';
    }, []);

    const [data, setData] = useState(resume);

    return(
        <DndProvider backend={HTML5Backend}>
            <Navbar/>
            <div className='pagecontainer'>
            <ResumeNode data={data} depth={1}/>
            </div>
        </DndProvider>

    );
}

export default Resume