import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'

class CreateAccountBase extends React.Component {

  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      showMessage:false,
      message:'',
      messageType: 'danger',
      email: '',
      password: '',
      passwordConfirm: ''
    };
    this.state = this.INITIAL_STATE;
  }



  handleSubmit(event){
    this.props.firebase.doAccountCreation(this.state.email, this.state.role)
    .then(() => {
      this.setState({
        showMessage: true,
        message: 'Account successfully created',
        messageType: 'success'
      });
    }).catch((e) => {
      console.log(e)
      this.setState({
        showMessage: true,
        message: e,
        messageType: 'danger'
      });
    });
  }

  render() {
    return (
      <Card style={{ width: '50vw', minWidth: '20rem',  margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showMessage ? <Alert variant={this.state.messageType}>{this.state.message}</Alert> : null}
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              type="text"
              placeholder="Email Address"
              title="Email Address"
              onChange={() => this.setState({username:document.getElementById('email').value})}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              placeholder="Password"
              title="Password"
              onChange={() => this.setState({password:document.getElementById('password').value})}
              >
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control
              id="passwordConfirmation"
              placeholder="Password Confirmation"
              title="Password"
              onChange={() => this.setState({passwordConfirmation:document.getElementById('passwordConfirmation').value})}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Button onClick={(event)=>this.handleSubmit(event)}>Create Account</Button>
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }
}

const CreateAccount = withFirebase(CreateAccountBase);
export default CreateAccount;
