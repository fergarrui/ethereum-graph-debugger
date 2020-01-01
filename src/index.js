import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import "regenerator-runtime/runtime";

import store from './client/_redux/Store.js';

import App from './client/App';

import styles from './client/styles/reset.scss';

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
