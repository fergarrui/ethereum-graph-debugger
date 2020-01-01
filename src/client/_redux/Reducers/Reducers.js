import * as ActionTypes from '../Constants';


export const selectLines = (state = [0, 0], action) => {
  switch (action.type) {
    case ActionTypes.SELECT_EDITOR_LINES: return action.lines;
    default: return state;
  }
}

export const selectEVMState = (state = '', action) => {
  switch(action.type) {
    case ActionTypes.TOGGLE_EVM_STATE: 
      return action.payload.evmSate;
    default: return state;
  }
}

export const loadingMessage = (state = { isLoading: false, message: '' }, action) => {
  switch(action.type) {
    case ActionTypes.TOGGLE_LOADING_MESSAGE:
      return { ...state, isLoading: action.payload.isLoadingMessageOn, message: action.payload.message }
    default: return state;
  }
}

export const errorMessage = (state = { hasError: false, message: ''}, action) => {
  switch(action.type) {
    case ActionTypes.TOGGLE_ERROR_MESSAGE:
      return { ...state, hasError: action.payload.isErrorMessageOn, message: action.payload.message }
    case ActionTypes.FETCH_CONTRACTS_FAIL:
      return { ...state, hasError: true, message: action.payload.message }
    default: return state;
  }
}

export const versions = (state = { postedVersions: [], versionNumber: null, hasFetched: false, versionsList: [], errorMessage: '' }, action) => {
  switch(action.type) {
    case ActionTypes.FETCH_VERSIONS_SUCCESS: 
      return { ...state, versionsList: action.payload.versions }
    case ActionTypes.FETCH_VERSIONS_FAIL:
      return { ...state, errorMessage: action.payload.message }
    case ActionTypes.ADD_VERSION:
      return { ...state, versions: action.version, hasFetched: true };
    case ActionTypes.GET_VERSION_NUM:
      return { ...state, versionNumber: action.versionNum, hasFetched: false }; 
    default: return state;
  }
}

export const contracts = (state = { contracts: [], parameter: '' }, action) => {
  switch(action.type) {
    case ActionTypes.GET_PARAMETER:
      return { ...state, parameter: action.payload.parameter }
    case ActionTypes.FETCH_CONTRACTS_SUCCESS:
      return { ...state, contracts: action.payload.contracts }
    default: return state;
  }
}