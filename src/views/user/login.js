/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Row, Card, CardTitle, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { NotificationManager } from 'components/common/react-notifications';

import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { loginUser, loginUserSuccess } from 'redux/actions';
import { apiPath, servicePath } from 'constants/defaultValues';

const Login = ({ history, error, loginUserAction }) => {
  useEffect(() => {
    if (history?.location?.search) {
      const myUrl = new URLSearchParams(history?.location?.search);
      const user = myUrl.get('user');
      if (user) {
        const reqUser = JSON.parse(Buffer.from(user, 'base64').toString());
        if (reqUser.accessToken) {
          const payload = {
            user: reqUser.user,
            token: reqUser.accessToken,
          };
          loginUserAction(payload, history);
        }
      }
    }
  }, [history?.location?.search]);

  useEffect(() => {
    if (error) {
      NotificationManager.warning(error, 'Login Error', 3000, null, null, '');
    }
  }, [error]);
  return (
    <Row className="h-100">
      <Colxx xxs="12" md="10" className="mx-auto my-auto">
        <Card className="auth-card">
          <div className="position-relative image-side ">
            <p className="text-white h2">MAGIC IS IN THE DETAILS</p>
          </div>
          <div className="form-side">
            {/* <NavLink to="/" className="black">
              Zary */}
            {/* <span className="logo-single" /> */}
            {/* </NavLink> */}
            <CardTitle className="mb-4">
              <IntlMessages id="app.welcome" />
            </CardTitle>
            <a href={`${apiPath}auth/google`}>
              <Button>Login With Google</Button>
            </a>
          </div>
        </Card>
      </Colxx>
    </Row>
  );
};
const mapStateToProps = ({ authUser }) => {
  const { loading, error } = authUser;
  return { loading, error };
};

export default connect(mapStateToProps, {
  loginUserAction: loginUser,
})(Login);
