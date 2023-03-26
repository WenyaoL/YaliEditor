// Source based on https://github.com/atom/atom-keymap
// The MIT License (MIT). Please see root LICENSE file for a copy of the license.
// Copyright (c) 2014 GitHub Inc.


const utils = require('../utils')

let isLinux = utils.isLinux
let isOsx = utils.isOsx
let isWindows = utils.isWindows

const KEY_SEPARATOR = '+'
const MODIFIERS = new Set(['ctrl', 'alt', 'shift', 'cmd'])
const KEY_NAMES_BY_KEYBOARD_EVENT_CODE = {
  Space: 'space',
  Backspace: 'backspace'
}
const NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY = {
  Control: 'ctrl',
  Meta: 'cmd',
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right'
}
const NUMPAD_KEY_NAMES_BY_KEYBOARD_EVENT_CODE = {
  Numpad0: 'num0',
  Numpad1: 'num1',
  Numpad2: 'num2',
  Numpad3: 'num3',
  Numpad4: 'num4',
  Numpad5: 'num5',
  Numpad6: 'num6',
  Numpad7: 'num7',
  Numpad8: 'num8',
  Numpad9: 'num9'
}

const LATIN_KEYMAP_CACHE = new WeakMap()
const isLatinKeymap = keymap => {
  if (keymap == null) {
    return true
  }

  let isLatin = LATIN_KEYMAP_CACHE.get(keymap)
  if (isLatin != null) {
    return isLatin
  }

  // To avoid exceptions, if the native keymap does not have entries for a key,
  // assume that key is latin.
  isLatin =
      ((keymap.KeyA == null) || isLatinCharacter(keymap.KeyA.value)) &&
      ((keymap.KeyS == null) || isLatinCharacter(keymap.KeyS.value)) &&
      ((keymap.KeyD == null) || isLatinCharacter(keymap.KeyD.value)) &&
      ((keymap.KeyF == null) || isLatinCharacter(keymap.KeyF.value))
  LATIN_KEYMAP_CACHE.set(keymap, isLatin)
  return isLatin
}

const isCharacter = character => {
  return character != null && character.length === 1
}

const isASCIICharacter = character => {
  return isCharacter(character) && character.charCodeAt(0) <= 127
}

const isLatinCharacter = character => {
  return isCharacter(character) && character.charCodeAt(0) <= 0x024F
}

const isUpperCaseCharacter = character => {
  return isCharacter(character) && character.toLowerCase() !== character
}

// eslint-disable-next-line no-unused-vars
const isLowerCaseCharacter = character => {
  return isCharacter(character) && character.toUpperCase() !== character
}

const usKeymap = Object.freeze(require('./us-keymap'))
const usCharactersForKeyCode = code => {
  return usKeymap[code]
}

// NOTE: Fallback keyboard information. Please update this at runtime via `native-keymap` and `setKeyboardLayout`.
const localKeyboardInfo = {
  layout: null,
  layoutName: 'us-default',
  keymap: usKeymap
}

/**
 * A normalized keyboard event for internal usage.
 *
 * @typedef {Object} KeyEvent
 * @property {string} key The key value (see KeyboardEvent.key).
 * @property {boolean} ctrl Whether `Control` is active (see KeyboardEvent.ctrlKey).
 * @property {boolean} alt Whether `Alt` or `Option` on macOS is active (see KeyboardEvent.altKey).
 * @property {boolean} shift Whether `Shift` is active (see KeyboardEvent.shiftKey).
 * @property {boolean} meta Whether `Command` is active on macOS (see KeyboardEvent.metaKey).
 */

/**
 * The keyboard mapping for a given key.
 *
 * @typedef {Object} IKeyboardMapping
 * @property {string} [value]
 * @property {string} [withShift]
 * @property {string} [withAltGr]
 * @property {string} [withShiftAltGr]
 */

const getKeyboardLayoutName = layout => {
  if (!layout) {
    return 'n.a.'
  }
  //       Windows           Linux         macOS      Error
  return layout.name || layout.layout || layout.id || 'n.a.'
}

