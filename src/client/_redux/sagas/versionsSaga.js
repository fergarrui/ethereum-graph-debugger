import { put, takeEvery, takeLatest, call } from 'redux-saga/effects';
import { baseUrl, fetchData, postData } from './utils';

export function* versionsWatcher() {
  yield takeEvery('FETCH_SOLC_VERSIONS', fetchSolcVersions);
  yield takeLatest('POST_VERSION', postVersion);
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

export function* postVersion(action) {
  const endpoint = `${baseUrl}solc`;

  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading... This might take a while' } })
    const headers = {
      method: 'POST',
      body: JSON.stringify(action.payload.version),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }

    const version = yield call(postData, endpoint, headers);
    yield put({ type: 'ADD_VERSION', payload: { version: version } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } })
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}