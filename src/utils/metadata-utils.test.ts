import { Language } from "../enums/Language";
import { languages } from "../models/languages";
import { getMetadata } from "./metadata-utils";
import { LATEST_QUERY_PARAM_MESSAGE_KEY } from "./url-utils";

describe(getMetadata.name, () => {
  it("should return metadata corresponding to the current language", () => {
    const language = Language.NorskBokmal;
    const ogUrl = "url";
    const deployUrl = "deployUrl";
    const encodedMessage = "encodedMessage";

    const { pageTitle, pageOgTitle, pageDescription } =
      languages[language].translations;

    const metadata = getMetadata({
      language,
      ogUrl,
      deployUrl,
      encodedMessage,
    });

    expect(metadata.title).toBe(pageTitle);
    expect(metadata.description).toBe(pageDescription);
    expect(metadata.openGraph?.title).toBe(pageOgTitle);
    expect(metadata.openGraph?.description).toBe(pageDescription);
    expect(metadata.openGraph?.url).toBe(ogUrl);
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${deployUrl}/api/og-image?${LATEST_QUERY_PARAM_MESSAGE_KEY}=${encodedMessage}`,
        width: 1200,
        height: 627,
        alt: pageOgTitle,
      },
    ]);
  });

  it("should omit the message from the og image url when there is no message", () => {
    const metadata = getMetadata({
      language: Language.NorskBokmal,
      ogUrl: "url",
      deployUrl: "deployUrl",
      encodedMessage: null,
    });

    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${"deployUrl"}/api/og-image`,
        width: 1200,
        height: 627,
        alt: languages[Language.NorskBokmal].translations.pageOgTitle,
      },
    ]);
  });
});
