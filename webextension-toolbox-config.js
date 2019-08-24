"use strict";
// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config
    config.plugins.push(
        new CopyPlugin([
            { from: config.context + '/js/*.js', to: config.output.path }
        ]),
    );

    // Important: return the modified config
    return config;
  }
};