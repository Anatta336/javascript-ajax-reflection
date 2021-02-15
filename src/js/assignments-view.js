import AssignmentsModel from "./assignments-model";
import DogModel from "./dog-model";

/**
 * Handles representing an AssignmentsModel as HTML elements on the page.
 */
export default class AssignmentsView {

  /**
   * @callback assignCurrentToEmail
   * @param {string} email The address to assign the current dog photo to.
   */

  /**
   * Creates an AssignmentView for the given AssignmentsModel.
   * @param {AssignmentsModel} assignModel 
   * @param {assignCurrentToEmail} assignCurrentDog
   */
  constructor(assignModel, assignCurrentDog) {
    /**
     * The assignments that this View represents.
     * @type {AssignmentsModel}
     */
    this.assignModel = assignModel;

    /**
     * Function that assigns the currently viewed dog to specified email.
     * @type {assignCurrentToEmail}
     */
    this.assignCurrentDog = assignCurrentDog;

    /**
     * Width of photos to display in px
     * @type {number} 
     */
    this.photoWidth = 120;

    /**
     * Keys are email address as a strong, value is the HTMLElement representing
     * the email address and its assigned dogs.
     * @type {Map<string, HTMLElement>}
     */
    this.nodeForEmail = new Map();

    /**
     * Map to store a reference to the "visit" button for each email address.
     * @type {Map<string, HTMLButtonElement>}
     */
    this.buttonForEmail = new Map();
    this.buttonsAreDisabled = true;

    /**
     * HTML element that represents all the emails and their assigned dogs.
     * @type {HTMLUListElement}
     */
    this.rootElement = this.createFullList();

    const boundCallback = this.updateChangedAssignment.bind(this);
    assignModel.addCallbackOnAssign(boundCallback);
  }

  /* example of generated HTML
  <ul> <!-- this.rootList -->
    <li id="alice@example.com"> <!-- this.nodeForEmail['alice@example.com'] -->
        <div class="existing-email">alice@example.com
            <button id="visit-alice@example.com" type="button">Visit</button>
        </div>
        <ul class="assigned">
          <li><img src="dogPhotoA.jpg" alt="A good dog"></li>
          <li><img src="dogPhotoB.jpg" alt="A good dog"></li>
        </ul>
    </li>
    <li id="bob@example.com"> <!-- this.nodeForEmail.get('bob@example.com') -->
        <div class="existing-email">bob@example.com
            <button id="visit-bob@example.com" type="button">Visit</button>
        </div>
        <ul class="assigned">
          <li><img src="dogPhotoC.jpg" alt="A good dog"></li>
          <li><img src="dogPhotoD.jpg" alt="A good dog"></li>
        </ul>
    </li>
  </ul>
  */

  /**
   * Updates the display for just one email address and is associated assignments.
   * @param {string} email Email address that had an assignment change.
   * @param {DogModel[]} assignedDogModels Array of assigned dog models for the email address.
   */
  updateChangedAssignment(email, assignedDogModels) {
    if (this.nodeForEmail.has(email)) {
      const existingNode = this.nodeForEmail.get(email);
      const updatedNode = this.createListItemForEmail(email, assignedDogModels);
      this.rootElement.replaceChild(updatedNode, existingNode);
      this.nodeForEmail.set(email, updatedNode);
    } else {
      const newNode = this.createListItemForEmail(email, assignedDogModels);
      this.rootElement.append(newNode);
    }
  }

  /**
   * Generates the full representation of emails and assignments made to them.
   * @returns {HTMLUListElement} Unordered list element with children representing emails
   * and their assignments.
   */
  createFullList() {
    const ul = document.createElement('ul');
    
    this.assignModel.assignments.forEach((dogModels, email) => {
      const li = this.createListItemForEmail(email, dogModels);
      ul.append(li);
    });

    return ul;
  }

  /**
   * Generates a list item element that displays an email address and the dog pictures assigned to it.
   * @param {string} email Email address the dogs have been assigned to.
   * @param {DogModel[]} dogModels Array of DogModel objects that have been assigned to this email address.
   * @returns {HTMLLIElement} List item element displaying the email address and its assigned dog photos.
   */
  createListItemForEmail(email, dogModels) {
    const liForEmail = document.createElement('li');
    liForEmail.id = email;
    this.nodeForEmail.set(email, liForEmail);

    const div = document.createElement('div');
    liForEmail.append(div);
    div.className = 'existing-email';
    div.append(email);
    
    const button = document.createElement('button');
    div.append(button);
    button.id = `visit-${email}`;
    button.type = 'button';
    button.append('Visit');
    button.addEventListener('click', () => {
      this.assignCurrentDog(email);
    });
    button.disabled = this.buttonsAreDisabled;
    this.buttonForEmail.set(email, button);

    const ulOfDogs = document.createElement('ul');
    liForEmail.append(ulOfDogs);
    dogModels.forEach(dogModel => {
      ulOfDogs.append(this.createListItemForDog(dogModel));
    })

    return liForEmail;
  }

  /**
   * Creates a list item HTMLElement to represent a single assigned dog.
   * @param {DogModel} dogModel Dog to display small image of.
   * @returns {HTMLLIElement} List item element that represents this dog.
   */
  createListItemForDog(dogModel) {
    const liForDog = document.createElement('li');
    const img = document.createElement('img');
    liForDog.append(img);
    img.src = `${dogModel.url}&q=80&w=${this.photoWidth}`;
    img.alt = dogModel.altText;

    return liForDog;
  }

  /**
   * Checks whether buttons are currently set to be disabled. Note that
   * returning true doesn't necessarily mean all buttons are disabled,
   * just that they should be.
   * @return {boolean} True if buttons are currently set to be disabled.
   */
  areButtonsDisabled() {
    return this.buttonsAreDisabled;
  }

  /**
   * Sets whether all the buttons in this view should be disabled. Setting
   * will apply the value to all existing buttons, and make it the value
   * applied to any new buttons that are created.
   * Doesn't prevent the buttons being enabled/disabled by other means.
   * @param {boolean} areDisabled True if buttons should become disabled.
   */
  setButtonsDisabled(areDisabled) {
    this.buttonsAreDisabled = areDisabled;

    this.buttonForEmail.forEach(button => {
      button.disabled = this.buttonsAreDisabled;
    });
  }
}
