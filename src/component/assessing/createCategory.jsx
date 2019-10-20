import React from 'react';
import Card from 'react-bootstrap/Card';
import Category from './category/category';
import { withFirebase } from '../firebase/context'

class CreateCategoryBase extends React.Component {

  componentWillMount() {
    this.category = (<Category></Category>)
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
      <Card style={{ width: '80vw', maxWidth:'60rem', minWidth: '30rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h4">Create Category</div>
          {this.category}
        </Card.Body>
      </Card>
    );
  }
}

const CreateCategory = withFirebase(CreateCategoryBase);
export default CreateCategory;
