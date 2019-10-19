import * as React from 'react';
import Card from 'react-bootstrap/Card';
import ReviewForm from './reviewForm';

const ReviewPage = (props) => {
    return (
        <Card style={{ width: '90vw', maxWidth: '50rem', margin: '5rem auto'}}>
            <Card.Body>
                <ReviewForm/>
            </Card.Body>
        </Card>
    );
}

export default ReviewPage;
