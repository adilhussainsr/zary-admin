/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, Input, Label, Row } from 'reactstrap';
import { BsArrowDown, BsArrowUp } from 'react-icons/bs';
import { removeZipItem } from 'redux/location/actions';

const initialState = {
  zip: '',
};

const ViewZipModal = ({ modalOpen, toggleModal, city, removeZipAction }) => {
  const [state, setState] = useState(initialState);
  const [filteredZip, setFilteredZip] = useState(city?.zip_codes || []);

  useEffect(() => {
    console.log(city);
    if (city?.zip_codes && state?.zip?.length) {
      console.log(state.zip);
      const zips = city.zip_codes.filter((code) => {
        const str = `${code?.zip || ''}${code?.areaName || ''}`;
        return str.includes(state.zip);
      });
      setFilteredZip(zips);
    } else {
      setFilteredZip(city?.zip_codes || []);
    }
  }, [state.zip, city && city?.zip_codes]);
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
  const deleteZip = (zipCode) => {
    removeZipAction(zipCode.id);
  };

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
          City Status: {city.isActive ? 'Active' : 'InActive'}
        </h3>
        <br />
        <Input
          type="text"
          placeholder="Search here"
          value={state.zip}
          onChange={(event) => setState({ ...state, zip: event.target.value })}
        />
        {filteredZip?.length ? (
          <>
            {filteredZip.map((code) => (
              <Row key={code.id} className="my-2 w-100 mx-2">
                <Label>
                  {code.zip} {code.areaName ? `(${code.areaName})` : ''}
                </Label>
                <Label className="ml-auto">
                  {code.isActive ? 'Active' : 'Inactive'}
                </Label>
                {code.isActive ? (
                  <BsArrowDown
                    onClick={() => deleteZip(code)}
                    className="ml-1"
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <BsArrowUp
                    onClick={() => deleteZip(code)}
                    className="ml-1"
                    style={{ cursor: 'pointer' }}
                  />
                )}
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
  removeZipAction: removeZipItem,
})(ViewZipModal);
