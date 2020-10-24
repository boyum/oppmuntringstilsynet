import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Buttons from '.';
import LanguageStore from '../../stores/LanguageStore';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

it('should render without accessibility errors', async () => {
  const wrapper = mount(
    <LanguageStore>
      <main>
        <Buttons handleReset={() => { }} handleCopy={() => { }} />
      </main>
    </LanguageStore>
  );
  const buttons = wrapper.getDOMNode();

  const results = await axe(buttons);

  expect(results).toHaveNoViolations();
});
