import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { withFirebase } from '../firebase/context'

class HeaderBase extends React.Component {
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
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={(event)=>this.handleClick(event)}>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>

      );
  }

  handleClick(event) {
    event.stopPropagation();
    this.props.firebase.doLogout();
    window.location.reload();
  }

}

const Header = withFirebase(HeaderBase);
export default Header;
