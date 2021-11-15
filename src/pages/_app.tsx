import { FunctionComponent } from "react";
import { LanguageStore } from "../stores/LanguageStore";
import { ThemeStore } from "../stores/ThemeStore";
import "../styles/globals.css";
import "../styles/themes.scss";

export type AppProps = {
  Component: FunctionComponent<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeStore>
    <LanguageStore>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </LanguageStore>
  </ThemeStore>
);

// eslint-disable-next-line import/no-default-export
export default Oppmuntringstilsynet;
