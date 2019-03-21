import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context';

// pages
import AuthLandingPage from './component/landingPage/authLandingPage.jsx';
import NoAuthLandingPage from './component/landingPage/noAuthLandingPage.jsx';
import LoginPage from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'
// scripts
import manageRoles from './component/firebase/manageRoles.js'

class RoutesBase extends React.Component {
  unauthenticatedRouting() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={NoAuthLandingPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  authenticatedRouting() {
    return (
        <BrowserRouter>
          <Switch>
            {/* Since logged in, just redirect to home */}
            <Route exact path="/login" render={() => (
                <Redirect to="/"/>
            )}/>
            <Route exact path='/' component={AuthLandingPage} />
            <Route exact path='/report' component={Report}/>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  render() {
    // update permissions
    if (this.props.firebase.auth.currentUser!==null) {
      setTimeout(manageRoles.updateUserPermissions, 0,
        this.props.firebase.db.collection('users').doc(this.props.firebase.auth.currentUser.uid));
    }
    return this.props.firebase.auth.currentUser === null ?
      this.unauthenticatedRouting() : this.authenticatedRouting();
    }
}

const Routes = withFirebase(RoutesBase);

export default Routes;
