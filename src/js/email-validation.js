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
     * @typedef EmailWarnings
     * @type {object}
     * @property {boolean} isEmpty Has no content
     * @property {boolean} noAt Missing &#064; symbol.
     * @property {boolean} tooManyAt &#064; symbol appears more than once.
     * @property {string|boolean} invalidCharacterInLocal invalid characters in the local part of the email (before @)
     * @property {boolean} localTooLong local part of address is too long 
     * @property {string|boolean} invalidCharacterInDomain invalid characters in the domain part of the email (after @)
     * @property {boolean} emptyDomain the domain part of the address is entirely empty
     * @property {boolean} zeroLengthDnsLabel a DNS label in the domain has zero length, for example "user&#064;example..com"
     * @property {boolean} missingTopLevelDomain domain is missing a top level domain, e.g. .com
     */

    /**
     * Currently active warnings. Updated whenever the inputField's value changes.
     * @type {EmailWarnings}
     */
    this.warnings = {
      noAt: false,
      tooManyAt: false,
      invalidCharacterInLocal: false,
      localTooLong: false,
      invalidCharacterInDomain: false,
      emptyDomain: false,
      zeroLengthDnsLabel: false,
      missingTopLevelDomain: false
    }

    this.inputField.addEventListener('input', () => {
      this.warnings = EmailValidation.generateWarnings(this.inputField.value);
      const message = EmailValidation.generateWarningMessage(this.warnings);

      // don't show a message or disable button if the email is totally empty
      if (!this.warnings.isEmpty && message) {
        this.buttonDisable.addDisableCause(this);
        this.showWarningMessage(message);
        this.styleAsInvalid(message);
      } else {
        this.buttonDisable.removeDisableCause(this);
        this.hideWarningMessage();
        this.styleAsValid();
      }
    })
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
    paragraph.appendChild(document.createTextNode(message));
    this.warningContainer.appendChild(paragraph);
  }

  /**
   * Adds a custom reason to style the input field as invalid.
   * @param {string} reason Why the input field's value is invalid
   */
  styleAsInvalid(reason) {
    this.inputField.setCustomValidity(reason);
  }

  /**
   * Removes any custom validity reason on the input field.
   */
  styleAsValid() {
    this.inputField.setCustomValidity('');
  }

  /**
   * Uses this.warnings to generate a warning message string, or false if
   * there are no warnings active.
   * @returns {string} A meaningful warning message explaining the problem, or an
   * empty string if there are no problems.
   */
  static generateWarningMessage(warnings) {
    if (warnings.isEmpty) {
      return `No email entered`;
    }
    if (warnings.noAt) {
      return `Should contain @`;
    }
    if (warnings.tooManyAt) {
      return `Should only contain one @`;
    }
    if (warnings.invalidCharacterInLocal) {
      return `${warnings.invalidCharacterInLocal} is not allowed in an email address`;
    }
    if (warnings.localTooLong) {
      return `The first part of the email address is too long`;
    }
    if (warnings.invalidCharacterInDomain) {
      return `${warnings.invalidCharacterInDomain} is not allowed in the domain part of an email address`;      
    }
    if (warnings.emptyDomain) {
      return `Expected something after the @`;
    }
    if (warnings.zeroLengthDnsLabel) {
      return `Unexpected . in the second part of the email address`
    }
    if (warnings.missingTopLevelDomain) {
      return `Missing the end part of the address such as .com`;
    }
    return '';
  }

  /**
   * Creates an object describing if the given email address passes validation.
   * @param {string} email Potential email to check validity.
   * @returns {EmailWarnings} Object containing properties describing validation checks
   * that were carried out on the email and their result.
   */
  static generateWarnings(email) {
    /* example breakdowns:
    email = "someone@example.com"
    indexOfAt = 7
    local = "someone"
    domain = "example.com"
    dnsLabels = ["example", "com"]
    warnings: (none)

    email = "invalid.address.com"
    indexOfAt = -1
    local = "invalid.address.com"
    domain = 
    dnsLabels = []
    warnings: noAt, missingTopLevelDomain

    email = "a@not.a.valid.addréss"
    indexOfAt = 1
    local = "a"
    domain = "not.a.valid.addréss"
    dnsLabels = ["not", "a", "valid", "addréss"]
    warnings: invalidCharacterInDomain ("é")
    */

    const warnings = {};

    warnings.isEmpty = !email;

    // how many times @ appears in the string, or undefined if none found
    const atCount = email.match(/@/g)?.length;
    warnings.noAt = (!atCount || !!(atCount === 0));
    warnings.tooManyAt = !!atCount && atCount > 1;

    const indexOfAt = email.indexOf('@');

    // if there's no @ symbol then treat whole email as being local
    const local = indexOfAt > -1 ? email.substr(0, indexOfAt) : email;

    // if there's no @ symbol then consider domain as empty
    const domain = indexOfAt > -1 ? email.substr(indexOfAt + 1) : '';

    return {
      ...warnings,
      ...EmailValidation.warningsForLocalPart(local),
      ...EmailValidation.warningsForDomainPart(domain)
    };
  }

  static warningsForLocalPart(local) {
    const warnings = {};
    const startsWithQuote = /^"/;
    const endsWithQuote = /"$/;
    const isQuoted = !!local.match(startsWithQuote)
      && !!local.match(endsWithQuote);

    // any character other than 0-9, a-z, A-Z, and specific special characters
    const invalidLocal = /[^\w\{\}\.!#$'*+=!?^_`|~`-]/;

    // there are still rules if the local part is quoted, but they're far more lax and ignored for now
    warnings.invalidCharacterInLocal = !isQuoted && local.match(invalidLocal)?.[0];

    warnings.localTooLong = (local.length > 64);

    return warnings;
  }

  static warningsForDomainPart(domain) {
    const warnings = {};
    const dnsLabels = domain.split('.');

    warnings.emptyDomain = (domain.length === 0);

    warnings.zeroLengthDnsLabel = dnsLabels.some(label => label.length === 0);

    // it is possible to have an email address with no top level domain, for example
    // user@localhost but in practice that is rare to see in the wild
    const minTopLevelDomainLength = 2;
    warnings.missingTopLevelDomain = (dnsLabels.length < 2)
      || dnsLabels[dnsLabels.length - 1].length < minTopLevelDomainLength;


    // starts or ends with hyphen, or contains anything other than basic letters and hyphen
    const invalidDnsLabel = /(^-)|(-$)|[^a-zA-Z0-9-]/g;

    warnings.invalidCharacterInDomain = false;
    dnsLabels.some(label => {
      const invalidChars = label.match(invalidDnsLabel);
      if (invalidChars && invalidChars.length > 0) {
        // store first invalid character encountered
        warnings.invalidCharacterInDomain = invalidChars[0];
        return true;
      }
      return false;
    })

    return warnings;
  }
}
