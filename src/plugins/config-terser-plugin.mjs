////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import terser from '@rollup/plugin-terser';

/**
 * Configures the `@rollup/plugin-terser` plugin.
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
 * @see https://www.npmjs.com/package/@rollup/plugin-terser
 */
function configTerserPlugin(format, importMetaUrl, options, plugins) {
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const minify = options.minify ?? (nodeEnv === 'production');
  if (minify) {
    // The @rollup/plugin-terser uses terser under the hood to minify the code.
    const pluginOptions = options.terserPluginOptions ?? {};
    if (options.debug === true) {
      console.debug('[DEBUG] The @rollup/plugin-terser plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(terser(pluginOptions));
  }
  return plugins;
}

export default configTerserPlugin;
