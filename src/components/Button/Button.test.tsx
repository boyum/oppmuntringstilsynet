import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "./Button";

expect.extend(toHaveNoViolations);

describe(Button.name, () => {
  it("should render without accessibility errors", async () => {
    const button = render(
      <Button
        id="id"
        onClick={() => {
          // Intentionally empty
        }}
        labelText="labelText"
      />,
    ).container;

    const results = await axe(button);

    expect(results).toHaveNoViolations();
  });
});
