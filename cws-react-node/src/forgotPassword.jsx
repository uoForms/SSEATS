import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from './component/firebase/context'

class ForgotPasswordBase extends React.Component {
  constructor(props) {
    super(props);
    this.INITIAL_STATE = {
      email:'',
      showError:false,
      errorMessage:''
    };
    this.state = this.INITIAL_STATE;
  }

  handleClick(event) {
    if (this.state.email !== '') {
      this.props.firebase.passwordResetEmail(this.state.email)
      .then(() => {
        console.log('success');
        this.setState(this.INITIAL_STATE);
        this.props.history.push('/');
      }).catch(() => {
        console.log('failed');
        this.setState({showError:true, errorMessage:"Invalid Email."});
      });
    } else if(this.state.email === '') {
      this.setState({showError:true, errorMessage:"Must enter a valid email."})
    } else {
      this.setState({showError:false})
    }
  }

  render() {
    return (
      <Card style={{ width: '30vw', margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showError ? <Alert variant={'danger'}>{this.state.errorMessage}</Alert> : null}
          <Form.Group>
            <Form.Label>Please enter your email address</Form.Label>
            <Form.Control
              id="email"
              type="text"
              placeholder="Email Address"
              title="Email Address"
              onChange={() => this.setState({email:document.getElementById('email').value})}
            />
          </Form.Group>
          <Button onClick={(event)=>this.handleClick(event)}>Send Password Reset Email</Button>
        </Card.Body>
      </Card>
    );
  }
}

const ForgotPassword = withFirebase(ForgotPasswordBase);

export default forgotPassword;
