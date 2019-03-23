import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context';

// Pages
import Report from './component/assessing/report.jsx'

import LandingPage from './component/landingPage/landingPage.jsx';

import ForgotPassword from './component/userOperations/forgotPassword.jsx'
import LoginPage from './component/userOperations/login.jsx';


// Error
import NotFound from './components/error/404.jsx'




// scripts
import manageRoles from './component/firebase/manageRoles.js'

class RoutesBase extends React.Component {
  constructor(props) {
    super(props)
    // Dictionary that contains all the possible routes
    // This is to better restrict page access using firebase
    this.pages = {
      "/report" : Report
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
            <Route exact path='/forgotPassword' component={ForgotPassword}/>
            {this.authorisedRouteList()}
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
