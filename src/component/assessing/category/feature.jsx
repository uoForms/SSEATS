import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MdAdd, MdRemove } from 'react-icons/md';
import Criteria from './criteria';


const Feature = (props) => {

  const [id, setId] = React.useState(null);
  
  React.useEffect(() => {
    setId("f-"+props.id);
  }, [props.id]);

  const updateCriteria = (criteriaId, value) => {
    props.updateCriteria(props.id, criteriaId, value)
  };

  const updateFeature = () => {
    props.updateValue(props.id, document.getElementById(id).value);
  };

  const addCriteria = () => {
    props.addCriteria(props.id)
  };

  const removeCriteria = (criteriaId) => {
    props.removeCriteria(props.id, criteriaId);
  };

  const removeFeature = () => {
    props.removeFeature(id);
  };

  const mapCriteria = () => {
    return props.criteria.map((criterion, i) => {
      return (
        <Criteria 
          feature={props.id}
          value={criterion}
          id={i}
          key={i}
          updateValue={updateCriteria}
          removeCriteria={removeCriteria}
        />
      );
    });
  };

  return (
    <Form.Group>
      <Form.Row>
        <Form.Group className="col-auto" as={Col}>
          <button className="btn" onClick={removeFeature}>
            <MdRemove
              size={30}
              style={{color:'red'}} />
          </button>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Feature Name</Form.Label>
          <Form.Control
            id = {id}
            placeholder = "Enter a feature name"
            title = {"Feature " + props.id}
            onChange={updateFeature}
            value={props.value}  
          >
          </Form.Control>
        </Form.Group>
      </Form.Row>
      <div className="pl-4">
        <div className="h6 pt-2 pb-1">
          <span>Criteria</span>
          <button className="btn" onClick={addCriteria}>
            <MdAdd
              size={30}
              style={{color:'green'}} />
          </button>
        </div>
        <div>
          {mapCriteria()}
        </div>
      </div>
    </Form.Group>
  );

}


export default Feature;
