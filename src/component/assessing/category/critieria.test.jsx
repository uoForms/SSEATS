import * as React from 'react';
import Criteria from './criteria.jsx';
import { shallow, mount, render } from 'enzyme';
// in app/src/setupTests.js file

const Enzyme = require('enzyme');

// this is where we reference the adapter package we installed  
const EnzymeAdapter = require('enzyme-adapter-react-16');

// This sets up the adapter to be used by Enzyme
Enzyme.configure({ adapter: new EnzymeAdapter() });


function func(){
    //Empty function
}

const props = {
  updateValue: func(),
  id:1,
  feature:1
}

describe('Rendering',() => {
  it("Test to verify is the form exists in the componenet", () => {
    const wrapper = mount (< Criteria {...props} />);
    expect(
      wrapper.containsMatchingElement(                              
        <input placeholder="Enter a new criterion" title="Criteria 1" id="c-1-1"  className="form-control" />
      )
    ).toBeTruthy();
  }); 
})