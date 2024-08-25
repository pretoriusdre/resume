import './PrintableOverlay.css'





const PrintableOverlay = () => {

    const element = (
        <div className='printableOverlay'>
            This interactive resume is best viewed online:<br/>
            <a href={window.location.href}>[Online version]</a>
        </div>
    );
    const alternative = (
        <div className='printableOverlay'>
            (Print from the public url to include a link here)
        </div>
    );

    const url = window.location.href;

    if (!url.includes('localhost') && !url.includes('127.0.0.1')) {
        return element;
      } else {
      return alternative;
    };
};
export default PrintableOverlay;