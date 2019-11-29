import React from 'react';

class ScoreColourBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value:props.value
    }
  }
  render() {

    return(
      <div>{
        this.state.value===undefined ?
        null:
        <span className="badge badge-pill" style={{backgroundColor: this.state.value.colour}}>{this.state.value.number}</span>
      }
      </div>
  );
  }
}

const ScoreColour = ScoreColourBase;
export default ScoreColour;
