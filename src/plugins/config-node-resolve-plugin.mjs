////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import nodeResolve from '@rollup/plugin-node-resolve';

/**
 * Configures the `@rollup/plugin-node-resolve` plugin.
 *
 * @param {string} format
 *     The format of the library.
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @param {Array<Object>} plugins
 *     The Rollup plugins array.
 * @returns {Array<Object>}
 *     The modified Rollup plugins array.
 * @author Haixing Hu
 * @see https://www.npmjs.com/package/@rollup/plugin-node-resolve
 */
function configNodeResolvePlugin(format, importMetaUrl, options, plugins) {
  if (options.useNodeResolvePlugin ?? true) {
    // The @rollup/plugin-node-resolve allows Rollup to resolve external
    // modules from node_modules:
    const pluginOptions = options.nodeResolvePluginOptions ?? {};
    if (options.debug === true) {
      console.debug('[DEBUG] The @rollup/plugin-node-resolve plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(nodeResolve(pluginOptions));
  }
  return plugins;
}

export default configNodeResolvePlugin;
