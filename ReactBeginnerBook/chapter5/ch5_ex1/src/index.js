import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Card from './Card';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Card backColor="red"/>, document.getElementById('root'));
registerServiceWorker();
