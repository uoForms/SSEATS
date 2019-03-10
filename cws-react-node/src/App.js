import React, { Component } from 'react';
import Header from './component/header/header.jsx'
import Routes from './routes.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {

  render() {
    return (
      <div>
        <Header />
        <Routes />
      </div>
    );
  }
}

export default App;
