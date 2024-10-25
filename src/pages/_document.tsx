import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { ReactNode } from "react";
import { getFallbackTheme } from "../utils/theme-utils";

class CustomDocument extends Document {
  static host: string;

  static currentUrl: string;

  static override async getInitialProps(
    context: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);

    CustomDocument.host = context?.req?.headers.host ?? "";
    CustomDocument.currentUrl = `${CustomDocument.host}${context?.pathname}`;

    return { ...initialProps };
  }

  private static renderMetaTags(): ReactNode {
    return <meta property="og:type" content="website" />;
  }

  private static renderHead(): ReactNode {
    return (
      <>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💕</text></svg>"
        />

        {CustomDocument.renderMetaTags()}
      </>
    );
  }

  override render(): JSX.Element {
    return (
      <Html lang="nb">
        <Head>{CustomDocument.renderHead()}</Head>
        <body data-theme={getFallbackTheme()}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
