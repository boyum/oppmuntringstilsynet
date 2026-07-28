import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import "../styles/themes.scss";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="nb">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
