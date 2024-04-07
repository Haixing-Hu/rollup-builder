////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import json from '@rollup/plugin-json';
import configAliasPlugin from './plugins/config-alias-plugin.mjs';
import configNodeResolvePlugin from './plugins/config-node-resolve-plugin.mjs';
import configCommonJsPlugin from './plugins/config-common-js-plugin.mjs';
import configBabelPlugin from './plugins/config-babel-plugin.mjs';
import configTerserPlugin from './plugins/config-terser-plugin.mjs';
import configAnalyzerPlugin from './plugins/config-analyzer-plugin.mjs';
import configVisualizerPlugin from './plugins/config-visualizer-plugin.mjs';

/**
 * Gets Rollup `plugins` configuration.
 *
 * @param {string} format
 *     The format of the library.
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @returns {Array<Object>}
 *     The Rollup plugins array.
 * @author Haixing Hu
 */
function getRollupPlugins(format, importMetaUrl, options) {
  const plugins = [];
  plugins.push(json());
  configAliasPlugin(format, importMetaUrl, options, plugins);
  configNodeResolvePlugin(format, importMetaUrl, options, plugins);
  configCommonJsPlugin(format, importMetaUrl, options, plugins);
  configBabelPlugin(format, importMetaUrl, options, plugins);
  configTerserPlugin(format, importMetaUrl, options, plugins);
  configAnalyzerPlugin(format, importMetaUrl, options, plugins);
  configVisualizerPlugin(format, importMetaUrl, options, plugins);
  // The user can specify additional plugins.
  if (options.plugins) {
    plugins.push(...options.plugins);
  }
  return plugins;
}

export default getRollupPlugins;
