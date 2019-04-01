import React from 'react';
//import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'
import manageScore from '../firebase/manageScore'

class AddScoreBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      criteriaOptions : null
    };
    manageScore.getCriterias(this.props.firebase.db).then(criteriaMap=>{
      console.log(criteriaMap)
      let options = [];
      for (let category in criteriaMap) {
        if (criteriaMap.hasOwnProperty(category)){
          let featureOptions = [];
          for(let feature in criteriaMap[category]) {
            if (criteriaMap[category].hasOwnProperty(feature)){
              let categoryOptions = [];
              for (let i in criteriaMap[category][feature]) {
                categoryOptions.push((_=>{
                  return(
                    <option key={criteriaMap[category][feature][i]}>
                      {criteriaMap[category][feature][i]}
                    </option>
                  );
                })());
              }
              featureOptions.push((_=>{
                return(
                  <optgroup label={feature}>
                    {categoryOptions}
                  </optgroup>
                );
              })());
            }
          }
          options.push((_=>{
            return(
              <optgroup label={category}>
                {featureOptions}
              </optgroup>
            );
          })());
        }
      }
      console.log(options)
      this.setState({criteriaOptions : options});
    });
  }

  handleClick() {
    
  }

  render() {
    return (
      <Form>
        <Form.Group>
          <Form.Label>Criteria</Form.Label>
          <Form.Control
            as="select"
            id="criteria"
            title="Criteria"
            onChange={_=>{
              // DoSomething
            }}
          >
            <option></option>
            {this.state.criteriaOptions}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Button onClick={(event)=>this.handleClick()}>Submit</Button>
        </Form.Group>
      </Form>
    );
  }
}

const AddScore = withFirebase(AddScoreBase);
export default AddScore;
