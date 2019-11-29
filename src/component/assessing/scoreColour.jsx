import React from 'react';

class ScoreColour extends React.Component {
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

export default ScoreColour;
