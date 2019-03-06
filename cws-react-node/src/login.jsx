import React from 'react';
import './form.css';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      username:'',
      password:'',
      showError:false,
      errorMessage:''
    };
  }

  handleClick(event) {
    // Defaults to incomplete credentials.
    let wrong = true;
    let msg = 'You must enter username and password.';
    // Simulate a invalid login.
    if (this.state.username != '' && this.state.password != '') {
      msg = "Invalid username or password.";
    }
    // Simulate a valid login.
    if (this.state.username == 'admin' && this.state.password == 'admin') {
      wrong = false;
      window.location.href = '/home';
    }
    this.setState({showError:wrong, errorMessage:msg});
  }

  render() {
    return (
      <div id="textForm">
        {this.state.showError ? <h5 id="loginError">{this.state.errorMessage}</h5> : null}
        <input 
          id="textfield1"
          type="text"  
          placeholder="Username" 
          title="Enter your username." 
          onChange={() => this.setState({username:document.getElementById('textfield1').value})}
        /><br/>
        <input  
          id="textfield2"
          type="password" 
          placeholder="Password" 
          title="Enter your password." 
          onChange={() => this.setState({password:document.getElementById('textfield2').value})}
        /><br/>
        <button id="textfield3" title="Login to your account." onClick={(event)=>this.handleClick(event)}>Login</button>
      </div>
    );
  }
}
