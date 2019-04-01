import React, { Component } from 'react';
import Routes from './routes.jsx';
import { withFirebase } from './component/firebase/context';

import 'bootstrap/dist/css/bootstrap.min.css';

class AppBase extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticating: true
    };
  }

  resolveUser() {
    return new Promise((resolve, reject) => {
      this.props.firebase.auth.onAuthStateChanged((user) => {
        if (this.props.firebase.auth.currentUser!==null) {
          // Fetch user permissions before page loads
          this.props.firebase.db.collection('users').doc(this.props.firebase.auth.currentUser.uid)
            .collection('permissions').get().then(permissions=>{
              for (let i = 0; i < permissions.docs.length; i++){
                this.props.firebase.userPermissions.push(permissions.docs[i].data());
              }
              resolve(user);
            });
        } else {
          resolve(user);
        }
      });
    });
  }

  componentDidMount() {
    this.resolveUser().then((user) => {
      this.setState({isAuthenticating: false});
    });
  }

  render() {
    if(this.state.isAuthenticating){
      return null;
    }
    return (
      <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
        <Routes />
      </div>
    );
  }
}

const App = withFirebase(AppBase);

export default App;
