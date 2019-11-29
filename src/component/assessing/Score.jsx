import React from 'react';
import Form from 'react-bootstrap/Form';

class Score extends React.Component {
  /*
  * Props should have the following values for the component to work properly:
  * selectNames     Array of strings for labelling each select
  * selectOptions   Array containing the component array for each select
  * score           The currently selected score value for each select
  * See addScore.jsx for an example
  */
  constructor(props){
    super(props);
    let formScore = props.score;
    // Initialize the score array when it's empty
    if (this.props.score.length === 0) {
      for (var i=0; i < this.props.selectOptions.length; i++) {
        formScore.push(this.props.selectOptions[i][0].props.value);
      }
    }
    this.state = {
      selectNames : props.selectNames,
      selectOptions : props.selectOptions,
      score : formScore,
    };
  }

  scores() {
    let scores = [];
    
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
    }
    return scores;
  }

  render() {
    return(
      <div>
        {this.scores()}
      </div>
    )
  }
}

export default Score;
