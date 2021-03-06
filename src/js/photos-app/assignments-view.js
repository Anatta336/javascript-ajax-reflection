import AssignmentsModel from './assignments-model';
import DogModel from './dog-model';
import dogImgAndCredit from './dog-img-and-credit';

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
   * @param {AssignmentsModel} assignModel AssignmentsModel to represent.
   * @param {HTMLUListElement} listElement List element to add list items to.
   * @param {assignCurrentToEmail} assignCurrentDog Callback to trigger assigning the current dog to an email address.
   * @param {number} photoWidth Horizontal size of photo to display for assigned dogs, in px.
   */
  constructor(assignModel, listElement, assignCurrentDog, photoWidth = 120) {
    /**
     * The assignments that this View represents.
     * @type {AssignmentsModel}
     */
    this.assignModel = assignModel;

    /**
     * List element that list items are added to for display.
     * @type {HTMLUListElement}
     */
    this.listElement = listElement;

    /**
     * Function that assigns the currently viewed dog to specified email.
     * @type {assignCurrentToEmail}
     */
    this.assignCurrentDog = assignCurrentDog;

    /**
     * Width of photos to display in px
     * @type {number} 
     */
    this.photoWidth = photoWidth;

    /**
     * Keys are email address as a strong, value is the list item element
     * representing the email address and its assigned dogs.
     * @type {Map<string, HTMLElement>}
     */
    this.nodeForEmail = new Map();

    /**
     * Map to store a reference to the "Assign" button for each email address.
     * @type {Map<string, HTMLButtonElement>}
     */
    this.buttonForEmail = new Map();
    this.buttonsAreDisabled = false;

    const boundCallback = this.updateChangedAssignment.bind(this);
    assignModel.addCallbackOnAssign(boundCallback);

    this.generateWholeList();
  }

  /* example of generated HTML
  <ul class="email-list"> <!-- this.listElement (already exists) -->
    <li> <!-- this.nodeForEmail.get('alice@example.com') -->
        <div class="existing-email">alice@example.com
            <button type="button">Assign</button>
        </div>
        <ul class="assigned">
          <li class="photo">
            <img src="dogPhotoA.jpg" alt="A good dog">
            <a href="...">UsernameA</a>
          </li>
        </ul>
    </li>
    <li> <!-- this.nodeForEmail.get('bob@example.com') -->
        <div class="existing-email">bob@example.com
            <button type="button">Assign</button>
        </div>
        <ul class="assigned">
          <li class="photo">
            <img src="dogPhotoB.jpg" alt="A good dog">
            <a href="...">UsernameB</a>
          </li>
          <li class="photo">
            <img src="dogPhotoC.jpg" alt="A good dog">
            <a href="...">UsernameC</a>
          </li>
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
      this.listElement.replaceChild(updatedNode, existingNode);
      this.nodeForEmail.set(email, updatedNode);
    } else {
      const newNode = this.createListItemForEmail(email, assignedDogModels);
      this.listElement.appendChild(newNode);
    }
  }

  /**
   * Generates the full representation of emails and assignments made to them,
   * adding them to this.listElement.
   */
  generateWholeList() {
    this.assignModel.assignments.forEach((dogModels, email) => {
      const li = this.createListItemForEmail(email, dogModels);
      this.listElement.appendChild(li);
    });
  }

  /**
   * Generates a list item element that displays an email address and the dog pictures assigned to it.
   * @param {string} email Email address the dogs have been assigned to.
   * @param {DogModel[]} dogModels Array of DogModel objects that have been assigned to this email address.
   * @returns {HTMLLIElement} List item element displaying the email address and its assigned dog photos.
   */
  createListItemForEmail(email, dogModels) {
    const liForEmail = document.createElement('li');
    this.nodeForEmail.set(email, liForEmail);

    const div = document.createElement('div');
    div.className = 'existing-email';
    div.appendChild(document.createTextNode(email));
    liForEmail.appendChild(div);
    
    const button = document.createElement('button');
    button.type = 'button';
    button.appendChild(document.createTextNode('Assign'));
    button.addEventListener('click', this.assignCurrentDog.bind(this, email));
    button.disabled = this.buttonsAreDisabled;
    this.buttonForEmail.set(email, button);
    div.appendChild(button);

    const ulOfDogs = document.createElement('ul');
    ulOfDogs.classList.add('assigned');
    dogModels.forEach(dogModel => {
      ulOfDogs.appendChild(this.createListItemForDog(dogModel));
    })
    liForEmail.appendChild(ulOfDogs);

    return liForEmail;
  }

  /**
   * Creates a list item HTMLElement to represent a single assigned dog.
   * @param {DogModel} dogModel Dog to display small image of.
   * @returns {HTMLLIElement} List item element that represents this dog.
   */
  createListItemForDog(dogModel) {
    const liForDog = document.createElement('li');
    liForDog.classList.add('photo');

    const imgAndCredit = dogImgAndCredit(dogModel, this.photoWidth);
    liForDog.appendChild(imgAndCredit.img);
    liForDog.appendChild(imgAndCredit.credit);

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
