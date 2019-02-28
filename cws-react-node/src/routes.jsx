import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// pages
import Login from './login.jsx';
import NotFound from './404.jsx'

export default class Routes extends React.Component {
  render() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/*' component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }
}
