import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'

class NoAuthLandingPage extends React.Component {
  render(){
    return(
      <Card style={{ width: '75vw', minWidth: '10rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h3">Welcome to POMME!</div>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item action href="/login" className="h5">
            Click here to login. To use this application, you have to be logged in.
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  }
}

export default NoAuthLandingPage;
