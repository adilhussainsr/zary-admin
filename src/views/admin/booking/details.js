/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Row, Button, Card, CardBody, CardTitle, Input } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navs/Breadcrumb';
import { useMutation, useQuery } from 'react-query';
import {
  CAPTURE_AMOUNT,
  GET_BOOKING,
  UPDATE_BOOKING_STATUS,
} from 'constants/apiRoutes';
import { apiGetWithAuthToken, apiPutWithAuthToken } from 'helpers/apiHelper';
import moment from 'moment';
import { BsArrowLeft, BsBack, BsDownload } from 'react-icons/bs';
import { startCase } from 'lodash';
import { getStatusColor } from 'helpers/Utils';
import StatusEnum from './StatusEnum';

const BookingDetails = ({ match, intl }) => {
  const [amount, setAmount] = useState({});
  const { isLoading, isRefetching, error, data, refetch } = useQuery(
    [GET_BOOKING, match.params?.id],
    () =>
      apiGetWithAuthToken(`${GET_BOOKING}/${match.params?.id}`).then((resp) => {
        if (resp.statusCode === 200 && resp.data) {
          return resp.data;
        }
        throw new Error(resp.messages);
      }),
    {
      enabled: !!match?.params?.id,
      refetchInterval: false,
    }
  );

  useEffect(() => {
    if (data?.payments) {
      const paymentAmount = {};
      data.payments.forEach((payment) => {
        paymentAmount[payment?.id] = payment?.amount;
      });
      setAmount(paymentAmount);
    }
  }, [data]);

  const {
    isLoading: isMutationLoading,
    error: mutationError,
    mutate,
  } = useMutation((payload) => {
    apiPutWithAuthToken(
      `${UPDATE_BOOKING_STATUS}/${match.params?.id}`,
      payload
    ).then((resp) => {
      if (resp.statusCode === 200) {
        return refetch();
      }
      return console.error(resp);
    });
  });

  const {
    isLoading: isCaptureLoading,
    error: captureError,
    mutate: mutateCapture,
  } = useMutation({
    mutationFn: ({ id, ...payload }) =>
      apiPutWithAuthToken(`${CAPTURE_AMOUNT}${id}`, payload).then((resp) => {
        if (resp.statusCode === 200 || resp.statusCode === 201) {
          return refetch();
        }
        return console.error(resp);
      }),
  });

  const updateStatus = (status) => {
    mutate({ status });
  };

  const captureAmount = (paymentId) => {
    if (amount[paymentId] && +amount[paymentId]) {
      console.log(amount[paymentId]);
      mutateCapture({
        id: paymentId,
        amount: +amount[paymentId],
      });
    }
  };

  const { messages } = intl;
  return (
    <>
      <Row>
        <Colxx xxs="12" md="12" lg="12">
          <div className="mb-2">
            <h1>Booking Details</h1>

            <Breadcrumb match={match} />
          </div>
          <Separator className="mb-5" />
          <Row />
          <Link to="/admin/booking">
            <BsArrowLeft fontSize={28} className="my-3" />
          </Link>
        </Colxx>
        <Colxx xxs="12">
          <Card className="mb-4">
            <CardBody style={{ minHeight: 500 }}>
              {isLoading || isRefetching || isMutationLoading ? (
                <div className="loading" />
              ) : (
                <>
                  <Row>
                    <CardTitle>Booking ID: {data.id}</CardTitle>
                    <CardTitle className="ml-auto">
                      From:{' '}
                      {moment(data.startDate).format('DD MMM YYYY hh:mm a')} to{' '}
                      {moment(data.endDate).format('DD MMM YYYY hh:mm a')}
                    </CardTitle>
                  </Row>
                  <Row>
                    <CardTitle
                      style={{ color: getStatusColor(data.status || '') }}
                    >
                      Booking Status: {startCase(data.status || '')}
                    </CardTitle>
                  </Row>
                  <div className="mx-2 w-80">
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Name</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.details?.fullName}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Email</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.details?.email}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Phone</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.details?.mobileNumber}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Address</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.details?.adddress}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Profession</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.details?.profession}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>No of guards</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data?.numberOfGuards}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Booking Amount</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data?.totalBookingAmount}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Type of guard</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data.guardType?.guardType}</h4>
                      </Colxx>
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>ID Proof</h4>
                      </Colxx>
                      {data.details?.idProof && (
                        <Colxx>
                          <h4>
                            {data.details?.idCardNumber}{' '}
                            <a
                              href={data.details?.idProof}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <BsDownload className="ml-1" />
                            </a>
                          </h4>
                        </Colxx>
                      )}
                    </Row>
                    <Row className="mb-2">
                      <Colxx>
                        <h4>Group size</h4>
                      </Colxx>
                      <Colxx>
                        <h4>{data?.numberOfPeople}</h4>
                      </Colxx>
                    </Row>
                    {data?.payments &&
                      data.payments.map((payment, i) => {
                        return (
                          <Row key={payment.id} className="mb-2">
                            <Colxx>
                              <h4>Payment {i + 1}</h4>
                              <h4 className="ml-4 my-1">Authorized Amount</h4>
                              <h4 className="ml-4 my-1">Captured Amount</h4>
                              <h4 className="ml-4">Status</h4>
                            </Colxx>
                            <Colxx>
                              <h4>{payment?.transactionId}</h4>
                              <h4 className="my-1">${payment?.amount}</h4>
                              <h4 className="my-1">
                                ${payment?.capturedAmount}
                              </h4>
                              <h4>{payment?.status}</h4>
                            </Colxx>
                            {isCaptureLoading && <div className="loading" />}
                            {payment?.status === 'authorized' &&
                              !isCaptureLoading && (
                                <Colxx>
                                  <h4>Capture Amount</h4>
                                  <Input
                                    className="my-1"
                                    type="number"
                                    max={payment?.amount || 0}
                                    value={amount[payment?.id] || 0}
                                    onChange={(event) =>
                                      setAmount((o) => ({
                                        ...o,
                                        [payment?.id]: +event.target.value,
                                      }))
                                    }
                                  />
                                  <Button
                                    onClick={() => captureAmount(payment?.id)}
                                  >
                                    Capture
                                  </Button>
                                </Colxx>
                              )}
                          </Row>
                        );
                      })}
                  </div>
                  <Row className="mt-4 text-center w-60">
                    {[
                      StatusEnum.PENDING,
                      StatusEnum.BOOKED,
                      StatusEnum.APPROVED,
                    ].includes(data.status) && (
                      <Colxx>
                        <Button
                          color="danger"
                          onClick={() => updateStatus(StatusEnum.REJECTED)}
                        >
                          Reject
                        </Button>
                      </Colxx>
                    )}
                    {[StatusEnum.PENDING, StatusEnum.BOOKED].includes(
                      data.status
                    ) && (
                      <Colxx>
                        <Button
                          onClick={() => updateStatus(StatusEnum.APPROVED)}
                        >
                          Approve
                        </Button>
                      </Colxx>
                    )}
                    {[StatusEnum.APPROVED].includes(data.status) && (
                      <Colxx>
                        <Button
                          onClick={() => updateStatus(StatusEnum.ONGOING)}
                        >
                          Guard Sent
                        </Button>
                      </Colxx>
                    )}
                    {[StatusEnum.ONGOING].includes(data.status) && (
                      <Colxx>
                        <Button
                          onClick={() => updateStatus(StatusEnum.COMPLETED)}
                        >
                          Complete
                        </Button>
                      </Colxx>
                    )}
                  </Row>
                </>
              )}
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      {/* {loaded && <TodoApplicationMenu />} */}
    </>
  );
};

export default injectIntl(BookingDetails);
