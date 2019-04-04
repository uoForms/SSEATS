import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { withFirebase } from '../firebase/context'

class CreateCategoryBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      reportTypes : [],
      features: []
    };
  }

  componentWillMount() {
    this.getReportTypes();
  }

  getReportTypes(){
    this.props.firebase.db.collection('report_type').get().then((reports) => {
      let reportOptionsArray = reports.docs.map((report, i) => {
          if(i === 0){
            this.setState({selectedType:report.ref.path});
          }
          return (<option key={i} value={report.ref.path}>{report.data().name}</option>);
      });
      let reportMapping = {}
      reports.docs.forEach((report) => {
        reportMapping[report.ref.path] = report;
      });
      this.setState({
        reportTypes: reportMapping,
        reportOptions: reportOptionsArray
      });
    });
  }

  addFeature() {
    this.state.features.push({
      name: '',
      criteria: []
    });
    this.forceUpdate();
  }

  removeFeature() {
    this.state.features.pop();
    this.forceUpdate();
  }

  addCriteria(feature) {
    this.state.features[feature].criteria.push({
      name: ''
    });
    this.forceUpdate();
  }

  removeCriteria(feature) {
    this.state.features[feature].criteria.pop();
    this.forceUpdate();
  }

  updateFeature(feature) {
    let value = document.getElementById('feature-' + feature).value;
    let features = this.state.features;
    features[feature]['name'] = value;
  }

  updateCriteria(feature, criteria) {
    let value = document.getElementById('criteria-' + feature + '-' + criteria).value;
    let features = this.state.features;
    features[feature].criteria[criteria] = value;
  }

  renderFeatures() {
    let features = this.state.features.map((feature, i) => {
      let criteria = feature.criteria.map((criterion, j) => {
        return (
          <Form.Group key={j}>
            <Form.Control
              id = {"criteria-" + i + "-" + j}
              placeholder = "Enter a new criteria"
              title = {"Criteria " + j}
              onChange={_ => this.updateCriteria(i,j)}>
            </Form.Control>
          </Form.Group>
        );
      });
      return (
        <ListGroup.Item key={i} data-type="feature" data-index={i}>
          <Form.Group>
            <Form.Label>Feature Name</Form.Label>
            <Form.Control
              id = {"feature-" + i}
              placeholder = "Enter the feature name"
              title = {"Feature " + i}
              onChange={_ => this.updateFeature(i)}>
            </Form.Control>
          </Form.Group>
          { this.state.features[i].criteria.length > 0 ?
             <div className="h6 pt-2 pb-1">Criteria</div> : null}
          {criteria}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                <Button className="mx-1"
                  variant="success"
                  onClick={_ => this.addCriteria(i)}>Add Criteria</Button>
                <Button className="mx-1"
                  variant="danger"
                  onClick={_ => this.removeCriteria(i)}>Remove Last Criteria</Button>
              </Form.Row>
            </Form.Group>
          </Form.Row>
        </ListGroup.Item>
      );
    })
    return (<ListGroup variant="flush" children={features} />);
  }

  render() {
    return (
      <Card style={{ width: '80vw', maxWidth:'60rem', minWidth: '30rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h4">Create Category</div>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Category Name</Form.Label>
                <Form.Control
                  id = "categoryName"
                  placeholder = "Enter New Category Name"
                  title = "Category Name"
                  onChange={_ => {
                    this.setState({categoryName:document.getElementById('categoryName').value})
                  }}
                  >
                </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Report Type</Form.Label>
                <Form.Control as="select"
                  id = "reportType"
                  placeholder = "Select a Report Type"
                  title = "Report Type"
                  onChange={_ => {
                    this.setState({selectedType:document.getElementById('reportType').value})
                  }}
                  children = {this.state.reportOptions}
                  >
                </Form.Control>
            </Form.Group>
          </Form.Row>
          { this.state.features.length > 0 ? <div className="h5 mb-0 pt-3">Features</div> : null}
        </Card.Body>
        { this.state.features.length > 0 ? this.renderFeatures() : null}
        <Card.Body>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                <Button className="mx-1"
                  variant="success"
                  onClick={_ => this.addFeature()}>Add Feature</Button>
                <Button className="mx-1"
                  variant="danger"
                  onClick={_ => this.removeFeature()}>Remove Last Feature</Button>
              </Form.Row>
            </Form.Group>
          </Form.Row>
        </Card.Body>
      </Card>
    );
  }
}

const CreateCategory = withFirebase(CreateCategoryBase);
export default CreateCategory;
