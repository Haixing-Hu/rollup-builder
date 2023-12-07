////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import babel from '@rollup/plugin-babel';

/**
 * Configures the `@rollup/plugin-babel` plugin.
 *
 * @param {string} format
 *     The format of the library.
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @param {Array} plugins
 *     The array of Rollup plugins.
 * @returns {Array<Object>}
 *     The modified Rollup plugins array.
 * @author Haixing Hu
 * @see https://www.npmjs.com/package/@rollup/plugin-babel
 */
function configBabelPlugin(format, importMetaUrl, options, plugins) {
  if (options.useBabelPlugin ?? true) {
    const pluginOptions = options.babelPluginOptions ?? {
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
      presets: [
        // The @babel/preset-env preset enables Babel to transpile ES6+ code
        // and the rollup requires that Babel keeps ES6 module syntax intact.
        ['@babel/preset-env', { modules: false }],
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    };
    if (options.debug === true) {
      console.debug('[DEBUG] The @rollup/plugin-babel plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(babel(pluginOptions));
  }
  return plugins;
}

export default configBabelPlugin;
