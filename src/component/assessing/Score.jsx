import React from 'react';
import Form from 'react-bootstrap/Form';
import { withFirebase } from '../firebase/context'

import manageScore from '../firebase/manageScore'

class ScoreBase extends React.Component {
  constructor(props){
    super(props);
    this.state = props.state;
    this.setScores()
  }

  scores() {
    let scores = [];
    let formScore = [];
    for (var i=0; i < this.state.selectOptions.length; i++) {
      scores.push(
        <Form.Group key={this.state.selectNames[i]}>
          <Form.Label>{this.state.selectNames[i]}</Form.Label>
          <Form.Control
            as="select"
            id={"score"+i}
            title="Score"
            onChange={(index=>{
              // Pass argument to avoid no-loop-func
              return (_=>{
                let select = document.getElementById("score"+index);
                let score = this.state.score;
                score[index] = this.state.selectOptions[index][select.selectedIndex].props.value
                this.setState({score:score});
              })
            })(i)}
          >
          {this.state.selectOptions[i]}
          </Form.Control>
        </Form.Group>
        );
      formScore.push(this.state.selectOptions[i][0].props.value);
    }
    // Initialize the score array when it's empty
    if (this.state.score.length === 0)
    {
      this.setState({score:formScore});
    }
    return scores;
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

  render() {
    return(
      <Form.Group key={this.state.selectNames[i]}>
          <Form.Label>{this.state.selectNames[i]}</Form.Label>
          <Form.Control
            as="select"
            id={"score"+i}
            title="Score"
            onChange={(index=>{
              // Pass argument to avoid no-loop-func
              return (_=>{
                let select = document.getElementById("score"+index);
                let score = this.state.score;
                score[index] = this.state.selectOptions[index][select.selectedIndex].props.value
                this.setState({score:score});
              })
            })(i)}
          >
          {this.state.selectOptions[i]}
          </Form.Control>
        </Form.Group>
    )
  }
}

const Score = withFirebase(ScoreBase);
export default Score
