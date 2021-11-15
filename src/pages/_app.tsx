import { FunctionComponent } from "react";
import LanguageStore from "../stores/LanguageStore";
import ThemeStore from "../stores/ThemeStore";
import "../styles/globals.css";
import "../styles/themes.scss";

type Props = {
  Component: FunctionComponent<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: React.FC<Props> = ({ Component, pageProps }) => (
  <ThemeStore>
    <LanguageStore>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </LanguageStore>
  </ThemeStore>
);

export default Oppmuntringstilsynet;
