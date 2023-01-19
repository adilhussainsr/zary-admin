/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from 'react';
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
  Card,
  CardBody,
  CardTitle,
} from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import IntlMessages from 'helpers/IntlMessages';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import products from 'data/products';

import {
  getCityList,
  getCityListWithOrder,
  getCityListSearch,
  selectedCityItemsChange,
} from 'redux/actions';
import AddNewCityModal from 'containers/applications/AddNewCityModal';
import CityListItem from 'components/applications/CityListItem';
import ViewZipModal from 'containers/applications/ViewZipModal';
import { ReactTableWithPaginationCard } from 'containers/ui/ReactTableCards';
import { apiGetWithAuthToken } from 'helpers/apiHelper';
import { GET_BOOKINGS } from 'constants/apiRoutes';
import moment from 'moment';
import { useQuery } from 'react-query';
import Table from './Table';

const defaultRequest = {
  direction: 'ASC',
  sortBy: 'id',
};

const Booking = ({ match, intl }) => {
  const history = useHistory();
  const viewDetails = useCallback((item) => {
    history.push(`${match.path}/${item}`);
    console.log(match, item);
  }, []);

  const cols = React.useMemo(
    () => [
      {
        Header: 'Booking ID',
        accessor: 'id',
        cellClass: 'list-item-heading w-10',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Date',
        accessor: 'startDate',
        cellClass: 'w-40',
        Cell: (props) => (
          <>
            {props.value
              ? moment(props.value).format('DD MMM YYYY hh:mm a')
              : ''}
          </>
        ),
      },
      {
        Header: 'Name',
        accessor: 'details.fullName',
        cellClass: 'list-item-heading w-30',
        disableSortBy: true,
        Cell: (props) => <>{props.value || ''}</>,
      },
      {
        Header: 'Type of Guard',
        accessor: 'guardType',
        cellClass: 'w-10',
        disableSortBy: true,
        Cell: (props) => <>{props.value?.guardType || ''}</>,
      },
      {
        Header: 'City',
        accessor: 'city',
        cellClass: 'w-10',
        disableSortBy: true,
        Cell: (props) => <>{props.value?.name || ''}</>,
      },
      {
        Header: 'Zip',
        accessor: 'zipCode',
        cellClass: 'w-10',
        disableSortBy: true,
        Cell: (props) => <>{props.value?.zip || ''}</>,
      },
      {
        Header: 'Numbers of Guard',
        accessor: 'numberOfGuards',
        cellClass: 'w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Amount',
        accessor: 'totalBookingAmount',
        cellClass: 'w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Payment Status',
        accessor: 'payments',
        disableSortBy: true,
        cellClass: 'w-40',
        Cell: (props) => (
          <>{props.value?.length ? props.value[0].status : '-'}</>
        ),
      },
      {
        Header: 'Booking Status',
        accessor: 'status',
        cellClass: 'w-40',
        Cell: (props) => <>{props.value}</>,
      },
      {
        Header: 'Action',
        cellClass: 'w-40',
        id: 'action',
        disableSortBy: true,
        Cell: (props) => (
          <>
            <Button
              onClick={() => {
                viewDetails(props?.cell?.row?.values?.id);
              }}
            >
              View Details
            </Button>
          </>
        ),
      },
    ],
    []
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownSplitOpen, setDropdownSplitOpen] = useState(false);
  const [displayOptionsIsOpen, setDisplayOptionsIsOpen] = useState(false);
  const [requestObj, setRequestObj] = useState(defaultRequest);
  const [queryParams, setQueryParams] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const { isLoading, error, data } = useQuery([GET_BOOKINGS, queryParams], () =>
    apiGetWithAuthToken(`${GET_BOOKINGS}?${queryParams}`).then((resp) => {
      if (resp.statusCode === 200 && resp.data) {
        return resp.data;
      }
      throw new Error(resp.messages);
    })
  );
  useEffect(() => {
    const urlParams = new URLSearchParams(requestObj).toString();
    setQueryParams(urlParams);
  }, [requestObj]);

  const updatePageChange = (pageIndex, pageSize) => {
    setRequestObj((old) => ({
      ...old,
      limit: pageSize,
      offset: pageIndex * pageSize,
    }));
  };

  const onSortChange = (sort) => {
    if (sort?.length) {
      setRequestObj((old) => ({
        ...old,
        sortBy: sort[0]?.id,
        direction: sort[0]?.desc ? 'DESC' : 'ASC',
      }));
    }
  };

  const { messages } = intl;
  return (
    <>
      <Row>
        <Colxx xxs="12" md="12" lg="12">
          <div className="mb-2">
            <h1>
              <IntlMessages id="menu.booking" />
            </h1>

            <Breadcrumb match={match} />
          </div>
          <Separator className="mb-5" />
          <Row />
        </Colxx>
        <Colxx xxs="12">
          <Card className="mb-4">
            <CardBody style={{ minHeight: 500 }}>
              <CardTitle>
                <IntlMessages id="table.manage-booking" />
              </CardTitle>
              <Table
                onSortChange={onSortChange}
                columns={cols}
                isLoading={isLoading}
                data={data?.bookings || []}
                defaultPageSize={5}
                totalCount={data?.count || 0}
                onPageChange={updatePageChange}
              />
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
export default injectIntl(connect(mapStateToProps, {})(Booking));
