import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { withFirebase } from '../firebase/context'

class HeaderBase extends React.Component {
  filterPage(value){
    return value.type !== null && value.type === 'page';
  }

  routingNavItems() {
    return this.props.firebase.userPermissions
      .filter(permission => permission.type !== null
        && permission.type === 'page')
      .map((page, i) => {
        return (
          <Nav.Item key={i}>
            <Nav.Link onClick={(event)=>this.props.history.push(page.link)}>{page.shortLabel}</Nav.Link>
          </Nav.Item>
        );
      });
  }

  userNavItems(){
    let navItems = [];
    if(this.props.firebase.auth.currentUser === null){
      navItems.push(
        <Nav.Item key='0'>
          <Nav.Link onClick={(event)=>this.props.history.push('/login')}>Login</Nav.Link>
        </Nav.Item>
      );
    } else {
      navItems.push(
        <Nav.Item key="0">
          <Nav.Link onClick={(event)=>this.handleClick(event)}>Logout</Nav.Link>
        </Nav.Item>
      );
    }
    return navItems;
  }


  render() {
    return (
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand onClick={(event)=>this.props.history.push('/')}>SSEATS</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Item>
              <Nav.Link onClick={(event)=>this.props.history.push('/')}>Home</Nav.Link>
            </Nav.Item>
            {this.routingNavItems()}
          </Nav>
          <Nav>
            {this.userNavItems()}
          </Nav>
        </Navbar>

    );
  }

  handleClick(event) {
    event.stopPropagation();
    this.props.firebase.doLogout().then(_ => this.props.history.push('/'));
  }

}

const Header = withFirebase(HeaderBase);
export default Header;
