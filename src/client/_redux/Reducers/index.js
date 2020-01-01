import { combineReducers } from 'redux';

import { selectLines, selectEVMState, loadingMessage, errorMessage, displayVersionNumber, versions, contracts } from './Reducers';

export default combineReducers({
  selectLines,
  selectEVMState,
  loadingMessage,
  errorMessage,
  displayVersionNumber,
  versions,
  contracts
});