import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { postData, fetchData } from './utils';
// import { data } from 'client/components/EwasmAnalyzer/data.js'


export function* toolsWatcher() {
  yield takeLatest('FETCH_TRANSACTION_DEBUGGER', fetchTransactionDebugger);
  yield takeLatest('FETCH_DISASSEMBLER', fetchDisassembler);
  yield takeLatest('FETCH_STORAGE', fetchStorage);
  yield takeLatest('FETCH_GRAPH', fetchGraph);
  yield takeLatest('FETCH_ANALYZER', fetchEwasmAnalyzer);
}

export function* fetchEwasmAnalyzer(action) {
  const { url, type, name } = action.payload;

  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(fetchData, url);
    yield put({ type: 'ANALYZER_FETCH_SUCCESS', payload: { ewasmAnalyzer: response, type: type, name: name }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchTransactionDebugger(action) {
  const { url, body, type, name } = action.payload;
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
    yield put({ type: 'DEBUGGER_FETCH_SUCCESS', payload: { transactionDebugger: response, type: type, name: name }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchStorage(action) {
  const { url, type, name } = action.payload;
  try {
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    const response = yield call(fetchData, url);
    yield put({ type: 'STORAGE_FETCH_SUCCESS', payload: { storage: response, type: type, name: name }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchDisassembler(action) {
  const { url, body, type, name } = action.payload;
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
    yield put({ type: 'DISASSEMBLER_FETCH_SUCCESS', payload: { disassembler: response, type: type, name: name }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}

export function* fetchGraph(action) {
  const { url, body, type, name } = action.payload;
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
    yield put({ type: 'GRAPH_FETCH_SUCCESS', payload: { graph: response, type: type, name: name }});
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  } catch(error) {
    yield put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: error.message } });
    yield put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
  }
}