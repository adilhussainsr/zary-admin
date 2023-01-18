import { NotificationManager } from 'components/common/react-notifications';
import { GET_POST_CITY_URL, GET_POST_ZIP_URL } from 'constants/apiRoutes';
import { apiGetWithAuthToken, apiPostWithAuthToken } from 'helpers/apiHelper';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
// import { getDateWithFormat } from 'helpers/Utils';

import { CITY_GET_LIST, CITY_ADD_ITEM, ZIP_ADD_ITEM } from '../contants';

import {
  getCityListSuccess,
  getCityListError,
  addCityItemSuccess,
  addCityItemError,
  addZipItemError,
} from './actions';

const getCityListRequest = async () => {
  return apiGetWithAuthToken(GET_POST_CITY_URL).then((resp) => {
    if (resp?.data?.data) {
      return resp?.data?.data;
    }
    throw new Error(resp?.data?.message || resp?.message || resp?.statusText);
  });
};

function* getCityListItems() {
  try {
    const response = yield call(getCityListRequest);
    yield put(getCityListSuccess(response));
  } catch (error) {
    yield put(getCityListError(error));
  }
}

const addCityItemRequest = async (item) => {
  return apiPostWithAuthToken(GET_POST_CITY_URL, item).then((resp) => {
    if (resp?.data?.data) {
      return resp?.data?.data;
    }
    throw new Error(resp?.data?.message || resp?.message || resp?.statusText);
  });
};

const addZipItemRequest = async (item) => {
  return apiPostWithAuthToken(GET_POST_ZIP_URL, item).then((resp) => {
    console.log(resp);
    if (resp?.statusCode === 201) {
      return true;
    }
    throw new Error(resp?.data?.message || resp?.message || resp?.statusText);
  });
};

function* addCityItem({ payload }) {
  try {
    yield call(addCityItemRequest, payload);
    NotificationManager.success(
      'New City added',
      'City Added',
      3000,
      null,
      null,
      ''
    );
    const response = yield call(getCityListRequest);
    yield put(addCityItemSuccess(response));
  } catch (error) {
    yield put(addCityItemError(error));
  }
}

function* addZipItem({ payload }) {
  try {
    const status = yield call(addZipItemRequest, payload);
    if (status) {
      NotificationManager.success(
        'New Zip Code added',
        'Zip Added',
        3000,
        null,
        null,
        ''
      );
      const response = yield call(getCityListRequest);
      yield put(addCityItemSuccess(response));
    }
  } catch (error) {
    yield put(addZipItemError(error));
  }
}

export function* watchGetList() {
  yield takeLatest(CITY_GET_LIST, getCityListItems);
}

export function* wathcAddItem() {
  yield takeLatest(CITY_ADD_ITEM, addCityItem);
}

export function* wathcAddZip() {
  yield takeLatest(ZIP_ADD_ITEM, addZipItem);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(wathcAddItem), fork(wathcAddZip)]);
}
