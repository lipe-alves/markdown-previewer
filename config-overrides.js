// config-overrides.js
const path = require("path");

module.exports = function override(config) {
    if (!config) {
        config = {
            resolve: {
                alias: {},
            },
        };
    }

    // Add your custom configuration here
    config.resolve.alias = {
        "@constants": path.resolve(__dirname, "./src/constants"),
        "@dictionaries": path.resolve(__dirname, "./src/dictionaries"),
        "@services": path.resolve(__dirname, "./src/services"),
        "@models": path.resolve(__dirname, "./src/models"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@providers": path.resolve(__dirname, "./src/providers"),
        "@types": path.resolve(__dirname, "./src/types"),
        "@functions": path.resolve(__dirname, "./src/functions"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        App: path.resolve(__dirname, "./src/App"),
    };

    return config;
};
