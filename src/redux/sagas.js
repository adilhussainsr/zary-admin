import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import locationSaga from './location/saga';
import chatSagas from './chat/saga';
import surveyListSagas from './surveyList/saga';
import surveyDetailSagas from './surveyDetail/saga';

export default function* rootSaga() {
  yield all([
    authSagas(),
    locationSaga(),
    chatSagas(),
    surveyListSagas(),
    surveyDetailSagas(),
  ]);
}
