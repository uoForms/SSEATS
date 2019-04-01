import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'
import manageScore from '../firebase/manageScore'

class AddScoreBase extends React.Component {
  constructor(props){
    super(props);
    
  }

  handleClick() {
    
  }
 
  field(key) {
    let title = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
    return (
      <Form.Group key={key}>
        <Form.Label>{title}</Form.Label>
        <Form.Control
          as="select"
          id={key}
          title={title}
          onChange={_=>{
            // DoSomething
          }}
        >
          <option></option>
          <option>long option 1</option>
          <option>long option 2</option>
          <option>long option 3</option>
          </Form.Control>
      </Form.Group>
    );
  }

  render() {
    return (
        <div>
          {this.field('asdf')}
          <Form.Group>
            <Button onClick={(event)=>this.handleClick()}>Submit</Button>
          </Form.Group>
        </div>
    );
  }
}

const AddScore = withFirebase(AddScoreBase);
export default AddScore;
