import type { FC } from "react";
import "../styles/globals.css";
import "../styles/themes.scss";
import { MessageStore } from "../stores/MessageStore";

export type AppProps = {
  Component: FC<unknown>;
  pageProps: Record<string, unknown>;
};

const Oppmuntringstilsynet: FC<AppProps> = ({ Component, pageProps }) => (
  <MessageStore>
    <Component {...pageProps} />
  </MessageStore>
);

export default Oppmuntringstilsynet;
