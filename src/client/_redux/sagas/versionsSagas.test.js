import { call, put } from 'redux-saga/effects';
import { baseUrl, fetchData } from './utils';

import { fetchSolcVersions } from './versionsSaga';

describe('should fetch solc versons', () => {
  const versionsGen = fetchSolcVersions();

  it('should show a loading message', () => {
    const expectedYield = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading...' } });
    expect(versionsGen.next().value).toEqual(expectedYield);
  });

  it('should fetch solc versions', () => {
    const endpoint = `${baseUrl}solc/list`;
    const expectedYield = call(fetchData, endpoint);
    expect(versionsGen.next().value).toEqual(expectedYield); 
  });

  it('should return solc versions on fetch success', () => {
    const response = [{version: "0.6.0", commit: "v0.6.0+commit.26b70077"}, {version: "0.5.15", commit: "v0.5.15+commit.6a57276f"}];
    const expectedResponse = put({ type: 'FETCH_VERSIONS_SUCCESS', payload: { versions: response } });
    expect(versionsGen.next(response).value).toEqual(expectedResponse)
  });

  it('should close the loading message on success', () => {
    const hideLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
    expect(versionsGen.next().value).toEqual(hideLoadingMessage);
  });

  it('should throw an error when fetch fails', () => {
    const expectedFail = put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: 'Error' } });
    expect(versionsGen.throw({ message: 'Error'}).value).toEqual(expectedFail);

    const hideLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
    expect(versionsGen.next().value).toEqual(hideLoadingMessage);
  });
})