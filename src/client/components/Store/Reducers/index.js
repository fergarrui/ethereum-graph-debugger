import { combineReducers } from 'redux';

import { selectLines, selectEVMState, toggleLoadingMessage, toggleErrorMessage } from './Reducers.js';

export default combineReducers({
  selectLines,
  selectEVMState,
  toggleLoadingMessage,
  toggleErrorMessage,
});