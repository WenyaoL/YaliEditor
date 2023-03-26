const { acceleratorFromKeyEvent, normalizeKeyboardEvent, setKeyboardLayout } = require('./helpers')

/**
 * @typedef {import("./helpers").KeyEvent} KeyEvent
 */

/**
 * Test whether the given key event contains modifiers or a dead key only.
 *
 * @param {KeyEvent} keyEvent The key event to test for.
 * @returns {Boolean} True if the given accelerator contains modifiers only.
 */
const isBareModifier = keyEvent => {
  return !keyEvent.key || /^°|´|altgraph|capslock|dead|unidentified$/i.test(keyEvent.key)
}

/**
 * Test whether the given key event is a valid standalone key binding.
 *
 * @param {KeyEvent} keyEvent The key event to test for.
 * @returns True if the key event isn't a character (letter or digit).
 */
const isValidSingleKey = keyEvent => {
  return keyEvent.key && keyEvent.key.length > 1
}

/**
 * Whether the given key event is valid. A valid key binding must contains
 * at least one key that isn't a modifier or a character key (letter/digit).
 *
 * @param {KeyEvent} keyEvent The key event to test for.
 * @returns {Boolean} True if the given key event contains modifiers only.
 */
const isValidKeyBinding = keyEvent => {
  if (!keyEvent || isBareModifier(keyEvent)) {
    return false
  }
  const { ctrl, shift, alt, meta } = keyEvent
  return isValidSingleKey(keyEvent) || !!ctrl || !!shift || !!alt || !!meta
}

module.exports = {
  acceleratorFromKeyEvent,
  normalizeKeyboardEvent,
  setKeyboardLayout,
  isValidKeyBinding
}
