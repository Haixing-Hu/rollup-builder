////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import getRollupExternal from './get-rollup-external.mjs';
import getRollupOutput from './get-rollup-output.mjs';
import getRollupPlugins from './get-rollup-plugins.mjs';
import getRollupOnWarn from './get-rollup-on-warn.mjs';

/**
 * Builds the Rollup configuration for a library.
 *
 * The function could be provided with an additional options for building the
 * library. It can have the following fields:
 *
 * - `debug: boolean`: whether to print the debug information. If this field is
 *   not specified, the default value is `false`.
 * - `formats: [string]`: the array of formats of the library. It can be an
 *   array of the following values:
 *     - `'cjs'`: the CommonJS format.
 *     - `'umd'`: the UMD format.
 *     - `'esm'`: the ES module format.
 *
 *   If this field is not specified, the default value is `['cjs', 'esm']`.
 * - `exports: string`: the export mode to use. It can be one of the following
 *    values:
 *     - `'auto'`: automatically guesses your intentions based on what the input
 *       module exports.
 *     - `'default'`: if you are only exporting one thing using `export default ...`;
 *       note that this can cause issues when generating CommonJS output that is
 *       meant to be interchangeable with ESM output.
 *     - `'named'`: if you are using named exports.
 *     - `'none'`: if you are not exporting anything (e.g. you are building an
 *       app, not a library)
 *     - `'mixed'`: if you are using named exports mixed with a default export.
 *       Note that this is not a standard exports mode officially supported by
 *       the `rollup`, instead, it is an additional mode add by this library.
 *
 *   See [output.exports](https://rollupjs.org/configuration-options/#output-exports)
 *   for more details. If this field is not specified, the default value is
 *   `'auto'`.
 * - `nodeEnv: string`: the value of the `NODE_ENV` environment variable. If
 *   this field is not specified, the default value is `process.env.NODE_ENV`.
 * - `minify: boolean`: whether to minify the code. If this field is not
 *   specified, and the `nodeEnv` is `production`, the default value is `true`;
 *   otherwise the default value is `false`.
 * - `sourcemap: boolean`: whether to generate the source map. If this field is
 *   not specified, the default value is `true`.
 * - `input: string`: the input file of the library. If this field is not
 *   specified, the default value is `src/index.js`.
 * - `outputDir: string`: the output directory of the library. If this field is
 *   not specified, the default value is `dist`.
 * - `filenamePrefix: string`: the prefix of the output filename. If this field
 *   is not specified, the default value is the dash case of the library name.
 *   For example, if the library name is `MyLibrary`, the default value of this
 *   field is `my-library`.
 * - `externals: [string]`: the array of additional external packages, each can
 *   be specified with either a string or a regular expression. If this field is
 *   not specified, the default value is an empty array.
 * - `useAliasPlugin: boolean`: whether to use the `@rollup/plugin-alias` plugin.
 *   If this field is not specified, the default value is `true`.
 * - `aliasPluginOptions: object`: the options for the `@rollup/plugin-alias`
 *   plugin. If this field is not specified, the default value is:
 *   ```js
 *   {
 *     entries: {
 *       'src': fileURLToPath(new URL('src', importMetaUrl)),
 *     },
 *   }
 *   ```
 * - `useNodeResolvePlugin: boolean`: whether to use the `@rollup/plugin-node-resolve`
 *   plugin. If this field is not specified, the default value is `true`.
 * - `nodeResolvePluginOptions: object`: the options for the `@rollup/plugin-node-resolve`
 *   plugin. If this field is not specified, the default value is: `{}`.
 * - `useCommonjsPlugin: boolean`: whether to use the `@rollup/plugin-commonjs`
 *   plugin. If this field is not specified, the default value is `true`.
 * - `commonjsPluginOptions: object`: the options for the `@rollup/plugin-commonjs`
 *   plugin. If this field is not specified, the default value is:
 *   ```js
 *   {
 *     include: ['node_modules/**'],
 *   }
 *   ```
 * - `useBabelPlugin: boolean`: whether to use the `@rollup/plugin-babel` plugin.
 *   If this field is not specified, the default value is `true`.
 * - `babelPluginOptions: object`: the options for the `@rollup/plugin-babel`
 *   plugin. If this field is not specified, the default value is:
 *   ```js
 *   {
 *    babelHelpers: 'runtime',
 *     exclude: ['node_modules/**'],
 *     presets: [
 *       '@babel/preset-env',
 *     ],
 *     plugins: [
 *       '@babel/plugin-transform-runtime',
 *     ],
 *   }
 *   ```
 *   Note that when using the `@rollup/plugin-babel` plugin, you can also specify
 *   the configuration of Babel in the standard Babel configuration files,
 *   such as `babel.config.js`, `.babelrc`, etc.
 * - `terserOptions: object`: the options for the `@rollup/plugin-terser` plugin.
 *   If this field is not specified, the default value is: `{}`. Whether to use
 *   the `@rollup/plugin-terser` plugin depends on the `minify` field of the
 *   options or the `NODE_ENV` environment variable.
 * - `useAnalyzerPlugin: boolean`: whether to use the `rollup-plugin-analyzer`
 *   plugin. If this field is not specified, the default value is `true`.
 * - `analyzerOptions: object`: the options for the `rollup-plugin-analyzer`
 *   plugin. If this field is not specified, the default value is:
 *   ```js
 *   {
 *     hideDeps: true,
 *     limit: 0,
 *     summaryOnly: true,
 *   }
 *   ```
 * - `plugins: [object]`: the array of configuration of additional Rollup
 *    plugins. If this field is not specified, the default value is an empty
 *    array.
 *
 * @param {string} libraryName
 *     The name of the library, which will be used as the name of the global
 *     variable in the UMD format. It should in the camel case.
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module. It **MUST** be passed
 *     with the `import.meta.url` of the caller module.
 * @param {object} options
 *     The additional options for building the library, as described above.
 * @returns {Array<object>}
 *     the array of Rollup configurations for the library.
 */
function rollupBuilder(libraryName, importMetaUrl, options = {}) {
  const formats = options.formats ?? ['cjs', 'esm'];
  const result = [];
  const input = options.input ?? 'src/index.js';
  for (const format of formats) {
    const clonedOptions = { ...options };
    const output = getRollupOutput(format, libraryName, clonedOptions);
    const external = getRollupExternal(importMetaUrl, clonedOptions);
    const plugins = getRollupPlugins(format, importMetaUrl, clonedOptions);
    const onwarn = getRollupOnWarn();
    const config = { input, output, external, plugins, onwarn };
    result.push(config);
    if (options.debug === true) {
      console.debug(`[DEBUG] The options for the format ${format} is:`);
      console.dir(clonedOptions, { depth: null });
    }
  }
  if (options.debug === true) {
    console.debug('[DEBUG] The generated rollup configurations are:');
    console.dir(result, { depth: null });
  }
  return result;
}

export default rollupBuilder;
