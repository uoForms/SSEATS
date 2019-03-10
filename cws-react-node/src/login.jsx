import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
      <Card style={{ width: '30rem', margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showError ? <Alert variant={'danger'}>{this.state.errorMessage}</Alert> : null}
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              id="username"
              type="text"
              placeholder="Username"
              title="Username"
              onChange={() => this.setState({username:document.getElementById('username').value})}
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              placeholder="Password"
              title="Password"
              onChange={() => this.setState({password:document.getElementById('password').value})}
            />
        </Form.Group>
        <Button onClick={(event)=>this.handleClick(event)}>Login</Button>
      </Card.Body>
    </Card>
    );
  }
}
