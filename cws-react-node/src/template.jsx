import React from 'react';
import ReactDOM from 'react-dom';

export {
  Header,
  Body,
};

//extend this to add content
class Header extends React.Component {
  content() {
    return (
        <div>
          Default content
        </div>
      );
  };

  render() {
    return (
        <div>
          <header>
            <div>
              {this.content()}
            </div>
          </header>
        </div>
      );
  }
}

// Extend this to add content
class Body extends React.Component {
  content() {
    return (
      <div>
        Nothing to show
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          {this.content()}
        </div>
      </div>
    );
  }
}

