import { combineReducers } from 'redux';

import { selectLines, selectEVMState, loadingMessage, errorMessage, displayVersionNumber, versions, contracts } from './Reducers.js';

export default combineReducers({
  selectLines,
  selectEVMState,
  loadingMessage,
  errorMessage,
  displayVersionNumber,
  versions,
  contracts
});