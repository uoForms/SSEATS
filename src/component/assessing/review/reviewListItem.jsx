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
            <Form.Group className="mb-1">
                <Form.Label className="mb-0">
                    <h3 className="mb-0">
                    {props.name}
                    </h3>
                </Form.Label>
            </Form.Group>
            <Form.Group className="mb-2">
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
