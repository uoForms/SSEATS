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
    if (this.state.username !== '' && this.state.password !== '') {
      msg = "Invalid username or password.";
    }
    // Simulate a valid login.
    if (this.state.username === 'admin' && this.state.password === 'admin') {
      wrong = false;
      window.location.href = '/home';
    }
    this.setState({showError:wrong, errorMessage:msg});
  }

  render() {
    return (
      <div class="form">
        {this.state.showError ? <p class="warning">{this.state.errorMessage}</p> : null}
        <div class="form-group">
          <label>Username</label>
          <input 
            id="username"
            class="form-component"
            type="text"
            placeholder="Username"
            title="Username"
            onChange={() => this.setState({username:document.getElementById('username').value})}
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input
            id="password"
            class="form-component"
            type="password"
            placeholder="Password"
            title="Password"
            onChange={() => this.setState({password:document.getElementById('password').value})}
          />
        </div>
        <button class="form-group" title="Login to your account." onClick={(event)=>this.handleClick(event)}>Login</button>
      </div>
    );
  }
}
