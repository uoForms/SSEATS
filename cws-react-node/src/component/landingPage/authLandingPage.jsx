import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'

class AuthLandingPage extends React.Component {
  render(){
    return(
      <Card style={{ width: '75rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h3">Welcome to POMME!</div>
        </Card.Body>
        {/* List of actions available, basically acts as a navbar for the home page */}
        <ListGroup variant="flush">
          <ListGroup.Item action href="/report" className="h5">
            View Patient Reports
          </ListGroup.Item>
        </ListGroup>
      </Card>
    );
  }
}

export default AuthLandingPage;
