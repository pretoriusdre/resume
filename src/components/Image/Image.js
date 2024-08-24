

import './Image.css'

const Image = ({title, src, collapsed, toggleCollapse}) => {


    const modalClass = `imgmodal${collapsed ? ' hidden' : ''}`

    return (
        <div>
            <img src={`${process.env.PUBLIC_URL}${src}`} className="imgtiny" onClick={toggleCollapse} title={title} alt={title} />
            <img src={`${process.env.PUBLIC_URL}${src}`} className={modalClass} onClick={toggleCollapse} title={title} alt={title} />
        </div>
    );
    
};

export default Image;