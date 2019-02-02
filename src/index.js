import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './client/components/Store/Store.js';

import App from './client/components/app/main.js';

import styles from './client/styles/reset.scss';

const store = configureStore();

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
