import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { MdRemove } from 'react-icons/md';

/**
 * 
 * @param {updateValue, id, feature} props 
 */
const Criteria = (props) => {

  const [id, setId] = React.useState("");

  React.useEffect(() => {
    setId("c-"+props.feature+"-"+props.id);
  }, [props.feature, props.id]);

  const updateCriteria = () => {
    props.updateValue(props.id, document.getElementById(id).value);
  };

  const removeCriteria = () => {
    props.removeCriteria(props.id);
  };

  return (
    <Form.Row className="align-items-center">
      <Form.Group className="col-auto" as={Col}>
        <button className="btn" onClick={removeCriteria}>
          <MdRemove
            size={30}
            style={{color:'red'}} />
        </button>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Control
          id = {id}
          placeholder = "Enter a new criterion"
          title = {"Criteria " + props.id}
          value={props.value}
          onChange={updateCriteria}>
        </Form.Control>
      </Form.Group>
    </Form.Row>
  );

}

export default Criteria;
