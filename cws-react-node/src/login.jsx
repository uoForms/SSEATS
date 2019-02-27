import React from 'react';
//import ReactDOM from 'react-dom';
import {Header, Body} from './template';

class Login extends Body {
  content() {
    return (
      <form>
        <input type="text" name="firstname" value="Mickey" /><br/>
        <input type="password" name="lastname" value="Mouse" /><br/>
        <input type="submit" value="Submit" />
      </form> 
    );
  }
}

export default class Page extends React.Component {
  render() {

    return (
      <div>
        <Header />
        <Login />
      </div>
    );
  }
}

// ========================================

//ReactDOM.render(<Page />, document.getElementById("root"));
