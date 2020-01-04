import * as selectors from '../selectors';

import { select, put, takeEvery, call } from 'redux-saga/effects';
import { baseUrl, fetchData } from './utils';

export function* contractsWatcher() {
  yield takeEvery('FETCH_CONTRACTS', fetchContracts)
}

export function* fetchContracts() {
  const parameter = yield select(selectors.getParameter);
  const endpoint = `${baseUrl}files/${encodeURIComponent(parameter) || ' '}?extension=sol`;
  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } })
    const contracts = yield call(fetchData, endpoint);
    yield put({ type: 'FETCH_CONTRACTS_SUCCESS', payload: { contracts: contracts } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } })
  }
  catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });    
  }
}