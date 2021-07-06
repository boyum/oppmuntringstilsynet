import {
  HtmlHeadAction,
  HtmlHeadData,
  HtmlHeadActionType,
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
      };

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetHtmlHeadData,
        data: {
          title: "newTitle",
          description: "newDescription",
          ogTitle: "newOgTitle",
          ogDescription: "ogDescription",
          ogUrl: "newOgUrl",
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
      };

      const newState = htmlHeadReducer(state, action);
      expect(newState).toEqual(expectedState);
    });
  });

  describe(HtmlHeadActionType.SetTitle, () => {
    it("should set the title", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      const newTitle = "newTitle";

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetTitle,
        title: newTitle,
      };

      const newState = htmlHeadReducer(state, action);

      const expectedState: HtmlHeadData = {
        title: "newTitle",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe(HtmlHeadActionType.SetDescription, () => {
    it("should set the description", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      const newDescription = "newDescription";

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetDescription,
        description: newDescription,
      };

      const newState = htmlHeadReducer(state, action);

      const expectedState: HtmlHeadData = {
        title: "title",
        description: "newDescription",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe(HtmlHeadActionType.SetOgTitle, () => {
    it("should set the open graph title", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      const newOgTitle = "newOgTitle";

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetOgTitle,
        ogTitle: newOgTitle,
      };

      const newState = htmlHeadReducer(state, action);

      const expectedState: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "newOgTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe(HtmlHeadActionType.SetOgDescription, () => {
    it("should set the open graph description", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      const newOgDescription = "newOgDescription";

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetOgDescription,
        ogDescription: newOgDescription,
      };

      const newState = htmlHeadReducer(state, action);

      const expectedState: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "newOgDescription",
        ogUrl: "ogUrl",
      };

      expect(newState).toEqual(expectedState);
    });
  });

  describe(HtmlHeadActionType.SetOgUrl, () => {
    it("should set the open graph url", () => {
      const state: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "ogUrl",
      };

      const newOgUrl = "newOgUrl";

      const action: HtmlHeadAction = {
        type: HtmlHeadActionType.SetOgUrl,
        ogUrl: newOgUrl,
      };

      const newState = htmlHeadReducer(state, action);

      const expectedState: HtmlHeadData = {
        title: "title",
        description: "description",
        ogTitle: "ogTitle",
        ogDescription: "ogDescription",
        ogUrl: "newOgUrl",
      };

      expect(newState).toEqual(expectedState);
    });
  });
});
