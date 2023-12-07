////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import analyzer from 'rollup-plugin-analyzer';

/**
 * Configures the `rollup-plugin-analyzer` plugin.
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
 * @see https://www.npmjs.com/package/rollup-plugin-analyzer
 */
function configAnalyzerPlugin(format, importMetaUrl, options, plugins) {
  if (options.useAnalyzerPlugin ?? true) {
    // The rollup-plugin-analyzer will print out some useful info about our
    // generated bundle upon successful builds.
    const pluginOptions = options.analyzerPluginOptions ?? {
      hideDeps: true,
      limit: 0,
      summaryOnly: true,
    };
    if (options.debug === true) {
      console.debug('[DEBUG] The rollup-plugin-analyzer plugin options are:');
      console.dir(pluginOptions, { depth: null });
    }
    plugins.push(analyzer(pluginOptions));
  }
  return plugins;
}

export default configAnalyzerPlugin;
