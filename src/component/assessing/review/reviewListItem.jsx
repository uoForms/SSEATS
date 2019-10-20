import * as React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

const ReviewListItem = (props) => {

    return (
        <ListGroup.Item
            action
            className="h5"
            onClick={props.onClick}
        >  
            <Form.Group>
                <Form.Label>{props.date.toDate().toLocaleString("en-CA")}</Form.Label>
                <div
                    className={"text-secondary"}
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {props.review}
                </div>
            </Form.Group>
        </ListGroup.Item>
    );
};

export default ReviewListItem;