/**
 * Sets the internal keyboard map and layout to map keys from.
 *
 * NOTE: Uses an en-US fallback keymap if `keymap` is null or empty.
 *
 * @param {*} layout The `native-keymap` keyboard layout.
 * @param {Record<string, IKeyboardMapping>} keymap The keyboard mapping for a given key.
 */
const setKeyboardLayout = (layout, keymap) => {
  if (!keymap || Object.keys(keymap).length === 0) {
    console.warn('atom-keymap.js: empty keymap detected, fallback to en-US.')
    localKeyboardInfo.layoutName = 'us-default'
    localKeyboardInfo.layout = null
    localKeyboardInfo.keymap = usKeymap
  } else {
    localKeyboardInfo.layoutName = getKeyboardLayoutName(layout)
    localKeyboardInfo.layout = layout
    localKeyboardInfo.keymap = keymap
  }
}

// const normalizeKeystroke = keystroke => {
//   const keyup = isKeyup(keystroke)
//   if (keyup) {
//     keystroke = keystroke.slice(1)
//   }
//   const keys = parseKeystroke(keystroke)
//   if (!keys) {
//     return false
//   }
//
//   let primaryKey = null
//   const modifiers = new Set()
//
//   for (let i = 0; i < keys.length; ++i) {
//     const key = keys[i]
//     if (MODIFIERS.has(key)) {
//       modifiers.add(key)
//     } else {
//       // Only the last key can be a non-modifier
//       if (i === (keys.length - 1)) {
//         primaryKey = key
//       } else {
//         return false
//       }
//     }
//   }
//
//   if (keyup) {
//     if (primaryKey != null) {
//       primaryKey = primaryKey.toLowerCase()
//     }
//   } else {
//     if (isUpperCaseCharacter(primaryKey)) {
//       modifiers.add('shift')
//     }
//     if (modifiers.has('shift') && isLowerCaseCharacter(primaryKey)) {
//       primaryKey = primaryKey.toUpperCase()
//     }
//   }
//
//   keystroke = []
//   if (!keyup || (keyup && primaryKey == null)) {
//     if (modifiers.has('ctrl')) {
//       keystroke.push('ctrl')
//     }
//     if (modifiers.has('alt')) {
//       keystroke.push('alt')
//     }
//     if (modifiers.has('shift')) {
//       keystroke.push('shift')
//     }
//     if (modifiers.has('cmd')) {
//       keystroke.push('cmd')
//     }
//   }
//   if (primaryKey != null) {
//     keystroke.push(primaryKey)
//   }
//   keystroke = keystroke.join(KEY_SEPARATOR)
//   if (keyup) {
//     keystroke = `^${keystroke}`
//   }
//   return keystroke
// }
//
// const parseKeystroke = keystroke => {
//   const keys = []
//   let keyStart = 0
//   for (let index = 0; index < keystroke.length; ++index) {
//     const character = keystroke[index]
//     if (character === KEY_SEPARATOR) {
//       if (index > keyStart) {
//         keys.push(keystroke.substring(keyStart, index))
//         keyStart = index + 1
//
//         // The keystroke has a trailing key separator (+) and is invalid
//         if (keyStart === keystroke.length) {
//           return false
//         }
//       }
//     }
//   }
//   if (keyStart < keystroke.length) {
//     keys.push(keystroke.substring(keyStart))
//   }
//   return keys
// }
//
// const isKeyup = keystroke => {
//   return keystroke.startsWith('^') && (keystroke !== '^')
// }

const nonAltModifiedKeyForKeyboardEvent = (code, shiftKey) => {
  if (code) {
    const keyChars = localKeyboardInfo.keymap[code]
    if (shiftKey) {
      return keyChars.withShift
    }
    return keyChars.value
  }
  return null
}

/**
 * Returns a normalized key event from the given DOM like keyboard event.
 *
 * @param {KeyboardEvent} event The DOM like keyboard event.
 * @returns {KeyEvent} Normalized key event or `null`.
 */
