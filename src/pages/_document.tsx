import React from "react";
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext,
} from "next/document";
import LanguageContext from "../contexts/LanguageContext";
import { getTranslations } from "./api/translations";
import LanguageEnum from "../enums/Language";

class CustomDocument extends Document {
  static host: string;

  static currentUrl: string;

  static async getInitialProps(
    context: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);

    CustomDocument.host = context?.req?.headers.host ?? "";
    CustomDocument.currentUrl = CustomDocument.host + context?.pathname;

    return { ...initialProps };
  }

  private static renderGTM(): JSX.Element {
    return (
      <noscript>
        <iframe
          title="GTM iframe"
          src="https://www.googletagmanager.com/ns.html?id=GTM-MPPJRMK"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    );
  }

  private static renderMetaTags(
    pageTitle: string,
    pageDescription: string,
  ): JSX.Element {
    const { currentUrl } = CustomDocument;

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
      </>
    );
  }

  private static renderHead(language: LanguageEnum): JSX.Element {
    const tagManagerHtml = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MPPJRMK');</script>`;
    const { pageTitle, pageDescription } = getTranslations(language);

    return (
      <>
        <title>{pageTitle}</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: tagManagerHtml }} />

        {CustomDocument.renderMetaTags(pageTitle, pageDescription)}
      </>
    );
  }

  render(): JSX.Element {
    return (
      <Html lang="nb">
        <LanguageContext.Consumer>
          {([language]) => (
            <>
              <Head>{CustomDocument.renderHead(language)}</Head>
              <body>
                {CustomDocument.renderGTM()}
                <Main />
                <NextScript />
              </body>
            </>
          )}
        </LanguageContext.Consumer>
      </Html>
    );
  }
}

export default CustomDocument;
