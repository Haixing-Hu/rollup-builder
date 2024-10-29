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
  let footer = '';
  let exports = options.exports ?? 'auto';
  switch (format) {
    case 'cjs':       // drop down
    case 'amd':       // drop down
    case 'umd':       // drop down
    case 'iife':
      filenameExt = (format === 'cjs' ? '.cjs' : `.${format}.js`);
      // The following workaround is to solve the following issue: If an ESM
      // module has both default export and named exports, the rollup cannot
      // handle it correctly. For example, the following is a source ESM module:
      // ```js
      // export { Foo, Bar };
      // export default Foo;
      // ```
      // The rollup will translate it into the following codes:
      // ```js
      // exports.Foo = Foo;
      // exports.Bar = Bar;
      // exports.default = Foo;
      // ```
      // However, a common-js consumer will use the module as follows:
      // ```js
      // const Foo = require('my-module');
      // ```
      // which will cause an error. The correct usage should be
      // ```js
      // const Foo = require('my-module').default
      // ```
      // But unfortunately, the rollup will translate the ESM default import as
      // follows:
      // ```js
      // import Foo from 'my-module';
      // ```
      // will be translated by rollup to
      // ```js
      // const Foo = require('my-module');
      // ```
      // Note that the above translation has no `.default` suffix, which will
      // cause an error.
      //
      // The workaround is copied from the source code of the official rollup
      // plugins:
      // https://github.com/rollup/plugins/blob/master/shared/rollup.config.mjs
      //
      // It adds a simple footer statements to each `CJS` format bundle:
      // ```js
      // module.exports = Object.assign(exports.default, exports);
      // ```
      //
      // See:
      // [1] https://rollupjs.org/configuration-options/#output-exports
      // [2] https://github.com/rollup/rollup/issues/1961
      // [3] https://stackoverflow.com/questions/58246998/mixing-default-and-named-exports-with-rollup
      // [4] https://github.com/avisek/rollup-patch-seamless-default-export
      // [5] https://github.com/rollup/plugins/blob/master/shared/rollup.config.mjs
      //
      if (exports === 'mixed') {
        exports = 'named';
        footer = 'module.exports = Object.assign(exports.default, exports);';
      }
      break;
    case 'es':        // drop down
    case 'esm':       // drop down
    case 'module':
      format = 'es';
      filenameExt = '.mjs';
      // fix the exports, because the ESM format does not support the 'mixed' exports mode
      if (exports === 'mixed') {
        exports = 'auto';
      }
      break;
    default:
      throw new Error(`Unsupported library format: ${format}`);
  }
  const nodeEnv = options.nodeEnv ?? process.env.NODE_ENV;
  const minify = options.minify ?? (nodeEnv === 'production');
  const camelCaseToDashCase = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  const filenamePrefix = options.filenamePrefix ?? camelCaseToDashCase(libraryName);
  const filenameBase = `${filenamePrefix}${minify ? '.min' : ''}`;
  const filename = `${filenameBase}${filenameExt}`;
  const outputDir = options.outputDir ?? 'dist';
  const sourcemap = options.sourcemap ?? true;
  // save some configuration to the options object
  options.format = format;
  options.name = libraryName;
  options.minify = minify;
  options.filenamePrefix = filenamePrefix;
  options.filenameBase = filenameBase;
  options.filenameExt = filenameExt;
  options.filename = filename;
  options.exports = exports;
  options.sourcemap = sourcemap;
  options.outputDir = outputDir;
  return {
    name: libraryName,
    file: `${outputDir}/${filename}`,
    format,
    exports,
    footer,
    sourcemap,
    compact: minify,
  };
}

export default getRollupOutput;
