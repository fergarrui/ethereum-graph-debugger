import * as ActionTypes from './Constants.js';

import { baseUrl } from '../utils/baseUrl';

export const getParameter = parameter => dispatch => {
  dispatch({
    type: ActionTypes.GET_PARAMETER,
    payload: {
      parameter
    }
  })
}

export const fetchContracts = () => dispatch => {
  dispatch({
    type: 'FETCH_CONTRACTS'
  })
}

export const fetchSolcVersions = () => dispatch => {
  dispatch({
    type: 'FETCH_SOLC_VERSIONS'
  })
}

export const selectEditorLines = lines => dispatch => {
  dispatch({
    type: ActionTypes.SELECT_EDITOR_LINES,
    lines,
  })
}

export const toggleEVMState = (evmState) => dispatch => {
  dispatch({
    type: ActionTypes.TOGGLE_EVM_STATE,
    payload: {
      evmState
    }
  })
}

export const toggleLoadingMessage = (isLoadingMessageOn, message) => dispatch => {
  dispatch({
    type: ActionTypes.TOGGLE_LOADING_MESSAGE,
    payload : {
      isLoadingMessageOn: isLoadingMessageOn,
      message: message
    }
  })
}

export const toggleErrorMessage = (isErrorMessageOn, message) => dispatch => {
  dispatch({
    type: ActionTypes.TOGGLE_ERROR_MESSAGE,
    payload : {
      isErrorMessageOn,
      message
    }
  })
}

export const getVersionNumber = versionNum => dispatch => {
  dispatch({
    type: ActionTypes.GET_VERSION_NUM,
    versionNum,
  })
}

export const addVersion = version => dispatch => {
  dispatch({
    type: ActionTypes.ADD_VERSION,
    version
  }) 
}

export const postVersion = version => dispatch => {
  dispatch(toggleLoadingMessage(true, 'Loading... This might take a while'));

  return fetch(baseUrl + 'solc', {
    method: 'POST',
    body: JSON.stringify(version),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error('Error ' + response.status + ': ' + response.statusText);

        error.response = response;
        throw error;
      }
    },
    error => {
      var errmess = new Error(error.message);
      throw errmess; 
    })
    .then(response => response.json())
    .then(response => {
      dispatch(toggleLoadingMessage(false));
      dispatch(addVersion(response));
    })
    .catch(error => {
      dispatch(toggleErrorMessage(true, error.message));
    });    
};