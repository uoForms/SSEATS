import React from 'react';
import Criteria from './criteria.jsx';
import { mount } from 'enzyme';




function func(){
    //Empty function
}
var props = {updateValue: func ,id:1,feature:1};


test.todo('lmao'

);

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null;
});

it("renders prop info", () => {
    const props = {
        updateValue: func(),
        id:1,
        feature:1
    }

    CriteriaComponent = mount(<Critiera {...props} />);

    expect((CriteriaComponent).prop('id')).toEqual(1);
});
