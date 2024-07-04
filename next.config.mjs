// @ts-check

/** @type {import("next").NextConfig} */
export default {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    reactCompiler: true,
  },

  webpack: (/** @type any */ config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
};
