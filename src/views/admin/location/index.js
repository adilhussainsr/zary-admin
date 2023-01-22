/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Collapse,
  ButtonDropdown,
  CustomInput,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

import {
  getCityList,
  getCityListWithOrder,
  getCityListSearch,
  selectedCityItemsChange,
} from 'redux/actions';
import TodoListItem from 'components/applications/TodoListItem';
import TodoApplicationMenu from 'containers/applications/TodoApplicationMenu';
import AddNewCityModal from 'containers/applications/AddNewCityModal';
import CityListItem from 'components/applications/CityListItem';
import ViewZipModal from 'containers/applications/ViewZipModal';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const Location = ({
  match,
  intl,
  cityItems,
  searchKeyword,
  loaded,
  orderColumn,
  orderColumns,
  selectedItems,
  getCityListAction,
  getCityListWithOrderAction,
  getCityListSearchAction,
  selectedCityItemsChangeAction,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    if (selectedCity) {
      const updatedCity = cityItems?.find(
        (city) => city.id === selectedCity?.id
      );
      setSelectedCity(updatedCity);
    }
  }, [cityItems, selectedCity]);

  useEffect(() => {
    document.body.classList.add('right-menu');
    getCityListAction();

    return () => {
      document.body.classList.remove('right-menu');
    };
  }, [getCityListAction]);

  const handleCheckChange = (event, id) => {
    if (lastChecked == null) {
      setLastChecked(id);
    }

    let selectedList = Object.assign([], selectedItems);
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    selectedCityItemsChangeAction(selectedList);

    if (event.shiftKey) {
      let items = cityItems;
      const start = getIndex(id, items, 'id');
      const end = getIndex(lastChecked, items, 'id');
      items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedList.push(
        ...items.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedList));
      selectedCityItemsChangeAction(selectedList);
    }
  };

  const handleChangeSelectAll = () => {
    if (loaded) {
      if (selectedItems.length >= cityItems.length) {
        selectedCityItemsChangeAction([]);
      } else {
        selectedCityItemsChangeAction(cityItems.map((x) => x.id));
      }
    }
  };

  const { messages } = intl;

  return (
    <>
      <Row className="app-row survey-app">
        <Colxx xxs="12" md="12" lg="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id="menu.location" />
            </h1>
            {loaded && (
              <div className="text-zero top-right-button-container">
                <Button
                  color="primary"
                  size="lg"
                  className="top-right-button"
                  onClick={() => setModalOpen(true)}
                >
                  <IntlMessages id="todo.add-new" />
                </Button>{' '}
                <ButtonDropdown
                  isOpen={dropdownSplitOpen}
                  toggle={() => setDropdownSplitOpen(!dropdownSplitOpen)}
                >
                  <div className="btn btn-primary btn-lg pl-4 pr-0 check-button check-all">
                    <CustomInput
                      className="custom-checkbox mb-0 d-inline-block"
                      type="checkbox"
                      id="checkAll"
                      checked={
                        selectedItems &&
                        cityItems &&
                        selectedItems.length >= cityItems.length
                      }
                      onClick={() => handleChangeSelectAll()}
                      onChange={() => handleChangeSelectAll()}
                      label={
                        <span
                          className={`custom-control-label ${
                            selectedItems &&
                            selectedItems.length > 0 &&
                            selectedItems.length < cityItems.length
                              ? 'indeterminate'
                              : ''
                          }`}
                        />
                      }
                    />
                  </div>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="dropdown-toggle-split btn-lg"
                  />
                  <DropdownMenu right>
                    {/* <DropdownItem>
                      <IntlMessages id="todo.action" />
                    </DropdownItem>
                    <DropdownItem>
                      <IntlMessages id="todo.another-action" />
                    </DropdownItem> */}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
            )}
            <Breadcrumb match={match} />
          </div>

          <div className="mb-2">
            <Button
              color="empty"
              className="pt-0 pl-0 d-inline-block d-md-none"
              onClick={() => setDisplayOptionsIsOpen(!displayOptionsIsOpen)}
            >
              <IntlMessages id="todo.display-options" />{' '}
              <i className="simple-icon-arrow-down align-middle" />
            </Button>
            <Collapse
              id="displayOptions"
              className="d-md-block"
              isOpen={displayOptionsIsOpen}
            >
              <div className="d-block mb-2 d-md-inline-block">
                <UncontrolledDropdown className="mr-1 float-md-left btn-group mb-1">
                  <DropdownToggle caret color="outline-dark" size="xs">
                    <IntlMessages id="todo.orderby" />
                    {orderColumn ? orderColumn.label : ''}
                  </DropdownToggle>
                  <DropdownMenu>
                    {orderColumns &&
                      orderColumns.map((o, index) => {
                        return (
                          <DropdownItem
                            key={index}
                            onClick={() => getCityListWithOrderAction(o.column)}
                          >
                            {o.label}
                          </DropdownItem>
                        );
                      })}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                  <input
                    type="text"
                    name="keyword"
                    id="search"
                    placeholder={messages['menu.search']}
                    defaultValue={searchKeyword}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        getCityListSearchAction(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </Collapse>
          </div>
          <Separator className="mb-5" />
          <Row>
            {loaded ? (
              cityItems &&
              cityItems.map((item, index) => (
                <CityListItem
                  key={`city_item_${index}`}
                  item={item}
                  onClick={() => setSelectedCity(item)}
                  handleCheckChange={handleCheckChange}
                  isSelected={loaded ? selectedItems.includes(item.id) : false}
                />
              ))
            ) : (
              <div className="loading" />
            )}
          </Row>
        </Colxx>
      </Row>
      {/* {loaded && <TodoApplicationMenu />} */}
      <AddNewCityModal
        toggleModal={() => setModalOpen(!modalOpen)}
        modalOpen={modalOpen}
      />
      <ViewZipModal
        city={selectedCity}
        toggleModal={() => setSelectedCity(null)}
        modalOpen={!!selectedCity}
      />
    </>
  );
};

const mapStateToProps = ({ location }) => {
  const {
    cityItems,
    searchKeyword,
    loaded,
    orderColumn,
    orderColumns,
    selectedItems,
  } = location;
  return {
    cityItems,
    searchKeyword,
    loaded,
    orderColumn,
    orderColumns,
    selectedItems,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    getCityListAction: getCityList,
    getCityListWithOrderAction: getCityListWithOrder,
    getCityListSearchAction: getCityListSearch,
    selectedCityItemsChangeAction: selectedCityItemsChange,
  })(Location)
);
