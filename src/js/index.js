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

function onFirstLoad() {
  adoption.hide();
  
  console.log(photo);
  console.log(loading);

  // TODO: will rework this to fetch the DogModel, then generate img,
  // wait for it to load, then other DOM stuff.
  fetchDog()
    .then((img) => {
      return onLoadPromise(img);
    })
    .then((img) => {
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
const assignView = new AssignmentsView(assignModel);

// TEMP! Make it available for easy testing
window.assignModel = assignModel;

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

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
  console.log(`assigning to ${newEmailInput.value}`);
  assignModel.assignDog(newEmailInput.value);

  newEmailInput.value = '';
});

// TODO: check for same email being used twice and handle gracefully

// TODO: circle styling on assigned dogs

// TODO: maybe show author name on hover over assigned dogs

onFirstLoad();

// FIXME: TypeError when assigning first dog, seems to be caused by
// 'this' being undefined during the callback