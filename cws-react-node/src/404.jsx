import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';

class NotFound extends Component {

  render() {
    return (
      <body>
    <div id="message">
      <h2>404</h2>
      <h1>Page Not Found</h1>
      <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
      <h3>Why am I seeing this?</h3>
      <p>This page was generated by the Firebase Command-Line Interface. To modify it, edit the <code>404.html</code> file in your project's configured <code>public</code> directory.</p>
    </div>
  </body>

    );
  }
}

export default NotFound;
