import sinon from 'sinon';

import { call, put, select } from 'redux-saga/effects';
import { baseUrl, fetchData } from './utils';

import * as selectors from '../selectors';

import { fetchContracts } from './contractsSaga';


describe('should fetch smart contracts', () => {
  const contractsGen = fetchContracts();

  it('should select the right parameter', () => {
    const endpoint = `${baseUrl}files/${encodeURIComponent(selectedParameter) || ' '}?extension=sol`;
    const selectedParameter = select(selectors.getParameter);
    expect(contractsGen.next().value).toEqual(selectedParameter);

    const loadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    expect(contractsGen.next().value).toEqual(loadingMessage);

    const expectedCall = call(fetchData, endpoint);
    expect(contractsGen.next(selectedParameter).value).toEqual(expectedCall);
  });

  it('should return contracts on success', () => {
    const mockedResults = [{"name":"LoopExample.sol","code":"pragma solidity ^0.5.8;\n\ncontract LoopExample {\n\n    uint[] arr;\n\n    function add(uint _val, uint _times) public {\n        uint v = _val;\n        for (uint i=0; i < _times; i++) {\n            arr.push(v);\n            v++;\n        }\n    }\n}\n","path":"/Users/stefaniaocchilupo/Desktop/contracts"},{"name":"LoopExample2.sol","code":"pragma solidity ^0.5.8;\n\ncontract LoopExample2 {\n\n    uint[] arr;\n    uint a;\n\n    constructor(uint _v) public {\n      a = _v;\n    }\n\n    function add(uint _val, uint _times) public {\n        uint v = _val;\n        a = _val;\n        for (uint i=0; i < _times; i++) {\n            arr.push(v);\n            v++;\n        }\n    }\n\n    function noParam() public {\n        arr.push(1);\n    }\n\n    function add2(uint _val) public {\n        a = _val;\n    }\n}\n","path":"/Users/stefaniaocchilupo/Desktop/contracts"}]
    const expectedResponse = put({ type: 'FETCH_CONTRACTS_SUCCESS', payload: { contracts: mockedResults } });
    expect(contractsGen.next(mockedResults).value).toEqual(expectedResponse)
  });

  it('should close the loading message on success', () => {
    const hideLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
    expect(contractsGen.next().value).toEqual(hideLoadingMessage);
  });

  it('should throw an error when fetch fails', () => {
    const expectedFail = put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: 'Error' } });
    expect(contractsGen.throw({ message: 'Error'}).value).toEqual(expectedFail);

    const hideLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
    expect(contractsGen.next().value).toEqual(hideLoadingMessage);
  });
});