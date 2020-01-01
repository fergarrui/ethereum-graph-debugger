import * as selectors from '../selectors';

import { select, put, takeEvery, all, call } from 'redux-saga/effects';

const baseUrl = 'http://localhost:9090/';

const fetchData = (endpoint) => fetch(endpoint).then(res => res.json())

function* contractsWatcher() {
  yield takeEvery('FETCH_CONTRACTS', fetchContracts)
}

function* versionsWatcher() {
  yield takeEvery('FETCH_SOLC_VERSIONS', fetchSolcVersions)
}

function* fetchSolcVersions() {
  const endpoint = `${baseUrl}solc/list`;
  try {
    const versions = yield call(fetchData, endpoint);
    yield put({ type: 'FETCH_VERSIONS_SUCCESS', payload: { versions: versions } });
  }
  catch(error) {
    yield put({ type: 'FETCH_VERSIONS_FAIL', payload: { message: error } });
  }
}

function* fetchContracts() {
  const parameter = yield select(selectors.getParameter);
  const endpoint = `${baseUrl}files/${encodeURIComponent(parameter) || ' '}?extension=sol`;
  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } })
    const contracts = yield call(fetchData, endpoint);
    yield put({ type: 'FETCH_CONTRACTS_SUCCESS', payload: { contracts: contracts } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } })
  }
  catch(error) {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } })
    yield put({ type: 'FETCH_CONTRACTS_FAIL', payload: { message: error } });
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error } })
  }
}

export default function* rootSaga() {
  yield all([
    versionsWatcher(),
    contractsWatcher()
  ])
}