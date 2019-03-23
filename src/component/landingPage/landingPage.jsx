import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { withFirebase } from '../firebase/context';

class LandingPageBase extends React.Component {

  pageListItems(){
    console.log("logged");
    console.log(this.props.firebase.currentUser);
    return this.props.firebase.userPermissions
      .filter(permission => permission.type !== null
        && permission.type === 'page')
      .map((page, i) => {
        return (
          <ListGroup.Item action className="h5" key={i} href={page.link}>
            {page.longLabel}
          </ListGroup.Item>
        );
      });
  }

  loginList(){
    console.log("not logged");
    console.log(this.props.firebase.currentUser);
    let listItems = [];
    listItems.push(
      <ListGroup.Item action className="h5" key="0" href="/login">
        To use this application, you need to be logged in. Click here to log in.
      </ListGroup.Item>
    );
    return listItems;
  }

  render(){
    return(
      <Card style={{ width: '75vw', minWidth: '10rem', margin: '5rem auto'}}>
        <Card.Body>
          <div className="h3">Welcome to SSEATS!</div>
        </Card.Body>
        {/* List of actions available, basically acts as a navbar for the home page */}
        <ListGroup variant="flush">
          {this.props.firebase.auth.currentUser === null ?
            this.loginList() : this.pageListItems()}
        </ListGroup>
      </Card>
    );
  }
}

const LandingPage = withFirebase(LandingPageBase);
export default LandingPage;
