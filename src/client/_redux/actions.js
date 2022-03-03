import * as ActionTypes from './Constants.js';

export const filterTabs = index => dispatch => {
  dispatch({
    type: ActionTypes.FILTER_TABS,
    payload: {
      index
    }
  })
}

export const fetchTransactionDebugger = (name, url, type, body) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_TRANSACTION_DEBUGGER,
    payload: {
      name,
      url,
      type,
      body,
    }
  });
}

export const fetchStorage = (name, url, type) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_STORAGE,
    payload: {
      name,
      url,
      type
    }
  });
}

export const fetchDisassembler = (name, url, type, body) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_DISASSEMBLER,
    payload: {
      name,
      url,
      type,
      body,
    }
  });
}

export const fetchControlFlowGraph = (name, url, type, body) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_GRAPH,
    payload: {
      name,
      url,
      type,
      body
    }
  });
}

export const fetchEwasmFileAnalyzer = (name, url, type, body) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_FILE_ANALYZER,
    payload: {
      name,
      url,
      type,
      body
    }
  })
}

export const fetchAnalyzer = (name, url, type) => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_ANALYZER,
    payload: {
      name,
      url,
      type
    }
  });
}

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
    type: ActionTypes.FETCH_CONTRACTS
  })
}

export const fetchSolcVersions = () => dispatch => {
  dispatch({
    type: ActionTypes.FETCH_SOLC_VERSIONS
  })
}

export const postVersion = version => dispatch => {
  dispatch({
    type: ActionTypes.POST_VERSION,
    payload: {
      version
    }
  });
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
    payload: {
      version
    }
  }) 
}