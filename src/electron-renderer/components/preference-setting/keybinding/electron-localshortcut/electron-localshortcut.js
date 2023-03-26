// Source based on https://github.com/parro-it/electron-localshortcut
// The MIT License (MIT). Please see root LICENSE file for a copy of the license.
// Copyright (c) 2017 Andrea Parodi

'use strict';

const createDebug = require('debug');
const { acceleratorFromKeyEvent, isValidKeyBinding, normalizeKeyboardEvent, setKeyboardLayout } = require('./atom-keymap');
const { convertFromElectronInput, isCompositionEventForElectron } = require('./event-helper');
const { isValidElectronAccelerator, toKeyEvent } = require('./convert-accelerator');
const equals = require('./match-accelerator');
const { isOsx } = require('./utils');

const debug = createDebug('electron-localshortcut');

/**
 * @typedef {import("./atom-keymap/helpers").KeyEvent} KeyEvent
 */

const windowsWithShortcuts = new WeakMap();

const _getWindowtitle = win => {
  if (win) {
    try {
      return win.getTitle();
    } catch (err) {
      return 'destroyed window';
    }
  }
  return 'n.a.';
};

function _checkAccelerator(accelerator) {
  if (!isValidElectronAccelerator(accelerator)) {
    const w = {};
    Error.captureStackTrace(w);
    const stack = w.stack ? w.stack.split('\n').slice(4).join('\n') : w.message;
    const msg = `
WARNING: "${accelerator}" is not a valid Electron accelerator.

${stack}
`;
    console.error(msg);
  }
}

/**
 * Disable all of the shortcuts registered on the BrowserWindow instance.
 * Registered shortcuts no more works on the `window` instance, but the module
 * keep a reference on them. You can reactivate them later by calling `enableAll`
 * method on the same window instance.
 *
 * @param  {Electron.BrowserWindow} win The window instance.
 */
function disableAll(win) {
  debug('Disabling all shortcuts on window "%s".', _getWindowtitle(win));
  const wc = win.webContents;
  const shortcutsOfWindow = windowsWithShortcuts.get(wc);

  for (const shortcut of shortcutsOfWindow) {
    shortcut.enabled = false;
  }
}

/**
 * Enable all of the shortcuts registered on the BrowserWindow instance that
 * you had previously disabled calling `disableAll` method.
 *
 * @param  {Electron.BrowserWindow} win The window instance.
 */
function enableAll(win) {
  debug('Enabling all shortcuts on window "%s".', _getWindowtitle(win));
  const wc = win.webContents;
  const shortcutsOfWindow = windowsWithShortcuts.get(wc);

  for (const shortcut of shortcutsOfWindow) {
    shortcut.enabled = true;
  }
}

/**
 * Unregisters all of the shortcuts registered on any focused BrowserWindow
 * instance. This method does not unregister any shortcut you registered on
 * a particular window instance.
 *
 * @param  {Electron.BrowserWindow} win The window instance.
 */
function unregisterAll(win) {
  debug('Unregistering all shortcuts on window "%s".', _getWindowtitle(win));
  const wc = win.webContents;
  const shortcutsOfWindow = windowsWithShortcuts.get(wc);

  if (shortcutsOfWindow && shortcutsOfWindow.removeListener) {
    shortcutsOfWindow.removeListener();
    windowsWithShortcuts.delete(wc);
  }
}

/**
 * Returns the index of the given key event in the current shortcut list.
 *
 * @param {KeyEvent} event The key event to search for.
 * @param {*} shortcutsOfWindow The list of shortcuts.
 * @returns {Number} The index in the list or -1.
 */
function _findShortcutIndex(event, shortcutsOfWindow) {
  let i = 0;
  for (const shortcut of shortcutsOfWindow) {
    if (equals(shortcut.eventStamp, event)) {
      return i;
    }
    ++i;
  }
  return -1;
}

/**
 * Electron before-input handler for a given window.
 *
 * NOTE: This listener is emitted before dispatching the keydown and keyup events in the page.
 *
 * @param {Electron.Event} e
 * @param {Electron.Input} inputEvent Electron keyboard event (isn't DOM compatible).
 */
