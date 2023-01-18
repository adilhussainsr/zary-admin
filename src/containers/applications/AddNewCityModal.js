/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import CustomSelectInput from 'components/common/CustomSelectInput';
import IntlMessages from 'helpers/IntlMessages';

import { addCityItem } from 'redux/actions';
import { NotificationManager } from 'components/common/react-notifications';
import { addZipItem } from 'redux/location/actions';

const initialState = {
  selectedCity: null,
  title: '',
  zip: '',
  area: '',
};

const AddNewCityModal = ({
  modalOpen,
  toggleModal,
  cities,
  addCityItemAction,
  addZipItemAction,
}) => {
  const [state, setState] = useState(initialState);
  // const [isCreateCity, setIsCreateCity] = useState(true);

  const addNewZip = () => {
    const newItem = {
      zip: state.zip,
      areaName: state.area,
      city_id: state.selectedCity?.id,
    };
    console.log(newItem);
    if (!newItem.city_id) {
      NotificationManager.warning(
        'Please select a city',
        'City not selected',
        3000,
        null,
        null,
        ''
      );
      return;
    }
    if (newItem.zip.length < 6) {
      NotificationManager.warning(
        'Please enter a valid zip code',
        'Invalid Zip',
        3000,
        null,
        null,
        ''
      );
      return;
    }
    if (!newItem.areaName?.length) {
      NotificationManager.warning(
        'Please enter a valid Area Name',
        'Invalid Area',
        3000,
        null,
        null,
        ''
      );
      return;
    }
    addZipItemAction(newItem);
    toggleModal();
    setState(initialState);
  };
  const addNewCity = () => {
    const newItem = {
      name: state.title,
    };
    addCityItemAction(newItem);
    // toggleModal();
    setState(initialState);
  };

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id="city.add-new-name" />
      </ModalHeader>
      <ModalBody>
        <Label className="mt-4">
          <IntlMessages id="city.enter-name" />
        </Label>
        <Input
          type="text"
          value={state.title}
          onChange={(event) =>
            setState({ ...state, title: event.target.value })
          }
        />
        <Button color="primary" className="my-4" outline onClick={addNewCity}>
          <IntlMessages id="city.add-new" />
        </Button>
        <br />
        <Label className="mt-4">
          <IntlMessages id="city.select" />
        </Label>
        <Select
          components={{ Input: CustomSelectInput }}
          className="react-select"
          classNamePrefix="react-select"
          name="form-field-city"
          options={
            cities
              ? cities.map((x, i) => {
                  return { id: x.id, label: x.name, value: x.name, key: i };
                })
              : []
          }
          value={state.selectedCity}
          onChange={(val) => setState({ ...state, selectedCity: val })}
        />

        <Label className="mt-4">
          <IntlMessages id="city.enter-zip" />
        </Label>
        <Input
          type="text"
          value={state.zip}
          onChange={(event) => setState({ ...state, zip: event.target.value })}
        />
        <Label className="mt-4">
          <IntlMessages id="city.enter-area" />
        </Label>
        <Input
          type="text"
          value={state.area}
          onChange={(event) => setState({ ...state, area: event.target.value })}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggleModal}>
          <IntlMessages id="todo.cancel" />
        </Button>
        <Button color="primary" onClick={addNewZip}>
          <IntlMessages id="todo.submit" />
        </Button>{' '}
      </ModalFooter>
    </Modal>
  );
};

const mapStateToProps = ({ location }) => {
  const { labels, allCityItems } = location;
  return {
    labels,
    cities: allCityItems,
  };
};
export default connect(mapStateToProps, {
  addCityItemAction: addCityItem,
  addZipItemAction: addZipItem,
})(AddNewCityModal);
