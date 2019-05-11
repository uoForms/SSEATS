import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Feature from './feature'
import { withFirebase } from '../../firebase/context'

class CategoryBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      categoryName: '',
      reportTypes : [],
      features: [],
      test:[]
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
    console.log(this.state.features.length)
    this.state.features.push(
      <Feature
        key = {this.state.features.length}
        id = {'feature-'+this.state.features.length} />
    );
    console.log(this.state.features)
    this.forceUpdate();
  }

  removeFeature() {
    this.state.features.pop();
    this.forceUpdate();
  }

  createCategory() {
    let newCategory = this.props.firebase.db.collection('categories').doc();
    newCategory.set({
      name:this.state.categoryName,
      user:false,
      report_type: this.props.firebase.db.doc(this.state.selectedType)
    });
    let featureCollection = newCategory.collection('features');
    this.state.features.forEach(feature => {
      let newFeature = featureCollection.doc();
      newFeature.set({
        name:feature.name
      })
      let criteriaCollection = newFeature.collection('criteria');
      feature.criteria.forEach(criteria => {
        criteriaCollection.doc().set({
          name: criteria
        });
      });
    });
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
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
        <div className="h5 mb-0 py-3">Features</div>
        <div className="pl-4">
          {this.state.features}
        </div>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Row>
              <Button className="mx-1"
                variant="success"
                onClick={_ => this.addFeature()}>Add Feature</Button>
            </Form.Row>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Row>
              <Button className="mx-1"
                variant="primary"
                onClick={_ => this.createCategory()}>Create Category</Button>
            </Form.Row>
          </Form.Group>
        </Form.Row>
      </div>
    );
  }
}

const Category = withFirebase(CategoryBase);
export default Category;
