const { isLinux, isOsx, isWindows } = require('./utils');

/**
 * Converts an Electron keyboard event into an `atom-keymap` compatible (DOM like) event.
 *
 * @param {Electron.Input} event The Electron event from `before-input-event`.
 * @param {boolean} isAltGrActive Whether `AltGr` is active/pressed.
 * @returns {KeyboardEvent} An `atom-keymap` compatible (DOM like) event.
 */
 const convertFromElectronInput = (event, isAltGrActive = false) => {
  const { key, code, control, alt, shift, meta, type } = event;
  const fakeModifierState = keyArg => {
    if (keyArg === 'AltGraph') {
      if (isWindows) {
        // Ctrl+Alt is an alias for AltGr on Windows.
        return !!isAltGrActive || (control && alt);
      } else if (isLinux) {
        return !!isAltGrActive;
      } else if (isOsx) {
        return alt; // Option
      }
    }
    // TODO: Read `NumLock` state from OS.
    return false;
  };
  return {
    key,
    code,
    ctrlKey: control,
    altKey: alt,
    shiftKey: shift,
    metaKey: meta,
    type: type.toLowerCase(),
    getModifierState: fakeModifierState
  };
};

/**
 * Tests whether the given DOM keyboard event is in composition.
 *
 * @param {KeyboardEvent} keyboardEvent
 * @returns {Boolean} Whether the given eventis in composition.
 */
const isCompositionEvent = keyboardEvent => {
  // See https://github.com/atom/atom-keymap/blob/1786fd23e0ed07ac6299f26c97f2387a4fb9ec6a/src/keymap-manager.coffee#L509.
  // When a keyboard event is part of IME composition, the keyCode is always
  // 229, which is the "composition key code". This API is deprecated, but this
  // is the most simple and reliable way we found to ignore keystrokes that are
  // part of IME compositions.
  return keyboardEvent.isComposing || (keyboardEvent.keyCode === 229 && keyboardEvent.key !== 'Dead');
};

/**
 * Tests whether the given Electron keyboard event is in composition.
 *
 * @param {Electron.Input} inputEvent
 * @returns {Boolean} Whether the given eventis in composition.
 */
const isCompositionEventForElectron = inputEvent => {
  // `isComposing` seems to be always false with composition keys.
  return inputEvent.isComposing ||
    // Works only on Linux. Windows sends the right key with code='Dead' during
    // composition and we cannot identify it, but translate the key event.
    (inputEvent.key === 'Unidentified' && inputEvent.code !== 'Dead' && inputEvent.code !== 'IntlRo');
};

module.exports = {
  convertFromElectronInput,
  isCompositionEvent,
  isCompositionEventForElectron
};
