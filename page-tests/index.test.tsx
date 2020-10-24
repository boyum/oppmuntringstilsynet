import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Page from '../pages';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

it('should render without accessibility errors when a message is set', async () => {
  const encodedMessage = "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRABUp40RyBbZ%2BKgczqUbNW5AHZVO9JizYgANlRE8svfiAByAewzxYAIQ2x2VWSAC%2BQA";
  const currentUrl = "https://example.com/";
  const host = "https://example.com";
  
  const wrapper = mount(<Page encodedMessage={encodedMessage} currentUrl={currentUrl} host={host} />);
  const page = wrapper.getDOMNode();

  const results = await axe(page);

  expect(results).toHaveNoViolations();
});

it('should render without accessibility errors when no message', async () => {
  const encodedMessage = "";
  const currentUrl = "https://example.com/";
  const host = "https://example.com";
  
  const wrapper = mount(<Page encodedMessage={encodedMessage} currentUrl={currentUrl} host={host} />);
  const page = wrapper.getDOMNode();

  const results = await axe(page);

  expect(results).toHaveNoViolations();
});