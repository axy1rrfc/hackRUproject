// next.config.js
const nextConfig = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });
    return config;
  },
};

module.exports = nextConfig;
