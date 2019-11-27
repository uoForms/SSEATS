import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'
import manageScore from '../firebase/manageScore'
import Score from './Score'

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
    manageScore.getCriterias(this.props.firebase.db, this.props.selectedCategory).then(criteriaMap=>{
      let options = [];
      for (var category in criteriaMap) {
        if (criteriaMap.hasOwnProperty(category)){
          for(var feature in criteriaMap[category]) {
            if (criteriaMap[category].hasOwnProperty(feature)){
              let categoryOptions = [];
              for (var i in criteriaMap[category][feature]) {
                for(var criteria in criteriaMap[category][feature][i]) {
                  if (criteriaMap[category][feature][i].hasOwnProperty(criteria)){
                    this.setState({criteria:criteriaMap[category][feature][i][criteria]});
                    categoryOptions.push(
                        <option key={criteria} value={criteriaMap[category][feature][i][criteria]}>
                          {criteria}
                        </option>
                    );
                  }
                }
              }
              options.push(
                  <optgroup key={category + ':' + feature} label={category + ": " + feature}>
                    {categoryOptions}
                  </optgroup>
              );
            }
          }
        }
      }
      this.setState({criteriaOptions : options});
      this.setScores()
    });
  }

  setScores() {
    if (this.state.criteria !== undefined) {
      manageScore.getScore(this.props.firebase.db.doc(this.state.criteria.split('/features/')[0])).then(scores=>{
        let scales = [];
        let names = [];
        for (var i in scores){
          scales.push([]);
          names.push(scores[i].name)
          let s = scales.length - 1;
          let nullLabel = scores[i].labels?' - '+scores[i].labels[scores[i].null]||'':'';
          scales[s].push(
            <option key="null" value={scores[i].null}>
              {scores[i].null + nullLabel}
            </option>
          );
          let bounded = (val, a, b)=>{
            return val <= Math.max(a, b) && val >= Math.min(a, b)
          }
          for (var j=scores[i].min; bounded(j, scores[i].min, scores[i].max); j+=scores[i].interval) {
            let label = scores[i].labels?' - '+scores[i].labels[j]||'':'';
            scales[s].push(
              <option key={j} value={j}>
                {j + label}
              </option>
            );
          }
        }
        this.setState({
          selectNames : names,
          selectOptions: scales,
        });
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

        {
          this.state.selectOptions!=null ?
          <Score 
            selectNames={this.state.selectNames}
            selectOptions={this.state.selectOptions}
            score={this.state.score}
          >   
          </Score>:
          null
        }

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
