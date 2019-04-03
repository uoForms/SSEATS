import React from 'react';
import Card from 'react-bootstrap/Card';
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
      let reportOptionsArray = reports.docs.map((report, i) =>
        <option key={i} value={report.ref.path}>{report.data().name}</option>
      );
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
      <Card style={{ width: '50vw', minWidth: '10rem', margin: '5rem auto'}}>
        <Card.Body>
          <Form.Group>
            <Form.Label>Report Type</Form.Label>
          </Form.Group>
        </Card.Body>
      </Card>
    );
  }
}

const CreateCategory = withFirebase(CreateCategoryBase);
export default CreateCategory;
