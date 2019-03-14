import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// pages
import AuthLandingPage from './component/landingPage/authLandingPage.jsx';
import NoAuthLandingPage from './component/landingPage/noAuthLandingPage.jsx';
import LoginPage from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'


export default class Routes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={AuthLandingPage} />
            <Route exact path='/home' component={NoAuthLandingPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/report' component={Report}/>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }
}
