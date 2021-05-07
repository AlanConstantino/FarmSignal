// import React from 'react';
import {Redirect} from 'react-router-dom';
import auth from './Auth';

function Logout({...rest}) {
  auth.logout();
  return <Redirect to={{pathname: '/'}}/>;
}

export default Logout;
