# Rollup Builder

[![npm package](https://img.shields.io/npm/v/@haixing_hu/rollup-builder.svg)](https://npmjs.com/package/@haixing_hu/rollup-builder)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![English Document](https://img.shields.io/badge/Document-English-blue.svg)](README.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/rollup-builder/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/rollup-builder/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/Haixing-Hu/rollup-builder/badge.svg?branch=master)](https://coveralls.io/github/Haixing-Hu/rollup-builder?branch=master)

`rollup-builder` 是一个多功能的工具，用于简化使用 Rollup 打包器构建 JavaScript 库的过程。它允许您生成多种格式，如 
CommonJS (CJS)、ES Module (ESM) 和 Universal Module Definition (UMD) 格式，可以选择是否进行代码压缩。

## 目录

- [特点](#features)
- [安装](#installation)
- [使用](#usage)
- [配置选项](#configuration)
- [贡献](#contributions)
- [许可证](#license)

## <span id="features">特点</span>

- 以多种格式构建 JavaScript 库，使其在不同环境中通用。
- 轻松进行生产环境下的代码压缩。
- 自动生成用于调试的源映射。
- 使用简单的选项配置库的格式、文件名等。
- 支持通过 Rollup 插件和自定义配置高度定制。

## <span id="installation">安装</span>

您可以将 `rollup-builder` 安装为开发依赖，使用 `npm` 或 `yarn` 安装：

```bash
npm install @haixing_hu/rollup-builder --save-dev
# 或
yarn add @haixing_hu/rollup-builder --dev
```

## <span id="usage">使用</span>

1. 创建一个 Rollup 配置文件（通常命名为 `rollup.config.mjs`），并导出一个函数，该函数定义了库的构建选项。
   您可以使用提供的 `rollupBuilder` 函数来简化此过程。

   示例 `rollup.config.mjs`：

   ```javascript
   import rollupBuilder from '@haixing_hu/rollup-builder';

   export default rollupBuilder('MyLibrary', import.meta.url);
   ```

2. 自定义 `rollup.config.mjs` 文件，以满足库的特定要求。您可以指定输入文件、格式、文件名前缀和其他选项。
   有关详细信息，请参阅 [配置选项](#configuration) 部分。 

   示例 `rollup.config.mjs`：

   ```javascript
   import rollupBuilder from '@haixing_hu/rollup-builder';
    
   export default rollupBuilder('MyLibrary', import.meta.url, {
     formats: ['cjs', 'esm'],
     minify: true,
     // Customize additional options as needed.
   });
   ```

3. 使用以下命令运行 Rollup 构建过程：

   ```bash
   rollup -c rollup.config.mjs
   ```

4. 构建后的库文件将位于 `dist` 目录中，遵循您指定的格式。例如，如果您指定了 `formats: ['cjs', 'esm']`，
   将生成以下文件：
   ```bash
    dist/my-library.cjs.js
    dist/my-library.cjs.min.js
    dist/my-library.esm.mjs
    dist/my-library.esm.min.mjs
   ```

5. 您应该修改 `package.json` 文件，以指定库的入口点。例如，如果您指定了 `formats: ['cjs', 'esm']`，
   您应该将 `package.json` 文件中的 `main`, `module` 和 `exports` 字段设置为：
   ```json
   {
     "main": "dist/my-library.cjs.min.js",
     "module": "dist/my-library.esm.min.mjs",
     "exports": {
         ".": {
            "require": "./dist/my-library.cjs.min.js",
            "import": "./dist/my-library.esm.min.mjs"
         }
     }
   }
   ``` 
6. 您应该将以下开发依赖项添加到您的库中：
   ```bash
   yarn add --dev @babel/core @babel/plugin-transform-runtime @babel/preset-env \
     @rollup/plugin-alias @rollup/plugin-babel @rollup/plugin-commonjs \
     @rollup/plugin-node-resolve @rollup/plugin-terser rollup rollup-plugin-analyzer
   ```
   或 
   ```bash
   npm install -D @babel/core @babel/plugin-transform-runtime @babel/preset-env \
     @rollup/plugin-alias @rollup/plugin-babel @rollup/plugin-commonjs \
     @rollup/plugin-node-resolve @rollup/plugin-terser rollup rollup-plugin-analyzer
   ```

## <span id="configuration">配置选项</span>

- `libraryName` (string): 你的库的名称（在 UMD 格式中使用）。
- `importMetaUrl` (string): 调用者模块的 `import.meta.url`。
- `options` (object): 附加的构建选项，包括：
    - `formats` (array): 构建的格式数组（默认：`['cjs', 'esm']`）。
    - `nodeEnv` (string): `NODE_ENV` 环境变量（默认：`process.env.NODE_ENV`）。
    - `minify` (boolean): 是否对代码进行压缩（默认：对于生产环境为 `true`，否则为 `false`）。
    - `sourcemap` (boolean): 是否生成源映射（默认：`true`）。
    - `input` (string): 库的输入文件（默认：`'src/index.js'`）。
    - `outputDir` (string): 库的输出目录（默认：`'dist'`）。
    - `filenamePrefix` (string): 输出文件的前缀（默认：库名称的短横线形式）。
    - `useAliasPlugin`: 是否使用 `@rollup/plugin-alias` 插件。如果未指定此字段，其默认值为 `true`。
    - `aliasPluginOptions`: `@rollup/plugin-alias` 插件的选项。如果未指定此字段，其默认值为：
      ```js
      {
        entries: {
          'src': fileURLToPath(new URL('src', importMetaUrl)),
          '@': fileURLToPath(new URL('src', importMetaUrl)),
        },
      }
      ```
    - `useNodeResolvePlugin`: 是否使用 `@rollup/plugin-node-resolve` 插件。如果未指定此字段，其默认值为 `true`。
    - `nodeResolvePluginOptions`: `@rollup/plugin-node-resolve` 插件的选项。如果未指定此字段，其默认值为：`{}`。
    - `useCommonjsPlugin`: 是否使用 `@rollup/plugin-commonjs` 插件。如果未指定此字段，其默认值为 `true`。
    - `commonjsPluginOptions`: `@rollup/plugin-commonjs` 插件的选项。如果未指定此字段，其默认值为：
      ```js
      {
        include: ['node_modules/**'],
      }
      ```
    - `useBabelPlugin`: 是否使用 `@rollup/plugin-babel` 插件。如果未指定此字段，其默认值为 `true`。
    - `babelPluginOptions`: `@rollup/plugin-babel` 插件的选项。如果未指定此字段，其默认值为：
      ```js
      {
        babelHelpers: 'runtime',
        exclude: ['node_modules/**'],
        presets: [
          '@babel/preset-env',
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
        ],
      }
      ```
      请注意，如果使用 `@rollup/plugin-babel` 插件，你还可以在标准的 Babel 配置文件中指定 
      Babel 的配置，例如 `babel.config.js`、`.babelrc` 等。
    - `terserOptions`: `@rollup/plugin-terser` 插件的选项。如果未指定此字段，其默认值为：`{}`。
      是否使用 `@rollup/plugin-terser` 插件取决于选项的 `minify` 字段或 `NODE_ENV` 环境变量。
    - `useAnalyzerPlugin`: 是否使用 `rollup-plugin-analyzer` 插件。如果未指定此字段，其默认值为 `true`。
    - `analyzerOptions`: `rollup-plugin-analyzer` 插件的选项。如果未指定此字段，其默认值为：
      ```js
      {
        hideDeps: true,
        limit: 0,
        summaryOnly: true,
      }
      ```
    - `plugins`: 附加的 Rollup 插件。如果未指定此字段，其默认值为空数组。

## <span id="contributions">贡献</span>

欢迎贡献！如果您发现任何问题或有改进建议，请随时提出问题或创建拉取请求。

## <span id="license">许可证</span>

本项目根据 Apache 2.0 许可证进行许可。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。
