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

export const dataFetch = (state = { isLoading: false, hasErrored: false, message: '' }, action) => {
  switch(action.type) {
    case ActionTypes.SHOW_LOADING_MESSAGE: 
      return { ...state, isLoading: true, message: action.message, hasErrored: false };
    case ActionTypes.HIDE_LOADING_MESSAGE: 
      return { ...state, isLoading: false, message: '' };
    case ActionTypes.SHOW_ERROR_MESSAGE: 
      return { ...state, hasErrored: true, message: action.message, isLoading: false };
    case ActionTypes.HIDE_ERROR_MESSAGE: 
      return { ...state, hasErrored: false, message: '' };
    default: return state;
  }
}

export const versions = (state = { version: '', versionNumber: null, hasFetched: false }, action) => {
  switch(action.type) {
    case ActionTypes.ADD_VERSION:
      return { ...state, version: action.version, hasFetched: true };
    case ActionTypes.GET_VERSION_NUM:
      return { ...state, versionNumber: action.versionNum, hasFetched: false }; 
    default: return state;
  }
}

export const contracts = (state = { contracts: [] }, action) => {
  switch(action.type) {
    case ActionTypes.ADD_CONTRACT:
      return { ...state, contracts: action.contract };
    default: return state;
  }
}