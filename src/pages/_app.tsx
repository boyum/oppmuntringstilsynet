import type { FC } from "react";
import "../styles/globals.css";
import "../styles/themes.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";

export type AppProps = {
  Component: FC<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <SpeedInsights />
  </>
);

export default Oppmuntringstilsynet;
