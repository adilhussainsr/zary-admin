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
} from '../contants';

const INIT_STATE = {
  allCityItems: null,
  cityItems: null,
  error: '',
  filter: null,
  searchKeyword: '',
  orderColumn: null,
  loaded: false,
  selectedItems: [],
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case CITY_GET_LIST:
      return { ...state, loaded: false };

    case CITY_GET_LIST_SUCCESS:
      return {
        ...state,
        loaded: true,
        allCityItems: action.payload,
        cityItems: action.payload,
      };

    case CITY_GET_LIST_ERROR:
      return { ...state, loaded: true, error: action.payload };

    case CITY_GET_LIST_WITH_FILTER:
      if (action.payload.column === '' || action.payload.value === '') {
        return {
          ...state,
          loaded: true,
          cityItems: state.allCityItems,
          filter: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const filteredItems = state.allCityItems.filter(
        (item) => item[action.payload.column] === action.payload.value
      );
      return {
        ...state,
        loaded: true,
        cityItems: filteredItems,
        filter: {
          column: action.payload.column,
          value: action.payload.value,
        },
      };

    case CITY_GET_LIST_WITH_ORDER:
      if (action.payload === '') {
        return {
          ...state,
          loaded: true,
          cityItems: state.cityItems,
          orderColumn: null,
        };
      }
      // eslint-disable-next-line no-case-declarations
      const sortedItems = state.cityItems.sort((a, b) => {
        if (a[action.payload] < b[action.payload]) return -1;
        if (a[action.payload] > b[action.payload]) return 1;
        return 0;
      });
      return {
        ...state,
        loaded: true,
        cityItems: sortedItems,
        orderColumn: state.orderColumns.find(
          (x) => x.column === action.payload
        ),
      };

    case CITY_GET_LIST_SEARCH:
      if (action.payload === '') {
        return { ...state, cityItems: state.allCityItems };
      }
      // eslint-disable-next-line no-case-declarations
      const keyword = action.payload.toLowerCase();
      // eslint-disable-next-line no-case-declarations
      const searchItems = state.allCityItems.filter(
        (item) =>
          item.title.toLowerCase().indexOf(keyword) > -1 ||
          item.detail.toLowerCase().indexOf(keyword) > -1 ||
          item.status.toLowerCase().indexOf(keyword) > -1 ||
          item.category.toLowerCase().indexOf(keyword) > -1 ||
          item.label.toLowerCase().indexOf(keyword) > -1
      );
      return {
        ...state,
        loaded: true,
        cityItems: searchItems,
        searchKeyword: action.payload,
      };

    case CITY_ADD_ITEM:
      return { ...state, loaded: false };

    case CITY_ADD_ITEM_SUCCESS:
      return {
        ...state,
        loaded: true,
        allCityItems: action.payload,
        cityItems: action.payload,
      };

    case CITY_ADD_ITEM_ERROR:
      return { ...state, loaded: true, error: action.payload };

    case CITY_SELECTED_ITEMS_CHANGE:
      return { ...state, loaded: true, selectedItems: action.payload };
    default:
      return { ...state };
  }
};
