import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import LanguagePicker from '.';

expect.extend(toHaveNoViolations);

describe(LanguagePicker.name, () => {
  it('should render without accessibility errors', async () => {
    const languagePicker = render(
      <main>
        <LanguagePicker handleChange={() => { }} />
      </main>
    ).container;
  
    const results = await axe(languagePicker);
  
    expect(results).toHaveNoViolations();
  });
});
