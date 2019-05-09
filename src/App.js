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

  componentWillMount() {
    var unsubscribe = this.props.firebase.auth.onAuthStateChanged((user) => {
      this.props.firebase.resolveUser().then((user) => {
        this.setState({isAuthenticating: false}, () => unsubscribe());
      });
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
