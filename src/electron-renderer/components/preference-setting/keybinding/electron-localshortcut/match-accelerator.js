// Source based on https://github.com/parro-it/keyboardevents-areequal
// The MIT License (MIT). Please see root LICENSE file for a copy of the license.
// Copyright (c) 2017 Andrea Parodi

'use strict';

/**
 * @typedef {import("./atom-keymap/helpers").KeyEvent} KeyEvent
 */

function _lower(key) {
  if (typeof key !== 'string') {
    return key;
  }
  return key.toLowerCase();
}

/**
 * Compares two internal key events and returns true if the key events are equal.
 *
 * @param {KeyEvent} event1
 * @param {KeyEvent} event2
 * @returns Whether the two key events are equal or not.
 */
function areEqual(event1, event2) {
  if (_lower(event1.key) !== _lower(event2.key)) {
    return false;
  }

  for (const modifier of ['ctrl', 'alt', 'shift', 'meta']) {
    const [value1, value2] = [event1[modifier], event2[modifier]];
    if (Boolean(value1) !== Boolean(value2)) {
      return false;
    }
  }
  return true;
}

module.exports = areEqual;
