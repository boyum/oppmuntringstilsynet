import type { FC } from "react";
import "../styles/globals.css";
import "../styles/themes.scss";

export type AppProps = {
  Component: FC<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
);

export default Oppmuntringstilsynet;
