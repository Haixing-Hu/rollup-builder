# Rollup Builder

[![npm package](https://img.shields.io/npm/v/@haixing_hu/rollup-builder.svg)](https://npmjs.com/package/@haixing_hu/rollup-builder)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![中文文档](https://img.shields.io/badge/文档-中文版-blue.svg)](README.zh_CN.md)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/Haixing-Hu/rollup-builder/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/Haixing-Hu/rollup-builder/tree/master)

`rollup-builder` provides a utility function to simplify the process of building 
JavaScript libraries using the Rollup bundler. It allows you to generate various 
formats such as CommonJS (CJS), ES Module (ESM), and Universal Module Definition
(UMD), and gives you the option to choose whether to perform code minification.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration Options](#configuration)
- [Contributions](#contributions)
- [License](#license)

## <span id="features">Features</span>

- Build JavaScript libraries in multiple formats, making them compatible with a 
  variety of environments.
- Minify your library for production use with ease.
- Automatic generation of sourcemaps for debugging.
- Configure the library's format, filename, and more using simple options.
- Highly customizable using Rollup plugins and custom configurations.

## <span id="installation">Installation</span>

You can install `rollup-builder` as a development dependency using `npm` or `yarn`:

```bash
npm install @haixing_hu/rollup-builder --save-dev
# or
yarn add @haixing_hu/rollup-builder --dev
```

## <span id="usage">Usage</span>

1. Create a Rollup configuration file (usually named `rollup.config.mjs`) and 
   export a function that defines the library's build options. You can use the 
   provided `rollupBuilder` function to streamline this process.

   Example `rollup.config.mjs`:

   ```javascript
   import rollupBuilder from '@haixing_hu/rollup-builder';

   export default rollupBuilder('MyLibrary', import.meta.url);
   ```

2. Customize the `rollup.config.mjs` file to match your library's specific 
   requirements. You can specify the input file, formats, filename prefix, and 
   other options. Refer to the [Configuration Options](#configuration) section
   for more details.

   Example `rollup.config.mjs`:
    
   ```javascript
   import rollupBuilder from '@haixing_hu/rollup-builder';
    
   export default rollupBuilder('MyLibrary', import.meta.url, {
     formats: ['cjs', 'esm'],
     minify: true,
     // Customize additional options as needed.
   });
   ```

3. Run the Rollup build process using the following command:

   ```bash
   rollup -c rollup.config.mjs
   ```

4. The resulting library files will be placed in the `dist` directory, following 
   the format you specified. For example, if you specified `formats: ['cjs', 'esm']`,
   the following files will be generated:
   ```bash
    dist/my-library.cjs.js
    dist/my-library.cjs.min.js
    dist/my-library.esm.mjs
    dist/my-library.esm.min.mjs
   ```
   
5. You should modify your `package.json` file to specify the entry point of your
   library. For example, if you specified `formats: ['cjs', 'esm']`, you should
   add the following lines to your `package.json` file:
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
6. You should add the following dev dependencies to your library:
   ```bash
   yarn add --dev @babel/core @babel/plugin-transform-runtime @babel/preset-env \
     @rollup/plugin-alias @rollup/plugin-babel @rollup/plugin-commonjs \
     @rollup/plugin-node-resolve @rollup/plugin-terser rollup rollup-plugin-analyzer
   ```
   or 
   ```bash
   npm install -D @babel/core @babel/plugin-transform-runtime @babel/preset-env \
     @rollup/plugin-alias @rollup/plugin-babel @rollup/plugin-commonjs \
     @rollup/plugin-node-resolve @rollup/plugin-terser rollup rollup-plugin-analyzer
   ```

## <span id="configuration">Configuration Options</span>

- `libraryName` (string): The name of your library (used in the UMD format).
- `importMetaUrl` (string): The `import.meta.url` of the caller module.
- `options` (object): Additional build options, including:
    - `formats` (\[string\]): An array of formats to build. If this field is not
      specified, the default value is `['cjs', 'esm']`.
    - `nodeEnv` (string): The `NODE_ENV` environment variable. If this field is 
      not specified, the default value is `process.env.NODE_ENV`.
    - `minify` (boolean): Whether to minify the code. If this field is not 
      specified, the default value will be `true` for production environment, 
      and `false` otherwise.
    - `sourcemap` (boolean): Whether to generate sourcemaps. If this field is not
      specified, the default value is `true`.
    - `input` (string): The input file of the library. If this field is not
      specified, the default value is `src/index.js`.
    - `outputDir` (string): The output directory of the library. If this field 
      is not specified, the default value is `dist`.
    - `filenamePrefix` (string): The prefix for the output filename. If this 
      field is not specified, the default value the dash-case of the library 
      name.
    - `externals` (\[string\]): the additional external packages, each can be 
      specified with either a string or a regular expression. If this field is
      not specified, the default value is an empty array.
    - `useAliasPlugin` (boolean): whether to use the `@rollup/plugin-alias` 
      plugin. If this field is not specified, the default value is `true`.
    - `aliasPluginOptions` (object): the options for the `@rollup/plugin-alias` 
      plugin. If this field is not specified, the default value is:
      ```js
      {
        entries: {
          'src': fileURLToPath(new URL('src', importMetaUrl)),
        },
      }
      ```
    - `useNodeResolvePlugin` (boolean): whether to use the `@rollup/plugin-node-resolve`
      plugin. If this field is not specified, the default value is `true`.
    - `nodeResolvePluginOptions` (object): the options for the `@rollup/plugin-node-resolve`
      plugin. If this field is not specified, the default value is: `{}`.
    - `useCommonjsPlugin` (boolean): whether to use the `@rollup/plugin-commonjs` plugin.
      If this field is not specified, the default value is `true`.
    - `commonjsPluginOptions` (object): the options for the `@rollup/plugin-commonjs`
      plugin. If this field is not specified, the default value is:
      ```js
      {
        include: ['node_modules/**'],
      }
      ```
    - `useBabelPlugin` (boolean): whether to use the `@rollup/plugin-babel` plugin.
      If this field is not specified, the default value is `true`.
    - `babelPluginOptions` (object): the options for the `@rollup/plugin-babel` plugin.
      If this field is not specified, the default value is:
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
      Note that if use the `@rollup/plugin-babel` plugin, you can also specify
      the configuration of Babel in the standard Babel configuration files,
      such as `babel.config.js`, `.babelrc`, etc.
    - `terserOptions` (object): the options for the `@rollup/plugin-terser` plugin.
      If this field is not specified, the default value is: `{}`. Whether
      to use the `@rollup/plugin-terser` plugin depends on the `minify`
      field of the options or the `NODE_ENV` environment variable.
    - `useAnalyzerPlugin` (boolean): whether to use the `rollup-plugin-analyzer` plugin.
      If this field is not specified, the default value is `true`.
    - `analyzerOptions` (object): the options for the `rollup-plugin-analyzer` plugin.
      If this field is not specified, the default value is:
      ```js
      {
        hideDeps: true,
        limit: 0,
        summaryOnly: true,
      }
      ```
    - `plugins` (\[object\]): the additional Rollup plugins. If this field is not
      specified, the default value is an empty array.

## <span id="contributions">Contributions</span>

Contributions are welcome! If you find any issues or have suggestions for
improvements, please feel free to open an issue or create a pull request.

## <span id="license">License</span>

This project is licensed under the Apache 2.0 License. 
See the [LICENSE](LICENSE) file for details.
