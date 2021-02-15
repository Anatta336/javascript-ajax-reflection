import PhotoSource from './photo-source';
import AssignmentsModel from './assignments-model';
import DogModel from './dog-model';
import DogView from './dog-view';
import Hideable from './hideable';
import onLoadPromise from './on-load-promise';
import AssignmentsView from './assignments-view';

/**
 * Creates an HTML element that consists of a random dog photo
 * with attribution for the photo's creator.
 */
function fetchDog() {  
  return photoSource.randomDog()
  .then(dogModel => {
    currentDog.model = dogModel;
    currentDog.view = new DogView(dogModel);

    const img = currentDog.view.createImg();

    // TODO: credit photographer too

    return img;
  });
}

/**
 * Attempts to assigns the currently viewed dog to the given email.
 * @param {string} email Email to assign dog to.
 */
function assignCurrentDog(email) {
  assignModel.assignDog(email, currentDog.model);
  fetchNextDog();
}

function disableAllAssignButtons() {
  newEmailButton.disabled = true;
  assignView.setButtonsDisabled(true);
}

function enableAllAssignButtons() {
  newEmailButton.disabled = false;
  assignView.setButtonsDisabled(false);
}

/**
 * Removes all children from a DOM Node.
 * @param {Node} parent Parent from which to remove all children.
 */
function removeAllChildren(parent) {
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
}

function fetchNextDog() {
  disableAllAssignButtons();
  fetchDog()
    .then(img => {
      return onLoadPromise(img);
    })
    .then(img => {
      removeAllChildren(photo.element);
      photo.element.append(img);
      enableAllAssignButtons();
    });
}

function onFirstLoad() {
  adoption.hide();
  
  console.log(photo);
  console.log(loading);

  // TODO: will rework this to fetch the DogModel, then generate img,
  // wait for it to load, then other DOM stuff.
  fetchDog()
    .then(img => {
      return onLoadPromise(img);
    })
    .then(img => {
      photo.element.append(img)
      adoption.element.append(assignView.rootElement);
      loading.hide();
      adoption.show();
    });
}

/**
 * @type {{model: DogModel, view: DogView}}
 */
let currentDog = {};

const assignModel = new AssignmentsModel();
const assignView = new AssignmentsView(assignModel, assignCurrentDog);

// TEMP! Make it available for easy testing
window.assignModel = assignModel;

const photoSource = new PhotoSource(unsplashAccessKey);
const photo = new Hideable(document.querySelector('.photo'));
const loading = new Hideable(document.querySelector('.loading'));
const adoption = new Hideable(document.querySelector('.adoption'));

/**
 * @type {HTMLInputElement}
 */
const newEmailInput = document.querySelector('#new-email');

/**
 * @type {HTMLButtonElement}
 */
const newEmailButton = document.querySelector('#visit-new-email');

newEmailButton.addEventListener('click', () => {
  assignCurrentDog(newEmailInput.value);
  newEmailInput.value = '';
});

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

// TODO: check for same email being used twice and handle gracefully

// TODO: email validation, display meaningful error

// TODO: circle styling on assigned dogs

// TODO: maybe show author name on hover over assigned dogs

// TODO: load new dog after assigning current

// TODO: styling for assigned dog photos

// TODO: styling for assigned emails, remove the list mark and put buttons lined up?

onFirstLoad();
