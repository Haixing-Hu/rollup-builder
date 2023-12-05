////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import analyzer from 'rollup-plugin-analyzer';

/**
 * Gets the Rollup `output` configuration.
 *
 * @param {string} format
 *     The format of the library.
 * @param {string} libraryName
 *     The name of the library.
 * @param {object} options
 *     The additional options for building the library.
 * @returns {object}
 *     The Rollup output configuration for the library.
 * @private
 */
function getRollupOutput(format, libraryName, options) {
  let filenameExt = '';
  switch (format) {
    case 'cjs': // drop down
    case 'umd':
      filenameExt = '.js';
      break;
    case 'esm':
      filenameExt = '.mjs';
      break;
    default:
      throw new Error(`Unsupported library format: ${format}`);
  }
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const minify = options.minify ?? (nodeEnv === 'production');
  const camelCaseToDashCase = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const filenamePrefix = options.filenamePrefix ?? camelCaseToDashCase(libraryName);
  const filename = `${filenamePrefix}.${format}${minify ? '.min' : ''}${filenameExt}`;
  const outputDir = options.outputDir ?? 'dist';
  const sourcemap = options.sourcemap ?? true;
  return {
    name: libraryName,
    file: `${outputDir}/${filename}`,
    format,
    sourcemap,
    compact: minify,
  };
}

/**
 * Gets Rollup `external` configuration.
 *
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @returns {function}
 *     The predicate used as the Rollup `external` configuration for the library.
 * @private
 */
function getRollupExternal(importMetaUrl, options) {
  // gets all peerDependencies packages from 'package.json' of the caller module
  const require = createRequire(importMetaUrl);
  const pkg = require('./package.json');
  const peers = [...Object.keys(pkg.peerDependencies || {})];
  const peerPattern = (peers ? new RegExp(`^(${peers.join('|')})($|/)`) : null);
  // gets the additional external packages from the user passed options
  const additions = options.externals ?? [];
  return (id) => {
    if (peerPattern && peerPattern.test(id)) {
      return true;
    }
    for (const pattern of additions) {
      if ((pattern instanceof RegExp) && pattern.test(id)) {
        return true;
      }
      if ((pattern instanceof String) && (pattern === id)) {
        return true;
      }
    }
    return false;
  };
}

/**
 * Gets Rollup `plugins` configuration.
 *
 * @param {string} format
 *     The format of the library.
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @returns {function}
 *     The predicate used as the Rollup `external` configuration for the library.
 * @private
 */
