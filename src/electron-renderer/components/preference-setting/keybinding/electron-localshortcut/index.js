'use strict';

const { isValidElectronAccelerator } = require('./convert-accelerator');
const electronLocalshortcut = require('./electron-localshortcut');
const { isCompositionEvent } = require('./event-helper');
const {
  acceleratorFromKeyEvent,
  normalizeKeyboardEvent,
  setKeyboardLayout,
  isValidKeyBinding
} = require('./atom-keymap');

/**
 * A normalized Electron accelerator or key.
 *
 * @typedef {Object} KeyBinding
 * @property {string} accelerator The normalized Electron accelerator.
 * @property {boolean} isValid Whether `accelerator` is a valid Electron accelerator.
 */

/**
 * Returns a normalized accelerator from the given keyboard event with additional information.
 *
 * @param {KeyboardEvent} keyboardEvent The DOM like keyboard event.
 * @returns {KeyBinding} The normalized accelerator or key.
 */
const getAcceleratorFromKeyboardEvent = keyboardEvent => {
  const keyEvent = normalizeKeyboardEvent(keyboardEvent);
  const accelerator = acceleratorFromKeyEvent(keyEvent);
  const isValid = isValidKeyBinding(keyEvent);
  return { accelerator, isValid };
};

module.exports = {
  // User API (Electron Main)
  electronLocalshortcut,
  isValidElectronAccelerator,

  // Expert APIs to map DOM keyboard events in browser
  isCompositionEvent,
  getAcceleratorFromKeyboardEvent,
  setKeyboardLayout
};
