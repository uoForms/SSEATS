import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// pages
import LoginPage from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'

export default class Routes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={LoginPage} />
            <Route exact path='/report' component={Report}/>
            <Route path='/*' component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }
}
