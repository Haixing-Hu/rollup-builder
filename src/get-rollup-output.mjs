////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

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
 * @author Haixing Hu
 */
function getRollupOutput(format, libraryName, options) {
  let filenameExt = '';
  switch (format) {
    case 'cjs':       // drop down
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
  const exports = options.exports ?? 'auto';
  return {
    name: libraryName,
    file: `${outputDir}/${filename}`,
    format,
    exports,
    sourcemap,
    compact: minify,
  };
}

export default getRollupOutput;
