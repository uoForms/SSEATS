import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export default class Header extends React.Component {
  content = ""

  setContent(content) {
    this.content = content
  };

  render() {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">POMME</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

      );
  }
}
