import AssignmentsModel from './assignments-model';
import AssignmentsView from './assignments-view';
import DogModel from './dog-model';
import DogView from './dog-view';
import PhotoSource from './photo-source';
import onLoadPromise from './on-load-promise';
import removeAllChildren from './remove-children';
import Hideable from './hideable';

export default class DogPhotos {
  /**
   * Creates a new DogPhotos instance.
   * @param {string} unsplashAccessKey API access key for Unsplash.
   * @param {Object} elements Object with properties that reference various elements on the page.
   * @param {HTMLElement} elements.photo Element where dog's photo should be added as a child.
   * @param {HTMLElement} elements.loading Element that contains loading text that is displayed before the first dog.
   * @param {HTMLElement} elements.adoption Element where a list of assignments sbould be added.
   */
  constructor(unsplashAccessKey, elements) {
    /**
     * PhotoSource object that provides access to the Unsplash API.
     * @type {PhotoSource}
     */
    this.photoSource = new PhotoSource(unsplashAccessKey);

    /**
     * Model for dog that's waiting for assignment.
     * @type {DogModel}
     */
    this.currentDogModel;

    /**
     * View for dog that's waiting for assignment.
     * @type {DogView}
     */
    this.currentDogView;

    /**
     * @type {AssignmentsModel}
     */
    this.assignmentsModel = new AssignmentsModel();

    /**
     * @type {AssignmentsView}
     */
    this.assignmentsView = new AssignmentsView(this.assignmentsModel, (email) => {
      this.assignCurrentDog(email);
    });

    /**
     * @type {Hideable}
     */
    this.currentPhoto = new Hideable(elements.photo);
    
    /**
     * @type {Hideable}
     */
    this.loadingText = new Hideable(elements.loading);
    
    /**
     * @type {Hideable}
     */
    this.adoptionList = new Hideable(elements.adoption);
    this.adoptionList.element.append(this.assignmentsView.rootElement);

    /**
     * @type {HTMLInputElement}
     */
    this.inputForNewEmail = document.querySelector('#new-email');

    /**
     * @type {HTMLButtonElement}
     */
    this.buttonForNewEmail = document.querySelector('#visit-new-email');
    this.buttonForNewEmail.addEventListener('click', () => {
      this.assignCurrentDog(this.inputForNewEmail.value);
      this.inputForNewEmail.value = '';
    })

    this.prepareFirstDog();
  }

  /**
   * Handles the fetching and displaying of the first dog photo,
   * including the showing and hiding of elements such as loading text.
   */
  prepareFirstDog() {
    this.loadingText.show();
    this.adoptionList.hide();

    // request a random dog
    this.photoSource.randomDog()
      .then(dogModel => {
        // set that dog as being current
        this.currentDogModel = dogModel;

        // create a View of that dog, and use that to create img element
        this.currentDogView = new DogView(dogModel);
        const img = this.currentDogView.createImg();
        // TODO: also create element that credits author
        // TODO: combine this img generation with what's used in prepareNextDog()

        return img;
      })
      .then(img => {
        // wait until image has loaded
        return onLoadPromise(img);
      })
      .then(img => {
        // add img element to page
        this.currentPhoto.element.append(img)

        // remove the loading text, add the adoption list
        this.loadingText.hide();
        this.adoptionList.show();
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

    // request a random dog
    this.photoSource.randomDog()
      .then(dogModel => {
        // set that dog as being current
        this.currentDogModel = dogModel;

        // create a View of that dog, and use that to create img element
        // TODO: also create element that credits author
        this.currentDogView = new DogView(dogModel);
        const img = this.currentDogView.createImg();
        return img;
      })
      .then(img => {
        // wait until image has loaded
        return onLoadPromise(img);
      })
      .then(img => {
        // remove old photo
        removeAllChildren(this.currentPhoto.element);

        // add new img to page
        this.currentPhoto.element.append(img);

        // re-enable assignment buttons
        this.enableAssignButtons();
      });
  }

  disableAssignButtons() {
    this.buttonForNewEmail.disabled = true;
    this.assignmentsView.setButtonsDisabled(true);
  }

  enableAssignButtons() {
    this.buttonForNewEmail.disabled = false;
    this.assignmentsView.setButtonsDisabled(false);
  }
}
