import React, { useEffect, useState }  from 'react';
import './style.css';

import resume from './resume.json';

import sangomarCmmsData from './media/sangomar-cmms-data.png';
import aiv from './media/aiv.jpg';
import bearingSpectrum from './media/bearingSpectrum.jpg';
import boilerChemicals from './media/boilerChemicals.jpg';
import caesar from './media/caesar.jpeg';
import chemicalLaydown from './media/chemicalLaydown.jpg';
import degasserVessel from './media/degasserVessel.jpg';
import equivalentStress from './media/equivalentStress.jpg';
import fgm160 from './media/fgm160.jpg';
import maintenanceBacklog from './media/maintenanceBacklog.jpg';
import radome from './media/radome.jpg';
import reboiler from './media/reboiler.jpg';
import separatorWeir from './media/separatorWeir.gif';
import vibrationClamp from './media/vibrationClamp.png';
import vibrationClampInstalled from './media/vibrationClampInstalled.jpg';
import financialModel from './media/financialModel.jpg';
import financeDashboard from './media/financeDashboard.png';

const images = {
    sangomarCmmsData,
    aiv,
    bearingSpectrum,
    boilerChemicals,
    caesar,
    chemicalLaydown,
    degasserVessel,
    equivalentStress,
    fgm160,
    maintenanceBacklog,
    radome,
    reboiler,
    separatorWeir,
    vibrationClamp,
    vibrationClampInstalled,
    financialModel,
    financeDashboard
  };


function getImageByKey(key: string) {
    return images[key]
}


function Node(props) {

    const [collapsed, setCollapsed] = useState(props.data?.meta?.collapsed || false);

    const hasChildren = ((props.data?.children?.length > 0));
    const nodeIcon = (hasChildren ? (collapsed ? '+' : '-') : '>');
    const bulletClass = "bulletspan" + (hasChildren ? "" : " leaf");


    function toggleCollapse() {

        if (collapsed) {
            setCollapsed(false);
        } else {
            setCollapsed(true);
        }
    }
    
    function getImageByKey(key: string) {
        return images[key]
    }

    const titleElement = (
        props.data?.meta?.always_show ?
        <span>{props?.data?.data?.title}</span> : 
        <span><span className={bulletClass} onClick={hasChildren ? toggleCollapse : null}>{nodeIcon}</span>{props?.data?.data?.title}</span>
    )
    

    const isImageTag = props?.data?.meta?.element === 'img'

    const element_arbitrary = React.createElement(
        props?.data?.meta?.element || 'span',
        props?.data?.meta?.attributes,
        titleElement
    );  

    const modalClass = "imgmodal" + (collapsed ? "-hidden" : "")



    const title = props?.data?.data?.title
        



    const element_img = (
    <div>
        <img src={getImageByKey(props?.data?.meta?.attributes?.src)} className="imgtiny" onClick={toggleCollapse} title={title} alt={title}/>
        <img src={getImageByKey(props?.data?.meta?.attributes?.src)} className={modalClass} onClick={toggleCollapse} title={title} alt={title}/>
    </div>)


    const element = (isImageTag ? element_img : element_arbitrary);

    const childItems = (props?.data?.children || []).map(
        (child) => {
            return <Node data={child} depth={props.depth + 1} key={props?.data?.title}/>
        }
    );

    const indentedChildren = (
        props.depth > 2 ?
        <ul>
            {childItems}
        </ul> :
        childItems
    )
    const hidden = props.data?.meta?.hidden || false;
    if (hidden) {
        return <React.Fragment/>
    }

    return(
            <div className='hangingIndent'>
                {element}
                <div className={collapsed ? 'collapsed' : 'visible'}>
                    {indentedChildren}
                </div>
            </div>
    );
}

function Resume(props) {

    useEffect(() => {
        document.title = 'Résumé';
    }, []);

    const [data, setData] = useState(resume);

    return(
        <div className='pagecontainer'>
            <Node data={data} depth={1}/>
        </div>
    );
}

export default Resume