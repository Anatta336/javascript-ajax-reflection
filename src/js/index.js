import PhotoSource from './photo-source';
import Hideable from './hideable';
import DogModel from './dog-model';
import DogView from './dog-view';

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
    photo.element.appendChild(img)

    // TODO: credit photographer

    // TODO: return div containing whole thing
    return img;
  });
}

function onFirstLoad() {
  adoption.hide();
  
  console.log(photo);
  console.log(loading);

  // TODO: could the show/hide be delayed until the image has been fetched?
  // avoiding the juddering of elements being lost and gained would be nice.
  fetchDog()
    .then(() => {
      loading.hide();
      adoption.show();
    });
}

let currentDog = {};

const photoSource = new PhotoSource(unsplashAccessKey);
const photo = new Hideable(document.querySelector('.photo'));
const loading = new Hideable(document.querySelector('.loading'));
const adoption = new Hideable(document.querySelector('.adoption'));

onFirstLoad();
