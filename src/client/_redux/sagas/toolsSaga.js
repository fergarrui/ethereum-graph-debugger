import { put, call, takeLatest } from 'redux-saga/effects';
import { postData, fetchData } from './utils';



const mockResponse = {
  "sections": [
      {
          "payload": {
              "functions": [
                  {
                      "params": [
                          "i32"
                      ],
                      "results": [
                          "i32"
                      ]
                  }
              ]
          },
          "payloadHex": "0160017f017f",
          "sectionType": "Type"
      },
      {
          "payload": {
              "functionsTypes": [
                  0
              ]
          },
          "payloadHex": "0100",
          "sectionType": "Function"
      },
      {
          "payload": {
              "exports": [
                  {
                      "index": 0,
                      "kind": "Function",
                      "name": "multiple"
                  }
              ]
          },
          "payloadHex": "01086d756c7469706c650000",
          "sectionType": "Export"
      },
      {
          "payload": {
              "functions": [
                  {
                      "bytecodeHex": "0240024002400240024020000e04030201000441e3000f0b41e4000f0b41e5000f0b41e6000f0b41e7000f0b41e8000b",
                      "exportedName": "multiple",
                      "formattedOpcodes": " <0> block 0x40\n   <1> block 0x40\n     <2> block 0x40\n       <3> block 0x40\n         <4> block 0x40\n           <5> local.get 0x0\n           <5> br_table 0x3,0x2,0x1,0x0,0x4\n           <5> i32.const 0x63\n           <5> return \n           <5> end \n         <4> i32.const 0x64\n         <4> return \n         <4> end \n       <3> i32.const 0x65\n       <3> return \n       <3> end \n     <2> i32.const 0x66\n     <2> return \n     <2> end \n   <1> i32.const 0x67\n   <1> return \n   <1> end \n <0> i32.const 0x68\n <0> end \n",
                      "functionSignature": "func_0(i32):i32",
                      "locals": [],
                      "name": "func_0",
                      "opcodes": [
                          {
                              "blockType": 0,
                              "depth": 0,
                              "immediates": [
                                  "0x40"
                              ],
                              "opcode": {
                                  "code": 2,
                                  "immediates": [
                                      {
                                          "type": 3
                                      }
                                  ],
                                  "name": "block"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 1,
                              "immediates": [
                                  "0x40"
                              ],
                              "opcode": {
                                  "code": 2,
                                  "immediates": [
                                      {
                                          "type": 3
                                      }
                                  ],
                                  "name": "block"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 2,
                              "immediates": [
                                  "0x40"
                              ],
                              "opcode": {
                                  "code": 2,
                                  "immediates": [
                                      {
                                          "type": 3
                                      }
                                  ],
                                  "name": "block"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 3,
                              "immediates": [
                                  "0x40"
                              ],
                              "opcode": {
                                  "code": 2,
                                  "immediates": [
                                      {
                                          "type": 3
                                      }
                                  ],
                                  "name": "block"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 4,
                              "immediates": [
                                  "0x40"
                              ],
                              "opcode": {
                                  "code": 2,
                                  "immediates": [
                                      {
                                          "type": 3
                                      }
                                  ],
                                  "name": "block"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 5,
                              "immediates": [
                                  "0x0"
                              ],
                              "opcode": {
                                  "code": 32,
                                  "immediates": [
                                      {
                                          "type": 0
                                      }
                                  ],
                                  "name": "local.get"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 5,
                              "immediates": [
                                  "0x3",
                                  "0x2",
                                  "0x1",
                                  "0x0",
                                  "0x4"
                              ],
                              "opcode": {
                                  "code": 14,
                                  "immediates": [
                                      {
                                          "type": 4
                                      },
                                      {
                                          "type": 0
                                      }
                                  ],
                                  "name": "br_table"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 5,
                              "immediates": [
                                  "0x63"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 5,
                              "immediates": [],
                              "opcode": {
                                  "code": 15,
                                  "immediates": [],
                                  "name": "return"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 5,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 4,
                              "immediates": [
                                  "0x64"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 4,
                              "immediates": [],
                              "opcode": {
                                  "code": 15,
                                  "immediates": [],
                                  "name": "return"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 4,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 3,
                              "immediates": [
                                  "0x65"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 3,
                              "immediates": [],
                              "opcode": {
                                  "code": 15,
                                  "immediates": [],
                                  "name": "return"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 3,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 2,
                              "immediates": [
                                  "0x66"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 2,
                              "immediates": [],
                              "opcode": {
                                  "code": 15,
                                  "immediates": [],
                                  "name": "return"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 2,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 1,
                              "immediates": [
                                  "0x67"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 1,
                              "immediates": [],
                              "opcode": {
                                  "code": 15,
                                  "immediates": [],
                                  "name": "return"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 1,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 0,
                              "immediates": [
                                  "0x68"
                              ],
                              "opcode": {
                                  "code": 65,
                                  "immediates": [
                                      {
                                          "type": 1
                                      }
                                  ],
                                  "name": "i32.const"
                              }
                          },
                          {
                              "blockType": 0,
                              "depth": 0,
                              "immediates": [],
                              "opcode": {
                                  "code": 11,
                                  "immediates": [],
                                  "name": "end"
                              }
                          }
                      ]
                  }
              ]
          },
          "payloadHex": "0131000240024002400240024020000e04030201000441e3000f0b41e4000f0b41e5000f0b41e6000f0b41e7000f0b41e8000b",
          "sectionType": "Code"
      },
      {
          "payloadHex": "046e616d6502050100010000"
      }
  ]
}


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
    // temp use mock data
    // const response = yield call(fetchData, url);
    yield put({ type: 'ANALYZER_FETCH_SUCCESS', payload: { ewasmAnalyzer: mockResponse, type: type, name: name }});
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