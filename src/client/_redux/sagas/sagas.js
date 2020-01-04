import { all } from 'redux-saga/effects';

import { contractsWatcher } from './contractsSaga';
import { versionsWatcher } from './versionsSaga';
import { toolsWatcher } from './toolsSaga';

export default function* rootSaga() {
  yield all([
    versionsWatcher(),
    contractsWatcher(),
    toolsWatcher()
  ])
}