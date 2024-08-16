import React, { useEffect, useState }  from 'react';
import { DndProvider} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


import './style.css';

import ResumeContext from "./ResumeContext";
import Navbar from './Navbar';
import ResumeNode from './ResumeNode';
import resume from './data/resume_content.json';


function Resume(props) {

    useEffect(() => {
        document.title = 'Résumé';
    }, []);


    const [isEditing, setIsEditing] = useState(true);
    const [data, setData] = useState(resume);

    return(
        <ResumeContext.Provider value={{ isEditing, setIsEditing }}>
            <DndProvider backend={HTML5Backend}>
                <Navbar/>
                <div className='pagecontainer'>
                <ResumeNode data={data} depth={1}/>
                </div>
            </DndProvider>
        </ResumeContext.Provider>
    );
}

export default Resume