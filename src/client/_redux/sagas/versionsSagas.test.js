import { call, put } from 'redux-saga/effects';
import { baseUrl, fetchData, postData } from './utils';

import { fetchSolcVersions, postVersion } from './versionsSaga';

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
});

describe('it posts new solc version', () => {
  const version = '0.5.15';
  const postVersionGen = postVersion({ payload: { version }});

  it('send a post request with the right parameter', () => {
    const showLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: true, message: 'Loading... This might take a while' } });
    expect(postVersionGen.next().value).toEqual(showLoadingMessage);

    const endpoint = `${baseUrl}solc`;
    
    const headers = {
      method: 'POST',
      body: JSON.stringify(version),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    }

    const mockedResponse = '0.5.15+commit.6a57276f.Emscripten.clang';

    const expectedYield = call(postData, endpoint, headers);
    expect(postVersionGen.next().value).toEqual(expectedYield);

    const expectedResponse = put({ type: 'ADD_VERSION', payload: { version: mockedResponse } });
    expect(postVersionGen.next(mockedResponse).value).toEqual(expectedResponse);

    const hideLoadingMessage = put({ type: 'TOGGLE_LOADING_MESSAGE', payload: { isLoadingMessageOn: false } });
    expect(postVersionGen.next().value).toEqual(hideLoadingMessage);
  });

  it('should thorw an error on fail', () => {
    const expectedFail = put({ type: 'TOGGLE_ERROR_MESSAGE', payload: { isErrorMessageOn: true, message: 'Error' } });
    expect(postVersionGen.throw({ message: 'Error'}).value).toEqual(expectedFail);
  });
});