/**
 * Wraps an object that can be disabled. Rather than directly disabling
 * or enabling it, you can call "addDisableCause" and "removeDisableCause"
 * on this wrapper. The wrapped element is disabled when theres one or more
 * causes to disable it.
 */
export default class Disableable {

  /**
   * @typedef {Object} HasDisable
   * @property {boolean} disabled Whether the object is currently disabled. Must allow setting.
   */

  /**
   * Creates a Disableable, wrapping an object that can be disabled.
   * @param {HasDisable} element Object that has a boolean disabled property.
   * @throws {TypeError} element must have a .disabled property.
   */
  constructor(element) {
    if (!('disabled' in element)) {
      throw new TypeError(`Disableable requires an element with a .disabled property, but ${element} doesn't have it.`);
    }

    /**
     * @type {HasDisable}
     */
    this.element = element;

    /**
     * @type {Set}
     */
    this.causes = new Set();
  }

  /**
   * @returns {boolean} True if there's at least one cause to disable.
   */
  getIsDisabled() {
    return this.causes.size > 0;
  }

  /**
   * Applies the disabled value of this wrapper to the wrapped object.
   */
  updateWrappedDisabled() {
    this.element.disabled = this.getIsDisabled();
  }

  /**
   * Attempts to add a reason to disable the wrapped object. If the cause is already
   * present then nothing is changed.
   * @param {any} cause Anything that uniquely represents the cause for disabling.
   * Note that the exact same value will be required to remove the cause.
   */
  addDisableCause(cause) {
    this.causes.add(cause);
    this.updateWrappedDisabled();
  }

  /**
   * Attempts to remove a cause for disabling the wrapped object. If the cause wasn't
   * present then nothing is changed.
   * @param {any} cause Cause to remove, must be identical to the cause that was added.
   * For details on unusual cases like NaN or -0 see MDN docs:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
   */
  removeDisableCause(cause) {
    this.causes.delete(cause);
    this.updateWrappedDisabled();
  }

  removeAllDisableCauses() {
    this.causes.clear();
    this.updateWrappedDisabled();
  }
}
