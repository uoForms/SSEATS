import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context';

// Pages
import Report from './component/assessing/report.jsx'
import CreateSubject from './component/assessing/createSubject.jsx'

import LandingPage from './component/landingPage/landingPage.jsx';

import ForgotPassword from './component/userOperations/forgotPassword.jsx'
import LoginPage from './component/userOperations/login.jsx';

// Error
import NotFound from './component/error/404.jsx'

// Scripts

class RoutesBase extends React.Component {
  constructor(props) {
    super(props)
    // Dictionary that contains all the possible routes
    // This is to better restrict page access using firebase
    this.pages = {
      "/report" : Report,
      "/subject/create" : CreateSubject
    };
  }

  unauthenticatedRouting() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/forgotPassword' component={ForgotPassword}/>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  authorisedRouteList(){
    return this.props.firebase.userPermissions
      .filter(permission => permission.type !== null
        && permission.type === 'page')
      .map((page, i) => {
        return (
          <Route key="i" exact path={page.link} component={this.pages[page.link]}/>
        );
      });
  }

  authenticatedRouting() {
    return (
        <BrowserRouter>
          <Switch>
            {/* Since logged in, just redirect to home */}
            <Route exact path="/login" render={() => (
                <Redirect to="/"/>
            )}/>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/forgotPassword' render={() => (
                <Redirect to="/"/>
            )}/>
            {this.authorisedRouteList()}
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  render() {
    return this.props.firebase.auth.currentUser === null ?
      this.unauthenticatedRouting() : this.authenticatedRouting();
    }
}

const Routes = withFirebase(RoutesBase);
export default Routes;
