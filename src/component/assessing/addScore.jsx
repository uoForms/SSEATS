import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'
import manageScore from '../firebase/manageScore'

class AddScoreBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      criteriaOptions : null,
      selectNames : null,
      selectOptions : null,
      criteria : undefined,
      score : [],
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
                  <optgroup key={category + ':' + feature} label={category + ": " + feature}>
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

  scores() {
    let scores = [];
    for (let i=0; i < this.state.selectOptions.length; i++) {
      scores.push(
        <Form.Group key={this.state.selectNames[i]}>
          <Form.Label>{this.state.selectNames[i]}</Form.Label>
          <Form.Control
            as="select"
            id="score"
            title="Score"
            onChange={_=>{
              let select = document.getElementById("score");
              let score = this.state.score;
              score[i] = select[select.selectedIndex].value
              this.setState({score:score});
            }}
          >
          {this.state.selectOptions[i]}
          </Form.Control>
        </Form.Group>
        );
    }
    return scores;
  }

  setScores() {
    if (this.state.criteria !== undefined) {
      manageScore.getScore(this.props.firebase.db.doc(this.state.criteria.split('/features/')[0])).then(scores=>{
        let scales = [];
        let names = [];
        for (let i in scores){
          scales.push([]);
          names.push(scores[i].name)
          let s = scales.length - 1;
          scales[s].push(
            <option key="null" value={scores[i].null}>
              {scores[i].null}
            </option>
          );
          for (let j=scores[i].min; j<=scores[i].max; j+=scores[i].interval) {
            scales[s].push(
              <option key={j} value={j}>
                {j}
              </option>
            );
          }
        }
        this.setState({selectNames : names});
        this.setState({selectOptions : scales});
      });
    }
  }

  async handleClick() {
    if (this.props.subjectDocumentReference && this.state.criteria) {
      const userRef = await this.props.firebase.getUserDoc();
      const userData = await userRef.get().then((user) => user.data());
      manageScore.createScore(this.props.subjectDocumentReference, {
        type: this.props.firebase.db.doc(this.state.criteria),
        score: this.state.score,
        assessor: userData.firstName ? userData.firstName + " " + userData.lastName : userData.email, 
        assessorRef: userRef,
        comment: typeof this.state.comment === 'undefined'
          || this.state.comment === null ? '' : this.state.comment
      }).then(this.props.exit);
    }
  }

  render() {
    return (
      <Form className="p-3">
        <Form.Group>
          <Form.Label>Criteria</Form.Label>
          <Form.Control
            as="select"
            id="criteria"
            title="Criteria"
            onChange={_=>{
              let select = document.getElementById("criteria");
              // Update score input when a criteria is selected.
              this.setState({criteria:select.selectedIndex===0?undefined:select[select.selectedIndex].value}, this.setScores);
            }}
          >
            <option></option>
            {this.state.criteriaOptions}
          </Form.Control>
        </Form.Group>

        {this.state.selectOptions!=null?this.scores():<Form.Label>Score</Form.Label>}

        <Form.Group>
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
