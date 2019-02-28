import React, { Component } from 'react';
import logo from './logo.svg';
import Header from './header.jsx'
import './App.css';

import Routes from './routes.jsx'

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
