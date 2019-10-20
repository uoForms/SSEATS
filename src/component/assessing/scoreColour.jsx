import React from 'react';
import { withFirebase } from '../firebase/context';

class ScoreColourBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value:props.value
    }
  }
  render() {
    return(
    <span className="badge badge-pill" style={{backgroundColor: this.state.value.colour}}>{this.state.value.number}</span>
  );
  }
}

const ScoreColour = withFirebase(ScoreColourBase);
export default ScoreColour;
