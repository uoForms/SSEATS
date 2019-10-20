import * as React from "react";
import ListGroup from 'react-bootstrap/ListGroup';

/**
 * Returns
 * 
 * list contains an array of props to be rendered by the template prop
 * 
 * type of list (null, or "flush")
 * 
 * @param {list, template, type} props 
 */
const List = (props) => {

    const mapData = () => {
        return props.list.map((prop, i) => { 
            return (
                <React.Fragment key={i}>
                    {props.template(prop)}
                </React.Fragment>
            );
        });
    }

    return (
        <ListGroup variant={props.type}>
            {mapData()}
        </ListGroup>
    );
};

export default List;
