////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////

function getRollupOnWarn() {
  return function onWarn(warning, warn) {
    // skip certain warnings
    if (warning.code === 'INVALID_ANNOTATION'
        && warning.message.includes('#__PURE__')
        && warning.message.includes('terser')) {
      return;
    }
    if (warning.code === 'CIRCULAR_DEPENDENCY'
        && warning.message.includes('node_modules')) {
      return;
    }
    // Use default for everything else
    warn(warning);
  };
}

export default getRollupOnWarn;
