import * as React from 'react';
import * as _ from "lodash";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Feature from './feature';
import FirebaseContext from '../../firebase/context';
import history from '../../../history';

const Category = (props) => {

  const firebase = React.useContext(FirebaseContext)

  const [features, setFeatures] = React.useState([]);
  const [reportOptions, setReportOptions] = React.useState([]);
  const [categoryName, setCategoryName] = React.useState("");
  const [selectedType, setSelectedType] = React.useState(null);

  React.useEffect(() => {
    if (firebase) {
      firebase.db.collection('report_type').get().then((reports) => {
        let reportOptionsArray = reports.docs.map((report, i) => {
            if(i === 0){
              setSelectedType(report.ref.path);
            }
            return (<option key={i} value={report.ref.path}>{report.data().name}</option>);
        });
        let reportMapping = {}
        reports.docs.forEach((report) => {
          reportMapping[report.ref.path] = report;
        });
        setReportOptions(reportOptionsArray);
      });
    }
  }, [firebase]);

  const addCriteria = (fId) => {
    let newFeatures = _.clone(features);
    newFeatures[fId].criteria.push("");
    setFeatures(newFeatures);
  }

  const removeCriteria = (fId, cId) => {
    let newFeatures = _.clone(features);
    newFeatures[fId].criteria.splice(cId, 1);
    setFeatures(newFeatures);
  }

  const removeFeature = (fId) => {
    let newFeatures = _.clone(features);
    newFeatures.splice(fId, 1);
    setFeatures(newFeatures);
  }

  const updateFeature = (fId, value) => {
    let newFeatures = _.clone(features);
    newFeatures[fId].value = value;
    setFeatures(newFeatures);
  }
  
  const updateCriteria = (fId, cId, value) => {
    let newFeatures = _.clone(features);
    newFeatures[fId].criteria[cId] = value;
    setFeatures(newFeatures);
  }
  
  const addFeature = () => {
    let newFeatures = _.cloneDeep(features);
    newFeatures.push({
      criteria: [],
      value: "",
    });
    setFeatures(newFeatures);
  }

  const createCategory = () => {
    let newCategory = firebase.db.collection('categories').doc();
    newCategory.set({
      name:categoryName,
      user:false,
      report_type: firebase.db.doc(selectedType)
    });
    let featureCollection = newCategory.collection('features');
    features.forEach(feature => {
      let newFeature = featureCollection.doc();
      newFeature.set({
        name:feature.value
      })
      let criteriaCollection = newFeature.collection('criteria');
      feature.criteria.forEach(criteria => {
        criteriaCollection.doc().set({
          name: criteria
        });
      });
    });
    history.push('/');
  }


  const mapFeatures = () => {
    return features.map((feature, i) => {
      return (
        <Feature 
          id={i}
          key={i}
          criteria={feature.criteria}
          value={feature.value}
          addCriteria={addCriteria}
          removeCriteria={removeCriteria}
          removeFeature={removeFeature}
          updateValue={updateFeature}
          updateCriteria={updateCriteria}
        />
      );
    });
  }



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
                setCategoryName(document.getElementById('categoryName').value)
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
                this.setSelectedType(document.getElementById('reportType').value)
              }}
              children = {reportOptions ? reportOptions : []}
              >
            </Form.Control>
        </Form.Group>
      </Form.Row>
      <div className="h5 mb-0 py-3">Features</div>
      <div>
        {mapFeatures()}
      </div>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Row>
            <Button className="mx-1"
              variant="success"
              onClick={addFeature}>Add Feature</Button>
          </Form.Row>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Row>
            <Button className="mx-1"
              variant="primary"
              onClick={createCategory}>Create Category</Button>
          </Form.Row>
        </Form.Group>
      </Form.Row>
    </div>
  );
};

export default Category;
