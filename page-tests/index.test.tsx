import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import React from "react";
import Home from "../pages";
import LanguageStore from "../stores/LanguageStore";
import MessageStore from "../stores/MessageStore";

expect.extend(toHaveNoViolations);

describe(Home.name, () => {
  it("should render without accessibility errors when no message", async () => {
    const encodedMessage = "";

    const page = render(
      <MessageStore>
        <LanguageStore>
          <Home encodedParamMessage={encodedMessage} />
        </LanguageStore>
      </MessageStore>,
    ).container;

    const results = await axe(page);

    expect(results).toHaveNoViolations();
  });
});
