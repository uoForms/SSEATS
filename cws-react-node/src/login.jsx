import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from './component/firebase/context'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      username:'',
      password:'',
      showError:false,
      errorMessage:''
    };
    this.state = this.INITIAL_STATE;
  }

  handleClick(event) {
    if (this.state.username !== '' && this.state.password !== '') {
      this.props.firebase.doSignInWithEmailAndPassword(this.state.username, this.state.password)
      .then(() => {
        console.log('success');
        this.setState(this.INITIAL_STATE);
        this.props.history.push('/home');
      }).catch(() => {
        console.log('failed');
        this.setState({showError:true, errorMessage:"Invalid username or password."});
      });
    } else if(this.state.username !== '' || this.state.password !== '') {
      this.setState({showError:true, errorMessage:"Must enter a username and password"})
    } else {
      this.setState({showError:false})
    }
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

const LoginPage = withFirebase(LoginForm);

export default LoginPage;
