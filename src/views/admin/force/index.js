/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Button,
  Card,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Input,
  UncontrolledDropdown,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';

import { apiGetWithAuthToken, apiPostWithAuthToken } from 'helpers/apiHelper';
import { GET_POST_FIRST_HOUR, GET_POST_GUARD_TYPES } from 'constants/apiRoutes';
import moment from 'moment';
import { useMutation, useQuery } from 'react-query';

const Force = ({ match, intl }) => {
  const history = useHistory();
  const viewDetails = useCallback((item) => {
    history.push(`${match.path}/${item}`);
    console.log(match, item);
  }, []);

  const [selectedGuard, setSelectedGuard] = useState(null);
  const [selectGuardDropdown, setSelectGuardDropdown] = useState(false);
  const [sameDayFirstHour, setSameDayFirstHour] = useState(null);
  const [otherDayFirstHour, setOtherDayFirstHour] = useState(null);
  const [basePriceHourly, setBasePriceHourly] = useState(null);
  const [guardStatus, setGuardDStatus] = useState(null);
  const [guardName, setGuardName] = useState(null);
  const [createNewGuard, setCreateNewGuard] = useState(null);
  const {
    isLoading: firstHourLoading,
    error: firstHourError,
    data: firstHourCharges,
    refetch,
  } = useQuery(
    [GET_POST_FIRST_HOUR],
    () =>
      apiGetWithAuthToken(`${GET_POST_FIRST_HOUR}`).then((resp) => {
        if (resp.statusCode === 200 && resp.data) {
          return resp.data;
        }
        throw new Error(resp.messages);
      }),
    {
      refetchInterval: false,
    }
  );
  const {
    isLoading: guardTypeLoading,
    error: guardTypeError,
    data: guardType,
    refetch: refetchGuardType,
  } = useQuery(
    [GET_POST_GUARD_TYPES],
    () =>
      apiGetWithAuthToken(`${GET_POST_GUARD_TYPES}?type=all`).then((resp) => {
        if (resp.statusCode === 200 && resp.data) {
          return resp.data?.data;
        }
        throw new Error(resp.messages);
      }),
    {
      refetchInterval: false,
    }
  );

  const {
    isLoading: isMutationLoading,
    error: mutationError,
    mutate,
  } = useMutation((payload) => {
    apiPostWithAuthToken(`${GET_POST_FIRST_HOUR}`, payload).then((resp) => {
      if (resp.statusCode === 201 || resp.statusCode === 200) {
        return refetch();
      }
      return console.error(resp);
    });
  });

  const {
    isLoading: isGuardTypeMutationLoading,
    error: guardTypemutationError,
    mutate: guardMutate,
  } = useMutation((payload) => {
    apiPostWithAuthToken(`${GET_POST_GUARD_TYPES}`, payload).then((resp) => {
      if (resp.statusCode === 201) {
        setCreateNewGuard(null);
        setBasePriceHourly(null);
        setGuardName(null);
        return refetchGuardType();
      }
      return console.error(resp);
    });
  });

  useEffect(() => {
    if (firstHourCharges?.sameDayFirstHour) {
      setSameDayFirstHour(firstHourCharges.sameDayFirstHour);
    }
    if (firstHourCharges?.otherDayFirstHour) {
      setOtherDayFirstHour(firstHourCharges.otherDayFirstHour);
    }
  }, [firstHourCharges]);

  useEffect(() => {
    if (selectedGuard) {
      setBasePriceHourly(selectedGuard?.basicPrice);
      setGuardName(selectedGuard?.guardType);
    }
  }, [selectedGuard]);
  const saveFirstHour = () => {
    mutate({
      sameDayFirstHour,
      otherDayFirstHour,
    });
  };

  const saveGuardType = () => {
    const payload = {};
    if (selectedGuard) {
      payload.id = selectedGuard.id;
      if (guardName) payload.guardType = guardName;
      if (guardStatus) payload.status = guardStatus;
    } else if (createNewGuard) {
      payload.guardType = createNewGuard;
    }
    if (basePriceHourly) payload.basicPrice = basePriceHourly;
    guardMutate(payload);
  };

  const { messages } = intl;
  return (
    <>
      <Row>
        <Colxx xxs="12" md="12" lg="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id="menu.force" />
            </h1>

            <Breadcrumb match={match} />
          </div>
          <Separator className="mb-5" />
          <Row />
        </Colxx>
        <Colxx xxs="12">
          <Card className="mb-4">
            <CardBody className="text-center">
              <CardTitle>
                <IntlMessages id="setting" />
              </CardTitle>
              <div className="w-90">
                <Row>
                  <CardTitle className="w-50">Select Guard Type</CardTitle>
                  <Row className="w-50">
                    <Colxx className="w-50">
                      {createNewGuard !== null ? (
                        <Input
                          type="text"
                          value={createNewGuard === null ? '' : createNewGuard}
                          onChange={(event) =>
                            setCreateNewGuard(event.target.value)
                          }
                        />
                      ) : (
                        <Dropdown
                          isOpen={selectGuardDropdown}
                          toggle={() => setSelectGuardDropdown((i) => !i)}
                        >
                          <DropdownToggle caret color="secondary" outline>
                            {selectedGuard?.guardType || 'Select Guard'}
                          </DropdownToggle>
                          <DropdownMenu>
                            {guardType &&
                              guardType.map((o, index) => {
                                return (
                                  <DropdownItem
                                    key={index}
                                    onClick={() => setSelectedGuard(o)}
                                  >
                                    {o.guardType}
                                  </DropdownItem>
                                );
                              })}
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </Colxx>
                    <Colxx className="w-50">
                      <Button
                        color={createNewGuard === null ? 'primary' : 'danger'}
                        onClick={() => {
                          setCreateNewGuard(
                            createNewGuard === null ? '' : null
                          );
                          if (createNewGuard === null) setSelectedGuard(null);
                        }}
                      >
                        {createNewGuard === null ? 'Add new' : 'Cancel'}
                      </Button>
                    </Colxx>
                  </Row>
                </Row>
                {createNewGuard === null && (
                  <Row>
                    <CardTitle className="w-50">Guard Name</CardTitle>
                    <Colxx className="w-50 text-left">
                      <Input
                        type="text"
                        value={guardName || ''}
                        onChange={(event) => setGuardName(event.target.value)}
                      />
                    </Colxx>
                  </Row>
                )}
                <Row>
                  <CardTitle className="w-50">Base Price</CardTitle>
                  <Colxx className="w-50 text-left">
                    <Input
                      type="text"
                      value={basePriceHourly || ''}
                      onChange={(event) =>
                        setBasePriceHourly(event.target.value)
                      }
                    />
                  </Colxx>
                </Row>
                {createNewGuard === null && (
                  <Row>
                    <CardTitle className="w-50">Status</CardTitle>
                    <Colxx className="w-50  text-left">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="secondary" outline>
                          {selectedGuard
                            ? guardStatus || selectedGuard?.status
                            : 'Select Guard'}
                        </DropdownToggle>
                        <DropdownMenu>
                          {['active', 'disabled'].map((o, i) => (
                            <DropdownItem
                              key={i}
                              onClick={() => setGuardDStatus(o)}
                            >
                              {o}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Colxx>
                  </Row>
                )}
                <Row className="justify-content-center">
                  {guardTypeLoading || isGuardTypeMutationLoading ? (
                    <div className="loading" />
                  ) : (
                    <Button color="primary" onClick={saveGuardType}>
                      Save
                    </Button>
                  )}
                </Row>
              </div>
            </CardBody>
          </Card>
        </Colxx>
        <Colxx xxs="12">
          <Card className="mb-4">
            <CardBody className="text-center">
              <CardTitle>
                <IntlMessages id="force.firstHour" />
              </CardTitle>
              {firstHourLoading ? (
                <div className="loading" />
              ) : (
                <div className="w-75">
                  <Row>
                    <CardTitle className="w-50">
                      First Hour Charges (Same Day)
                    </CardTitle>
                    <Colxx className="w-50">
                      <Input
                        type="text"
                        value={
                          sameDayFirstHour === null ? '' : sameDayFirstHour
                        }
                        onChange={(event) =>
                          setSameDayFirstHour(event.target.value)
                        }
                      />
                    </Colxx>
                  </Row>
                  <Row>
                    <CardTitle className="w-50">
                      First Hour Charges (Other Day)
                    </CardTitle>
                    <Colxx className="w-50">
                      <Input
                        type="text"
                        value={
                          otherDayFirstHour === null ? '' : otherDayFirstHour
                        }
                        onChange={(event) =>
                          setOtherDayFirstHour(event.target.value)
                        }
                      />
                    </Colxx>
                  </Row>
                  <Row className="justify-content-center">
                    {firstHourLoading && isMutationLoading ? (
                      <div className="loading" />
                    ) : (
                      <Button color="primary" onClick={saveFirstHour}>
                        Save
                      </Button>
                    )}
                  </Row>
                </div>
              )}
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      {/* {loaded && <TodoApplicationMenu />} */}
    </>
  );
};

const mapStateToProps = () => {
  return {};
};
export default injectIntl(connect(mapStateToProps, {})(Force));
