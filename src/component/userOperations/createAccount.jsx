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
      messageType: '',
      messages: [],
      invalidEmailError: false,
      passwordMatchError: false,
      emptyPassword: false,
      emptyPasswordConfirm: false,
      email: '',
      password: '',
      passwordConfirm: '',
      accountCreated:false,
    };
    this.state = this.INITIAL_STATE;
  }

  handleSubmit(event){
    this.setState({
      messages: [],
      invalidEmailError: !this.validEmail(),
      passwordMatchError: !this.matchingPassword(),
      emptyPassword: !this.emptyPassword(1),
      emptyPasswordConfirm: !this.emptyPassword(2)
    }, () => {
      if(this.isFormValid()){
        this.props.firebase.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((value) => {
          this.props.firebase.addNewUser(value.user.uid, this.state.email).then(() => {
            this.setState({
              accountCreated: true
            });
          }).catch((e) => {
            this.state.messages.push({
              message: 'Could not properly create your user, please contact an administrator',
              messageType: 'danger'
            });
            this.forceUpdate()
          });
        }).catch((e) => {
          console.log(e)
          this.state.messages.push({
            message: e.message,
            messageType: 'danger'
          });
          this.forceUpdate()
        });
      }
    });
  }

  matchingPassword(){
    return this.state.password === this.state.passwordConfirm;
  }

  validEmail(){
    let pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    let match = this.state.email.match(pattern)
    return !!(match && this.state.email.length === match[0].length);
  }

  isFormValid(){
    return (!this.state.invalidEmailError && !this.state.passwordMatchError &&
      !this.state.emptyPassword && !this.state.emptyPasswordConfirm);
  }

  renderMessages(){
    return this.state.messages.map((message, i) => {
      return (
        <Alert key={i} variant={message.messageType}>{message.message}</Alert>
      );
    });
  }

  notMatchingPasswordControl(){
      return (<Form.Control.Feedback type="invalid">Passwords need to match</Form.Control.Feedback>);
  }

  /**
    *   Position 1 is password field, pasition 2 is password confirm field.
    */
  emptyPassword(position){
    return !!(position === 1 ? this.state.password.length : this.state.passwordConfirm.length);
  }

  renderForm() {
    return (
      <Card style={{ width: '50vw', minWidth: '20rem',  margin: '5rem auto'}}>
        <Card.Body>
          {this.renderMessages()}
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              id="email"
              type="text"
              placeholder="Email Address"
              title="Email Address"
              isInvalid={this.state.invalidEmailError}
              onChange={() => this.setState({email:document.getElementById('email').value})}
            />
          {this.state.invalidEmailError ?
            (<Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
              placeholder="Password"
              title="Password"
              type="password"
              isInvalid={this.state.passwordMatchError || this.state.emptyPassword}
              onChange={() => this.setState({password:document.getElementById('password').value})}
              >
            </Form.Control>
            {this.state.passwordMatchError ? this.notMatchingPasswordControl() : null}
            {this.state.emptyPassword ? (<Form.Control.Feedback type="invalid">Password cannot be empty</Form.Control.Feedback>) : null}
          </Form.Group>
          <Form.Group>
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control
              id="passwordConfirm"
              placeholder="Password Confirmation"
              title="Password"
              type="password"
              isInvalid={this.state.passwordMatchError || this.state.emptyPasswordConfirm}
              onChange={() => this.setState({passwordConfirm:document.getElementById('passwordConfirm').value})}
            >
            </Form.Control>
            {this.state.passwordMatchError ? this.notMatchingPasswordControl() : null}
            {this.state.emptyPasswordConfirm ? (<Form.Control.Feedback type="invalid">Password confirmation cannot be empty</Form.Control.Feedback>) : null}
          </Form.Group>
          <Form.Group>
            <Button onClick={(event)=>this.handleSubmit(event)}>Create Account</Button>
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }

  renderConfirmation() {
    return (
      <Card style={{ width: '50vw', minWidth: '20rem',  margin: '5rem auto'}}>
        <Card.Body>
          <div className="h5">Account has been created!</div>
          <Button variant="link" onClick={(event)=>this.props.history.push('/')}>Return to menu</Button>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return this.state.accountCreated ? this.renderConfirmation() : this.renderForm();
  }
}

const CreateAccount = withFirebase(CreateAccountBase);
export default CreateAccount;
