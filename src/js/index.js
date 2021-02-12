import PhotoSource from './photo-source';
import Hideable from './hideable';
import DogModel from './dog-model';
import DogView from './dog-view';
import onLoadPromise from './on-load-promise';

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

  // TODO: could the show/hide be delayed until the image has been fetched?
  // avoiding the juddering of elements being lost and gained would be nice.
  // on-load-promise is the start of that
  fetchDog()
    .then((img) => {
      return onLoadPromise(img);
    })
    .then((img) => {
      photo.element.appendChild(img)
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

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message
