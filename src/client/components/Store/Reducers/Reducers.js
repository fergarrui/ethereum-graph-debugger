import * as ActionTypes from '../Constants.js';


export const selectLines = (state = [0, 0], action) => {
  switch (action.type) {
    case ActionTypes.SELECT_EDITOR_LINES: return action.lines;
    default: return state;
  }
}

export const selectEVMState = (state = '', action) => {
  switch(action.type) {
    case ActionTypes.SHOW_EVM_STATE: return action.evmState;
    case ActionTypes.HIDE_EVM_STATE: return action.empty;
    default: return state;
  }
}

export const loadingMessage = (state = { isLoading: false, message: '' }, action) => {
  switch(action.type) {
    case ActionTypes.SHOW_LOADING_MESSAGE: 
      return { ...state, isLoading: true, message: action.message };
    case ActionTypes.HIDE_LOADING_MESSAGE: 
      return { ...state, isLoading: false, message: '' };
    default: return state;
  }
}

export const errorMessage = (state = { hasError: false, message: ''}, action) => {
  switch(action.type) {
    case ActionTypes.SHOW_ERROR_MESSAGE: 
      return { ...state, hasError: true, message: action.message };
    case ActionTypes.HIDE_ERROR_MESSAGE: 
      return { ...state, hasError: false, message: '' };
    default: return state;
  }
}

export const versions = (state = { versions: [], versionNumber: null, hasFetched: false }, action) => {
  switch(action.type) {
    case ActionTypes.ADD_VERSION:
      return { ...state, versions: action.version, hasFetched: true };
    case ActionTypes.GET_VERSION_NUM:
      return { ...state, versions: action.version, versionNumber: action.versionNum, hasFetched: false }; 
    default: return state;
  }
}