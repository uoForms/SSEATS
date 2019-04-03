import React from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { withFirebase } from '../firebase/context'

class CreateCategoryBase extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      reportTypes : []
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

  render() {
    return (
      <Card style={{ width: '60vw', minWidth: '10rem', margin: '5rem auto'}}>
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
        </Card.Body>
      </Card>
    );
  }
}

const CreateCategory = withFirebase(CreateCategoryBase);
export default CreateCategory;
