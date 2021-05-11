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

  render(): JSX.Element {
    const { host, currentUrl } = CustomDocument;
    const ogImageUrl = `https://${host}/og-image.jpg`;

    const tagManagerHtml = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MPPJRMK');</script>`;

    return (
      <Html lang="nb">
        <LanguageContext.Consumer>
          {([language]) => {
            const translations = getTranslations(language);

            return (
              <>
                <Head>
                  <title>{translations.pageTitle}</title>
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

                  <meta property="og:title" content={translations.pageTitle} />
                  <meta
                    property="og:description"
                    content={translations.pageDescription}
                  />
                  <meta property="og:image" content={ogImageUrl} />
                  <meta property="og:url" content={currentUrl} />
                  <meta property="og:type" content="website" />
                </Head>
                <body>
                  <noscript>
                    <iframe
                      title="GTM iframe"
                      src="https://www.googletagmanager.com/ns.html?id=GTM-MPPJRMK"
                      height="0"
                      width="0"
                      style={{ display: "none", visibility: "hidden" }}
                    />
                  </noscript>

                  <Main />
                  <NextScript />
                </body>
              </>
            );
          }}
        </LanguageContext.Consumer>
      </Html>
    );
  }
}

export default CustomDocument;
