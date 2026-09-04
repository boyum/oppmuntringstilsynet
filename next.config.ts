import { NextConfig } from "next";

export default {
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
} satisfies NextConfig;
