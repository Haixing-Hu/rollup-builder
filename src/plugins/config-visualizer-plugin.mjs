////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Configures the `rollup-plugin-visualizer` plugin.
 *
 * The `rollup-plugin-visualizer` will visualize and analyze your Rollup
 * bundle to see which modules are taking up space.
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
 * @see https://www.npmjs.com/package/rollup-plugin-visualizer
 */
function configVisualizerPlugin(format, importMetaUrl, options, plugins) {
  if (options.useVisualizerPlugin ?? true) {
    // The rollup-plugin-visualizer will visualize and analyze your Rollup
    // bundle to see which modules are taking up space.
    const pluginOptions = options.visualizerPluginOptions ?? {
      filename: `./doc/${options.filenameBase}.visualization.html`,
      gzipSize: true,
      brotliSize: true,
    };
    if (options.debug === true) {
      console.debug('[DEBUG] The rollup-plugin-visualizer plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(visualizer(pluginOptions));
  }
  return plugins;
}

export default configVisualizerPlugin;
