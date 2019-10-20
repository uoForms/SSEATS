import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { withFirebase } from '../firebase/context'

class CreateReportTypeBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      scoreTypes : null,
      scores: [],
      buttonEnabled: false,
    };
    this.props.firebase.db.collection('score_type').get().then(scoreTypes=>{
      this.setState({
        scoreTypes : (_=>{
          let key = 0;
          return _=>{
            key++;
            return scoreTypes.docs.map(doc=>{
              return (<option key={doc.id+key} name={doc.ref.path}>{doc.get("name")}</option>)
            })
          }
        })()
      });
    })
  }

  addScore() {
    this.state.scores.push({name:undefined,value:""});
    this.forceUpdate();
  }

  removeScore() {
    this.state.scores.pop();
    this.forceUpdate();
  }

  updateScore(index) {
    return _=>{
      // Delay to let changes apply... doesn't really work
      setInterval(this.isButtonEnabled(), 100);
      let score = document.getElementById("criteria_" + index);
      if(score != null) {
        let scores = this.state.scores.slice(0);
        scores[index] = score.selectedIndex===0?{name:undefined,value:""}:
        {name:this.props.firebase.db.doc(score[score.selectedIndex].attributes.name.value), value:score[score.selectedIndex].value};
        this.setState({scores : scores});
      }
    }
  }

  addScoreType() {
    let name = document.getElementById('categoryName').value;
    let scores = this.state.scores.filter(score=>score.name!==undefined).map(score=>score.name);
    if (this.isButtonEnabled()) {
      this.props.firebase.db.collection("report_type").doc().set({
        name : name,
        scores : scores,
      }).then();
      this.props.history.push('/');
    }
  }

  isButtonEnabled() {
    let enabled = false;
    if (document.getElementById("submit") !== null) {
      let name = document.getElementById('categoryName')
      if (name !== null){
        name = name.value;
        let scores = this.state.scores.filter(score=>score.name!==undefined).map(score=>score.name);
        enabled = name !== "" && scores.length > 0;
      }
      // Toggle the submit button.
      this.setState({buttonEnabled:enabled});
    }
    return enabled;
  }

  renderScores() {
    let scores = this.state.scores.map((score, i)=>{
      return(
        <Form.Group key={"formGroup"+i}>
          <Form.Control
            key={"select"+i}
            as="select"
            id={"criteria_" + i}
            title="Criteria"
            value={score.value}
            onChange={this.updateScore(i)}
          >
          <option key={"empty"+i} name=""></option>
          {this.state.scoreTypes()}
          </Form.Control>
        </Form.Group>);
    });
    return (
        <div children={scores} />
      );
  }

  render() {
    return (
      <Card style={{ width: '80vw', maxWidth:'60rem', minWidth: '30rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h4">Create Report Type</div>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Report Name</Form.Label>
                <Form.Control
                  id = "categoryName"
                  placeholder = "Enter New Report Name"
                  title = "Report Name"
                  onChange = {_ => this.isButtonEnabled()}
                  >
                </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Group>
            { this.state.scores.length > 0 ? <div>Scores</div> : null}
          </Form.Group>
          { this.state.scores.length > 0 ? this.renderScores() : null}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                <Button className="mx-1"
                  variant="success"
                  onClick={_ => this.addScore()}>Add Score</Button>
                <Button className="mx-1"
                  variant="danger"
                  onClick={_ => this.removeScore()}>Remove Last Score</Button>
              </Form.Row>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                {this.state.buttonEnabled?
                  <Button 
                  className="mx-1"
                  variant="primary"
                  id="submit"
                  onClick={_ => this.addScoreType()}
                  >Create Report Type</Button>:
                  <Button 
                  className="mx-1"
                  variant="primary"
                  id="submit"
                  disabled="true"
                  >Create Report Type</Button>
                }
                  
              </Form.Row>
            </Form.Group>
          </Form.Row>
        </Card.Body>
      </Card>
    );
  }
}

const CreateReportType = withFirebase(CreateReportTypeBase);
export default CreateReportType;
