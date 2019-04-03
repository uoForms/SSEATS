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
      criteriaOptions : null,
      selectOptions : null,
      criteria : undefined,
      score : undefined,
      comment : undefined
    };
    manageScore.getCriterias(this.props.firebase.db).then(criteriaMap=>{
      let options = [];
      for (let category in criteriaMap) {
        if (criteriaMap.hasOwnProperty(category)){
          for(let feature in criteriaMap[category]) {
            if (criteriaMap[category].hasOwnProperty(feature)){
              let categoryOptions = [];
              for (let i in criteriaMap[category][feature]) {
                for(let criteria in criteriaMap[category][feature][i]) {
                  if (criteriaMap[category][feature][i].hasOwnProperty(criteria)){
                    categoryOptions.push((_=>{
                      return(
                        <option key={criteria} value={criteriaMap[category][feature][i][criteria]}>
                          {criteria}
                        </option>
                      );
                    })());
                  }
                }
              }
              options.push((_=>{
                return(
                  <optgroup key={feature} label={category + ": " + feature}>
                    {categoryOptions}
                  </optgroup>
                );
              })());
            }
          }
        }
      }
      this.setState({criteriaOptions : options});
    });
  }

  setScores() {
    if (this.state.criteria !== undefined) {
      manageScore.getScore(this.props.firebase.db.doc(this.state.criteria.split('/features/')[0])).then(scores=>{
        let scale = [];
        scale.push(
          <option key="null" value={scores[0].null}>
            {scores[0].null}
          </option>
        );
        for (let i=scores[0].min; i<=scores[0].max; i+=scores[0].interval) {
          scale.push(
            <option key={i} value={i}>
              {i}
            </option>
          );
        }
        this.setState({selectOptions : scale});
      });
    }
  }

  handleClick() {
    console.log(this.state.criteria)
    console.log(this.state.score)
    console.log(this.state.comment)
    if (this.props.subjectDocumentReference) {
      manageScore.createScore(this.props.subjectDocumentReference);
    }
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
              let select = document.getElementById("criteria");
              this.setState({criteria:select.selectedIndex===0?undefined:select[select.selectedIndex].value});
              this.setScores();
            }}
          >
            <option></option>
            {this.state.criteriaOptions}
          </Form.Control>
          <Form.Label>Select</Form.Label>
          <Form.Control
            as="select"
            id="score"
            title="Score"
            onChange={_=>{
              let select = document.getElementById("score");
              this.setState({score:select[select.selectedIndex].value});
            }}
          >
          {this.state.selectOptions}
          </Form.Control>
          <Form.Label>Comment</Form.Label>
          <Form.Control
            id="comment"
            type="text"
            title="Comment"
            onChange={_=>{
              this.setState({comment : document.getElementById('comment').value});
            }}
          />
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
