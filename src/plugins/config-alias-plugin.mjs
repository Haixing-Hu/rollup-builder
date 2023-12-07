////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { fileURLToPath } from 'node:url';
import alias from '@rollup/plugin-alias';

/**
 * Configures the `@rollup/plugin-alias` plugin.
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
 * @see https://www.npmjs.com/package/@rollup/plugin-alias
 */
function configAliasPlugin(format, importMetaUrl, options, plugins) {
  if (options.useAliasPlugin ?? true) {
    // The @rollup/plugin-alias enables us to use absolute import paths for
    // "src" (or any other path you want to configure).
    const pluginOptions = options.aliasPluginOptions ?? {
      entries: {
        'src': fileURLToPath(new URL('src', importMetaUrl)),
      },
    };
    if (options.debug === true) {
      console.debug('[DEBUG] The @rollup/plugin-alias plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(alias(pluginOptions));
  }
  return plugins;
}

export default configAliasPlugin;
