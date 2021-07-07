export enum HtmlHeadActionType {
  SetHtmlHeadData = "SetHtmlHeadData",
  SetTitle = "SetTitle",
  SetDescription = "SetDescription",
  SetOgTitle = "SetOgTitle",
  SetOgDescription = "SetOgDescription",
  SetOgUrl = "SetOgUrl",
}

export type HtmlHeadAction = {
  type: HtmlHeadActionType.SetHtmlHeadData;
  data: Partial<HtmlHeadData>;
};

export type HtmlHeadData = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  encodedMessage: string | null;
  deployUrl: string;
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
  }
}
