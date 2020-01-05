import { combineReducers } from 'redux';

import { selectLines, selectEVMState, loadingMessage, errorMessage, displayVersionNumber, versions, contracts, tools } from './reducers';

export default combineReducers({
  selectLines,
  selectEVMState,
  loadingMessage,
  errorMessage,
  displayVersionNumber,
  versions,
  contracts,
  tools
});