import AssignmentsModel from './assignments-model';
import AssignmentsView from './assignments-view';
import DogModel from './dog-model';
import DogView from './dog-view';
import PhotoSource from './photo-source';
import onLoadPromise from './on-load-promise';
import removeAllChildren from './remove-children';
import Hideable from './hideable';
import Disableable from './disableable';
import disableWhenEmpty from './disable-when-empty';

/**
 * The main "app" which links together the separate parts.
 */
export default class DogPhotos {

  /**
   * @callback displayError
   * @param {string} message The message to display as a critical error.
   */

  /**
   * Creates a new DogPhotos instance.
   * @param {string} unsplashAccessKey API access key for Unsplash.
   * @param {displayError} displayError Function that replaces the app's usual output with an error message.
   * @param {Object} elements Object with properties that reference various elements on the page.
   * @param {HTMLElement} elements.currentDog Element where dog's photo should be added as a child.
   * @param {HTMLElement} elements.loading Element that contains loading text that is displayed before the first dog.
   * @param {HTMLElement} elements.adoption Element that contains everything related to assigning a dog, should be hidden before first image loads.
   * @param {HTMLUListElement} elements.displayList Unordered List Element where assignments should be added.
   * @param {HTMLInputElement} elements.emailInput Text input element where user can enter a new email address.
   * @param {HTMLButtonElement} elements.newEmailButton Button element that will assign current dog to the new email address.
   * @param {Disableable} elements.emailButtonDisable Button element wrapped in Disableable.
   * @param {number} currentPhotoWidth Horizontal size of photo to display for current dog, in px.
   */
  constructor(unsplashAccessKey, displayError, elements, currentPhotoWidth = 400) {
    /**
     * PhotoSource object that provides access to the Unsplash API.
     * @type {PhotoSource}
     */
    this.photoSource = new PhotoSource(unsplashAccessKey, displayError);

    /**
     * @type {displayError}
     */
    this.displayError = displayError;

    /**
     * Model for dog that's waiting for assignment.
     * @type {DogModel}
     */
    this.currentDogModel;

    /**
     * @type {AssignmentsModel}
     */
    this.assignmentsModel = new AssignmentsModel();

    /**
     * @type {Hideable}
     */
    this.currentPhoto = new Hideable(elements.currentDog);
    
    /**
     * @type {Hideable}
     */
    this.loadingText = new Hideable(elements.loading);
    
    /**
     * @type {Hideable}
     */
    this.adoption = new Hideable(elements.adoption);

    /**
     * @type {HTMLUListElement}
     */
    this.adoptionList = elements.displayList;

    /**
     * Horizontal size of photo to display, in px.
     * @type {number}
     */
    this.photoWidth = currentPhotoWidth;

    /**
     * @type {AssignmentsView}
     */
    this.assignmentsView = new AssignmentsView(
      this.assignmentsModel,
      this.adoptionList,
      (email) => {
        this.assignCurrentDog(email);
      },
    );

    /**
     * @type {HTMLInputElement}
     */
    this.inputForNewEmail = elements.emailInput;

    /**
     * @type {HTMLButtonElement}
     */
    this.buttonForNewEmail = elements.newEmailButton;
    this.buttonForNewEmail.addEventListener('click', () => {
      this.assignCurrentDog(this.inputForNewEmail.value);
      this.inputForNewEmail.value = '';
    })

    /**
     * The "Assign" button associated with a new user entered email, wrapped in Disableable.
     * @type {Disableable}
     */
    this.emailButtonDisable = elements.emailButtonDisable;

    // automatically disable "assign" button for new email if the field is empty.
    disableWhenEmpty(this.inputForNewEmail, this.emailButtonDisable);

    this.prepareFirstDog();
  }

  /**
   * Handles the fetching and displaying of the first dog photo, including the showing
   * and hiding of elements such as loading text.
   */
  prepareFirstDog() {
    this.loadingText.show();
    this.currentPhoto.hide();
    this.adoption.hide();

    this.fetchRandomDogImageAndCredit().then(imageAndCredit => {
      // add to page
      this.currentPhoto.element.appendChild(imageAndCredit.img);
      this.currentPhoto.element.appendChild(imageAndCredit.credit);

      // remove the loading text, add the adoption list
      this.loadingText.hide();
      this.currentPhoto.show();
      this.adoption.show();
    });
  }

  /**
   * Requests a new random dog, sets it as the currentDogModel, and then
   * provides a new div element containing the loaded image and author credit.
   * @returns {Promise<{image: HTMLImageElement, credit: HTMLAnchorElement}>}
   * Promise that fulfills to the new currentDogModel's photo and author credit.
   */
  fetchRandomDogImageAndCredit() {
    return this.photoSource.randomDog()
      .then(dogModel => {
        // set that dog as being current
        this.currentDogModel = dogModel;
        return DogView.createImageAndCredit(dogModel, this.photoWidth);
      })
      .then(imageAndCredit => {
        // wait until img has loaded, then pass the div to next stage
        return onLoadPromise(imageAndCredit.img)
          .then(() => {
            return imageAndCredit;
          });
      });
  }

  /**
   * Attempts to assigns the currently viewed dog to the given email.
   * @param {string} email Email to assign dog to.
   */
  assignCurrentDog(email) {
    this.assignmentsModel.assignDog(email, this.currentDogModel);
    this.prepareNextDog();
  }

  prepareNextDog() {
    // disable buttons so the previous dog can't be assigned again
    this.disableAssignButtons();

    this.fetchRandomDogImageAndCredit().then(imageAndCredit => {
      // remove old photo and credit
      removeAllChildren(this.currentPhoto.element);

      // add new to page
      this.currentPhoto.element.appendChild(imageAndCredit.img);
      this.currentPhoto.element.appendChild(imageAndCredit.credit);

      // re-enable assignment buttons
      this.enableAssignButtons();
    });
  }

  disableAssignButtons() {
    this.emailButtonDisable.addDisableCause(this);
    this.assignmentsView.setButtonsDisabled(true);
  }

  enableAssignButtons() {
    this.emailButtonDisable.removeDisableCause(this);
    this.assignmentsView.setButtonsDisabled(false);
  }
}
