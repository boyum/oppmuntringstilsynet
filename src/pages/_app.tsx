import type { FC } from "react";
import { LanguageStore } from "../stores/LanguageStore";
import { ThemeStore } from "../stores/ThemeStore";
import "../styles/globals.css";
import "../styles/themes.scss";

export type AppProps = {
  Component: FC<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: FC<AppProps> = ({ Component, pageProps }) => (
  <ThemeStore>
    <LanguageStore>
      <Component {...pageProps} />
    </LanguageStore>
  </ThemeStore>
);

export default Oppmuntringstilsynet;
