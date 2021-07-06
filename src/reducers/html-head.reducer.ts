export enum HtmlHeadActionType {
  SetHtmlHeadData = "SetHtmlHeadData",
  SetTitle = "SetTitle",
  SetDescription = "SetDescription",
  SetOgTitle = "SetOgTitle",
  SetOgDescription = "SetOgDescription",
  SetOgUrl = "SetOgUrl",
}

export type HtmlHeadAction =
  | {
      type: HtmlHeadActionType.SetHtmlHeadData;
      data: Partial<HtmlHeadData>;
    }
  | { type: HtmlHeadActionType.SetTitle; title: string }
  | { type: HtmlHeadActionType.SetDescription; description: string }
  | { type: HtmlHeadActionType.SetOgTitle; ogTitle: string }
  | { type: HtmlHeadActionType.SetOgDescription; ogDescription: string }
  | { type: HtmlHeadActionType.SetOgUrl; ogUrl: string };

export type HtmlHeadData = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
};

export function htmlHeadReducer(
  state: HtmlHeadData,
  action: HtmlHeadAction,
): HtmlHeadData {
  switch (action.type) {
    case HtmlHeadActionType.SetHtmlHeadData: {
      const { data } = action;
      return { ...state, ...data };
    }

    case HtmlHeadActionType.SetTitle: {
      const { title } = action;
      return { ...state, title };
    }

    case HtmlHeadActionType.SetDescription: {
      const { description } = action;
      return { ...state, description };
    }

    case HtmlHeadActionType.SetOgTitle: {
      const { ogTitle } = action;
      return { ...state, ogTitle };
    }

    case HtmlHeadActionType.SetOgDescription: {
      const { ogDescription } = action;
      return { ...state, ogDescription };
    }

    case HtmlHeadActionType.SetOgUrl: {
      const { ogUrl } = action;
      return { ...state, ogUrl };
    }
  }
}
