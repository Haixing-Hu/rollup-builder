////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import commonjs from '@rollup/plugin-commonjs';

/**
 * Configures the `@rollup/plugin-commonjs` plugin.
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
 * @see https://www.npmjs.com/package/@rollup/plugin-commonjs
 */
function configCommonJsPlugin(format, importMetaUrl, options, plugins) {
  if (options.useCommonjsPlugin ?? true) {
    // The @rollup/plugin-commonjs plugin converts 3rd-party CommonJS modules
    // into ES6 code, so that they can be included in our Rollup bundle.
    // When using @rollup/plugin-babel with @rollup/plugin-commonjs in the
    // same Rollup configuration, it's important to note that
    // @rollup/plugin-commonjs must be placed before this plugin in the
    // plugins array for the two to work together properly.
    const pluginOptions = options.commonjsPluginOptions ?? {
      include: ['node_modules/**'],
    };
    if (options.debug === true) {
      console.debug('[DEBUG] The @rollup/plugin-commonjs plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(commonjs(pluginOptions));
  }
  return plugins;
}

export default configCommonJsPlugin;
