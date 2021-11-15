import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript
} from "next/document";
import { themes } from "../types/Themes";
import { getFallbackTheme } from "../utils/theme-utils";

class CustomDocument extends Document {
  static host: string;

  static currentUrl: string;

  static async getInitialProps(
    context: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);

    CustomDocument.host = context?.req?.headers.host ?? "";
    CustomDocument.currentUrl = `${CustomDocument.host}${context?.pathname}`;

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

  private static renderMetaTags(): JSX.Element {
    return <meta property="og:type" content="website" />;
  }

  private static renderHead(): JSX.Element {
    const tagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MPPJRMK');`;

    return (
      <>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: tagManagerScript }} />

        {CustomDocument.renderMetaTags()}
      </>
    );
  }

  render(): JSX.Element {
    return (
      <Html lang="nb">
        <Head>{CustomDocument.renderHead()}</Head>
        <body data-theme={getFallbackTheme(themes)}>
          {process.env.NODE_ENV === "production" && CustomDocument.renderGTM()}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// eslint-disable-next-line import/no-default-export
export default CustomDocument;
