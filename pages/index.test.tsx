import { render } from "@testing-library/react";
import React from "react";
import Home from ".";
import LanguageStore from "../stores/LanguageStore";
import MessageStore from "../stores/MessageStore";
import { themes } from "../types/Themes";

describe(Home.name, () => {
  it("should render without errors", async () => {
    themes.forEach(async () => {
      expect(() =>
        render(
          <MessageStore>
            <LanguageStore>
              <Home encodedParamMessage="" />
            </LanguageStore>
          </MessageStore>,
        ),
      ).not.toThrowError();
    });
  });
});
