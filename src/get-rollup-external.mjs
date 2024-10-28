////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { createRequire } from 'node:module';

/**
 * Gets Rollup `external` configuration.
 *
 * @param {string} importMetaUrl
 *     The URL of the `import.meta` of the caller module.
 * @param {object} options
 *     The additional options for building the library.
 * @returns {function}
 *     The predicate used as the Rollup `external` configuration for the library.
 * @author Haixing Hu
 */
function getRollupExternal(importMetaUrl, options) {
  if (!importMetaUrl) {
    throw new Error('importMetaUrl is required');
  }
  if (!options) {
    throw new Error('options is required');
  }
  // gets all peerDependencies packages from 'package.json' of the caller module
  const require = createRequire(importMetaUrl);
  const pkg = require('./package.json');
  const peers = [...Object.keys(pkg.peerDependencies || {})];
  if (!Array.isArray(peers)) {
    throw new Error('peerDependencies should be an array');
  }
  if (peers.length === 0) {
    return [];
  }
  const peerPattern = (peers ? new RegExp(`^(${peers.join('|')})($|/)`) : null);
  // gets the additional external packages from the user passed options
  const additions = options.externals ?? [];
  // save some configuration to the options object
  options.peers = peers;
  options.peerPattern = peerPattern;
  return (id) => {
    if (peerPattern && peerPattern.test(id)) {
      return true;
    }
    for (const pattern of additions) {
      if ((pattern instanceof RegExp) && pattern.test(id)) {
        return true;
      }
      if (((typeof pattern === 'string') || (pattern instanceof String)) && (pattern === id)) {
        return true;
      }
    }
    return false;
  };
}

export default getRollupExternal;
