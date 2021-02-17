/**
 * Wraps an HTML element so it can be easily shown or hidden.
 */
export default class Hideable {
  /**
   * Creates a Hideable instance that wraps an HTML element.
   * @param {HTMLElement} element 
   */
  constructor (element) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError('Expected to be an Element.');
    }
    /**
     * @type {HTMLElement}
     */
    this.element = element;
    
    /**
     * What value will be applied to the display style property when hiding.
     * @type {string}
     */
    this.hiddenStyle = 'none';

    /**
     * Whether the element is currently hidden.
     * @type {boolean}
     */
    this.isVisible = !(this.element.style.display === this.hiddenStyle);

    /**
     * What value will be applied to the display style property to show the element.
     * @type {string}
     */
    this.visibleStyle = this.isVisible ? this.element.style.display : 'block';
  }
  
  /**
   * Makes the wrapped element visible.
   */
  show() {
    if (this.isVisible) {
      return;
    }
    this.element.style.display = this.visibleStyle;
    this.isVisible = true;
  }

  /**
   * Hides the wrapped element.
   */
  hide() {
    if (!this.isVisible) {
      return;
    }
    this.element.style.display = this.hiddenStyle;
    this.isVisible = false;
  }

  /**
   * Toggles visibility, depending on this isVisible property.
   */
  toggleVisibility() {
    if (this.isVisible) {
      hide();
    } else {
      show();
    }
  }
}
