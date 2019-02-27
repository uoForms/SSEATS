import React from 'react';

//extend this to add content
export default class Header extends React.Component {
  content = ""

  setContent(content) {
    this.content = content
  };

  render() {
    return (
        <div>
          <header>
            <div>
              <p>This is a header</p>
              {this.content}
            </div>
          </header>
        </div>
      );
  }
}
