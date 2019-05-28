import { SELECT_EDITOR_LINES, SHOW_EVM_STATE, SHOW_LOADING_MESSAGE, 
  HIDE_LOADING_MESSAGE, SHOW_ERROR_MESSAGE, HIDE_ERROR_MESSAGE, 
  HIDE_EVM_STATE, GET_ERROR_MESSAGE, GET_VERSION_NUM, IS_ACTIVE, GET_ACTIVE_INDEX } from '../Constants.js';


export function selectLines(state = [0, 0], action) {
  switch (action.type) {
    case SELECT_EDITOR_LINES: return action.lines;
    default: return state;
  }
}

export function selectEVMState(state = '', action) {
  switch(action.type) {
    case SHOW_EVM_STATE: return action.evmState;
    case HIDE_EVM_STATE: return action.empty;
    default: return state;
  }
}

export function toggleLoadingMessage(state = false, action) {
  switch(action.type) {
    case SHOW_LOADING_MESSAGE: return action.show;
    case HIDE_LOADING_MESSAGE: return action.show;
    default: return state;
  }
}

export function toggleErrorMessage(state = false, action) {
  switch(action.type) {
    case SHOW_ERROR_MESSAGE: return action.show;
    case HIDE_ERROR_MESSAGE: return action.show;
    case GET_ERROR_MESSAGE: return action.message;
    default: return state;
  }
}

export function displayVersionNumber(state = '', action) {
  switch(action.type) {
    case GET_VERSION_NUM: return action.version;
    default: return state;
  }
}

export function setActiveIndex(state = 0, action) {
  switch(action.type) {
    case GET_ACTIVE_INDEX: return action.index;
    default: return state;
  }
}