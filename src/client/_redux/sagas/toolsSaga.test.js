import { call, put } from 'redux-saga/effects';
import { baseUrl, fetchData, postData } from './utils';

import { fetchTransactionDebugger, fetchStorage, fetchGraph, fetchDisassembler } from './toolsSaga';

describe.skip('should fetch data with the right parameters', () => { 
  const debuggerGen = fetchTransactionDebugger();
  const storageGen = fetchStorage();
  const graphGen = fetchGraph();
  const disassemblerGen = fetchDisassembler();

  const headers = {
    method: 'POST',
    body: JSON.stringify({ request: body }),
    headers:{
      'Content-Type': 'application/json'
    }
  }

  it('should fetch transaction debugger', () => {
    const response = call(postData, url,  )
  });

 it('should fetch disassembler', () => {
   
  });

  it('should fetch control flowg raph', () => {
   
  });

  it('should fetch storagr', () => {
   
  });
})