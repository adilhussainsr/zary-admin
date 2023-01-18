import {
  CITY_GET_LIST,
  CITY_GET_LIST_SUCCESS,
  CITY_GET_LIST_ERROR,
  CITY_GET_LIST_WITH_FILTER,
  CITY_GET_LIST_WITH_ORDER,
  CITY_GET_LIST_SEARCH,
  CITY_ADD_ITEM,
  CITY_ADD_ITEM_SUCCESS,
  CITY_ADD_ITEM_ERROR,
  CITY_SELECTED_ITEMS_CHANGE,
  ZIP_ADD_ITEM,
  ZIP_ADD_ITEM_SUCCESS,
  ZIP_ADD_ITEM_ERROR,
  ZIP_REMOVE_ITEM,
} from '../contants';

export const getCityList = () => ({
  type: CITY_GET_LIST,
});

export const getCityListSuccess = (items) => ({
  type: CITY_GET_LIST_SUCCESS,
  payload: items,
});

export const getCityListError = (error) => ({
  type: CITY_GET_LIST_ERROR,
  payload: error,
});

export const getCityListWithFilter = (column, value) => ({
  type: CITY_GET_LIST_WITH_FILTER,
  payload: { column, value },
});

export const getCityListWithOrder = (column) => ({
  type: CITY_GET_LIST_WITH_ORDER,
  payload: column,
});

export const getCityListSearch = (keyword) => ({
  type: CITY_GET_LIST_SEARCH,
  payload: keyword,
});

export const addCityItem = (item) => ({
  type: CITY_ADD_ITEM,
  payload: item,
});

export const addCityItemSuccess = (items) => ({
  type: CITY_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addCityItemError = (error) => ({
  type: CITY_ADD_ITEM_ERROR,
  payload: error,
});

export const addZipItem = (item) => ({
  type: ZIP_ADD_ITEM,
  payload: item,
});

export const addZipItemSuccess = (items) => ({
  type: ZIP_ADD_ITEM_SUCCESS,
  payload: items,
});

export const addZipItemError = (error) => ({
  type: ZIP_ADD_ITEM_ERROR,
  payload: error,
});

export const selectedCityItemsChange = (selectedItems) => ({
  type: CITY_SELECTED_ITEMS_CHANGE,
  payload: selectedItems,
});

export const removeZipItem = (item) => ({
  type: ZIP_REMOVE_ITEM,
  payload: item,
});
