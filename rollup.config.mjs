////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2023.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import rollupBuilder from './src/./index.mjs';

export default rollupBuilder('RollupBuilder', import.meta.url, {
  input: 'src/index.mjs',
  debug: true,
});
