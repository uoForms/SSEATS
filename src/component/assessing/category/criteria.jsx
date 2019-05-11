import React from 'react';
import Form from 'react-bootstrap/Form';

export default class Criteria extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  updateCriteria() {
    this.setState({name:document.getElementById(this.props.key).value});
  }

  getValue() {
    return this.state.name;
  }

  render() {
    return (
      <Form.Group key={this.props.key}>
        <Form.Control
          id = {this.props.id}
          placeholder = "Enter a new criterion"
          title = {"Criteria " + this.props.key}
          onChange={_ => this.updateCriteria()}>
        </Form.Control>
      </Form.Group>
    );
  }
}
