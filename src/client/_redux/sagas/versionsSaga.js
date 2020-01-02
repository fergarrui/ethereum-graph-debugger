import { put, takeEvery, call } from 'redux-saga/effects';
import { baseUrl, fetchData } from './utils';

export function* versionsWatcher() {
  yield takeEvery('FETCH_SOLC_VERSIONS', fetchSolcVersions)
}

export function* fetchSolcVersions() {
  const endpoint = `${baseUrl}solc/list`;
  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } })
    const versions = yield call(fetchData, endpoint);
    yield put({ type: 'FETCH_VERSIONS_SUCCESS', payload: { versions: versions } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } })
  }
  catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}