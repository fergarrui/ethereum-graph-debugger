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