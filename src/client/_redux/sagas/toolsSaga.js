import { put, call, takeLatest } from 'redux-saga/effects';
import { postData, fetchData } from './utils';

export function* toolsWatcher() {
  yield takeLatest('FETCH_TRANSACTION_DEBUGGER', fetchTransactionDebugger);
  yield takeLatest('FETCH_DISASSEMBLER', fetchDisassembler);
  yield takeLatest('FETCH_STORAGE', fetchStorage);
  yield takeLatest('FETCH_GRAPH', fetchGraph);
}

export function* fetchTransactionDebugger(action) {
  const { url, body } = action.payload;
  const headers = {
    method: 'POST',
    body: JSON.stringify({ request: body }),
    headers:{
      'Content-Type': 'application/json'
    }
  }

  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(postData, url, headers);
    yield put({ type: 'DEBUGGER_FETCH_SUCCESS', payload: { transactionDebugger: response, type: action.payload.type }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchStorage(action) {
  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(fetchData, action.payload.url);
    yield put({ type: 'STORAGE_FETCH_SUCCESS', payload: { storage: response, type: action.payload.type }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchDisassembler(action) {
  const { url, body } = action.payload;
  const headers = {
    method: 'POST',
    body: JSON.stringify({ request: body }),
    headers:{
      'Content-Type': 'application/json'
    }
  }

  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(postData, url, headers);
    yield put({ type: 'DISASSEMBLER_FETCH_SUCCESS', payload: { disassembler: response, type: action.payload.type }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchGraph(action) {
  const { url, body } = action.payload;
  const headers = {
    method: 'POST',
    body: JSON.stringify({ request: body }),
    headers:{
      'Content-Type': 'application/json'
    }
  }

  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(postData, url, headers);
    yield put({ type: 'GRAPH_FETCH_SUCCESS', payload: { graph: response, type: action.payload.type }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}