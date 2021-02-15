import DogPhotos from './dog-photos';

const dogPhotos = new DogPhotos(unsplashAccessKey, {
  photo: document.querySelector('.photo'),
  loading: document.querySelector('.loading'),
  adoption: document.querySelector('.adoption'),
});

// TODO: check for unsplashAccessKey being undefined or emptystring, and show a meaningful message

// TODO: email validation, display meaningful error

// TODO: circle styling on assigned dogs

// TODO: maybe show author name on hover over assigned dogs

// TODO: load new dog after assigning current

// TODO: styling for assigned dog photos

// TODO: styling for assigned emails, remove the list mark and put buttons lined up?
