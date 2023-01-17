import { GET_POST_CITY_URL } from 'constants/apiRoutes';
import { apiGetWithAuthToken, apiPostWithAuthToken } from 'helpers/apiHelper';
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
// import { getDateWithFormat } from 'helpers/Utils';

import { CITY_GET_LIST, CITY_ADD_ITEM } from '../contants';

import {
  getCityListSuccess,
  getCityListError,
  addCityItemSuccess,
  addCityItemError,
} from './actions';

const getCityListRequest = async () => {
  return apiGetWithAuthToken(GET_POST_CITY_URL).then((resp) => {
    if (resp?.data?.data) {
      return resp?.data?.data;
    }
    throw new Error(resp?.data?.message || resp?.message || resp?.statusText);
  });
  // eslint-disable-next-line no-return-await
  // return await new Promise((success) => {
  //   setTimeout(() => {
  //     success(cityData.data);
  //   }, 1000);
  // })
  //   .then((response) => response)
  //   .catch((error) => error);
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

function* addCityItem({ payload }) {
  console.log("adding city")
  try {
    yield call(addCityItemRequest, payload);
    const response = yield call(getCityListRequest);
    yield put(addCityItemSuccess(response));
  } catch (error) {
    yield put(addCityItemError(error));
  }
}

export function* watchGetList() {
  yield takeEvery(CITY_GET_LIST, getCityListItems);
}

export function* wathcAddItem() {
  console.log("testing logs")
  yield takeEvery(CITY_ADD_ITEM, addCityItem);
}

export default function* rootSaga() {
  yield all([fork(watchGetList), fork(wathcAddItem)]);
}