const _onBeforeInput = shortcutsOfWindow => (e, inputEvent) => {
  if (!isOsx && inputEvent.key === 'AltGraph') {
    // Workaround to detect AltGr by listening to key down/up event.
    shortcutsOfWindow.isAltGrActive = inputEvent.type === 'keyDown';
  }

  if (inputEvent.type !== 'keyDown') {
    return;
  } else if (isCompositionEventForElectron(inputEvent)) {
    debug('keyinput skip (composition): %o', inputEvent);
    return;
  }

  const keyEvent = normalizeKeyboardEvent(convertFromElectronInput(inputEvent, shortcutsOfWindow.isAltGrActive));
  if (!isValidKeyBinding(keyEvent)) {
    debug('keyinput is invalid: %o', keyEvent);
    return;
  }

  debug('keyinput (normalized): "%s" from %o', acceleratorFromKeyEvent(keyEvent), inputEvent);

  for (const { eventStamp, callback } of shortcutsOfWindow) {
    if (equals(eventStamp, keyEvent)) {
      debug('keyinput match found! %o', eventStamp);
      if (callback()) {
        e.preventDefault();
      }
      return;
    }
  }
};

/**
 * Registers the shortcut `accelerator`on the BrowserWindow instance.
 *
 * @param  {Electron.BrowserWindow} win The window instance to register.
 * @param  {String|Array<String>} accelerator The shortcut to register.
 * @param  {Function} callback This function is called when the shortcut is pressed,
 * the window is focused and not minimized.
 */
function register(win, accelerator, callback) {
  if (!win || !accelerator || !callback) {
    throw new Error('Invalid state: all arguments must be non-null.');
  }

  const wc = win.webContents;
  if (Array.isArray(accelerator)) {
    accelerator.forEach(accelerator => {
      if (typeof accelerator === 'string') {
        register(win, accelerator, callback);
      }
    });
    return;
  }

  debug(`Registering callback for "%s" on window "%s".`, accelerator, _getWindowtitle(win));
  _checkAccelerator(accelerator);

  let shortcutsOfWindow;
  if (windowsWithShortcuts.has(wc)) {
    shortcutsOfWindow = windowsWithShortcuts.get(wc);
  } else {
    shortcutsOfWindow = [];
    windowsWithShortcuts.set(wc, shortcutsOfWindow);

    const keyHandler = _onBeforeInput(shortcutsOfWindow);
    wc.on('before-input-event', keyHandler);

    // Save a reference to allow remove of listener from elsewhere
    shortcutsOfWindow.removeListener = () => wc.removeListener('before-input-event', keyHandler);
    wc.once('closed', shortcutsOfWindow.removeListener);
  }

  const eventStamp = toKeyEvent(accelerator);
  shortcutsOfWindow.push({
    eventStamp,
    callback,
    isAltGrActive: false,
    enabled: true
  });
}

/**
 * Unregisters the shortcut of `accelerator` registered on the BrowserWindow instance.
 *
 * @param  {Electron.BrowserWindow} win The window instance to unregister.
 * @param  {String|Array<String>} accelerator The shortcut to unregister
 */
function unregister(win, accelerator) {
  if (!win) {
    throw new Error('Invalid state: "win" must be non-null.');
  } else if (win.isDestroyed()) {
    debug('Early return because window is destroyed.');
    return;
  }

  const wc = win.webContents;
  if (Array.isArray(accelerator)) {
    accelerator.forEach(accelerator => {
      if (typeof accelerator === 'string') {
        unregister(win, accelerator);
      }
    });
    return;
  }

  debug('Unregistering callback for "%s" on window "%s".', accelerator, _getWindowtitle(win));
  _checkAccelerator(accelerator);

  if (!windowsWithShortcuts.has(wc)) {
    debug('Early return because window has never had shortcuts registered.');
    return;
  }

  const shortcutsOfWindow = windowsWithShortcuts.get(wc);
  const eventStamp = toKeyEvent(accelerator);
  const shortcutIdx = _findShortcutIndex(eventStamp, shortcutsOfWindow);
  if (shortcutIdx === -1) {
    return;
  }

  shortcutsOfWindow.splice(shortcutIdx, 1);

  // If the window has no more shortcuts, we remove it early from the WeakMap
  // and unregistering the event listener
  if (shortcutsOfWindow.length === 0) {
    shortcutsOfWindow.removeListener();

    // Remove window from shortcuts catalog
    windowsWithShortcuts.delete(wc);
  }
}

/**
 * Whether the shortcut `accelerator` is registered on `window`.
 *
 * @param  {Electron.BrowserWindow} win The window instance to check.
 * @param  {String} accelerator The shortcut to check for.
 * @return {Boolean} Whether the `accelerator` is registered on `win`.
 */
function isRegistered(win, accelerator) {
  _checkAccelerator(accelerator);
  const wc = win.webContents;
  const shortcutsOfWindow = windowsWithShortcuts.get(wc);
  if (!shortcutsOfWindow) {
    return false;
  }
  const eventStamp = toKeyEvent(accelerator);
  return _findShortcutIndex(eventStamp, shortcutsOfWindow) !== -1;
}

module.exports = {
  register,
  unregister,
  isRegistered,
  unregisterAll,
  enableAll,
  disableAll,
  setKeyboardLayout
};
