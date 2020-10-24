import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import LanguagePicker from '.';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

it('should render without accessibility errors', async () => {
  const wrapper = mount(<LanguagePicker handleChange={() => {}} />);
  const languagePicker = wrapper.getDOMNode();

  const results = await axe(languagePicker);

  expect(results).toHaveNoViolations();
});
