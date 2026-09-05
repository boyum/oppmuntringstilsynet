import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import "../styles/themes.scss";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return (
    <html lang="nb">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
