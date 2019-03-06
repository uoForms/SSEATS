import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// pages
import Login from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'

export default class Routes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/*' component={NotFound} />
            <Route exact path='/' component={Report}/>
          </Switch>
        </BrowserRouter>
    );
  }
}
