import * as React from 'react';
import Card from 'react-bootstrap/Card';
import AssignSubjectForm from './assignSubjectForm';

// Wrapper for the assign subject form
const AssignSubjectPage = () => {

    return (
        <Card style={{ width: '90vw', maxWidth: '50rem', margin: '5rem auto'}}>
            <Card.Body>
                <AssignSubjectForm/>
            </Card.Body>
        </Card>
    );

}

export default AssignSubjectPage;
