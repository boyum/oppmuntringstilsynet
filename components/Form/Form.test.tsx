import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Form from '.';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

let realUseContext: any;
let useContextMock;

// Setup mock
beforeEach(() => {
  realUseContext = React.useContext;
  useContextMock = React.useContext = jest.fn();
});
// Cleanup mock
afterEach(() => {
    React.useContext = realUseContext;
});

it('should render without accessibility errors when fields are disabled', async () => {
  const wrapper = mount(<Form isDisabled={true} />);
  const form = wrapper.getDOMNode();

  const results = await axe(form);

  expect(results).toHaveNoViolations();
});

it('should render without accessibility errors when fields are not disabled', async () => {
  const wrapper = mount(<Form isDisabled={false} />);
  const form = wrapper.getDOMNode();

  const results = await axe(form);

  expect(results).toHaveNoViolations();
});