const normalizeKeyboardEvent = event => {
  const eventType = event.type
  if (eventType !== 'keydown') {
    return null
  }

  const { layoutName: currentLayout, keymap } = localKeyboardInfo
  let { key, code, ctrlKey, altKey, shiftKey, metaKey } = event

  // `native-keymap` is able to translate dead keys for each OS.
  if (key === 'Dead' && !isLinux) {
    const keyChars = keymap[code]
    if (keyChars) {
      if (altKey && shiftKey && keyChars.withShiftAltGr != null) {
        key = keyChars.withShiftAltGr
      } else if (altKey && keyChars.withAltGr != null) {
        key = keyChars.withAltGr
      } else if (shiftKey && keyChars.withShift != null) {
        key = keyChars.withShift
      } else if (keyChars.value != null) {
        key = keyChars.value
      }
    }
  }

  // FIXME: `getModifierState('NumLock')` is always false in Electron main process.
  // if (NUMPAD_KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code] != null && event.getModifierState('NumLock')) {
  if (NUMPAD_KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code] != null) {
    key = NUMPAD_KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code]
  }

  if (KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code] != null) {
    key = KEY_NAMES_BY_KEYBOARD_EVENT_CODE[code]
  }

  // Work around Chrome bugs on Linux
  if (isLinux) {
    // Fix NumpadDecimal key value being '' with NumLock disabled.
    if (code === 'NumpadDecimal' && !event.getModifierState('NumLock')) {
      key = 'delete'
    }
    // Fix 'Unidentified' key value for '/' key on Brazillian keyboards
    if (code === 'IntlRo' && key === 'Unidentified' && ctrlKey) {
      key = '/'
    }
  }

  const isNonCharacterKey = key.length > 1
  if (isNonCharacterKey) {
    key = NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY[key] != null
      ? NON_CHARACTER_KEY_NAMES_BY_KEYBOARD_EVENT_KEY[key]
      : key.toLowerCase()
    if (key === 'altgraph' && isWindows) {
      key = 'alt'
    }
  } else {
    // Deal with caps-lock issues. Key bindings should always adjust the
    // capitalization of the key based on the shiftKey state and never the state
    // of the caps-lock key.
    if (shiftKey) {
      key = key.toUpperCase()
    } else {
      key = key.toLowerCase()
    }

    if (event.getModifierState('AltGraph') || (isOsx && altKey)) {
      // All macOS layouts have an alt-modified character variant for every
      // single key. Therefore, if we always favored the alt variant, it would
      // become impossible to bind `alt-*` to anything. Since `alt-*` bindings
      // are rare and we bind very few by default on macOS, we will only shadow
      // an `alt-*` binding with an alt-modified character variant if it is a
      // basic ASCII character.
      if (isOsx && code) {
        const nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(code, shiftKey)
        if (nonAltModifiedKey && (ctrlKey || metaKey || !isASCIICharacter(key))) {
          key = nonAltModifiedKey
        } else if (key !== nonAltModifiedKey) {
          altKey = false
        }
      // Windows layouts are more sparing in their use of AltGr-modified
      // characters, and the U.S. layout doesn't have any of them at all. That
      // means that if an AltGr variant character exists for the current
      // keystroke, it likely to be the intended character, and we always
      // interpret it as such rather than favoring a `ctrl-alt-*` binding
      // intepretation.
      } else if (isWindows && code) {
        const nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(code, shiftKey)
        if (nonAltModifiedKey && (metaKey || !isASCIICharacter(key))) {
          key = nonAltModifiedKey
        } else if (key !== nonAltModifiedKey) {
          ctrlKey = false
          altKey = false
        }
      // Linux has a dedicated `AltGraph` key that is distinct from all other
      // modifiers, including LeftAlt. However, if AltGraph is used in
      // combination with other modifiers, we want to treat it as a modifier and
      // fall back to the non-alt-modified character.
      } else if (isLinux) {
        const nonAltModifiedKey = nonAltModifiedKeyForKeyboardEvent(code, shiftKey)
        if (nonAltModifiedKey && (ctrlKey || altKey || metaKey)) {
          key = nonAltModifiedKey
          altKey = !!event.getModifierState('AltGraph')
        }
      }
    }
  }

  // Workaround for com.apple.keylayout.DVORAK-QWERTYCMD on macOS.
  // Use US equivalent character for non-latin characters in keystrokes with modifiers
  // or when using the dvorak-qwertycmd layout and holding down the command key.
  if ((key.length === 1 && !isLatinKeymap(keymap)) || (metaKey && /DVORAK-QWERTYCMD/i.test(currentLayout))) {
    const keyChars = usCharactersForKeyCode(code)
    if (keyChars) {
      if (shiftKey) {
        key = keyChars.withShift
      } else {
        key = keyChars.value
      }
    }
  }

  // ============ Convert to accelerator/key event ============

  // let keystroke = ''
  // if (key === 'ctrl' || (ctrlKey && eventType !== 'keyup')) {
  //   keystroke += 'ctrl'
  // }
  //
  // if (key === 'alt' || (altKey && eventType !== 'keyup')) {
  //   if (keystroke.length > 0) {
  //     keystroke += KEY_SEPARATOR
  //   }
  //   keystroke += 'alt'
  // }
  //
  // if (key === 'shift' || (shiftKey && eventType !== 'keyup' && (isNonCharacterKey || (isLatinCharacter(key) && isUpperCaseCharacter(key))))) {
  //   if (keystroke) {
  //     keystroke += KEY_SEPARATOR
  //   }
  //   keystroke += 'shift'
  // }
  //
  // if (key === 'cmd' || (metaKey && eventType !== 'keyup')) {
  //   if (keystroke) {
  //     keystroke += KEY_SEPARATOR
  //   }
  //   keystroke += 'cmd'
  // }

  const keyInputEvent = { key: null, shift: false, meta: false }
  keyInputEvent.ctrl = key === 'ctrl' || !!ctrlKey
  keyInputEvent.alt = key === 'alt' || !!altKey


  /*if (key === 'shift' || (shiftKey && (isNonCharacterKey || (isLatinCharacter(key) && isUpperCaseCharacter(key))))) {
    keyInputEvent.shift = true
  }*/

  if (key === 'shift' || (shiftKey && (!isNonCharacterKey && isLatinCharacter(key))) ) {
    keyInputEvent.shift = true
  }

  if (isOsx && (key === 'cmd' || metaKey)) {
    keyInputEvent.meta = true
  }

  if (!MODIFIERS.has(key)) {
    keyInputEvent.key = key
  }

  // if (eventType === 'keyup') {
  //   keystroke = normalizeKeystroke(`^${keystroke}`)
  // }
  return keyInputEvent
}

