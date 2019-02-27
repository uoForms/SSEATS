import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
      <form>
        <input type="text" name="firstname" value="Mickey" /><br/>
        <input type="password" name="lastname" value="Mouse" /><br/>
        <input type="submit" value="Submit" />
      </form> 
    );
  }
}

// ========================================

//ReactDOM.render(<Page />, document.getElementById("root"));