function getRollupPlugins(format, importMetaUrl, options) {
  const plugins = [];
  if (options.useAliasPlugin ?? true) {
    // The @rollup/plugin-alias enables us to use absolute import paths for
    // "src" (or any other path you want to configure).
    plugins.push(alias(options.aliasPluginOptions ?? {
      entries: {
        'src': fileURLToPath(new URL('src', importMetaUrl)),
      },
    }));
  }
  if (options.useNodeResolvePlugin ?? true) {
    // The @rollup/plugin-node-resolve allows Rollup to resolve external
    // modules from node_modules:
    plugins.push(nodeResolve(options.nodeResolvePluginOptions ?? {}));
  }
  if (options.useCommonjsPlugin ?? true) {
    // The @rollup/plugin-commonjs plugin converts 3rd-party CommonJS modules
    // into ES6 code, so that they can be included in our Rollup bundle.
    // When using @rollup/plugin-babel with @rollup/plugin-commonjs in the
    // same Rollup configuration, it's important to note that
    // @rollup/plugin-commonjs must be placed before this plugin in the
    // plugins array for the two to work together properly.
    plugins.push(commonjs(options.commonjsPluginOptions ?? {
      include: ['node_modules/**'],
    }));
  }
  if (options.useBabelPlugin ?? true) {
    // let babelModules = '';
    // switch (format) {
    //   case 'cjs':   // drop down
    //   case 'umd':
    //     babelModules = format;
    //     break;
    //   case 'esm':
    //     babelModules = false;
    //     break;
    //   default:
    //     throw new Error(`Unsupported library format: ${format}`);
    // }
    // The @rollup/plugin-babel enables Babel for code transpilation
    plugins.push(babel(options.babelPluginOptions ?? {
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
      presets: [
        // ['@babel/preset-env', { modules: babelModules }],
        '@babel/preset-env',
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    }));
  }
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const minify = options.minify ?? (nodeEnv === 'production');
  if (minify) {
    // The @rollup/plugin-terser uses terser under the hood to minify the code.
    plugins.push(terser(options.terserPluginOptions ?? {}));
  }
  if (options.useAnalyzerPlugin ?? true) {
    // The rollup-plugin-analyzer will print out some useful info about our
    // generated bundle upon successful builds.
    plugins.push(analyzer(options.analyzerPluginOptions ?? {
      hideDeps: true,
      limit: 0,
      summaryOnly: true,
    }));
  }
  // The user can specify additional plugins.
  if (options.plugins) {
    plugins.push(...options.plugins);
  }
  return plugins;
}

/**
 * Builds the Rollup configuration for a library.
 *
 * @param {string} libraryName
 *     The name of the library, which will be used as the name of the global
 *     variable in the UMD format. It should in the camel case.
 * @param {string} importMetaUrl
 *     The URL of the import.meta of the caller module. It **MUST** be passed
 *     with the `import.meta.url` of the caller module.
 * @param {object} options
 *     The additional options for building the library. It can have the
 *     following fields:
 *
 *     - formats: the formats of the library. It can be an array of the
 *       following values:
 *       - 'cjs': the CommonJS format.
 *       - 'umd': the UMD format.
 *       - 'esm': the ES module format.
 *       If this field is not specified, the default value is ['cjs', 'esm'].
 *     - `nodeEnv`: the value of the `NODE_ENV` environment variable. If this
 *       field is not specified, the default value is `process.env.NODE_ENV`.
 *     - `minify`: whether to minify the code. If this field is not specified,
 *       the default value is `true` if `nodeEnv` is `production`, otherwise
 *       the default value is `false`.
 *     - `sourcemap`: whether to generate the source map. If this field is not
 *       specified, the default value is `true`.
 *     - `input`: the input file of the library. If this field is not specified,
 *       the default value is `src/index.js`.
 *     - `outputDir`: the output directory of the library. If this field is not
 *       specified, the default value is `dist`.
 *     - `filenamePrefix`: the prefix of the output filename. If this field is
 *       not specified, the default value is the dash case of the library name.
 *       For example, if the library name is `MyLibrary`, the default value of
 *       this field is `my-library`.
 *     - `externals`: the additional external packages, each can be specified
 *       with either a string or a regular expression. If this field is not
 *       specified, the default value is an empty array.
 *     - `useAliasPlugin`: whether to use the `@rollup/plugin-alias` plugin. If
 *       this field is not specified, the default value is `true`.
 *     - `aliasPluginOptions`: the options for the `@rollup/plugin-alias` plugin.
 *       If this field is not specified, the default value is:
 *       ```js
 *       {
 *         entries: {
 *           'src': fileURLToPath(new URL('src', importMetaUrl)),
 *         },
 *       }
 *       ```
 *     - `useNodeResolvePlugin`: whether to use the `@rollup/plugin-node-resolve`
 *       plugin. If this field is not specified, the default value is `true`.
 *     - `nodeResolvePluginOptions`: the options for the `@rollup/plugin-node-resolve`
 *       plugin. If this field is not specified, the default value is: `{}`.
 *     - `useCommonjsPlugin`: whether to use the `@rollup/plugin-commonjs` plugin.
 *       If this field is not specified, the default value is `true`.
 *     - `commonjsPluginOptions`: the options for the `@rollup/plugin-commonjs`
 *       plugin. If this field is not specified, the default value is:
 *       ```js
 *       {
 *         include: ['node_modules/**'],
 *       }
 *       ```
 *     - `useBabelPlugin`: whether to use the `@rollup/plugin-babel` plugin.
 *       If this field is not specified, the default value is `true`.
 *     - `babelPluginOptions`: the options for the `@rollup/plugin-babel` plugin.
 *       If this field is not specified, the default value is:
 *       ```js
 *       {
 *         babelHelpers: 'runtime',
 *         exclude: ['node_modules/**'],
 *         presets: [
 *           '@babel/preset-env',
 *         ],
 *         plugins: [
 *           '@babel/plugin-transform-runtime',
 *         ],
 *       }
 *       ```
 *       Note that if use the `@rollup/plugin-babel` plugin, you can also specify
 *       the configuration of Babel in the standard Babel configuration files,
 *       such as `babel.config.js`, `.babelrc`, etc.
 *     - `terserOptions`: the options for the `@rollup/plugin-terser` plugin.
 *       If this field is not specified, the default value is: `{}`. Whether
 *       to use the `@rollup/plugin-terser` plugin depends on the `minify`
 *       field of the options or the `NODE_ENV` environment variable.
 *     - `useAnalyzerPlugin`: whether to use the `rollup-plugin-analyzer` plugin.
 *       If this field is not specified, the default value is `true`.
 *     - `analyzerOptions`: the options for the `rollup-plugin-analyzer` plugin.
 *       If this field is not specified, the default value is:
 *       ```js
 *       {
 *         hideDeps: true,
 *         limit: 0,
 *         summaryOnly: true,
 *       }
 *       ```
 *     - `plugins`: the additional Rollup plugins. If this field is not
 *       specified, the default value is an empty array.
 * @returns {Array<object>}
 *     the Rollup configurations for the library.
 */
function rollupBuilder(libraryName, importMetaUrl, options = {}) {
  const formats = options.formats ?? ['cjs', 'esm'];
  const result = [];
  const input = options.input ?? 'src/index.js';
  for (const format of formats) {
    const output = getRollupOutput(format, libraryName, options);
    const external = getRollupExternal(importMetaUrl, options);
    const plugins = getRollupPlugins(format, importMetaUrl, options);
    result.push({ input, output, external, plugins });
  }
  return result;
}

export default rollupBuilder;
