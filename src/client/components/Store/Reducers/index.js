import { combineReducers } from 'redux';

import { selectLines, selectEVMState, displayVersionNumber, versions, contracts, dataFetch } from './Reducers.js';

export default combineReducers({
  selectLines,
  selectEVMState,
  displayVersionNumber,
  versions,
  contracts,
  dataFetch
});