import React, { Component } from 'react';
import Routes from './routes.jsx';
import { withFirebase } from './component/firebase/context';

import 'bootstrap/dist/css/bootstrap.min.css';

class AppBase extends Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticating: true
    };
  }

  componentDidMount() {
    if (this.props.firebase){
      var unsubscribe = this.props.firebase.auth.onAuthStateChanged((user) => {
        this.props.firebase.resolveUser().then((user) => {
          console.log(this)
          this.setState({isAuthenticating: false}, () => unsubscribe());
        });
      });
    }
  }

  app() {
    return (
      <div style={{minHeight:"100vh", display:"flex", flexDirection:"column"}}>
        <Routes />
      </div>
    );
  }

  render() {
    return this.state.isAuthenticating ? null : this.app();
  }
}

const App = withFirebase(AppBase);

export default App;
