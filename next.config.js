// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const withPrefresh = require('@prefresh/next');
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const WebpackModules = require('webpack-modules');

const config = {
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },

  reactStrictMode: true,
  poweredByHeader: false,
  webpack(originalWebpackConfig, {
    dev,
    isServer,
  }) {
    const newWebpackConfig = {};

    const splitChunks = originalWebpackConfig.optimization
      && originalWebpackConfig.optimization.splitChunks;

    if (splitChunks) {
      const {
        cacheGroups,
      } = splitChunks;

      const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/;
      if (cacheGroups.framework) {
        cacheGroups.preact = {
          ...cacheGroups.framework,
          test: preactModules,
        };
        cacheGroups.commons.name = 'framework';
      } else {
        cacheGroups.preact = {
          name: 'commons',
          chunks: 'all',
          test: preactModules,
        };
      }
    }

    // Install webpack aliases:
    // eslint-disable-next-line no-param-reassign
    const aliases = originalWebpackConfig.resolve.alias
      || (newWebpackConfig.resolve.alias = {});
    aliases.react = 'preact/compat';
    aliases['react-dom'] = 'preact/compat';

    // inject Preact DevTools
    if (dev && !isServer) {
      const {
        entry,
      } = originalWebpackConfig;

      newWebpackConfig.entry = () => entry().then((entries) => ({
        ...entries,
        'main.js': ['preact/debug'].concat(entries['main.js'] || []),
      }));
    }

    return {
      ...originalWebpackConfig,
      ...newWebpackConfig,
      plugins: [
        ...originalWebpackConfig.plugins,
        new WebpackModules(),
      ],
    };
  },
};

module.exports = config;
