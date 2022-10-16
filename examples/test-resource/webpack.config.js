const webpack = require("webpack");
const path = require("path");

const server = {
    entry: "./src/server/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "esbuild-loader",
                options: {
                    loader: "ts",
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })],
    optimization: {
        minimize: true,
    },
    resolve: {
        alias: {
            "@client": path.resolve(__dirname, "src/client/"),
        },
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist", "server"),
    },
    target: "node",
};

const client = {
    entry: "./src/client/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "esbuild-loader",
                options: {
                    loader: "ts",
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [new webpack.DefinePlugin({ "global.GENTLY": false })],
    optimization: {
        minimize: true,
    },
    resolve: {
        alias: {
            "@server": path.resolve(__dirname, "src/server/"),
        },
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist", "client"),
    },
    target: "node",
};

module.exports = [server, client];
