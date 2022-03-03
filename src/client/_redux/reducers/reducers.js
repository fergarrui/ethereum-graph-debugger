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
    case ActionTypes.ADD_VERSION:
      return { ...state, versions: action.payload.version, hasFetched: true };
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

export const tools = (state = { transactionDebugger: [], storage: [], disassembler: [], graph: [], ewasmAnalyzer: [], hasFetched: false, isLoading: false,  tabs: [] }, action) => {
  switch(action.type) {
    case ActionTypes.FETCH_DISASSEMBLER:
    case ActionTypes.FETCH_GRAPH:
    case ActionTypes.FETCH_STORAGE:
    case ActionTypes.FETCH_TRANSACTION_DEBUGGER:
    case ActionTypes.FETCH_ANALYZER:
    case ActionTypes.FETCH_FILE_ANALYZER:
      return { ...state, isLoading: true }
    case ActionTypes.DEBUGGER_FETCH_SUCCESS: 
      return { ...state, isLoading: false, transactionDebugger: [ ...state.transactionDebugger, { name: action.payload.name, data: action.payload.transactionDebugger }], hasFetched: true, tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.STORAGE_FETCH_SUCCESS: 
      return { ...state, isLoading: false, storage:[ ...state.storage, { name: action.payload.name, data: action.payload.storage }], hasFetched: true, tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.GRAPH_FETCH_SUCCESS:
      return { ...state, isLoading: false, graph: [ ...state.graph, { name: action.payload.name, isConstructor: action.payload.graph.isConstructor, data: action.payload.graph }], hasFetched: true, tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.DISASSEMBLER_FETCH_SUCCESS:
      return { ...state, isLoading: false, disassembler: [ ...state.disassembler, { name: action.payload.name, data: action.payload.disassembler }], hasFetched: true, tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.ANALYZER_FETCH_SUCCESS:
      return  { ...state, isLoading: false, hasFetched: true, ewasmAnalyzer: [ ...state.ewasmAnalyzer, { name: action.payload.name, data: action.payload.ewasmAnalyzer }], tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.FILE_ANALYZER_FETCH_SUCCESS:
      return  { ...state, isLoading: false, hasFetched: true, ewasmAnalyzer: [ ...state.ewasmAnalyzer, { name: action.payload.name, data: action.payload.ewasmAnalyzer }], tabs: [ ...state.tabs, { name: action.payload.name, title: action.payload.type, type: action.payload.type }] }
    case ActionTypes.FILTER_TABS:
      return { ...state, tabs: state.tabs.filter((tab, i) => i !== action.payload.index)}
    default:
      return state;
  }
} 