import {
  HtmlHeadAction,
  HtmlHeadActionType,
  HtmlHeadData,
  htmlHeadReducer,
} from "./html-head.reducer";

describe(htmlHeadReducer.name, () => {
  describe(HtmlHeadActionType.SetHtmlHeadData, () => {
    it("should override all HTML head data", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
        encodedMessage: null,
        deployUrl: "",
      };

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetHtmlHeadData,
        data: {
          title: "newTitle",
          description: "newDescription",
          ogTitle: "newOgTitle",
          ogDescription: "ogDescription",
          ogUrl: "newOgUrl",
          encodedMessage: "encodedMessage",
          deployUrl: "origin",
        },
      };

      const newState = htmlHeadReducer(state, action);
      expect(newState).toEqual(action.data);
    });

    it("should override only set HTML head data", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
        encodedMessage: null,
        deployUrl: "origin",
      };

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetHtmlHeadData,
        data: {
          title: "newTitle",
          ogTitle: "newOgTitle",
        },
      };

      const expectedState: HtmlHeadData = {
        title: "newTitle",
        description: "description",
        ogTitle: "newOgTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
        encodedMessage: null,
        deployUrl: "origin",
      };

      const newState = htmlHeadReducer(state, action);
      expect(newState).toEqual(expectedState);
    });
  });
});
