// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { DecodeFunc, DecodeOutput } from './types';

const assert = require('@polkadot/util/assert');

const safeParseInt = require('./safeParseInt');

module.exports = function decodeListLong (decode: DecodeFunc, input: Uint8Array): DecodeOutput {
  const llength = input[0] - 0xf6;
  const length = safeParseInt(input.slice(1, llength));
  const totalLength = llength + length;
  const decoded = [];

  assert(totalLength <= input.length, 'invalid rlp: total length is larger than the data');

  let innerRemainder = input.slice(llength, totalLength);

  assert(innerRemainder.length > 0, 'invalid rlp, List has a invalid length');

  while (innerRemainder.length) {
    const d = decode(innerRemainder);

    decoded.push(d.decoded);
    innerRemainder = d.remainder;
  }

  return {
    decoded,
    remainder: input.slice(totalLength)
  };
};
