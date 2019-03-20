import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { withFirebase } from './component/firebase/context'

// pages
import AuthLandingPage from './component/landingPage/authLandingPage.jsx';
import NoAuthLandingPage from './component/landingPage/noAuthLandingPage.jsx';
import LoginPage from './login.jsx';
import NotFound from './404.jsx'
import Report from './report.jsx'
// scripts
import manageRoles from './manageRoles.js'

class RoutesBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticating: true,
      userPermissions: []
    };
  }

  resolveUser() {
    return new Promise((resolve, reject) => {
      this.props.firebase.auth.onAuthStateChanged((user) => {
        // Fetch user permissions before page loads
        this.props.firebase.db.collection('users').doc(this.props.firebase.auth.currentUser.uid).collection('permissions').get().then(permissions=>{
          for (let i = 0; i < permissions.docs.length; i++){
            this.state.userPermissions.push(permissions.docs[i].get('label'));
          }
          //console.log(this.state.userPermissions);
          resolve(user);
        });

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
            {this.state.userPermissions.includes('SeeScores')?<Route exact path='/report' component={Report}/>:null}
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
    );
  }

  render() {
    if(this.state.isAuthenticating){
      return null;
    } else {
      // update permissions
      setTimeout(manageRoles.updateUserPermissions, 0, this.props.firebase.db.collection('users').doc(this.props.firebase.auth.currentUser.uid));
      return this.props.firebase.auth.currentUser === null ?
        this.unauthenticatedRouting() : this.authenticatedRouting();
    }
  }
}

const Routes = withFirebase(RoutesBase);

export default Routes;
