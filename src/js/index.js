import makeUnsplash from './photo';
import makeHideable from './hideable';

/**
 * Creates an HTML element that consists of a random dog photo
 * with attribution for the photo's creator.
 */
function showDogPhoto() {  
  return unsplash.randomDog()
    .then(dog => {
      // create image of dog
      const img = document.createElement('img');
      img.src = dog.url;
      img.alt = dog.alt;
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

  showDogPhoto()
    .then(() => {
      loading.hide();
      adoption.show();
    });
}

const unsplash = makeUnsplash();
const photo = makeHideable(document.querySelector('.photo'));
const loading = makeHideable(document.querySelector('.loading'));
const adoption = makeHideable(document.querySelector('.adoption'));

onFirstLoad();
