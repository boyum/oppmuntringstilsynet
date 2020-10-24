import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Form from '.';
import LanguageStore from '../../stores/LanguageStore';
import MessageStore from '../../stores/MessageStore';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

it('should render without accessibility errors when fields are disabled', async () => {
  const wrapper = mount(
    <MessageStore>
      <LanguageStore>
        <main>
          <Form isDisabled={true} />
        </main>
      </LanguageStore>
    </MessageStore>
  );
  const form = wrapper.getDOMNode();

  const results = await axe(form);

  expect(results).toHaveNoViolations();
});

it('should render without accessibility errors when fields are not disabled', async () => {
  const wrapper = mount(
    <MessageStore>
      <LanguageStore>
        <main>
          <Form isDisabled={false} />
        </main>
      </LanguageStore>
    </MessageStore>
  );
  const form = wrapper.getDOMNode();

  const results = await axe(form);

  expect(results).toHaveNoViolations();
});
