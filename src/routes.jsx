import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context';

import Header from './component/header/header.jsx';
// Pages
import Report from './component/assessing/report.jsx'
import CreateSubject from './component/assessing/createSubject.jsx';
import CreateCategory from './component/assessing/createCategory.jsx';
import CreateReportType from './component/assessing/createReportType.jsx';
import LandingPage from './component/landingPage/landingPage.jsx';

import ForgotPassword from './component/userOperations/forgotPassword.jsx'
import LoginPage from './component/userOperations/login.jsx';

// Error
import NotFound from './component/error/404.jsx'
import history from './history';

// Scripts

class RoutesBase extends React.Component {
  constructor(props) {
    super(props);
    // Dictionary that contains all the possible routes
    // This is to better restrict page access using firebase
    this.pages = {
      "/report/view" : Report,
      "/subject/create" : CreateSubject,
      "/category/create" : CreateCategory,
      "/report/create" : CreateReportType,
    };
  }

  componentWillMount(){
    this.setState({perms: this.props.firebase.userPermissions})
    this.listener = history.listen((location, action) => {
      this.setState({perms: this.props.firebase.userPermissions})
    });
  }

  componentWillUnmount(){
    this.listener();
  }

  unauthenticatedRouting() {
    return (
        <Router history={history}>
          <div>
            <Switch>
              <Route component={Header}></Route>
            </Switch>
            <Switch>
              <Route exact path='/' component={LandingPage} />
              <Route exact path='/login' component={LoginPage} />
              <Route exact path='/forgotPassword' component={ForgotPassword}/>
              <Route component={NotFound} />
            </Switch>
          </div>
        </Router>
    );
  }

  authorisedRouteList(){
    return this.state.perms
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
        <Router history={history}>
          <div>
            <Switch>
              <Route component={Header}></Route>
            </Switch>
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
          </div>
        </Router>
    );
  }

  render() {
    return this.props.firebase.auth.currentUser === null ?
      this.unauthenticatedRouting() : this.authenticatedRouting();
    }
}

const Routes = withFirebase(RoutesBase);
export default Routes;