/**
 * Converts a normalized key event into an Electron accelerator.
 *
 * @param {KeyEvent} keyEvent The normalized key event.
 * @returns {string} An Electron accelerator as string.
 */
const acceleratorFromKeyEvent = keyEvent => {
  if (!keyEvent) {
    return null
  }

  const { key, ctrl, shift, alt, meta } = keyEvent
  let keystroke = ''
  if (ctrl) {
    keystroke += 'ctrl'
  }

  if (alt) {
    if (keystroke) {
      keystroke += KEY_SEPARATOR
    }
    keystroke += 'alt'
  }

  if (shift) {
    if (keystroke) {
      keystroke += KEY_SEPARATOR
    }
    keystroke += 'shift'
  }

  if (isOsx && meta) {
    if (keystroke) {
      keystroke += KEY_SEPARATOR
    }
    keystroke += 'cmd'
  }

  if (key) {
    if (keystroke) {
      keystroke += KEY_SEPARATOR
    }
    if (key === '+') {
      keystroke += 'plus'
    } else {
      keystroke += key
    }
  }
  return keystroke
}

const __setPlatform = (setLinux, setOsx, setWindows) => {
  if (process.env.NODE_ENV === 'test') {
    isLinux = setLinux
    isOsx = setOsx
    isWindows = setWindows
  }
}

module.exports = {
  setKeyboardLayout,
  acceleratorFromKeyEvent,
  normalizeKeyboardEvent,
  __setPlatform
}
