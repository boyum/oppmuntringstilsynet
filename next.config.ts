import { NextConfig } from "next";

export default {
  reactStrictMode: true,
  poweredByHeader: false,
  i18n: {
    // locales: ["nb", "nn", "en"],
    locales: ["nb"],
    defaultLocale: "nb"
  },
} satisfies NextConfig;
