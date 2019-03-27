import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'
import manageSubjects from '../firebase/manageSubjects'

class CreateSubjectBase extends React.Component {
  constructor(props){
    super(props);
    this.INITIAL_STATE = {
      data:{
        surname:undefined,
        name:undefined,
        postal_code:undefined,
        date_of_birth:undefined
      },
      type:{
        surname:"text",
        name:"text",
        postal_code:"text",
        date_of_birth:"date"
      },
      showError:false,
      errorMessage:''
    };
    this.state = this.INITIAL_STATE;
  }

  handleClick(event) {
    if ((_=>{
      let noUndef = true;
      for (let i in this.state.data){
        if (this.state.data[i] === undefined){
          noUndef = false;
        }
      }
      return noUndef
    })()) {
      this.setState({showError:false, errorMessage:""})
      console.log(this.props.firebase)
      manageSubjects.createSubject(this.props.firebase.db, this.state.data).then(_=>console.log("message")).catch((e) => {
        this.setState({showError:true, errorMessage:"Invalid fields."});
      });
    } else {
      this.setState({showError:true, errorMessage:"Missing fields."})
    }
  }

  field(key) {
    let title = key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ');
    return (
      <Form.Group key={key}>
        <Form.Label>{title}</Form.Label>
        <Form.Control
          id={key}
          type={this.state.type[key]}
          title={title}
          onChange={_=>{
            let shallowCopy = {...this.state.data};
            shallowCopy[key] = document.getElementById(key).value;
            this.setState({data:shallowCopy});
          }}
        />
      </Form.Group>
    );
  }

  render() {
    return (
      <Card style={{ width: '50vw', minWidth: '10rem', margin: '5rem auto'}}>
        <Card.Body>
          {this.state.showError ? <Alert variant={'danger'}>{this.state.errorMessage}</Alert> : null}
          {(_=>{
            let fields = [];for (let key in this.state.data)fields.push(this.field(key));return fields;})()}
          <Form.Group>
            <Button onClick={(event)=>this.handleClick(event)}>Submit</Button>
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }
}

const CreateSubject = withFirebase(CreateSubjectBase);
export default CreateSubject;
