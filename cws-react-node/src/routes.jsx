import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context'
// pages
import AuthLandingPage from './component/landingPage/authLandingPage.jsx';
import NoAuthLandingPage from './component/landingPage/noAuthLandingPage.jsx';
import LoginPage from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'
import forgotPassword from './forgotPassword.jsx'


class RoutesBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticating: true
    };
  }

  resolveUser() {
    return new Promise((resolve, reject) => {
      this.props.firebase.auth.onAuthStateChanged((user) => {
        resolve(user);
      });
    });
  }

  componentDidMount() {
    this.resolveUser().then((user) => {
      this.setState({isAuthenticating: false});
    });
  }

  unauthenticatedRouting() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={NoAuthLandingPage} />
            <Route exact path='/forgotPassword' component={forgotPassword}/>
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
            <Route exact path='/forgotPassword' component={forgotPassword}/>
            <Route exact path='/' component={AuthLandingPage} />
            <Route exact path='/report' component={Report}/>
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  render() {
    if(this.state.isAuthenticating){
      return null;
    } else {
      return this.props.firebase.auth.currentUser === null ?
        this.unauthenticatedRouting() : this.authenticatedRouting();
    }
  }
}

const Routes = withFirebase(RoutesBase);

export default Routes;
