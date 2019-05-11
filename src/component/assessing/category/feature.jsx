import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { MdAdd, MdRemove } from 'react-icons/md';
import Criteria from './criteria';

export default class Feature extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name: '',
      criteria: []
    }
  }

  componentWillMount () {
    console.log(this.key)
    console.log(this.props.key)
    console.log(this.props.id)
  }

  addCriteria() {
    console.log(this.state.criteria.length)
    this.state.criteria.push(
      <Criteria
        key={this.state.criteria.length}
        id={"criteria-"+this.key+"-"+this.state.criteria.length} />
    );
    this.forceUpdate();
  }

  updateFeature() {
    this.setState({name:document.getElementById(this.props.id).value});
  }

  removeCriterion(i) {
    console.log(i)
  }

  mapFeatures() {
    return this.state.criteria.map((criterion, i) => {
      return (
        <Form.Row>
          <Form.Group>
            <div onClick={_ => this.removeCriterion(i) }>
              <MdRemove
                size={28}
                style={{color:'red'}} />
            </div>
          </Form.Group>
          { criterion }
        </Form.Row>
      );
    });
  }

  render() {
    return (
      <Form.Group>
        <Form.Group>
          <Form.Label>Feature Name</Form.Label>
          <Form.Control
            id = {this.props.id}
            placeholder = "Enter a feature name"
            title = {"Feature " + this.key}
            onChange={_ => this.updateFeature()}>
          </Form.Control>
        </Form.Group>
        <div className="h6 pt-2 pb-1">Criteria</div>
        <div className="pl-4">
          { this.mapFeatures() }
        </div>
        <Form.Row>
          <Button className="mx-1"
            variant="success"
            onClick={_ => this.addCriteria()}>Add Criteria</Button>
        </Form.Row>
      </Form.Group>
    );
  }

}
