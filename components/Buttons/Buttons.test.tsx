import React, { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Buttons from '.';
import LanguageStore from '../../stores/LanguageStore';

expect.extend(toHaveNoViolations);

describe(Buttons.name, () => {
  it('should render without accessibility errors', async () => {
    const buttons = render(
      <LanguageStore>
        <main>
          <Buttons handleReset={undefined} handleCopy={undefined} />
        </main>
      </LanguageStore>,
    ).container;

    const results = await axe(buttons);

    expect(results).toHaveNoViolations();
  });
});
