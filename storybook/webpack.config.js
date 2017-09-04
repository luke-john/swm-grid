// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://storybooks.js.org/docs/react-storybook/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

var genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = function (config, env) {

    var config = genDefaultConfig(config, env);

    // Add typescript support
    config.module.rules.push({
        test: /\.tsx?$/,
        exclude: [
            /node_modules/
        ],
        include: [
            /documentation/,
            /stories/,
            /src/,
            /storybook/,
        ],
        loader: "awesome-typescript-loader",
        query: {
            configFileName: "./tsconfig.storybook.json"
        },
    })
    config.resolve.extensions.push(".tsx")
    config.resolve.extensions.push(".ts")
    config.resolve.extensions.push(".js")

    // Add markdown support
    config.module.rules.push({
        test: /\.md$/,
        loader: "raw-loader"
    })
    config.resolve.extensions.push(".md")

    return config
}