// @ts-nocheck
/* eslint-disable regexp/no-super-linear-backtracking,regexp/no-unused-capturing-group */
/** @import {Platform} from './Public'; */
import { PLATFORM, WEBOS_VERSION_CHROME_MAP } from '../constants.js';

// User-Agent: Mozilla/5.0 (<system-information>) <platform> (<platform-details>) <extensions>
// const USER_AGENT_REGEX = /^Mozilla\/5\.0 \((?<systemInformation>.+?)\) (?<platform>.+?)( \((?<platformDetails>.+?)\))? (?<extensions>(?<browser>.+?)( (?<compatibleBrowser>.+))?)$/;
const USER_AGENT_REGEX = /^Mozilla\/5\.0 \((?<systemInformation>.+?)\) .+?( \(.+?\))? (?<browser>.+?)( (?<compatibleBrowser>.+))?$/;
const WEBOS_REGEX = /^Web0S;/;
const TIZEN_REGEX = /(Linux\/SmartTV(\+(?<year>.+))?; Maple2012|Tizen (?<version>.+))$/;
const WINDOWS_REGEX = /^Windows NT (?<version>.+)/;
const MACOS_REGEX = /Mac OS X (?<version>.+)$/;
const ANDROID_TV_REGEX = /Android (?<version>.+?);(.+?)? (SHIELD )?(Android TV|MIBOX)/;
const ANDROID_REGEX = /Android (?<version>.+?);/;
const LINUX_DESKTOP_REGEX = /X11; Linux/;
const LINUX_REGEX = /Linux/;

/**
 * @param {string} ua userAgent
 * @returns {Platform} platform
 */
export default function parseUserAgent(ua) {
  const match = USER_AGENT_REGEX.exec(ua);
  /** @type {Platform} */
  const result = {
    os: { family: undefined, version: 1 },
    browser: undefined,
    version: 1,
    type: PLATFORM.UNKNOWN,
  };

  if (!match) {
    return result;
  }
  const { systemInformation, browser, compatibleBrowser } = match.groups;
  const [browserName, browserVersion] = parseBrowser(browser, compatibleBrowser);
  let osFamily, osVersion, platform;

  result.browser = browserName;
  result.version = browserVersion;

  if (WINDOWS_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformWindows(systemInformation);
  }
  else if (ANDROID_TV_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformAndroidTV(systemInformation);
  }
  else if (ANDROID_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformAndroid(systemInformation);
  }
  else if (WEBOS_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformWebOS(systemInformation, result, compatibleBrowser);
  }
  else if (TIZEN_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformTizen(systemInformation, result);
  }
  else if (MACOS_REGEX.test(systemInformation)) {
    [osFamily, osVersion, platform] = parsePlatformMacOS(systemInformation);
  }
  else if (LINUX_DESKTOP_REGEX.test(systemInformation)) {
    osFamily = 'Linux';
    platform = PLATFORM.DESKTOP;
  }
  else if (LINUX_REGEX.test(systemInformation)) {
    osFamily = 'Linux';
  }

  result.os.family = osFamily;
  result.os.version = osVersion || 1;
  result.type = platform ?? PLATFORM.UNKNOWN;

  return result;
}

/**
 * @param {string} browserRaw browserRaw
 * @param {string} compatibleBrowserRaw compatibleBrowserRaw
 */
function parseBrowser(browserRaw, compatibleBrowserRaw) {
  const [browserName, browserVersion] = browserRaw.split('/');
  let browser = browserName;
  let version = Number.parseInt(browserVersion, 10) || 1;

  if (version === 1 || browser === 'Version') {
    const matchedBrowser = compatibleBrowserRaw
      .split(' ')
      .find((e) => e.includes('/'));

    if (matchedBrowser) {
      const [compatibleName, compatibleVersion] = matchedBrowser.split('/');

      browser = compatibleName;
      version = Number.parseInt(compatibleVersion, 10) || 1;
    }
  }

  return [browser, version];
}

/**
 * @param {string} systemInformation systemInformation
 */
function parsePlatformWindows(systemInformation) {
  const { version } = WINDOWS_REGEX.exec(systemInformation).groups;

  return ['Windows', Number.parseInt(version, 10), PLATFORM.DESKTOP];
}

/**
 * @param {string} systemInformation systemInformation
 */
function parsePlatformAndroidTV(systemInformation) {
  const { version } = ANDROID_TV_REGEX.exec(systemInformation).groups;

  return ['AndroidTV', Number.parseInt(version, 10), PLATFORM.TV];
}

/**
 * @param {string} systemInformation systemInformation
 */
function parsePlatformAndroid(systemInformation) {
  const { version } = ANDROID_REGEX.exec(systemInformation).groups;

  return ['Android', Number.parseInt(version, 10), PLATFORM.MOBILE];
}

/**
 * @param {string} systemInformation systemInformation
 * @param {Platform} result result
 * @param {string} compatibleBrowser compatibleBrowser
 */
function parsePlatformWebOS(systemInformation, result, compatibleBrowser) {
  let version = 1;

  if (result.browser === 'Safari' && result.version === 538) {
    version = 2;
  }
  if (result.browser === 'QtWebEngine') {
    const [browserName, browserVersion] = compatibleBrowser // == Chrome and Safari
      .split(' ')
      .find((e) => e.includes('/'))
      .split('/');

    result.browser = browserName;
    result.version = browserVersion ? Number.parseInt(browserVersion, 10) : 1;
  }

  if (result.version in WEBOS_VERSION_CHROME_MAP) {
    version = WEBOS_VERSION_CHROME_MAP[result.version];
  }

  return ['WebOS', version, PLATFORM.TV];
}

/**
 * @param {string} systemInformation systemInformation
 * @param {Platform} result result
 */
function parsePlatformTizen(systemInformation, result) {
  const { year, version } = TIZEN_REGEX.exec(systemInformation).groups;

  if (version >= 5.5) {
    result.version = Number.parseInt(result.browser, 10);
    result.browser = 'Chrome';
  }

  return ['Tizen', Number.parseFloat(year ?? version), PLATFORM.TV];
}

/**
 * @param {string} systemInformation systemInformation
 */
function parsePlatformMacOS(systemInformation) {
  const { version } = MACOS_REGEX.exec(systemInformation).groups;

  return ['macOS', Number.parseInt(version, 10), PLATFORM.DESKTOP];
}
