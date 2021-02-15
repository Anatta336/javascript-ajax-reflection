import Disableable from './disableable';
import removeAllChildren from './remove-children';

export default class EmailValidation {
  /**
   * 
   * @param {HTMLInputElement} inputField Text input element where the user can enter an email address.
   * @param {Disableable} buttonDisable Disableable that will be given a cause to disable when email is not valid.
   * @param {HTMLElement} warningContainer HTML element that will contain any warning messages about the email address.
   */
  constructor(inputField, buttonDisable, warningContainer) {
    /**
     * Text input element where the user can enter an email address.
     * @type {HTMLInputElement}
     */
    this.inputField = inputField;

    /**
     * Disableable that will be given a cause to disable when email is not valid.
     * @type {Disableable}
     */
    this.buttonDisable = buttonDisable;

    /**
     * HTML element that contains any warning messages about the email address.
     * @type {HTMLElement}
     */
    this.warningContainer = warningContainer;

    /**
     * Regular expression that provides a non-exhaustive check for whether
     * the email address is valid.
     * @type {RegExp}
     */
    this.validRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;

    this.inputField.addEventListener('input', () => {
      this.checkValidity(this.inputField.value);
    })
  }

  /**
   * Check if the given string is a valid email address, showing warnings if not.
   * @param {string} email String that may or may not be a valid email address.
   * @returns {boolean} True if given email is a valid address, otherwise false.
   */
  checkValidity(email) {
    const isValid = this.validRegex.test(email);

    if (!isValid) {
      this.buttonDisable.addDisableCause(this);
      this.showWarningMessage(`${email} is not a valid email address.`);
    } else {
      this.buttonDisable.removeDisableCause(this);
      this.hideWarningMessage();
    }

    return isValid;
  }

  /**
   * Hides all warning messages.
   */
  hideWarningMessage() {
    removeAllChildren(this.warningContainer);
  }

  /**
   * Shows the given warning message.
   * @param {String} message Message to display.
   */
  showWarningMessage(message) {
    removeAllChildren(this.warningContainer);
    const paragraph = document.createElement('p');
    paragraph.classList.add('warning');
    paragraph.append(message);
    this.warningContainer.append(paragraph);
  }
}
