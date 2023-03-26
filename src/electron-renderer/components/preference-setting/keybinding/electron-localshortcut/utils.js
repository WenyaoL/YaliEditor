let _process = null
if (!window) _process = process



const isLinux =
  (_process?.platform === 'linux') ||
  (navigator.userAgentData.platform?.indexOf('linux') > -1) ||
  (String(navigator.platform).indexOf('linux') > -1) ||
  (navigator.platform == "X11");

const isOsx =
  (_process?.platform === 'darwin') ||
  (navigator.platform == "Mac68K") ||
  (navigator.platform == "MacPPC") ||
  (navigator.platform == "Macintosh") ||
  (navigator.platform == "MacIntel");

const isWindows =
  (_process?.platform === 'win32') ||
  (navigator.userAgentData?.platform == "Windows") ||
  (navigator.platform == "Win32") ||
  (navigator.platform == "Windows");

module.exports = {
  isLinux,
  isOsx,
  isWindows
};
