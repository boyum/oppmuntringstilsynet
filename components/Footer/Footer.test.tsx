import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import React from 'react';
import Footer from '.';

expect.extend(toHaveNoViolations);

describe(Footer.name, () => {
  it('should render without accessibility errors', async () => {
    const footer = render(<Footer />).container;
  
    const results = await axe(footer);
  
    expect(results).toHaveNoViolations();
  });
  
  it('should render with centered text', () => {
    const footer = render(<Footer />).container;
  
    const textAlign = window.getComputedStyle(footer).textAlign;
    console.log('styles', window.getComputedStyle(footer))
  
    expect(textAlign).toBe('center');
  });
});
