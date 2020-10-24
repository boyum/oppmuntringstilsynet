import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Page from '../pages';
import LanguageStore from '../stores/LanguageStore';
import MessageStore from '../stores/MessageStore';

configure({ adapter: new Adapter() });

expect.extend(toHaveNoViolations);

it('should render without accessibility errors when a message is set', async () => {
  const encodedMessage = "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRABUp40RyBbZ%2BKgczqUbNW5AHZVO9JizYgANlRE8svfiAByAewzxYAIQ2x2VWSAC%2BQA";
  const currentUrl = "https://example.com/";
  const host = "https://example.com";

  const wrapper = mount(
    <MessageStore>
      <LanguageStore>
        <main>
          <Page encodedMessage={encodedMessage} currentUrl={currentUrl} host={host} />
        </main>
      </LanguageStore>
    </MessageStore>
  );
  const page = wrapper.getDOMNode();

  const results = await axe(page);

  console.log('yuipppipppii')
  
  expect(results).toHaveNoViolations();
});

it('should render without accessibility errors when no message', async () => {
  const encodedMessage = "";
  const currentUrl = "https://example.com/";
  const host = "https://example.com";

  console.log('pokpok')

  const wrapper = mount(
    <MessageStore>
      <LanguageStore>
        <main>
          <Page encodedMessage={encodedMessage} currentUrl={currentUrl} host={host} />
        </main>
      </LanguageStore>
    </MessageStore>);
  const page = wrapper.getDOMNode();

  const results = await axe(page);

  console.log('wweee')

  expect(results).toHaveNoViolations();
});