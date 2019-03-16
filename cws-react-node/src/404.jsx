import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';

class NotFound extends Component {

  render() {
    return (
      <Card style={{ width: '30rem', margin: '5rem auto'}}>
        <Card.Body>
          <h2>404</h2>
          <h1>Page Not Found</h1>
          <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
        </Card.Body>
      </Card>
    );
  }
}

export default NotFound;
