// Source based on https://github.com/parro-it/keyboardevent-from-electron-accelerator
// The MIT License (MIT). Please see root LICENSE file for a copy of the license.
// Copyright (c) 2017 Andrea Parodi

'use strict';

const { isOsx } = require('./utils');

const MODIFIERS = /^(CommandOrControl|CmdOrCtrl|Command|Cmd|Control|Ctrl|AltGr|Option|Alt|Shift|Super)$/i;
const KEY_CODES = /^(Num[0-9]|Plus|Space|Tab|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp|PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen|F24|F23|F22|F21|F20|F19|F18|F17|F16|F15|F14|F13|F12|F11|F10|F9|F8|F7|F6|F5|F4|F3|F2|F1|[0-9A-Z)!@#$%^&*(:+<_>?~{|}";=,\-./`[\\\]'])$/i;

/**
 * @typedef {import("../atom-keymap/helpers").KeyEvent} KeyEvent
 */

function _command(keyEvent) {
  if (!isOsx) {
    throw new Error('Modifier `Command` is only supported on macOS.');
  }

  if (keyEvent.meta) {
    throw new Error('Double `Command` modifier specified.');
  }
  keyEvent.meta = true;
}

function _super(keyEvent) {
  if (keyEvent.meta) {
    throw new Error('Double `Super` modifier specified.');
  }
  keyEvent.meta = true;
}

function _commandorcontrol(keyEvent) {
  if (isOsx) {
    if (keyEvent.meta) {
      throw new Error('Double `Command` modifier specified.');
    }
    keyEvent.meta = true;
    return;
  }

  if (keyEvent.ctrl) {
    throw new Error('Double `Control` modifier specified.');
  }
  keyEvent.ctrl = true;
}

function _alt(keyEvent, modifier) {
  if (modifier === 'option' && !isOsx) {
    throw new Error('Modifier `Option` is only supported on macOS.');
  }

  if (keyEvent.alt) {
    throw new Error('Double `Alt` modifier specified.');
  }
  keyEvent.alt = true;
}

function _shift(keyEvent) {
  if (keyEvent.shift) {
    throw new Error('Double `Shift` modifier specified.');
  }
  keyEvent.shift = true;
}

function _control(keyEvent) {
  if (keyEvent.ctrl) {
    throw new Error('Double `Control` modifier specified.');
  }
  keyEvent.ctrl = true;
}

function setModifier(keyEvent, modifier) {
  switch (modifier) {
    case 'command':
    case 'cmd': {
      return _command(keyEvent);
    }
    case 'super': {
      return _super(keyEvent);
    }
    case 'control':
    case 'ctrl': {
      return _control(keyEvent);
    }
    case 'commandorcontrol':
    case 'cmdorctrl': {
      return _commandorcontrol(keyEvent);
    }
    case 'option':
    case 'altgr':
    case 'alt': {
      return _alt(keyEvent, modifier);
    }
    case 'shift': {
      return _shift(keyEvent);
    }
    default:
      throw new Error(`Invalid modifier "${modifier}".`);
  }
}

function setKey(keyEvent, key) {
  if (keyEvent.key) {
    throw new Error(`Duplicated keycode "${key}".`);
  }
  keyEvent.key = key;
}

/**
 * Transform an Electron accelerator string into an internal key event.
 *
 * @param  {string} accelerator An Electron accelerator string, e.g. `Ctrl+C` or `Shift+Space`.
 * @return {KeyEvent} An internal key event derivate from the `accelerator` argument.
 */
function toKeyEvent(accelerator) {
  const keyEvent = { key: null }; // ctrl: false, alt: false, shift: false, meta: false
  const parts = accelerator.split('+');
  for (const keyStr of parts) {
    const modifierMatch = keyStr.match(MODIFIERS);
    if (modifierMatch) {
      const modifier = modifierMatch[0].toLowerCase();
      setModifier(keyEvent, modifier);
      continue;
    }

    const codeMatch = keyStr.match(KEY_CODES);
    if (codeMatch) {
      const code = codeMatch[0].toLowerCase();
      if (code === 'plus') {
        setKey(keyEvent, '+');
      } else {
        setKey(keyEvent, code);
      }
    } else {
      throw new Error(`Invalid accelerator: "${accelerator}" on part "${keyStr}".`);
    }
  }
  return keyEvent;
}

/**
 * Test whether the given string is a valid Electron accelerator.
 *
 * @param {String} accelerator The Electron accelerator as string.
 * @returns {Boolean} True if the given accelerator is valid.
 */
function isValidElectronAccelerator(accelerator) {
  if (!accelerator) {
    return false;
  }
  const parts = accelerator.split("+");
  let keyFound = false;
  return parts.every((val, index) => {
    const isKey = KEY_CODES.test(val);
    const isModifier = MODIFIERS.test(val);
    if (isKey) {
      // Key must be unique
      if (keyFound) {
        return false;
      }
      keyFound = true;
    }
    // Key is required
    if (index === parts.length - 1 && !keyFound) {
      return false;
    }
    return isKey || isModifier;
  });
}

module.exports = {
  reduceModifier: setModifier,
  toKeyEvent,
  isValidElectronAccelerator
};
