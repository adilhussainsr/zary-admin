import React, { Suspense, useEffect } from 'react';
import {
  Route,
  withRouter,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import AppLayout from 'layout/AppLayout';
import { logoutUser } from 'redux/actions';
import Force from './force';

// import { ProtectedRoute, UserRole } from 'helpers/authHelper';
const Location = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './location')
);
const BookingDetails = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './booking/details')
);
const Booking = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './booking')
);
const Dashboards = React.lazy(() =>
  import(/* webpackChunkName: "dashboards" */ './dashboard')
);
const Logout = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(logoutUser(history));
  }, []);
  return <div className="loading" />;
};

const App = ({ match }) => {
  return (
    <AppLayout>
      <div className="dashboard-wrapper">
        <Suspense fallback={<div className="loading" />}>
          <Switch>
            <Redirect
              exact
              from={`${match.url}/`}
              to={`${match.url}/dashboard`}
            />
            <Route
              path={`${match.url}/dashboard`}
              render={(props) => <Dashboards {...props} />}
            />
            <Route
              path={`${match.url}/location`}
              render={(props) => <Location {...props} />}
            />
            <Route
              path={`${match.url}/booking`}
              exact
              render={(props) => <Booking {...props} />}
            />
            <Route
              path={`${match.url}/force`}
              exact
              render={(props) => <Force {...props} />}
            />
            <Route
              path={`${match.url}/booking/:id`}
              render={(props) => <BookingDetails {...props} />}
            />
            <Route
              path={`${match.url}/logout`}
              render={(props) => <Logout {...props} />}
            />
            <Redirect to="/error" />
          </Switch>
        </Suspense>
      </div>
    </AppLayout>
  );
};

const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(connect(mapStateToProps, {})(App));
