/**
 * Wraps an HTML element so it can be easily shown or hidden.
 * @param {Element} element HTML Element that will have its visibility changed.
 */
export default class Hideable {
  
  constructor (element) {
    if (!(element instanceof Element)) {
      throw new TypeError('Expected to be an Element.');
    }
    this.element = element;
    
    this.hiddenStyle = 'none';
    this.isVisible = !(this.element.style.display === this.hiddenStyle);
    this.visibleStyle = this.isVisible ? this.element.style.display : 'block';
  }
  
  show() {
    if (this.isVisible) {
      return;
    }
    this.element.style.display = this.visibleStyle;
    this.isVisible = true;
  }

  hide() {
    if (!this.isVisible) {
      return;
    }
    this.element.style.display = this.hiddenStyle;
    this.isVisible = false;
  }

  toggleVisibility() {
    if (this.isVisible) {
      hide();
    } else {
      show();
    }
  }
}
