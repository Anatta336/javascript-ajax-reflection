/**
 * Provides a way to store string key value pairs in a way that should persist
 * in the browser between sessions.
 * When possible it uses the localStorage API, but if that's not available
 * (for example in IE11 opening a page from the file system) it will fall back
 * to using cookies instead.
 * If LocalStore needs to use cookies then the strings will be sanitised and
 * may lose information. See the sanitiseForCookie method for details.
 */
export default class LocalStore {
  /**
   * Creates a LocalStore instance. Note that data is stored externally, and so
   * is shared between multiple instances of LocalStore.
   * @param {boolean} forceToUseCookies If true data is stored in cookies, even
   * when localStorage is available. Not recommended.
   */
  constructor(forceToUseCookies = false) {
    /**
     * True if localStorage should be used to store data.
     * Changing this value will switch where data is being written and read,
     * so may cause data loss.
     * @type {boolean}
     */
    this.shouldUseLocalStorage = !forceToUseCookies && !!window.localStorage;
  }

  /**
   * Certain characters if stored in a cookie's key or value would disrupt how LocalStore
   * processes cookies. This is a very basic sanitisation process, just removing any
   * offending characters. Take care as this may change the meaning of the string.
   * @param {string} value String to sanitise.
   * @param {boolean} isKey True if this is a key, and so should have extra sanitsation.
   */
  sanitiseForCookie(value, isKey = false) {
    // ; should be used only to separate cookies, not within a cookie
    const sanitised = value.replaceAll(';', '');
    if (isKey) {
      // = should separate the key from the value, so cannot appear within the key
      return sanitised.replaceAll('=', '');
    }
    return sanitised;
  }

  /**
   * Stores a plain string.
   * @param {string} key Name to store data under. Use this to access it again later.
   * @param {string} value The value to store.
   */
  storeString(key, value) {
    if (this.shouldUseLocalStorage) {
      localStorage.setItem(key, value);
    } else {
      document.cookie = `${this.sanitiseForCookie(key, true)}=${this.sanitiseForCookie(value)}`;
    }
  }

  /**
   * Attempts to fetch a previously stored string of data.
   * @param {string} key Name of data to fetch.
   * @returns {string|boolean} The string associated with the given key, or false if none found.
   */
  retrieveString(key) {
    if (this.shouldUseLocalStorage) {
      const value = localStorage.getItem(key);
      return value;
    } else {
      const sanitisedKey = this.sanitiseForCookie(key, true);
      const found = this.getCookiesAsKeyValuePairs().find(cookie => cookie.key === sanitisedKey);
      if (!found) {
        return false;
      }
      return found.value;
    }
  }

  /**
   * @returns {{key: string, value: string}[]}
   */
  getCookiesAsKeyValuePairs() {
    /**
     * Array of cookies, each cookie represented by a string with any leading
     * or trailing whitespace removed. e.g.:
     * ["cookieA=123", "anotherCookie=January"]
     * @type {string[]}
     */
    const cookies = document.cookie.split(';').map(item => item.trim());

    return cookies.map(cookie => {
      const indexOfEquals = cookie.indexOf('=');
      const key = cookie.substr(0, indexOfEquals);
      const value = cookie.substr(indexOfEquals + 1);
      return { key, value };
    })
  }

  checkForPermissionCookie() {
    // note this only checks that the cookie exists, not its value
    if (document.cookie.split(';').some((item) => item.trim().startsWith(`${permissionName}=`))) {
      return true;
    }
    return false;
  }

  storeMap() {

  }
}