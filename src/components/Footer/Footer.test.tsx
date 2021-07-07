import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import Footer from ".";

expect.extend(toHaveNoViolations);

describe(Footer.name, () => {
  it("should render without accessibility errors", async () => {
    const footer = render(<Footer />).container;

    const results = await axe(footer);

    expect(results).toHaveNoViolations();
  });
});
