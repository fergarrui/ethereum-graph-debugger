import * as ActionTypes from './Constants.js';

  import { baseUrl } from '../../utils/baseUrl';

export const selectEditorLines = lines => {
  return {
    type: ActionTypes.SELECT_EDITOR_LINES,
    lines,
  }
}

export const showEVMState = evmState => {
  return {
    type: ActionTypes.SHOW_EVM_STATE,
    evmState,
  }
}

export const hideEVMState = () => {
  return {
    type: ActionTypes.HIDE_EVM_STATE,
    empty: '',
  }
}

export const showLoadingMessage = (message) => {
  return {
    type: ActionTypes.SHOW_LOADING_MESSAGE,
    message
  }
}

export const hideLoadingMessage = () => {
  return {
    type: ActionTypes.HIDE_LOADING_MESSAGE,
  }
}

export const showErrorMessage = message => {
  return {
    type: ActionTypes.SHOW_ERROR_MESSAGE,
    message
  }
}

export const hideErrorMessage = () => {
  return {
    type: ActionTypes.HIDE_ERROR_MESSAGE,
  }
}

export const getVersionNumber = versionNum => {
  return {
    type: ActionTypes.GET_VERSION_NUM,
    versionNum,
  }
}

export const addVersion = version => {
  return {
    type: ActionTypes.ADD_VERSION,
    version
  }
}

export const postVersion = version => dispatch => {
  dispatch(showLoadingMessage('Loading... This might take a while'));

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
      dispatch(hideLoadingMessage());
      dispatch(addVersion(response));
    })
    .catch(error => {
      alert('Your version could not be posted\nError: ' + error.message)
    });    
};