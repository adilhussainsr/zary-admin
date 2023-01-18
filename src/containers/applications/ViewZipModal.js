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
  Row,
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

const ViewZipModal = ({
  modalOpen,
  toggleModal,

  city,
}) => {
  const [state, setState] = useState(initialState);

  // const addNewZip = () => {
  //   const newItem = {
  //     zip: state.zip,
  //     areaName: state.area,
  //     city_id: state.selectedCity?.id,
  //   };
  //   if (!newItem.city_id) {
  //     NotificationManager.warning(
  //       'Please select a city',
  //       'City not selected',
  //       3000,
  //       null,
  //       null,
  //       ''
  //     );
  //     return;
  //   }
  //   if (newItem.zip.length < 6) {
  //     NotificationManager.warning(
  //       'Please enter a valid zip code',
  //       'Invalid Zip',
  //       3000,
  //       null,
  //       null,
  //       ''
  //     );
  //     return;
  //   }
  //   if (!newItem.areaName?.length) {
  //     NotificationManager.warning(
  //       'Please enter a valid Area Name',
  //       'Invalid Area',
  //       3000,
  //       null,
  //       null,
  //       ''
  //     );
  //     return;
  //   }
  //   addZipItemAction(newItem);
  //   toggleModal();
  //   setState(initialState);
  // };
  // const addNewCity = () => {
  //   const newItem = {
  //     name: state.title,
  //   };
  //   addCityItemAction(newItem);
  //   // toggleModal();
  //   setState(initialState);
  // };

  if (!city) {
    return null;
  }
  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>City: {city.name}</ModalHeader>
      <ModalBody>
        <h3 className="mt-4">
          Status: {city.isActive ? 'Active' : 'InActive'}
        </h3>
        <br />
        {city.zip_codes?.length ? (
          <>
            {city.zip_codes.map((code) => (
              <Row key={code.id}>
                <Label>{code.zip}</Label>
                <Label>{code.isActive ? 'Active' : 'Inactive'}</Label>
              </Row>
            ))}
          </>
        ) : (
          'No Zip code added'
        )}
      </ModalBody>
    </Modal>
  );
};

const mapStateToProps = ({ location }) => {
  const { allCityItems } = location;
  return {
    cities: allCityItems,
  };
};
export default connect(mapStateToProps, {
  addCityItemAction: addCityItem,
  addZipItemAction: addZipItem,
})(ViewZipModal);
