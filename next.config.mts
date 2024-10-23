import { NextConfig } from "next";

export default {
  reactStrictMode: true,
  poweredByHeader: false,

  // webpack: (config, { dev, isServer }) => {
  //   if (!dev && !isServer) {
  //     Object.assign(config.resolve.alias, {
  //       "react/jsx-runtime.js": "preact/compat/jsx-runtime",
  //       react: "preact/compat",
  //       "react-dom": "preact/compat",
  //     });
  //   }

  //   return config;
  // },
} satisfies NextConfig;
