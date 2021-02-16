export default class LocalStore {
  constructor(forceToUseCookies = false) {
    /**
     * True if localStorage is available for use.
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