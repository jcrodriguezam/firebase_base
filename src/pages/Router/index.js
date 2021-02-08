import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Login from 'pages/Login';
import Home from 'pages/Home';
import Users from 'pages/Users';
import Profile from 'pages/Profile';
import ResetPassword from 'pages/ResetPassword';
import NotFound from 'pages/NotFound';
import User from 'pages/User';
import Section from 'pages/Section';
import Images from 'pages/Data/Images';
import Videos from 'pages/Data/Videos';
import Documents from 'pages/Data/Documents';
import Audio from 'pages/Data/Audio';
import paths from './paths';
import PrivateRoute from './PrivateRoute';

const RouterComponent = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={paths.LOGIN} component={Login} />
        <Route exact path={paths.RESET_PASSWORD} component={ResetPassword} />
        <PrivateRoute path={paths.ADD_USER} component={User} />
        <PrivateRoute path={paths.MODIFY_USER} component={User} />
        <PrivateRoute path={paths.USERS} component={Users} />
        <PrivateRoute path={paths.PROFILE} component={Profile} />
        <PrivateRoute path={paths.SECTION} component={Section} />
        <PrivateRoute path={paths.IMAGES} component={Images} />
        <PrivateRoute path={paths.VIDEOS} component={Videos} />
        <PrivateRoute path={paths.DOCUMENTS} component={Documents} />
        <PrivateRoute path={paths.AUDIO} component={Audio} />
        <PrivateRoute path={paths.ROOT} component={Home} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default RouterComponent;
