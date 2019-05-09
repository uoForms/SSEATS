 import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      email:'',
      password:'',
      showError:false,
      errorMessage:''
    };
    this.state = this.INITIAL_STATE;
  }

  handleClick(event) {
    if (this.state.email !== '' && this.state.password !== '') {
      this.props.firebase.doSignInWithEmailAndPassword(this.state.email, this.state.password)
      .then(_=>{
        this.setState(this.INITIAL_STATE);
        this.props.firebase.resolveUser().then(()=>{
            this.props.history.push('/');
        }).catch ((e) => {
          this.setState({showError:true, errorMessage:e.message});
        });
      }).catch((e) => {
        this.setState({showError:true, errorMessage:e.message});
      });
    } else if(this.state.email !== '' || this.state.password !== '') {
      this.setState({showError:true, errorMessage:"Must enter a email and password"});
    } else {
      this.setState({showError:false});
    }
  }

  render() {
    return (
      <Card style={{ width: '50vw', minWidth: '10rem', margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showError ? <Alert variant={'danger'}>{this.state.errorMessage}</Alert> : null}
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              id="email"
              type="text"
              placeholder="Email"
              title="Email"
              onChange={() => this.setState({email:document.getElementById('email').value})}
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
          <Form.Group>
            <Button onClick={(event)=>this.handleClick(event)}>Login</Button>
          </Form.Group>
          <Form.Group>
            <Button variant="link"
              onClick={(event)=>this.props.history.push("/forgotPassword")}
            >Forgot Password?</Button>
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }
}

const LoginPage = withFirebase(LoginForm);

export default LoginPage;
