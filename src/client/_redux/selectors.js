export const getParameter = state => {
  return state.contracts.parameter;
}

export const getVersions = state => {
  return state.versions.versionsList;
}

export const getPostedVersions = state => {
  return state.versions.postedVersions
}

export const getContracts = state => {
  return state.contracts.contracts
}

export const getTransactionDebugger = state => {
  return state.tools.transactionDebugger;
}

export const getDisassembler = state => {
  return state.tools.disassembler;
}

export const getGraph = state => {
  return state.tools.graph;
}

export const getStorage = state => {
  return state.tools.storage;
}

export const getTabs = state => {
  return state.tools.tabs
}

export const getHasToolFetched = state => {
  return state.tools.hasFetched
}

export const getToolIsLoading = state => {
  return state.tools.isLoading
}