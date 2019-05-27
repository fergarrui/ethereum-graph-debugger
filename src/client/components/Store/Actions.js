import { SELECT_EDITOR_LINES, SHOW_EVM_STATE, 
  SHOW_LOADING_MESSAGE, HIDE_LOADING_MESSAGE, 
  SHOW_ERROR_MESSAGE, HIDE_ERROR_MESSAGE, 
  HIDE_EVM_STATE, GET_ERROR_MESSAGE, GET_VERSION_NUM } from './Constants.js';

export function selectEditorLines(lines) {
  return {
    type: SELECT_EDITOR_LINES,
    lines,
  }
}

export function showEVMState(evmState) {
  return {
    type: SHOW_EVM_STATE,
    evmState,
  }
}

export function hideEVMState() {
  return {
    type: HIDE_EVM_STATE,
    empty: '',
  }
}

export function showLoadingMessage() {
  return {
    type: SHOW_LOADING_MESSAGE,
    show: true,
  }
}

export function hideLoadingMessage() {
  return {
    type: HIDE_LOADING_MESSAGE,
    show: false,
  }
}

export function showErrorMessage() {
  return {
    type: SHOW_ERROR_MESSAGE,
    show: true,
  }
}

export function hideErrorMessage() {
  return {
    type: HIDE_ERROR_MESSAGE,
    show: false,
  }
}

export function getErrorMessage(message) {
  return {
    type: GET_ERROR_MESSAGE,
    message,
  }
}

export function getVersionNumber(version) {
  return {
    type: GET_VERSION_NUM,
    version,
  }
}
