import React from 'react';

export default class Login extends React.Component {
  render() {
    return (
      <form>
        <input type="text" name="firstname" /><br/>
        <input type="password" name="lastname" /><br/>
        <input type="submit" value="Submit" />
      </form> 
    );
  }
}
