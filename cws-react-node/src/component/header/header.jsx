import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { withFirebase } from '../firebase/context'

class HeaderBase extends React.Component {
  filterPage(value){
    console.log("32");
    console.log(value);
    return value.type !== null && value.type === 'page';
  }

  routingNavItems() {
    let list = this.props.firebase.userPermissions
      .filter(permission => permission.type !== null
        && permission.type === 'page')
      .map((page, i) => {
        console.log(i)
        return (
          <Nav.Item key={i}>
            <Nav.Link href={page.link}>{page.shortLabel}</Nav.Link>
          </Nav.Item>
        );
      });
    console.log(list);
    return list;
  }

  userNavItems(){
    let navItems = [];
    if(this.props.firebase.auth.currentUser === null){
      navItems.push(
        <Nav.Item key='0'>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
      );
    } else {
      // TODO: When user session operations is complete, change this render
      //       to have the logged in nav items.
      navItems.push(
        <Nav.Item key='0'>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
      );
    }
    return navItems;
  }


  render() {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">POMME</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            {this.routingNavItems()}
          </Nav>
          <Nav>
            {this.userNavItems()}
          </Nav>
        </Navbar>

    );
  }
}

const Header = withFirebase(HeaderBase);
export default Header;
