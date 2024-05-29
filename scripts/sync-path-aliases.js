const getConfigOverridesConfig = require("../config-overrides.js");
const fs = require("fs");
const path = require("path");

const TS_CONFIG_PATH = path.join(__dirname, "../tsconfig.json");

syncPathAliases();

function syncPathAliases() {
    const tsConfig = JSON.parse(fs.readFileSync(TS_CONFIG_PATH));
    const configOverrides = getConfigOverridesConfig();

    // Reset ts config path aliases
    tsConfig.compilerOptions.paths = {};

    for (const [alias, fullpath] of Object.entries(
        configOverrides.resolve.alias
    )) {
        const [, pattern] = fullpath.split("/src/");

        const folderAlias = `${alias}/*`;
        const folderPattern = `${pattern}/*`;
        tsConfig.compilerOptions.paths[folderAlias] = [folderPattern];

        if (fs.existsSync(`${fullpath}/index.ts`)) {
            const indexAlias = alias;
            const indexPattern = `${pattern}/index.ts`;
            tsConfig.compilerOptions.paths[indexAlias] = [indexPattern];
        }
    }

    fs.writeFileSync(TS_CONFIG_PATH, JSON.stringify(tsConfig, null, 4));
}
