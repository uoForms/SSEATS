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
      role: '',
      roles: []
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

  componentDidMount() {
    this.getRoles();
  }

  getRoles() {
    this.props.firebase.getRoleList().then(queryResults => {
      let roles = [];
      queryResults.forEach(role => {
        let data = role.data();
        data['id'] = role.id
        roles.push(data);
      });
      let roleMapping = roles.map((role, i) => {
        return <option key={i} value={"/roles/" + role.id}>{role.name} - {role.description}</option>
      });
      this.setState({
        roles: roleMapping
      });
    });
  }

  render() {
    return (
      <Card style={{ width: '50vw', minWidth: '20rem',  margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showMessage ? <Alert variant={this.state.messageType}>{this.state.message}</Alert> : null}
          <Form.Group>
            <Form.Label>Email address</Form.Label>1
            <Form.Control
              id="email"
              type="text"
              placeholder="Email Address"
              title="Email Address"
              onChange={() => this.setState({username:document.getElementById('email').value})}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Control as="select"
              id="role"
              placeholder="Role"
              title="Role"
              onChange={() => this.setState({username:document.getElementById('role').value})}
              children={this.state.roles}>
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
