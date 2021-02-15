import DogModel from "./dog-model";
import mapReplacer from "./map-replacer";
import mapReviver from "./map-reviver";

export default class AssignmentsModel {
  constructor() {
    // TODO: could use defineProperty to make storageName immutable?
    this.storageName = 'assignedDogs';

    this.callbacksForAssign = [];

    /**
     * Map where key names are emails, with each value being an
     * array of 1 or more DogModels.
     * @type {Map<string,DogModel[]}
     */
    this.assignments = new Map();
    this.readFromStore();
  }

  /**
   * @callback onAssignCallback
   * @param {string} email The email that has had its assignments changed.
   * @param {DogModel[]} assignedDogModels The DogModels assigned to the email.
   */

  /**
   * Add a callback that'll be called whenever a dog assignment is made. The callback function will
   * be passed the email that the assignment was made to and the full updated array of DogModels.
   * @param {onAssignCallback} callback The function to call, will be passed email string and array of DogModels.
   */
  addCallbackOnAssign(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`Expected callback function, got ${typeof callback}.`);
    }

    this.callbacksForAssign.push(callback);
  }

  /**
   * Removes a callback function so it is no longer called when assignments change.
   * @param {onAssignCallback} callback The callback function to remove.
   */
  removeCallbackOnAssign(callback) {
    if (typeof callback !== 'function') {
      throw new TypeError(`Expected callback function, got ${typeof callback}.`);
    }

    const index = this.callbacksForAssign.indexOf(callback);
    if (index !== -1) {
      this.callbacksForAssign.splice(index, 1);
    }
  }

  /**
   * 
   * @param {string} email Email add
   * @param {DogModel[]} assignedDogModels Array of DogModels associated with
   * the email address.
   */
  triggerAssignCallbacks(email, assignedDogModels) {
    this.callbacksForAssign.forEach(callback => {
      callback(email, assignedDogModels);
    });
  }

  /**
   * Assigns a dog to an email.
   * @param {string} email Email to assign dog to.
   * @param {DogModel} dogModel Dog to assign.
   */
  assignDog(email, dogModel)  {
    if (!this.assignments.has(email)) {
      // email doesn't yet exist in assignments, so init to empty array
      this.assignments.set(email, []);
    }
    
    this.assignments.get(email).push(dogModel);

    this.triggerAssignCallbacks(email, this.assignments.get(email));
  }

  /**
   * Checks if the given email has any dogs assigned to it.
   * @param {string} email Email address to check for.
   * @returns {boolean} True if email has at least one assignment.
   */
  hasAssignedDogs(email) {
    return this.assignments.has(email) && this.assignments.get(email).length > 0;
  }

  /**
   * Provides all the email addresses.
   * @returns {string[]} Array of email addresses.
   */
  listEmails() {
    return this.assignments.keys();
  }

  /**
   * Provides array of DogModels assigned to the given email address.
   * @param {string} email Email address to check.
   * @returns {DogModel[]} Array of DogModels giving 
   */
  listAssignedDogs(email) {
    return this.assignments.get(email);
  }

  /**
   * Writes this model's current state to localStorage.
   */
  writeToStore() {
    localStorage.setItem(this.storageName, JSON.stringify(this.assignments, mapReplacer));
  }

  /**
   * If localStorage has assignment data uses it to overwrite whatever
   * is stored in this AssignmentsModel.
   */
  readFromStore() {
    const stringified = localStorage.getItem(this.storageName);
    if (!stringified) {
      // nothing in localStorage to read
      return;
    }

    this.assignments = JSON.parse(stringified, mapReviver);
  }
}
