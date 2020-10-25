import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Page from '../pages';
import LanguageStore from '../stores/LanguageStore';
import MessageStore from '../stores/MessageStore';

expect.extend(toHaveNoViolations);

describe(Page.name, () => {
  // it('should render without accessibility errors when a message is set', async () => {
  //   const encodedMessage =
  // eslint-disable-next-line max-len
  //     "N4IgxgFgpmDWDOIBcBtALgJwK5QDSZ32ygF1cQATAQzSmRABUp40RyBbZ%2BKgczqUbNW5AHZVO9JizYgANlRE8svfiAByAewzxYAIQ2x2VWSAC%2BQA";
  //   const currentUrl = "https://example.com/";
  //   const host = "https://example.com";

  //   const page = render(
  //     <MessageStore>
  //       <LanguageStore>
  //         <Page encodedMessage={encodedMessage} currentUrl={currentUrl} host={host} />
  //       </LanguageStore>
  //     </MessageStore>
  //   ).container;

  //   const results = await axe(page);

  //   expect(results).toHaveNoViolations();
  // });

  it('should render without accessibility errors when no message', async () => {
    const encodedMessage = '';
    const currentUrl = 'https://example.com/';
    const host = 'https://example.com';

    const page = render(
      <MessageStore>
        <LanguageStore>
          <Page encodedParamMessage={encodedMessage} currentUrl={currentUrl} host={host} />
        </LanguageStore>
      </MessageStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });
});
