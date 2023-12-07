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

/**
 * Builds the Rollup configuration for a library.
 *
 * The function could be provided with an additional options for building the
 * library. It can have the following fields:
 *
 * - `debug`: whether to print the debug information. If this field is not
 *   specified, the default value is `false`.
 * - `formats`: the formats of the library. It can be an array of the
 *   following values:
 *     - `'cjs'`: the CommonJS format.
 *     - `'umd'`: the UMD format.
 *     - `'esm'`: the ES module format.
 *
 *   If this field is not specified, the default value is `['cjs', 'esm']`.
 * - `nodeEnv`: the value of the `NODE_ENV` environment variable. If this field
 *   is not specified, the default value is `process.env.NODE_ENV`.
 * - `minify`: whether to minify the code. If this field is not specified, the
 *   default value is `true` if `nodeEnv` is `production`, otherwise the default
 *   value is `false`.
 * - `sourcemap`: whether to generate the source map. If this field is not
 *   specified, the default value is `true`.
 * - `input`: the input file of the library. If this field is not specified,
 *   the default value is `src/index.js`.
 * - `outputDir`: the output directory of the library. If this field is not
 *   specified, the default value is `dist`.
 * - `filenamePrefix`: the prefix of the output filename. If this field is not
 *   specified, the default value is the dash case of the library name. For
 *   example, if the library name is `MyLibrary`, the default value of this
 *   field is `my-library`.
 * - `externals`: the additional external packages, each can be specified with
 *   either a string or a regular expression. If this field is not specified,
 *   the default value is an empty array.
 * - `useAliasPlugin`: whether to use the `@rollup/plugin-alias` plugin. If this
 *   field is not specified, the default value is `true`.
 * - `aliasPluginOptions`: the options for the `@rollup/plugin-alias` plugin.
 *   If this field is not specified, the default value is:
 *   ```js
 *   {
 *     entries: {
 *       'src': fileURLToPath(new URL('src', importMetaUrl)),
 *     },
 *   }
 *   ```
 * - `useNodeResolvePlugin`: whether to use the `@rollup/plugin-node-resolve`
 *   plugin. If this field is not specified, the default value is `true`.
 * - `nodeResolvePluginOptions`: the options for the `@rollup/plugin-node-resolve`
 *   plugin. If this field is not specified, the default value is: `{}`.
 * - `useCommonjsPlugin`: whether to use the `@rollup/plugin-commonjs` plugin.
 *   If this field is not specified, the default value is `true`.
 * - `commonjsPluginOptions`: the options for the `@rollup/plugin-commonjs`
 *   plugin. If this field is not specified, the default value is:
 *   ```js
 *   {
 *     include: ['node_modules/**'],
 *   }
 *   ```
 * - `useBabelPlugin`: whether to use the `@rollup/plugin-babel` plugin.
 *   If this field is not specified, the default value is `true`.
 * - `babelPluginOptions`: the options for the `@rollup/plugin-babel` plugin.
 *   If this field is not specified, the default value is:
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
 *
 *   Note that when using the `@rollup/plugin-babel` plugin, you can also specify
 *   the configuration of Babel in the standard Babel configuration files,
 *   such as `babel.config.js`, `.babelrc`, etc.
 * - `terserOptions`: the options for the `@rollup/plugin-terser` plugin. If
 *   this field is not specified, the default value is: `{}`. Whether to use the
 *   `@rollup/plugin-terser` plugin depends on the `minify` field of the options
 *   or the `NODE_ENV` environment variable.
 * - `useAnalyzerPlugin`: whether to use the `rollup-plugin-analyzer` plugin. If
 *   this field is not specified, the default value is `true`.
 * - `analyzerOptions`: the options for the `rollup-plugin-analyzer` plugin. If
 *   this field is not specified, the default value is:
 *   ```js
 *   {
 *     hideDeps: true,
 *     limit: 0,
 *     summaryOnly: true,
 *   }
 *   ```
 * - `plugins`: the array of configuration of additional Rollup plugins. If this
 *   field is not specified, the default value is an empty array.
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
    const output = getRollupOutput(format, libraryName, options);
    const external = getRollupExternal(importMetaUrl, options);
    const plugins = getRollupPlugins(format, importMetaUrl, options);
    const config = { input, output, external, plugins };
    // console.dir(config, { depth: null });
    result.push(config);
  }
  if (options.debug === true) {
    console.debug('[DEBUG] The rollup configurations are:');
    console.dir(result, { depth: null });
  }
  return result;
}

export default rollupBuilder;
