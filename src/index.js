import React from 'react';
import ReactDOM from 'react-dom/client';

import Resume from './Resume/resume';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Resume />
  </React.StrictMode>
);

export default Resume;
