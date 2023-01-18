import { NotificationManager } from 'components/common/react-notifications';
import { GET_POST_CITY_URL, GET_POST_ZIP_URL } from 'constants/apiRoutes';
import {
  apiDeleteWithAuthToken,
  apiGetWithAuthToken,
  apiPostWithAuthToken,
} from 'helpers/apiHelper';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
// import { getDateWithFormat } from 'helpers/Utils';

import {
  CITY_GET_LIST,
  CITY_ADD_ITEM,
  ZIP_ADD_ITEM,
  ZIP_REMOVE_ITEM,
} from '../contants';

import {
  getCityListSuccess,
  getCityListError,
  addCityItemSuccess,
  addZipItemError,
} from './actions';

const getCityListRequest = async () => {
  return apiGetWithAuthToken(`${GET_POST_CITY_URL}?type=all`).then((resp) => {
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

const removeZipItemRequest = async (item) => {
  return apiDeleteWithAuthToken(`${GET_POST_ZIP_URL}/${item}`).then((resp) => {
    if (resp?.statusCode === 200) {
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
    yield put(getCityListSuccess(response));
  } catch (error) {
    yield put(getCityListError(error));
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

function* removeZipItem({ payload }) {
  try {
    const status = yield call(removeZipItemRequest, payload);
    console.log(status);
    if (status) {
      NotificationManager.success(
        'New Zip Code Deleted',
        'Zip Deleted',
        3000,
        null,
        null,
        ''
      );
      const response = yield call(getCityListRequest);
      yield put(getCityListSuccess(response));
    }
  } catch (error) {
    yield put(getCityListError(error));
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

export function* wathcRemoveZip() {
  yield takeLatest(ZIP_REMOVE_ITEM, removeZipItem);
}

export default function* rootSaga() {
  yield all([
    fork(watchGetList),
    fork(wathcAddItem),
    fork(wathcAddZip),
    fork(wathcRemoveZip),
  ]);
}
